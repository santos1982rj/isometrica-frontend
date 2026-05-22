import { useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  GraduationCap,
  LineChart,
  Lock,
  PlayCircle,
  Sigma,
  Target,
  Trophy,
} from 'lucide-react';

import { listCourses, listMyCourses } from '../courses/courses.service';
import { getMyProgress } from '../progress/progress.service';
import { useAnalytics } from '../analytics/useAnalytics';
import { useWeeklyAnalytics } from '../analytics/useWeeklyAnalytics';

type StatCardProps = {
  label: string;
  value: string | number;
  helper: string;
  icon: ReactNode;
};

const dayLabels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

const competencyMap = [
  { label: 'Fundamentos', value: 82, helper: 'base conceitual' },
  { label: 'Modelagem', value: 64, helper: 'hipoteses e unidades' },
  { label: 'Aplicação', value: 48, helper: 'exercícios resolvidos' },
];

function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours}h ${rest}min` : `${hours}h`;
}

function StatCard({ label, value, helper, icon }: StatCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 transition duration-300 hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">{label}</span>
          <strong className="numeric mt-2 block text-xl font-semibold text-[var(--text)] sm:text-2xl">{value}</strong>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--iso-primary)] transition duration-300 group-hover:border-[var(--accent-border)]">
          {icon}
        </span>
      </div>
      <p className="mt-3 border-t border-[var(--border)] pt-3 text-sm leading-5 text-[var(--text-muted)]">{helper}</p>
    </article>
  );
}

export function DashboardPage() {
  const { data: analytics } = useAnalytics();
  const { data: weekly = [] } = useWeeklyAnalytics();
  const { data: courses = [] } = useQuery({ queryKey: ['courses'], queryFn: listCourses });
  const { data: myCourses = [] } = useQuery({ queryKey: ['my-courses'], queryFn: listMyCourses });
  const { data: progress = [] } = useQuery({ queryKey: ['progress'], queryFn: getMyProgress });

  const weeklyXp = weekly.reduce((total, day) => total + day.xpGanho, 0);
  const weeklyExercises = weekly.reduce((total, day) => total + day.exercicios, 0);
  const maxWeeklyXp = Math.max(...weekly.map((day) => day.xpGanho), 1);

  const activeProgress = useMemo(
    () =>
      progress
        .filter((item) => !item.concluida)
        .sort((a, b) => (b.tempoAssistido ?? 0) - (a.tempoAssistido ?? 0))[0],
    [progress],
  );

  const completedLessons = progress.filter((item) => item.concluida).length;
  const progressPercent = progress.length > 0 ? Math.round((completedLessons / progress.length) * 100) : 0;
  const lessonsRemaining = Math.max(progress.length - completedLessons, 0);
  const recommendedCourses = courses.slice(0, 3);
  const enrolledCourses = myCourses.slice(0, 3);
  const continueHref = activeProgress
    ? `/courses/${activeProgress.aula.modulo.curso.slug}/lessons/${activeProgress.aula.slug}`
    : '/courses';

  return (
    <section className="w-full space-y-4">
      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm shadow-black/5">
        <div className="grid lg:grid-cols-[1.4fr_0.9fr]">
          <div className="border-b border-[var(--border)] p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-[var(--text-muted)]">
              <span className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-1 text-[var(--iso-primary)]">
                Dashboard
              </span>
              <span>Centro de estudo</span>
            </div>
            <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
              <div>
                <h1 className="max-w-2xl text-2xl font-semibold tracking-normal text-[var(--text)] sm:text-3xl">
                  {activeProgress ? 'Retome a aula que esta em andamento.' : 'Comece sua primeira trilha.'}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                  {activeProgress
                    ? `${activeProgress.aula.titulo} em ${activeProgress.aula.modulo.curso.titulo}.`
                    : 'Escolha um curso e monte um ritmo de estudo que avance aula por aula.'}
                </p>
              </div>
              <Link className="iso-button-primary min-h-11 justify-center gap-2 rounded-lg px-4 text-sm" to={continueHref}>
                <PlayCircle className="h-4 w-4" />
                {activeProgress ? 'Continuar aula' : 'Ver cursos'}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 bg-[var(--surface-soft)] sm:grid-cols-4 lg:grid-cols-2">
            {[
              { label: 'Nivel', value: analytics?.nivel ?? 1 },
              { label: 'Progresso', value: `${progressPercent}%` },
              { label: 'XP semana', value: weeklyXp },
              { label: 'Pendentes', value: lessonsRemaining },
            ].map((item) => (
              <div
                key={item.label}
                className="min-h-24 border-b border-r border-[var(--border)] p-4 last:border-b-0 sm:[&:nth-child(n+3)]:border-b-0 lg:[&:nth-child(3)]:border-b lg:[&:nth-child(2n)]:border-r-0"
              >
                <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">{item.label}</span>
                <strong className="numeric mt-3 block text-2xl font-semibold text-[var(--text)]">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
                <BookOpen className="h-4 w-4 text-[var(--iso-primary)]" />
                Próxima ação
              </div>
              <h2 className="mt-3 text-xl font-semibold text-[var(--text)]">
                {activeProgress?.aula.titulo ?? 'Escolha o curso de partida'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                {activeProgress
                  ? `${activeProgress.aula.modulo.titulo} | ${activeProgress.aula.modulo.curso.titulo}`
                  : 'A fila de cursos recomendados está pronta para iniciar seu histórico.'}
              </p>
            </div>
            <div className="min-w-32 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-right">
              <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">Concluidas</span>
              <strong className="numeric mt-2 block text-2xl font-semibold text-[var(--text)]">{completedLessons}</strong>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_13rem] md:items-center">
            <div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[var(--text)]">Andamento registrado</span>
                <span className="numeric font-semibold text-[var(--iso-primary)]">{progressPercent}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                <div className="h-full rounded-full bg-[var(--iso-primary)]" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <span className="block text-xs text-[var(--text-muted)]">Cursos ativos</span>
                  <strong className="numeric mt-1 block text-sm font-semibold text-[var(--text)]">
                    {analytics?.cursosEmAndamento ?? 0}
                  </strong>
                </div>
                <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <span className="block text-xs text-[var(--text-muted)]">Exercicios</span>
                  <strong className="numeric mt-1 block text-sm font-semibold text-[var(--text)]">{weeklyExercises}</strong>
                </div>
                <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <span className="block text-xs text-[var(--text-muted)]">Streak</span>
                  <strong className="numeric mt-1 block text-sm font-semibold text-[var(--text)]">{analytics?.streak ?? 0} dias</strong>
                </div>
              </div>
            </div>

            <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <div className="flex items-center gap-2">
                <Sigma className="h-4 w-4 text-[var(--accent)]" />
                <span className="text-sm font-semibold text-[var(--text)]">Sessao curta</span>
              </div>
              <p className="mt-3 text-sm leading-5 text-[var(--text-muted)]">
                Uma aula, uma anotação e um exercício antes de trocar de módulo.
              </p>
            </aside>
          </div>
        </article>

        <article className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Ritmo da semana</p>
              <strong className="numeric mt-2 block text-2xl font-semibold text-[var(--text)]">{weeklyXp} XP</strong>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--iso-primary)]">
              <LineChart className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-5 grid grid-cols-7 items-end gap-2">
            {dayLabels.map((label, index) => {
              const value = weekly[index]?.xpGanho ?? 0;
              const height = Math.max((value / maxWeeklyXp) * 92, 12);

              return (
                <div key={`${label}-${index}`} className="space-y-2 text-center">
                  <div className="flex h-28 items-end rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-1">
                    <div className="w-full rounded-sm bg-[var(--iso-primary)] transition duration-300 group-hover:bg-[var(--accent)]" style={{ height }} />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">{weeklyExercises} exercícios resolvidos nesta semana.</p>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="XP total" value={analytics?.xpTotal ?? 0} helper={`Nivel ${analytics?.nivel ?? 1} na plataforma.`} icon={<Trophy className="h-4 w-4" />} />
        <StatCard label="Sequencia" value={`${analytics?.streak ?? 0} dias`} helper="Consistencia de estudo recente." icon={<Flame className="h-4 w-4" />} />
        <StatCard label="Tempo estudado" value={formatMinutes(analytics?.tempoTotalEstudo ?? 0)} helper="Tempo acumulado nas aulas." icon={<Clock3 className="h-4 w-4" />} />
        <StatCard label="Cursos ativos" value={analytics?.cursosEmAndamento ?? 0} helper={`${analytics?.cursosConcluidos ?? 0} cursos finalizados.`} icon={<GraduationCap className="h-4 w-4" />} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Indicadores</p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Pratica atual</h2>
            </div>
            <Target className="h-5 w-5 text-[var(--iso-primary)]" />
          </div>
          <div className="mt-5 space-y-4">
            {competencyMap.map((item) => (
              <div key={item.label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">{item.label}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{item.helper}</p>
                  </div>
                  <span className="numeric text-sm font-semibold text-[var(--text-soft)]">{item.value}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                  <div className="h-full rounded-full bg-[var(--iso-primary)]" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Fila de estudo</p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Meus cursos</h2>
            </div>
            <Link className="hidden text-sm font-semibold text-[var(--iso-primary)] sm:inline-flex" to="/courses">
              Ver catalogo
            </Link>
          </div>
          <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {enrolledCourses.length > 0 &&
              enrolledCourses.map((enrollment) => (
                <Link key={enrollment.id} className="group/course flex items-center justify-between gap-4 py-4" to={`/courses/${enrollment.curso.slug}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-[var(--text)]">{enrollment.curso.titulo}</h3>
                      <span className="rounded-full bg-[var(--iso-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--iso-primary)]">
                        Matriculado
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-[var(--text-muted)]">{enrollment.curso.resumo ?? enrollment.curso.descricao}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                      <div className="h-full rounded-full bg-[var(--iso-primary)]" style={{ width: `${Math.round(enrollment.progresso)}%` }} />
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition duration-200 group-hover/course:translate-x-1 group-hover/course:text-[var(--iso-primary)]" />
                </Link>
              ))}
            {enrolledCourses.length === 0 &&
              recommendedCourses.map((course) => (
                <Link key={course.id} className="group/course flex items-center justify-between gap-4 py-4" to={`/courses/${course.slug}`}>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-[var(--text)]">{course.titulo}</h3>
                      {course.isPremium ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                          <Lock className="h-3 w-3" />
                          Premium
                        </span>
                      ) : (
                        <span className="rounded-full bg-[var(--iso-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--iso-primary)]">
                          Gratuito
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-[var(--text-muted)]">{course.resumo ?? course.descricao}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition duration-200 group-hover/course:translate-x-1 group-hover/course:text-[var(--iso-primary)]" />
                </Link>
              ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
            <CheckCircle2 className="h-5 w-5 text-[var(--iso-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--text)]">Revisao sugerida</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {progress.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                className="group/review flex min-h-28 flex-col justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3 transition duration-200 hover:border-[var(--accent-border)] hover:bg-[var(--surface)]"
                to={`/courses/${item.aula.modulo.curso.slug}/lessons/${item.aula.slug}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 ${item.concluida ? 'text-[var(--success-500)]' : 'text-[var(--text-muted)]'}`} />
                  <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition duration-200 group-hover/review:translate-x-1 group-hover/review:text-[var(--iso-primary)]" />
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium text-[var(--text)]">{item.aula.titulo}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">{item.aula.modulo.curso.titulo}</p>
                </div>
              </Link>
            ))}
            {progress.length === 0 && (
              <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm leading-6 text-[var(--text-muted)] md:col-span-3">
                Quando você assistir aulas, elas aparecerão aqui para revisão.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
          <h2 className="text-lg font-semibold text-[var(--text)]">Checklist da sessao</h2>
          <div className="mt-4 space-y-3">
            {[
              'Revise a hipotese antes de aplicar formula.',
              'Confira unidades e ordem de grandeza.',
              'Resolva uma questao antes de avancar.',
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success-500)]" />
                <p className="text-sm leading-6 text-[var(--text-muted)]">{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
