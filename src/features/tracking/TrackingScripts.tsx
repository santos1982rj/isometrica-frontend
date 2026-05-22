import { useEffect } from 'react';

import {
  getPublicTrackingConfig,
  type PublicTrackingConfig,
} from './tracking.service';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: MetaPixelQueue;
    _fbq?: MetaPixelQueue;
  }
}

type MetaPixelQueue = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  push?: MetaPixelQueue;
  queue?: unknown[];
  version?: string;
};

export function TrackingScripts() {
  useEffect(() => {
    let active = true;

    getPublicTrackingConfig()
      .then((config) => {
        if (active) {
          loadTracking(config);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return null;
}

function loadTracking(config: PublicTrackingConfig) {
  if (config.googleTagManagerId) {
    loadGoogleTagManager(config.googleTagManagerId);
  }

  if (config.googleAnalyticsMeasurementId) {
    loadGoogleAnalytics(config.googleAnalyticsMeasurementId);
  }

  if (config.metaPixelId) {
    loadMetaPixel(config.metaPixelId);
  }
}

function loadGoogleTagManager(containerId: string) {
  if (document.getElementById('isometrica-gtm')) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    'gtm.start': Date.now(),
    event: 'gtm.js',
  });

  appendExternalScript(
    'isometrica-gtm',
    `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`,
  );
}

function loadGoogleAnalytics(measurementId: string) {
  appendExternalScript(
    'isometrica-google-tag',
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`,
  );

  if (document.getElementById('isometrica-google-tag-config')) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId);

  const marker = document.createElement('meta');
  marker.id = 'isometrica-google-tag-config';
  marker.dataset.measurementId = measurementId;
  document.head.append(marker);
}

function loadMetaPixel(pixelId: string) {
  if (!window.fbq) {
    const fbq = function metaPixelQueue(...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
        return;
      }

      fbq.queue?.push(args);
    } as MetaPixelQueue;

    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;

    appendExternalScript(
      'isometrica-meta-pixel',
      'https://connect.facebook.net/en_US/fbevents.js',
    );
  }

  if (document.getElementById('isometrica-meta-pixel-config')) {
    return;
  }

  window.fbq?.('init', pixelId);
  window.fbq?.('track', 'PageView');

  const marker = document.createElement('meta');
  marker.id = 'isometrica-meta-pixel-config';
  marker.dataset.pixelId = pixelId;
  document.head.append(marker);
}

function appendExternalScript(id: string, src: string) {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.append(script);
}
