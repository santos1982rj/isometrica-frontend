import type { CourseDetails } from '../courses/courses.types';

type TrackingCourse = Pick<
  CourseDetails,
  'id' | 'titulo' | 'slug' | 'categoria' | 'nivel' | 'preco' | 'isPremium'
>;

type PaymentTrackingInput = {
  paymentId: string;
  value: number;
  course: TrackingCourse;
};

type CheckoutKind = 'transparent' | 'external';

type TrackingEventPayload = Record<string, unknown>;

const EXTERNAL_CHECKOUT_KEY = '@isometrica:pending-external-checkout';
const TRACKED_EVENT_KEY = '@isometrica:tracked-event';

export function trackCourseView(course: TrackingCourse) {
  if (!trackOnce(`course-view:${course.id}`)) {
    return;
  }

  pushGoogleEvent('view_item', {
    currency: 'BRL',
    value: course.preco ?? 0,
    items: [toGoogleItem(course)],
  });
  pushDataLayer('course_viewed', {
    course_id: course.id,
    course_slug: course.slug,
    course_name: course.titulo,
    course_category: course.categoria,
    course_level: course.nivel,
    course_price: course.preco ?? 0,
  });
  pushMetaEvent('track', 'ViewContent', {
    content_ids: [course.id],
    content_name: course.titulo,
    content_category: course.categoria ?? 'Curso',
    content_type: 'product',
    currency: 'BRL',
    value: course.preco ?? 0,
  });
}

export function trackPurchaseIntent(course: TrackingCourse, checkout: CheckoutKind) {
  pushGoogleEvent('course_purchase_intent', toCoursePayload(course, checkout));
  pushDataLayer('course_purchase_intent', toCoursePayload(course, checkout));
  pushMetaEvent('trackCustom', 'PurchaseIntent', toMetaCoursePayload(course, checkout));
}

export function trackCheckoutStarted(course: TrackingCourse, checkout: CheckoutKind) {
  pushGoogleEvent('begin_checkout', {
    currency: 'BRL',
    value: course.preco ?? 0,
    checkout_type: checkout,
    items: [toGoogleItem(course)],
  });
  pushDataLayer('checkout_started', toCoursePayload(course, checkout));
  pushMetaEvent('track', 'InitiateCheckout', {
    ...toMetaCoursePayload(course, checkout),
    num_items: 1,
  });
}

export function trackPaymentApproved({
  paymentId,
  value,
  course,
}: PaymentTrackingInput) {
  if (!trackOnce(`purchase:${paymentId}`)) {
    return;
  }

  pushGoogleEvent('purchase', {
    transaction_id: paymentId,
    currency: 'BRL',
    value,
    items: [toGoogleItem(course)],
  });
  pushDataLayer('payment_approved', {
    payment_id: paymentId,
    ...toCoursePayload(course),
    value,
    currency: 'BRL',
  });
  pushMetaEvent('track', 'Purchase', {
    content_ids: [course.id],
    content_name: course.titulo,
    content_type: 'product',
    currency: 'BRL',
    value,
  });
}

export function trackEnrollmentCompleted(
  course: TrackingCourse,
  accessType: 'free' | 'purchase',
  referenceId?: string,
) {
  const key = referenceId
    ? `enrollment:${accessType}:${referenceId}`
    : `enrollment:${accessType}:${course.id}`;

  if (!trackOnce(key)) {
    return;
  }

  const payload = {
    access_type: accessType,
    reference_id: referenceId,
    ...toCoursePayload(course),
  };

  pushGoogleEvent('course_enrollment_completed', payload);
  pushDataLayer('course_enrollment_completed', payload);
  pushMetaEvent('trackCustom', 'EnrollmentCompleted', {
    access_type: accessType,
    reference_id: referenceId,
    ...toMetaCoursePayload(course),
  });
}

export function markExternalCheckout(course: TrackingCourse, preferenceId: string) {
  sessionStorage.setItem(
    EXTERNAL_CHECKOUT_KEY,
    JSON.stringify({
      courseId: course.id,
      preferenceId,
      value: course.preco ?? 0,
      createdAt: Date.now(),
    }),
  );
}

export function consumeApprovedExternalCheckout(course: TrackingCourse) {
  const rawPendingCheckout = sessionStorage.getItem(EXTERNAL_CHECKOUT_KEY);

  if (!rawPendingCheckout) {
    return null;
  }

  try {
    const pendingCheckout = JSON.parse(rawPendingCheckout) as {
      courseId?: string;
      preferenceId?: string;
      value?: number;
      createdAt?: number;
    };
    const expiresAfterOneHour =
      typeof pendingCheckout.createdAt === 'number' &&
      Date.now() - pendingCheckout.createdAt > 60 * 60 * 1000;

    if (
      pendingCheckout.courseId !== course.id ||
      expiresAfterOneHour
    ) {
      sessionStorage.removeItem(EXTERNAL_CHECKOUT_KEY);
      return null;
    }

    sessionStorage.removeItem(EXTERNAL_CHECKOUT_KEY);

    return {
      paymentId:
        pendingCheckout.preferenceId ??
        `external-${course.id}-${pendingCheckout.createdAt}`,
      value: pendingCheckout.value ?? course.preco ?? 0,
    };
  } catch {
    sessionStorage.removeItem(EXTERNAL_CHECKOUT_KEY);
    return null;
  }
}

function toCoursePayload(course: TrackingCourse, checkout?: CheckoutKind) {
  return {
    course_id: course.id,
    course_slug: course.slug,
    course_name: course.titulo,
    course_category: course.categoria,
    course_level: course.nivel,
    value: course.preco ?? 0,
    currency: 'BRL',
    ...(checkout ? { checkout_type: checkout } : {}),
  };
}

function toMetaCoursePayload(course: TrackingCourse, checkout?: CheckoutKind) {
  return {
    content_ids: [course.id],
    content_name: course.titulo,
    content_category: course.categoria ?? 'Curso',
    content_type: 'product',
    currency: 'BRL',
    value: course.preco ?? 0,
    ...(checkout ? { checkout_type: checkout } : {}),
  };
}

function toGoogleItem(course: TrackingCourse) {
  return {
    item_id: course.id,
    item_name: course.titulo,
    item_category: course.categoria ?? 'Curso',
    item_variant: course.nivel,
    price: course.preco ?? 0,
    quantity: 1,
  };
}

function pushGoogleEvent(eventName: string, payload: TrackingEventPayload) {
  window.dataLayer = window.dataLayer ?? [];

  if (window.gtag) {
    window.gtag('event', eventName, payload);
    return;
  }

  window.dataLayer.push(['event', eventName, payload]);
}

function pushDataLayer(eventName: string, payload: TrackingEventPayload) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: eventName,
    ...payload,
  });
}

function pushMetaEvent(
  method: 'track' | 'trackCustom',
  eventName: string,
  payload: TrackingEventPayload,
) {
  window.fbq?.(method, eventName, payload);
}

function trackOnce(key: string) {
  const storageKey = `${TRACKED_EVENT_KEY}:${key}`;

  if (sessionStorage.getItem(storageKey)) {
    return false;
  }

  sessionStorage.setItem(storageKey, '1');
  return true;
}
