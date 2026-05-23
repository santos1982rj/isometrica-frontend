import {
  BookOpen,
  CheckCircle2,
  CircleCheckBig,
  Clock3,
  Crown,
  CreditCard,
  FileText,
  LockKeyhole,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Payment, initMercadoPago } from '@mercadopago/sdk-react';

import { IsoBadge } from '../../components/ui/IsoBadge';
import { IsoButton } from '../../components/ui/IsoButton';
import { LiquidCard } from '../../components/ui/LiquidCard';
import { CoursePageSkeleton } from '../../components/skeletons/CoursePageSkeleton';
import { Seo } from '../../components/seo/Seo';
import { useAuthStore } from '../../core/store/authStore';
import { getMyProgress } from '../progress/progress.service';
import {
  createPaymentPreference,
  processTransparentPayment,
  type TransparentPaymentFormData,
  type TransparentPaymentResult,
} from '../payments/payments.service';
import {
  consumeApprovedExternalCheckout,
  markExternalCheckout,
  trackCheckoutStarted,
  trackCourseView,
  trackEnrollmentCompleted,
  trackPaymentApproved,
  trackPurchaseIntent,
} from '../tracking/tracking.events';
import { enrollFreeCourse, getCourseBySlug } from './courses.service';

function formatLevel(level: string) {
  const labels = {
    INICIANTE: 'Iniciante',
    INTERMEDIARIO: 'Intermediário',
    AVANCADO: 'Avançado',
  };

  return labels[level as keyof typeof labels] ?? level;
}

function getSalesLines(value: string | null, fallback: string[]) {
  const lines = value
    ?.split(/\r?\n|;/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines && lines.length > 0 ? lines : fallback;
}

export function CourseDetailsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [showTransparentCheckout, setShowTransparentCheckout] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<TransparentPaymentResult | null>(null);
  const [paymentBrickPreferenceId, setPaymentBrickPreferenceId] = useState<string | null>(null);
  const [paymentAttemptId, setPaymentAttemptId] = useState(() => crypto.randomUUID());
  const mercadoPagoPublicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY as string | undefined;

  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['course-details', slug],
    queryFn: () => getCourseBySlug(slug!),
    enabled: !!slug,
  });

  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: getMyProgress,
    enabled: !!token,
  });

  const enrollMutation = useMutation({
    mutationFn: () => enrollFreeCourse(course!.id),
    onSuccess: async () => {
      trackEnrollmentCompleted(course!, 'free');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['course-details', slug] }),
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
        queryClient.invalidateQueries({ queryKey: ['my-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['analytics'] }),
      ]);
    },
  });

  const paymentPreferenceMutation = useMutation({
    mutationFn: () => createPaymentPreference(course!.id),
    onSuccess: (preference) => {
      markExternalCheckout(course!, preference.preferenceId);
      window.location.href = preference.checkoutUrl;
    },
  });

  const paymentBrickPreferenceMutation = useMutation({
    mutationFn: () => createPaymentPreference(course!.id),
    onSuccess: (preference) => {
      setPaymentBrickPreferenceId(preference.preferenceId);
    },
  });

  const transparentPaymentMutation = useMutation({
    mutationFn: (payload: {
      paymentAttemptId: string;
    } & TransparentPaymentFormData) =>
      processTransparentPayment({
        courseId: course!.id,
        ...payload,
      }),
    onSuccess: async (payment) => {
      const paymentApproved =
        payment.paymentStatus === 'approved' ||
        payment.persisted.status === 'APROVADO';

      if (paymentApproved) {
        trackPaymentApproved({
          paymentId: payment.paymentId,
          value: payment.transactionAmount,
          course: course!,
        });
        trackEnrollmentCompleted(course!, 'purchase', payment.paymentId);
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['course-details', slug] }),
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
        queryClient.invalidateQueries({ queryKey: ['my-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['analytics'] }),
      ]);
      setCompletedPayment(payment);
    },
  });

  useEffect(() => {
    if (mercadoPagoPublicKey) {
      initMercadoPago(mercadoPagoPublicKey, { locale: 'pt-BR' });
    }
  }, [mercadoPagoPublicKey]);

  useEffect(() => {
    if (!course) {
      return;
    }

    trackCourseView(course);
  }, [course]);

  useEffect(() => {
    if (!course?.isEnrolled) {
      return;
    }

    const approvedExternalCheckout = consumeApprovedExternalCheckout(course);

    if (!approvedExternalCheckout) {
      return;
    }

    trackPaymentApproved({
      paymentId: approvedExternalCheckout.paymentId,
      value: approvedExternalCheckout.value,
      course,
    });
    trackEnrollmentCompleted(
      course,
      'purchase',
      approvedExternalCheckout.paymentId,
    );
  }, [course]);

  useEffect(() => {
    if (!showTransparentCheckout) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowTransparentCheckout(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTransparentCheckout]);

  if (isLoading) {
    return (
      <>
        <Seo
          title="Curso"
          description="Conheça uma trilha de estudo da ISOMÉTRICA para engenharia."
        />
        <CoursePageSkeleton />
      </>
    );
  }

  if (isError || !course) {
    return (
      <LiquidCard>
        <p className="font-semibold text-red-400">Não foi possível carregar a disciplina.</p>
      </LiquidCard>
    );
  }

  const totalLessons = course.modulos.reduce((total, module) => total + module.aulas.length, 0);
  const completedLessons = course.modulos.reduce(
    (total, module) =>
      total +
      module.aulas.filter((lesson) =>
        progress?.some((item) => item.aulaId === lesson.id && item.concluida),
      ).length,
    0,
  );
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const firstLesson = course.modulos[0]?.aulas[0];
  const previewLessons = course.modulos.reduce(
    (total, module) => total + module.aulas.filter((lesson) => lesson.isGratuita).length,
    0,
  );
  const benefitLines = getSalesLines(course.beneficios, [
    'Estude os fundamentos que sustentam a disciplina antes de avançar para aplicações.',
    'Siga uma trilha em módulos com aulas organizadas para manter continuidade.',
    'Aplique o conteúdo com exercícios e materiais técnicos ao longo do curso.',
  ]);
  const audienceLines = getSalesLines(course.publicoAlvo, [
    `Estudantes de engenharia em nível ${formatLevel(course.nivel).toLowerCase()}.`,
    'Quem quer revisar conceitos com uma sequência de estudo clara.',
    'Profissionais que precisam retomar a base antes de resolver problemas aplicados.',
  ]);
  const accountEntryUrl = `/register?next=${encodeURIComponent(`/courses/${course.slug}`)}`;
  const paymentApproved =
    completedPayment?.paymentStatus === 'approved' ||
    completedPayment?.persisted.status === 'APROVADO';
  const paymentRejected =
    completedPayment?.paymentStatus === 'rejected' ||
    completedPayment?.persisted.status === 'RECUSADO';
  return (
    <section className="w-full space-y-4">
      <Seo
        title={course.titulo}
        description={course.resumo ?? course.descricao}
        image={course.imagem}
        type="article"
      />

      <LiquidCard className="relative overflow-hidden rounded-xl p-4 sm:p-5 lg:p-6">
        {course.imagem && (
          <>
            <img
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20"
              src={course.imagem}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--surface)_8%,rgba(0,0,0,0.36)_100%)]" />
          </>
        )}
        <div className="relative z-10 flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
          <div className="max-w-5xl">
            <IsoBadge>
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Engenharia | ISOMETRICA
            </IsoBadge>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              {course.categoria ?? 'Engenharia'}
            </p>

            <h1 className="mt-4 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
              {course.titulo}
            </h1>

            <p className="mt-4 max-w-4xl text-sm leading-6 text-[var(--text-soft)]">
              {course.resumo ?? course.descricao}
            </p>
            {course.resumo && (
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--text-muted)]">
                {course.descricao}
              </p>
            )}

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Nível</p>
                <strong className="mt-2 block text-[var(--text)]">{formatLevel(course.nivel)}</strong>
              </div>
              <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Carga horária</p>
                <strong className="mt-2 flex items-center gap-2 text-[var(--text)]">
                  <Clock3 className="h-4 w-4 text-[var(--secondary-700)] dark:text-[var(--secondary-300)]" />
                  {course.cargaHoraria ?? 0}h
                </strong>
              </div>
              <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Estrutura</p>
                <strong className="mt-2 flex items-center gap-2 text-[var(--text)]">
                  <BookOpen className="h-4 w-4 text-[var(--secondary-700)] dark:text-[var(--secondary-300)]" />
                  {course.modulos.length} módulos
                </strong>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {previewLessons > 0 && (
                <IsoBadge variant="success">
                  {previewLessons} prévia{previewLessons > 1 ? 's' : ''} aberta{previewLessons > 1 ? 's' : ''}
                </IsoBadge>
              )}
              <IsoBadge>{totalLessons} aulas na trilha</IsoBadge>
              <IsoBadge variant="orange">
                {course.isPremium ? 'Compra avulsa' : 'Matrícula gratuita'}
              </IsoBadge>
            </div>
          </div>

          <div className="w-full">
            <LiquidCard className="rounded-lg p-4">
              {course.isPremium ? (
                <>
                  <div className="mb-4 flex items-center gap-2 text-[var(--accent-500)]">
                    <Crown className="h-5 w-5" />
                    Premium
                  </div>
                  <strong className="iso-stat-number text-4xl font-semibold text-[var(--text)]">
                    R$ {course.preco?.toFixed(2)}
                  </strong>
                </>
              ) : (
                <>
                  <div className="mb-4 text-[var(--success-500)]">Acesso gratuito</div>
                  <strong className="text-4xl font-semibold text-[var(--text)]">Livre</strong>
                </>
              )}

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[var(--text-soft)]">Progresso</span>
                  <span className="iso-stat-number text-[var(--secondary-700)] dark:text-[var(--secondary-300)]">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--secondary-500)] to-[var(--success-500)]"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-[var(--text-muted)]">
                  {completedLessons} de {totalLessons} aulas concluídas.
                </p>
              </div>

              <div className="mt-5 grid gap-2">
                <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                  <Trophy className="h-5 w-5 text-[var(--accent-500)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">Exercícios integrados</p>
                    <p className="text-xs text-[var(--text-muted)]">prática guiada</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                  <FileText className="h-5 w-5 text-[var(--secondary-700)] dark:text-[var(--secondary-300)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">Materiais técnicos</p>
                    <p className="text-xs text-[var(--text-muted)]">PDFs e anexos</p>
                  </div>
                </div>
              </div>

              <IsoButton
                className="mt-5 w-full"
                disabled={
                  (!course.isPremium && enrollMutation.isPending) ||
                  (course.isPremium &&
                    (paymentPreferenceMutation.isPending || transparentPaymentMutation.isPending))
                }
                onClick={() => {
                  if (course.isPremium && !course.isEnrolled) {
                    if (!token) {
                      trackPurchaseIntent(course, 'transparent');
                      navigate(accountEntryUrl);
                      return;
                    }

                    trackPurchaseIntent(course, 'transparent');
                    trackCheckoutStarted(course, 'transparent');
                    setCompletedPayment(null);
                    setPaymentBrickPreferenceId(null);
                    setPaymentAttemptId(crypto.randomUUID());
                    setShowTransparentCheckout((current) => !current);
                    paymentBrickPreferenceMutation.mutate();
                    return;
                  }

                  if (!course.isPremium && !course.isEnrolled) {
                    if (!token) {
                      navigate(accountEntryUrl);
                      return;
                    }

                    enrollMutation.mutate();
                    return;
                  }

                  const firstLesson = course.modulos[0]?.aulas[0];
                  if (firstLesson) {
                    navigate(`/courses/${course.slug}/lessons/${firstLesson.slug}`);
                  }
                }}
              >
                <PlayCircle className="h-5 w-5" />
                {course.isPremium && !course.isEnrolled
                  ? token
                    ? 'Comprar acesso'
                    : 'Criar conta para comprar'
                  : !course.isPremium && !course.isEnrolled
                    ? !token
                      ? 'Criar conta para matricular'
                      : enrollMutation.isPending
                      ? 'Matriculando...'
                      : 'Matricular grátis'
                    : 'Continuar disciplina'}
              </IsoButton>

              {course.isPremium && !course.isEnrolled && (
                <button
                  type="button"
                  className="mt-3 w-full text-sm font-semibold text-[var(--text-muted)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--text)]"
                  disabled={paymentPreferenceMutation.isPending}
                  onClick={() => {
                    if (!token) {
                      trackPurchaseIntent(course, 'external');
                      navigate(accountEntryUrl);
                      return;
                    }

                    trackPurchaseIntent(course, 'external');
                    trackCheckoutStarted(course, 'external');
                    paymentPreferenceMutation.mutate();
                  }}
                >
                  {paymentPreferenceMutation.isPending
                    ? 'Abrindo checkout externo...'
                    : token
                      ? 'Pagar no Mercado Pago'
                      : 'Entre para pagar no Mercado Pago'}
                </button>
              )}

              {course.isEnrolled && (
                <p className="mt-3 text-center text-sm text-[var(--success-500)]">
                  Você está matriculado nesta disciplina.
                </p>
              )}

              {enrollMutation.isError && (
                <p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  Não foi possível realizar a matrícula agora.
                </p>
              )}

              {transparentPaymentMutation.isError && (
                <p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  Não foi possível processar o pagamento transparente.
                </p>
              )}

              {paymentPreferenceMutation.isError && (
                <p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  Não foi possível iniciar o checkout externo.
                </p>
              )}
            </LiquidCard>
          </div>
        </div>
      </LiquidCard>

      {course.isPremium && !course.isEnrolled && showTransparentCheckout && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowTransparentCheckout(false);
            }
          }}
        >
          <section
            aria-labelledby="payment-modal-title"
            aria-modal="true"
            role="dialog"
            className="liquid-glass my-auto w-full max-w-xl rounded-2xl p-0"
          >
            <div className="max-h-[calc(100vh-1.5rem)] overflow-y-auto">
              <div className="min-w-0 p-4 sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4 border-b border-[var(--border)] pb-5">
                  <div>
                    <IsoBadge variant="orange">
                      <CreditCard className="mr-1 h-3.5 w-3.5" />
                      Checkout
                    </IsoBadge>
                    <h2 id="payment-modal-title" className="mt-3 text-xl font-semibold text-[var(--text)] sm:text-2xl">
                      Pagamento do acesso
                    </h2>
                  </div>
                  <button
                    aria-label="Fechar pagamento"
                    className="iso-button-soft h-11 w-11 min-h-0 shrink-0 rounded-lg p-0"
                    onClick={() => setShowTransparentCheckout(false)}
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)]">{course.titulo}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">Acesso premium</p>
                  </div>
                  <strong className="iso-stat-number shrink-0 text-xl text-[var(--text)]">
                    R$ {course.preco?.toFixed(2)}
                  </strong>
                </div>

                {completedPayment ? (
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 text-center sm:p-6">
                    <div className={[
                      'mx-auto flex h-16 w-16 items-center justify-center rounded-full border',
                      paymentApproved
                        ? 'border-[rgba(56,178,172,0.28)] bg-[rgba(56,178,172,0.14)] text-[var(--success-500)]'
                        : 'border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent-500)]',
                    ].join(' ')}>
                      <CircleCheckBig className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-[var(--text)]">
                      {paymentApproved
                        ? 'Pagamento aprovado'
                        : paymentRejected
                          ? 'Pagamento recusado'
                          : 'Pagamento recebido'}
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-soft)]">
                      {paymentApproved
                        ? 'Obrigado pela compra. Seu acesso ao curso já foi liberado.'
                        : paymentRejected
                          ? 'O Mercado Pago não aprovou esta tentativa. Você pode tentar outro cartão.'
                          : 'Obrigado. O Mercado Pago está finalizando a confirmação do pagamento.'}
                    </p>
                    <p className="mt-3 text-xs text-[var(--text-muted)]">
                      ID do pagamento: {completedPayment.paymentId}
                    </p>
                    {completedPayment.instructions.pixQrCodeBase64 && (
                      <div className="mx-auto mt-4 max-w-sm rounded-xl border border-[var(--border)] bg-white p-4 text-slate-900">
                        <img
                          alt="QR Code Pix"
                          className="mx-auto aspect-square w-52"
                          src={`data:image/png;base64,${completedPayment.instructions.pixQrCodeBase64}`}
                        />
                        {completedPayment.instructions.pixQrCode && (
                          <textarea
                            aria-label="Código Pix copia e cola"
                            className="mt-3 max-h-28 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs"
                            readOnly
                            value={completedPayment.instructions.pixQrCode}
                          />
                        )}
                      </div>
                    )}
                    {completedPayment.instructions.ticketUrl && !paymentApproved && (
                      <a
                        className="iso-button-primary mx-auto mt-4 w-fit gap-2 px-4"
                        href={completedPayment.instructions.ticketUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Abrir instruções de pagamento
                      </a>
                    )}
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {paymentApproved && firstLesson && (
                        <button
                          className="iso-button-primary w-full gap-2 px-4"
                          onClick={() => navigate(`/courses/${course.slug}/lessons/${firstLesson.slug}`)}
                          type="button"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Começar curso
                        </button>
                      )}
                      <button
                        className="iso-button-soft w-full px-4"
                        onClick={() => {
                          if (paymentRejected) {
                            setCompletedPayment(null);
                            setPaymentAttemptId(crypto.randomUUID());
                            return;
                          }

                          setShowTransparentCheckout(false);
                        }}
                        type="button"
                      >
                        {paymentApproved
                          ? 'Voltar ao curso'
                          : paymentRejected
                            ? 'Tentar novamente'
                            : 'Fechar'}
                      </button>
                      {!paymentApproved && !paymentRejected && (
                        <button
                          className="iso-button-soft w-full px-4"
                          onClick={() => navigate('/profile')}
                          type="button"
                        >
                          Ver compras
                        </button>
                      )}
                    </div>
                  </div>
                ) : mercadoPagoPublicKey && paymentBrickPreferenceId ? (
                  <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white p-3 text-slate-900">
                    <Payment
                      id="course-payment-brick"
                      initialization={{
                        amount: course.preco ?? 0,
                        preferenceId: paymentBrickPreferenceId,
                        payer: user?.email ? { email: user.email } : undefined,
                      }}
                      customization={{
                        paymentMethods: {
                          ticket: 'all',
                          bankTransfer: 'all',
                          atm: 'all',
                          creditCard: 'all',
                          prepaidCard: 'all',
                          debitCard: 'all',
                          mercadoPago: 'all',
                        },
                        visual: {
                          style: {
                            theme: 'default',
                          },
                        },
                      }}
                      locale="pt-BR"
                      onError={() => setCheckoutReady(false)}
                      onReady={() => setCheckoutReady(true)}
                      onSubmit={async ({ formData }) => {
                        await transparentPaymentMutation.mutateAsync({
                          ...formData,
                          paymentAttemptId,
                          payer: {
                            ...formData.payer,
                            email: formData.payer.email || user?.email || '',
                          },
                        });
                      }}
                    />
                  </div>
                ) : mercadoPagoPublicKey && paymentBrickPreferenceMutation.isPending ? (
                  <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-soft)]">
                    Preparando cartão, Pix, boleto e demais meios de pagamento...
                  </p>
                ) : mercadoPagoPublicKey && paymentBrickPreferenceMutation.isError ? (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                    <p>Não foi possível preparar todos os meios de pagamento.</p>
                    <button
                      className="iso-button-soft mt-3 px-4"
                      onClick={() => paymentBrickPreferenceMutation.mutate()}
                      type="button"
                    >
                      Tentar novamente
                    </button>
                  </div>
                ) : (
                  <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                    Chave pública do Mercado Pago não configurada.
                  </p>
                )}

                {!completedPayment && (
                  <div className="mt-4 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-soft)]">
                  <span className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success-500)]" />
                    Cartão, Pix, boleto e demais meios processados pelo Mercado Pago.
                  </span>
                  <span className="flex items-start gap-2">
                    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[var(--secondary-700)] dark:text-[var(--secondary-300)]" />
                    {mercadoPagoPublicKey
                      ? checkoutReady
                        ? 'Formulario seguro pronto.'
                        : 'Preparando o formulario seguro...'
                      : 'Chave pública do Mercado Pago não configurada.'}
                  </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
        <LiquidCard className="rounded-xl p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--secondary-700)] dark:text-[var(--secondary-300)]">
            O que você leva
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">
            Benefícios do curso
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {benefitLines.map((benefit) => (
              <div
                key={benefit}
                className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3"
              >
                <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-[var(--success-500)]" />
                <p className="text-sm leading-6 text-[var(--text-soft)]">{benefit}</p>
              </div>
            ))}
          </div>
        </LiquidCard>

        <LiquidCard className="rounded-xl p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Para quem é
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">
            Público-alvo
          </h2>
          <div className="mt-4 space-y-2">
            {audienceLines.map((audience) => (
              <div
                key={audience}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm leading-6 text-[var(--text-soft)]"
              >
                {audience}
              </div>
            ))}
          </div>
        </LiquidCard>
      </div>

      <LiquidCard className="rounded-xl p-4 sm:p-5">
        <div className="border-b border-[var(--border)] pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--secondary-700)] dark:text-[var(--secondary-300)]">
            Conteúdo da trilha
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
            Do fundamento à prática em {course.modulos.length} módulos
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-soft)]">
            Explore as aulas antes de decidir. As prévias abertas mostram o estilo do curso e as demais aulas ficam liberadas conforme o acesso.
          </p>
        </div>
      </LiquidCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {course.modulos.map((module) => (
          <LiquidCard key={module.id} className="rounded-xl p-4 sm:p-5">
            <div className="mb-4 border-b border-[var(--border)] pb-4">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--secondary-700)] dark:text-[var(--secondary-300)]">
                Módulo {module.ordem}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">{module.titulo}</h2>
              {module.descricao && (
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{module.descricao}</p>
              )}
            </div>

            <div className="space-y-2">
              {module.aulas.map((lesson) => {
                const isLessonCompleted = progress?.some(
                  (item) => item.aulaId === lesson.id && item.concluida,
                );

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => {
                      if (token) {
                        navigate(`/courses/${course.slug}/lessons/${lesson.slug}`);
                        return;
                      }

                      navigate(
                        lesson.isGratuita
                          ? `/preview/lessons/${lesson.id}`
                          : accountEntryUrl,
                      );
                    }}
                    className="group flex w-full gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-left transition hover:border-[var(--accent-border)] hover:bg-[var(--surface)]"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]">
                        {isLessonCompleted ? <CheckCircle2 className="h-4 w-4 text-[var(--success-500)]" /> : <PlayCircle className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <IsoBadge>Aula</IsoBadge>
                          {lesson.isGratuita ? <IsoBadge variant="success">Gratuita</IsoBadge> : <IsoBadge variant="orange">Premium</IsoBadge>}
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-[var(--text)] sm:text-base">{lesson.titulo}</h3>
                        {lesson.descricao && <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-soft)]">{lesson.descricao}</p>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </LiquidCard>
        ))}
      </div>
    </section>
  );
}
