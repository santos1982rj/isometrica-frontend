import { ArrowRight, BookOpen, Clock3, Crown, Filter, GraduationCap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { PageLoader } from '../../components/loaders/PageLoader';
import { Seo } from '../../components/seo/Seo';
import { listCourses } from './courses.service';
import { useAuthStore } from '../../core/store/authStore';

type CourseFilter = 'ALL' | 'ENROLLED' | 'FREE' | 'PREMIUM';

const filters: Array<{ id: CourseFilter; label: string }> = [
  { id: 'ALL', label: 'Todas' },
  { id: 'ENROLLED', label: 'Matriculadas' },
  { id: 'FREE', label: 'Gratuitas' },
  { id: 'PREMIUM', label: 'Premium' },
];

function formatLevel(level: string) {
  const labels = {
    INICIANTE: 'Iniciante',
    INTERMEDIARIO: 'Intermediario',
    AVANCADO: 'Avancado',
  };

  return labels[level as keyof typeof labels] ?? level;
}

export function CoursesPage() {
  const token = useAuthStore((state) => state.token);
  const [filter, setFilter] = useState<CourseFilter>('ALL');
  const { data: courses = [], isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: listCourses,
  });

  const filteredCourses = useMemo(() => {
    if (filter === 'ENROLLED') {
      return courses.filter((course) => course.isEnrolled);
    }

    if (filter === 'FREE') {
      return courses.filter((course) => !course.isPremium);
    }

    if (filter === 'PREMIUM') {
      return courses.filter((course) => course.isPremium);
    }

    return courses;
  }, [courses, filter]);

  const enrolledCount = courses.filter((course) => course.isEnrolled).length;
  const freeCount = courses.filter((course) => !course.isPremium).length;
  const visibleFilters = token
    ? filters
    : filters.filter((item) => item.id !== 'ENROLLED');

  if (isLoading) {
    return (
      <>
        <Seo
          title="Cursos de engenharia"
          description="Catálogo de cursos da ISOMÉTRICA para estudar engenharia com trilhas organizadas."
        />
        <PageLoader />
      </>
    );
  }

  if (isError) {
    return (
      <section className="rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-sm font-semibold text-red-300">
        Não foi possível carregar os cursos.
      </section>
    );
  }

  return (
    <section className="w-full space-y-4">
      <Seo
        title="Cursos de engenharia"
        description="Catálogo de cursos da ISOMÉTRICA para estudar engenharia com trilhas organizadas."
      />

      <header className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm shadow-black/5">
        <div className="grid lg:grid-cols-[1fr_auto]">
          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-[var(--text-muted)]">
              <span className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-1 text-[var(--iso-primary)]">
                Catálogo
              </span>
              <span>Cursos</span>
            </div>
            <h1 className="mt-4 max-w-3xl text-2xl font-semibold text-[var(--text)] sm:text-3xl">
              Cursos organizados para estudar com continuidade.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
              Filtre por acesso, abra a trilha certa e acompanhe sua evolução sem perder o contexto do conteúdo.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-3 border-t border-[var(--border)] bg-[var(--surface-soft)] lg:min-w-[24rem] lg:border-l lg:border-t-0">
            {[
              { label: 'Cursos', value: courses.length },
              {
                label: token ? 'Matrículas' : 'Premium',
                value: token
                  ? enrolledCount
                  : courses.filter((course) => course.isPremium).length,
              },
              { label: 'Livres', value: freeCount },
            ].map((item) => (
              <div key={item.label} className="border-r border-[var(--border)] p-4 last:border-r-0 sm:p-5">
                <span className="block text-xs font-semibold uppercase text-[var(--text-muted)]">{item.label}</span>
                <strong className="numeric mt-3 block text-2xl font-semibold text-[var(--text)]">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm shadow-black/5 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
            <Filter className="h-4 w-4 text-[var(--iso-primary)]" />
            {filteredCourses.length} cursos visíveis
          </div>
          <div className="flex flex-wrap gap-2">
            {visibleFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={[
                  'min-h-9 rounded-md border px-3 text-sm font-semibold transition',
                  filter === item.id
                    ? 'border-[var(--accent-border)] bg-[var(--iso-primary-soft)] text-[var(--iso-primary)]'
                    : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] hover:border-[var(--border-strong)] hover:text-[var(--text)]',
                ].join(' ')}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <article
            key={course.id}
            className="group flex min-h-[25rem] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm shadow-black/5 transition hover:border-[var(--border-strong)]"
          >
            {course.imagem ? (
              <img className="h-40 w-full border-b border-[var(--border)] object-cover" src={course.imagem} alt="" />
            ) : (
              <div className="flex h-40 items-end border-b border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <div className="grid h-12 w-12 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--iso-primary)]">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-1 text-xs font-semibold text-[var(--text-soft)]">
                  {course.categoria ?? 'Engenharia'}
                </span>
                {course.isEnrolled && (
                  <span className="rounded-md bg-[var(--iso-primary-soft)] px-2 py-1 text-xs font-semibold text-[var(--iso-primary)]">
                    Matriculado
                  </span>
                )}
                <span className={[
                  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold',
                  course.isPremium
                    ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                    : 'bg-[rgba(56,178,172,0.12)] text-[var(--success-500)]',
                ].join(' ')}>
                  {course.isPremium && <Crown className="h-3 w-3" />}
                  {course.isPremium ? 'Premium' : 'Gratuito'}
                </span>
              </div>

              <h2 className="mt-4 line-clamp-2 text-xl font-semibold text-[var(--text)]">{course.titulo}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
                {course.resumo ?? course.descricao}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-2.5">
                  <BookOpen className="h-4 w-4 text-[var(--iso-primary)]" />
                  <strong className="numeric mt-2 block text-sm font-semibold text-[var(--text)]">{course.totalModulos}</strong>
                  <span className="text-xs text-[var(--text-muted)]">módulos</span>
                </div>
                <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-2.5">
                  <Clock3 className="h-4 w-4 text-[var(--accent)]" />
                  <strong className="numeric mt-2 block text-sm font-semibold text-[var(--text)]">{course.cargaHoraria ?? 0}h</strong>
                  <span className="text-xs text-[var(--text-muted)]">carga</span>
                </div>
                <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-2.5">
                  <GraduationCap className="h-4 w-4 text-[var(--success-500)]" />
                  <strong className="mt-2 block truncate text-sm font-semibold text-[var(--text)]">{formatLevel(course.nivel)}</strong>
                  <span className="text-xs text-[var(--text-muted)]">nível</span>
                </div>
              </div>

              <div className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--border)] pt-4">
                <div>
                  <span className="block text-xs font-semibold uppercase text-[var(--text-muted)]">
                    {course.isPremium ? 'Investimento' : 'Acesso'}
                  </span>
                  <strong className="numeric mt-1 block text-xl font-semibold text-[var(--text)]">
                    {course.isPremium ? `R$ ${course.preco?.toFixed(2)}` : 'Livre'}
                  </strong>
                </div>
                <Link
                  className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[var(--iso-primary)] px-3 text-sm font-semibold text-white transition hover:brightness-110"
                  to={`/courses/${course.slug}`}
                >
                  {course.isEnrolled ? 'Continuar' : 'Abrir'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}

        {filteredCourses.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--text-muted)] md:col-span-2 2xl:col-span-3">
            Nenhum curso encontrado neste filtro.
          </div>
        )}
      </section>
    </section>
  );
}
