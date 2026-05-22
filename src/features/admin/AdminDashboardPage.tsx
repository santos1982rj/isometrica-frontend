import {
  CreditCard,
  Search,
  GraduationCap,
  ShieldCheck,
  Settings2,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IsoBadge } from '../../components/ui/IsoBadge';
import { LiquidCard } from '../../components/ui/LiquidCard';

import {
  getAdminOverview,
  getAdminTrackingSettings,
  listAdminCourses,
  listAdminTransactions,
  listAdminUsers,
  updateAdminCourseStatus,
  updateAdminCourseCommercial,
  updateAdminCourseSales,
  updateAdminLessonPreview,
  updateAdminTrackingSettings,
  updateAdminUserAccess,
} from './admin.service';

import type { AdminCourse, AdminUser } from './admin.types';

export function AdminDashboardPage() {
  const queryClient = useQueryClient();

  const { data: overview } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: getAdminOverview,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: listAdminUsers,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: listAdminCourses,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: listAdminTransactions,
  });
  const { data: trackingSettings } = useQuery({
    queryKey: ['admin', 'settings', 'tracking'],
    queryFn: getAdminTrackingSettings,
  });
  const [courseStatusFilter, setCourseStatusFilter] = useState<
    'ALL' | 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO'
  >('ALL');
  const [courseQuery, setCourseQuery] = useState('');
  const [courseTeacherFilter, setCourseTeacherFilter] = useState<'ALL' | string>('ALL');
  const [courseSort, setCourseSort] = useState<
    'RECENT' | 'TITLE_ASC' | 'TITLE_DESC' | 'LESSONS_DESC'
  >('RECENT');
  const [trackingForm, setTrackingForm] = useState({
    googleTagManagerId: '',
    googleAnalyticsMeasurementId: '',
    metaPixelId: '',
  });

  useEffect(() => {
    if (!trackingSettings) {
      return;
    }

    setTrackingForm({
      googleTagManagerId: trackingSettings.googleTagManagerId ?? '',
      googleAnalyticsMeasurementId:
        trackingSettings.googleAnalyticsMeasurementId ?? '',
      metaPixelId: trackingSettings.metaPixelId ?? '',
    });
  }, [trackingSettings]);

  const updateUserAccessMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: Pick<AdminUser, 'role' | 'status'>;
    }) => updateAdminUserAccess(userId, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] }),
      ]);
    },
  });

  const updateCourseStatusMutation = useMutation({
    mutationFn: ({
      courseId,
      status,
    }: {
      courseId: string;
      status: AdminCourse['status'];
    }) => updateAdminCourseStatus(courseId, { status }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] }),
      ]);
    },
  });

  const updateCourseCommercialMutation = useMutation({
    mutationFn: ({
      courseId,
      isPremium,
      preco,
    }: {
      courseId: string;
      isPremium: boolean;
      preco: number | null;
    }) => updateAdminCourseCommercial(courseId, { isPremium, preco }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });

  const updateCourseSalesMutation = useMutation({
    mutationFn: ({
      courseId,
      resumo,
      imagem,
      beneficios,
      publicoAlvo,
    }: {
      courseId: string;
      resumo: string;
      imagem: string;
      beneficios: string;
      publicoAlvo: string;
    }) =>
      updateAdminCourseSales(courseId, {
        resumo,
        imagem,
        beneficios,
        publicoAlvo,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });

  const updateLessonPreviewMutation = useMutation({
    mutationFn: ({
      lessonId,
      isGratuita,
    }: {
      lessonId: string;
      isGratuita: boolean;
    }) => updateAdminLessonPreview(lessonId, isGratuita),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });

  const updateTrackingSettingsMutation = useMutation({
    mutationFn: updateAdminTrackingSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'settings', 'tracking'],
      });
    },
  });

  function handleTrackingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateTrackingSettingsMutation.mutate(trackingForm);
  }

  const filteredCourses = useMemo(
    () => {
      const normalizedQuery = courseQuery.trim().toLowerCase();

      return courses.filter((course) => {
        const matchStatus =
          courseStatusFilter === 'ALL' || course.status === courseStatusFilter;
        const matchTeacher =
          courseTeacherFilter === 'ALL' ||
          course.criadoPor?.id === courseTeacherFilter;
        const matchQuery =
          normalizedQuery.length === 0 ||
          course.titulo.toLowerCase().includes(normalizedQuery) ||
          course.slug.toLowerCase().includes(normalizedQuery);

        return matchStatus && matchTeacher && matchQuery;
      });
    },
    [courseQuery, courseStatusFilter, courseTeacherFilter, courses],
  );

  const sortedCourses = useMemo(() => {
    const items = [...filteredCourses];

    if (courseSort === 'TITLE_ASC') {
      items.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
      return items;
    }

    if (courseSort === 'TITLE_DESC') {
      items.sort((a, b) => b.titulo.localeCompare(a.titulo, 'pt-BR'));
      return items;
    }

    if (courseSort === 'LESSONS_DESC') {
      items.sort((a, b) => {
        const lessonsA = a.modulos.reduce(
          (total, module) => total + module.aulas.length,
          0,
        );
        const lessonsB = b.modulos.reduce(
          (total, module) => total + module.aulas.length,
          0,
        );
        return lessonsB - lessonsA;
      });
      return items;
    }

    items.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return items;
  }, [courseSort, filteredCourses]);

  const teacherOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const course of courses) {
      if (course.criadoPor?.id) {
        map.set(course.criadoPor.id, course.criadoPor.nome);
      }
    }
    return Array.from(map.entries()).map(([id, nome]) => ({ id, nome }));
  }, [courses]);

  return (
    <section className="space-y-6">
      <LiquidCard className="rounded-[2rem] p-8">
        <IsoBadge variant="orange">Área administrativa</IsoBadge>

        <h1 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)]">
          Dashboard Admin
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-[var(--text-soft)]">
          Acesso geral da plataforma: usuários, professores, cursos,
          pagamentos e operação. Professores não acessam esta área.
        </p>
      </LiquidCard>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetric
          icon={<Users />}
          title="Usuários"
          value={overview?.users.total ?? 0}
          helper={`${overview?.users.teachers ?? 0} professores`}
        />
        <AdminMetric
          icon={<GraduationCap />}
          title="Cursos"
          value={overview?.content.courses ?? 0}
          helper={`${overview?.content.publicCourses ?? 0} publicados`}
        />
        <AdminMetric
          icon={<ShieldCheck />}
          title="Aulas"
          value={overview?.content.lessons ?? 0}
          helper={`${overview?.content.modules ?? 0} módulos`}
        />
        <AdminMetric
          icon={<CreditCard />}
          title="Pagamentos"
          value={overview?.payments.transactions ?? 0}
          helper={`${overview?.payments.pending ?? 0} pendentes · R$ ${(overview?.payments.approvedRevenue ?? 0).toFixed(2)} aprovados`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <LiquidCard>
          <h2 className="text-2xl font-black text-[var(--text)]">
            Usuários recentes
          </h2>

          <div className="mt-5 overflow-hidden rounded-3xl border border-[var(--border)]">
            {users.slice(0, 8).map((user) => (
              <div
                key={user.id}
                className="grid gap-3 border-b border-[var(--border)] bg-[var(--surface-soft)] p-4 last:border-b-0 xl:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-bold text-[var(--text)]">
                    {user.nome}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {user.email}
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <AccessSelect
                    label="Papel"
                    value={user.role}
                    options={['ALUNO', 'PROFESSOR', 'ADMIN']}
                    onChange={(role) =>
                      updateUserAccessMutation.mutate({
                        userId: user.id,
                        data: {
                          role: role as AdminUser['role'],
                          status: user.status,
                        },
                      })
                    }
                  />

                  <AccessSelect
                    label="Status"
                    value={user.status}
                    options={['ATIVO', 'INATIVO', 'SUSPENSO']}
                    onChange={(status) =>
                      updateUserAccessMutation.mutate({
                        userId: user.id,
                        data: {
                          role: user.role,
                          status: status as AdminUser['status'],
                        },
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </LiquidCard>

        <LiquidCard>
          <h2 className="text-2xl font-black text-[var(--text)]">
            Cursos da plataforma
          </h2>
          {updateCourseStatusMutation.isError && (
            <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              Não foi possível alterar a publicação. Revise o checklist do curso.
            </p>
          )}

          <div className="mt-4">
            <AccessSelect
              label="Filtro status"
              value={courseStatusFilter}
              options={['ALL', 'RASCUNHO', 'PUBLICADO', 'ARQUIVADO']}
              onChange={(value) =>
                setCourseStatusFilter(
                  value as 'ALL' | 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO',
                )
              }
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Busca
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  value={courseQuery}
                  onChange={(event) => setCourseQuery(event.target.value)}
                  placeholder="Titulo ou slug"
                  className="h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-xs font-semibold text-[var(--text)] outline-none"
                />
              </div>
            </label>

            <label className="grid gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Professor
              <select
                value={courseTeacherFilter}
                onChange={(event) => setCourseTeacherFilter(event.target.value)}
                className="h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-bold text-[var(--text)] outline-none"
              >
                <option value="ALL">Todos</option>
                {teacherOptions.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.nome}
                  </option>
                ))}
              </select>
            </label>

            <AccessSelect
              label="Ordenação"
              value={courseSort}
              options={['RECENT', 'TITLE_ASC', 'TITLE_DESC', 'LESSONS_DESC']}
              onChange={(value) =>
                setCourseSort(
                  value as 'RECENT' | 'TITLE_ASC' | 'TITLE_DESC' | 'LESSONS_DESC',
                )
              }
            />
          </div>

          <div className="mt-5 space-y-3">
            {sortedCourses.length === 0 && (
              <p className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-soft)]">
                Nenhum curso encontrado com os filtros atuais.
              </p>
            )}
            {sortedCourses.slice(0, 8).map((course) => (
              <div
                key={course.id}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[var(--text)]">
                      {course.titulo}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      {course.criadoPor?.nome ?? 'Sem professor'}
                    </p>
                  </div>

                  <IsoBadge
                    variant={course.status === 'PUBLICADO' ? 'success' : 'orange'}
                  >
                    {course.status}
                  </IsoBadge>
                </div>

                <p className="mt-3 text-xs font-semibold text-[var(--text-muted)]">
                  {course.modulos.length} módulos ·{' '}
                  {course.modulos.reduce(
                    (total, module) => total + module.aulas.length,
                    0,
                  )}{' '}
                  aulas
                </p>

                <div className="mt-3 flex gap-2">
                  <a
                    className="iso-button-soft min-h-0 px-3 py-2 text-xs"
                    href={`/courses/${course.slug}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Pré-visualizar
                  </a>
                  <a
                    className="iso-button-soft min-h-0 px-3 py-2 text-xs"
                    href="/teacher"
                  >
                    Editar conteúdo
                  </a>
                  {course.status !== 'PUBLICADO' && (
                    <button
                      type="button"
                      className="iso-button-soft min-h-0 px-3 py-2 text-xs"
                      onClick={() =>
                        updateCourseStatusMutation.mutate({
                          courseId: course.id,
                          status: 'PUBLICADO',
                        })
                      }
                    >
                      Publicar
                    </button>
                  )}
                  {course.status !== 'ARQUIVADO' && (
                    <button
                      type="button"
                      className="iso-button-soft min-h-0 px-3 py-2 text-xs"
                      onClick={() =>
                        updateCourseStatusMutation.mutate({
                          courseId: course.id,
                          status: 'ARQUIVADO',
                        })
                      }
                    >
                      Arquivar
                    </button>
                  )}
                  {course.status === 'ARQUIVADO' && (
                    <button
                      type="button"
                      className="iso-button-soft min-h-0 px-3 py-2 text-xs"
                      onClick={() =>
                        updateCourseStatusMutation.mutate({
                          courseId: course.id,
                          status: 'RASCUNHO',
                        })
                      }
                    >
                      Reabrir rascunho
                    </button>
                  )}
                </div>

                <PublicationChecklist course={course} />
                <LessonPreviewForm
                  course={course}
                  isPending={updateLessonPreviewMutation.isPending}
                  onToggle={(lessonId, isGratuita) =>
                    updateLessonPreviewMutation.mutate({
                      lessonId,
                      isGratuita,
                    })
                  }
                />

                <CommercialCourseForm
                  course={course}
                  isPending={updateCourseCommercialMutation.isPending}
                  onSave={(isPremium, preco) =>
                    updateCourseCommercialMutation.mutate({
                      courseId: course.id,
                      isPremium,
                      preco,
                    })
                  }
                />
                <SalesCourseForm
                  course={course}
                  isPending={updateCourseSalesMutation.isPending}
                  onSave={(resumo, imagem, beneficios, publicoAlvo) =>
                    updateCourseSalesMutation.mutate({
                      courseId: course.id,
                      resumo,
                      imagem,
                      beneficios,
                      publicoAlvo,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </LiquidCard>
      </div>

      <LiquidCard>
        <h2 className="text-2xl font-black text-[var(--text)]">
          Transações recentes
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300">
            Aprovadas: {overview?.payments.approved ?? 0}
          </p>
          <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300">
            Pendentes: {overview?.payments.pending ?? 0}
          </p>
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300">
            Recusadas/Estorno: {(overview?.payments.rejected ?? 0) + (overview?.payments.refunded ?? 0)}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {transactions.length === 0 ? (
            <p className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 text-[var(--text-soft)]">
              Nenhuma transação registrada ainda. A integração com Mercado Pago
              será conectada nesta área.
            </p>
          ) : (
            transactions.slice(0, 8).map((transaction) => (
              <div
                key={transaction.id}
                className="grid gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-bold text-[var(--text)]">
                    {transaction.user.nome}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {transaction.referenciaCompra}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <strong className="text-[var(--text)]">
                    R$ {transaction.valorTotal.toFixed(2)}
                  </strong>
                  <IsoBadge
                    variant={
                      transaction.status === 'APROVADO'
                        ? 'success'
                        : 'orange'
                    }
                  >
                    {transaction.status}
                  </IsoBadge>
                </div>
              </div>
            ))
          )}
        </div>
      </LiquidCard>

      <LiquidCard>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-cyan-300">
                <Settings2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-[var(--text)]">
                  Configurações de rastreamento
                </h2>
                <p className="mt-1 text-sm text-[var(--text-soft)]">
                  Ative integrações por ID para medir visitas e campanhas.
                </p>
              </div>
            </div>
          </div>

          {trackingSettings?.updatedAt && (
            <IsoBadge variant="success">
              Atualizado em{' '}
              {new Date(trackingSettings.updatedAt).toLocaleDateString('pt-BR')}
            </IsoBadge>
          )}
        </div>

        <form
          className="mt-6 grid gap-4 lg:grid-cols-3"
          onSubmit={handleTrackingSubmit}
        >
          <TrackingInput
            label="Google Tag Manager"
            helper="Exemplo: GTM-ABC1234"
            value={trackingForm.googleTagManagerId}
            placeholder="GTM-"
            onChange={(googleTagManagerId) =>
              setTrackingForm((current) => ({
                ...current,
                googleTagManagerId,
              }))
            }
          />
          <TrackingInput
            label="Google Analytics"
            helper="Measurement ID do GA4"
            value={trackingForm.googleAnalyticsMeasurementId}
            placeholder="G-"
            onChange={(googleAnalyticsMeasurementId) =>
              setTrackingForm((current) => ({
                ...current,
                googleAnalyticsMeasurementId,
              }))
            }
          />
          <TrackingInput
            label="Meta Pixel"
            helper="Pixel ID numérico"
            value={trackingForm.metaPixelId}
            placeholder="1234567890"
            onChange={(metaPixelId) =>
              setTrackingForm((current) => ({
                ...current,
                metaPixelId,
              }))
            }
          />

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm leading-6 text-[var(--text-soft)] lg:col-span-2">
            Os campos vazios desligam a integração correspondente. A plataforma
            salva somente identificadores validados e monta as tags no frontend.
          </div>

          <div className="flex flex-col justify-end gap-2">
            {updateTrackingSettingsMutation.isError && (
              <p className="text-sm font-semibold text-red-300">
                Não foi possível salvar. Revise os IDs informados.
              </p>
            )}
            {updateTrackingSettingsMutation.isSuccess && (
              <p className="text-sm font-semibold text-emerald-300">
                Configurações salvas.
              </p>
            )}
            <button
              type="submit"
              className="iso-button min-h-0 px-4 py-3"
              disabled={updateTrackingSettingsMutation.isPending}
            >
              {updateTrackingSettingsMutation.isPending
                ? 'Salvando...'
                : 'Salvar rastreamento'}
            </button>
          </div>
        </form>
      </LiquidCard>
    </section>
  );
}

function AccessSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-bold text-[var(--text)] outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function AdminMetric({
  icon,
  title,
  value,
  helper,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  helper: string;
}) {
  return (
    <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-cyan-300">
        {icon}
      </div>

      <h2 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {title}
      </h2>

      <p className="mt-2 text-4xl font-black text-[var(--text)]">
        {value}
      </p>

      <p className="mt-2 text-sm text-[var(--text-soft)]">{helper}</p>
    </article>
  );
}

function TrackingInput({
  label,
  helper,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  helper: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <span className="text-xs font-bold uppercase text-[var(--text-muted)]">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 font-semibold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-cyan-300/60"
      />
      <span className="text-sm text-[var(--text-soft)]">{helper}</span>
    </label>
  );
}

function CommercialCourseForm({
  course,
  isPending,
  onSave,
}: {
  course: AdminCourse;
  isPending: boolean;
  onSave: (isPremium: boolean, preco: number | null) => void;
}) {
  const [isPremium, setIsPremium] = useState(course.isPremium);
  const [preco, setPreco] = useState(course.preco?.toString() ?? '');

  useEffect(() => {
    setIsPremium(course.isPremium);
    setPreco(course.preco?.toString() ?? '');
  }, [course.isPremium, course.preco]);

  return (
    <div className="mt-4 grid gap-2 border-t border-[var(--border)] pt-4 sm:grid-cols-[1fr_0.8fr_auto] sm:items-end">
      <label className="grid gap-1 text-[10px] font-bold uppercase text-[var(--text-muted)]">
        Venda
        <select
          className="h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-bold text-[var(--text)] outline-none"
          value={isPremium ? 'premium' : 'free'}
          onChange={(event) => setIsPremium(event.target.value === 'premium')}
        >
          <option value="premium">Premium</option>
          <option value="free">Gratuito</option>
        </select>
      </label>
      <label className="grid gap-1 text-[10px] font-bold uppercase text-[var(--text-muted)]">
        Preço
        <input
          className="h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-bold text-[var(--text)] outline-none disabled:opacity-50"
          disabled={!isPremium}
          min="0"
          onChange={(event) => setPreco(event.target.value)}
          placeholder="0.00"
          step="0.01"
          type="number"
          value={preco}
        />
      </label>
      <button
        className="iso-button-soft min-h-0 h-10 px-3 text-xs"
        disabled={isPending || (isPremium && Number(preco) <= 0)}
        onClick={() => onSave(isPremium, isPremium ? Number(preco) : null)}
        type="button"
      >
        Salvar venda
      </button>
    </div>
  );
}

function SalesCourseForm({
  course,
  isPending,
  onSave,
}: {
  course: AdminCourse;
  isPending: boolean;
  onSave: (
    resumo: string,
    imagem: string,
    beneficios: string,
    publicoAlvo: string,
  ) => void;
}) {
  const [resumo, setResumo] = useState(course.resumo ?? '');
  const [imagem, setImagem] = useState(course.imagem ?? '');
  const [beneficios, setBeneficios] = useState(course.beneficios ?? '');
  const [publicoAlvo, setPublicoAlvo] = useState(course.publicoAlvo ?? '');

  useEffect(() => {
    setResumo(course.resumo ?? '');
    setImagem(course.imagem ?? '');
    setBeneficios(course.beneficios ?? '');
    setPublicoAlvo(course.publicoAlvo ?? '');
  }, [course.beneficios, course.imagem, course.publicoAlvo, course.resumo]);

  return (
    <details className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <summary className="cursor-pointer text-xs font-bold uppercase text-[var(--text-muted)]">
        Página de venda
      </summary>
      <div className="mt-3 grid gap-2">
        <input
          className="h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-xs font-semibold text-[var(--text)] outline-none"
          onChange={(event) => setImagem(event.target.value)}
          placeholder="URL da capa do curso"
          value={imagem}
        />
        <textarea
          className="min-h-20 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-xs leading-5 text-[var(--text)] outline-none"
          onChange={(event) => setResumo(event.target.value)}
          placeholder="Promessa curta do curso"
          value={resumo}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <textarea
            className="min-h-28 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-xs leading-5 text-[var(--text)] outline-none"
            onChange={(event) => setBeneficios(event.target.value)}
            placeholder={'Benefícios, um por linha'}
            value={beneficios}
          />
          <textarea
            className="min-h-28 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-xs leading-5 text-[var(--text)] outline-none"
            onChange={(event) => setPublicoAlvo(event.target.value)}
            placeholder={'Público-alvo, um por linha'}
            value={publicoAlvo}
          />
        </div>
        <button
          className="iso-button-soft min-h-0 h-10 w-fit px-3 text-xs"
          disabled={isPending}
          onClick={() => onSave(resumo, imagem, beneficios, publicoAlvo)}
          type="button"
        >
          {isPending ? 'Salvando...' : 'Salvar página de venda'}
        </button>
      </div>
    </details>
  );
}

function PublicationChecklist({ course }: { course: AdminCourse }) {
  const lessons = course.modulos.flatMap((module) => module.aulas);
  const hasStructuredContent = course.modulos.length > 0 && lessons.length > 0;
  const hasLessonMaterial = lessons.some((lesson) => lesson.conteudo || lesson.videoUrl);
  const hasPreview = lessons.some((lesson) => lesson.isGratuita);
  const hasSalesCopy = !!course.resumo && !!course.beneficios && !!course.publicoAlvo;
  const hasImage = !!course.imagem;
  const hasPrice = !course.isPremium || !!course.preco;

  const checks = [
    {
      label: 'Estrutura com módulo e aula',
      ready: hasStructuredContent,
      required: true,
    },
    {
      label: 'Ao menos uma aula com conteúdo ou vídeo',
      ready: hasLessonMaterial,
      required: true,
    },
    {
      label: 'Preço definido para curso premium',
      ready: hasPrice,
      required: true,
    },
    {
      label: 'Prévia gratuita marcada',
      ready: hasPreview,
      required: false,
    },
    {
      label: 'Resumo, benefícios e público-alvo',
      ready: hasSalesCopy,
      required: false,
    },
    {
      label: 'Capa do curso',
      ready: hasImage,
      required: false,
    },
  ];

  return (
    <details className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <summary className="cursor-pointer text-xs font-bold uppercase text-[var(--text-muted)]">
        Checklist de publicação
      </summary>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {checks.map((check) => (
          <div
            className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-xs"
            key={check.label}
          >
            <span className="text-[var(--text-soft)]">{check.label}</span>
            <IsoBadge variant={check.ready ? 'success' : 'orange'}>
              {check.ready ? 'OK' : check.required ? 'Obrigatório' : 'Recomendado'}
            </IsoBadge>
          </div>
        ))}
      </div>
    </details>
  );
}

function LessonPreviewForm({
  course,
  isPending,
  onToggle,
}: {
  course: AdminCourse;
  isPending: boolean;
  onToggle: (lessonId: string, isGratuita: boolean) => void;
}) {
  const modulesWithLessons = course.modulos.filter((module) => module.aulas.length > 0);

  if (modulesWithLessons.length === 0) {
    return null;
  }

  return (
    <details className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <summary className="cursor-pointer text-xs font-bold uppercase text-[var(--text-muted)]">
        Aulas de prévia
      </summary>
      <div className="mt-3 grid gap-2">
        {modulesWithLessons.map((module) => (
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3" key={module.id}>
            <p className="text-xs font-bold text-[var(--text)]">{module.titulo}</p>
            <div className="mt-2 grid gap-2">
              {module.aulas.map((lesson) => (
                <label
                  className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-soft)]"
                  key={lesson.id}
                >
                  <span className="min-w-0 truncate">{lesson.titulo}</span>
                  <input
                    checked={lesson.isGratuita}
                    disabled={isPending}
                    onChange={(event) => onToggle(lesson.id, event.target.checked)}
                    type="checkbox"
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </details>
  );
}
