import { BookOpen, Clock, Crown, Layers3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { listCourses } from './courses.service';

function formatLevel(level: string) {
  const labels = {
    INICIANTE: 'Iniciante',
    INTERMEDIARIO: 'Intermediário',
    AVANCADO: 'Avançado',
  };

  return labels[level as keyof typeof labels] ?? level;
}

export function CoursesPage() {
  const navigate = useNavigate();

  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: listCourses,
  });

  if (isLoading) {
    return (
      <section className="liquid-card rounded-3xl p-6">
        <p className="text-slate-300">Carregando disciplinas...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="liquid-card rounded-3xl p-6">
        <p className="text-red-300">
          Não foi possível carregar as disciplinas.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Disciplinas
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-50">
            Trilhas acadêmicas de engenharia
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            Conteúdos pensados para ajudar o estudante a entender conceitos,
            validar raciocínios e evoluir com rigor técnico.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {courses?.map((course) => (
          <article
            key={course.id}
            className="liquid-card group rounded-3xl p-6 transition hover:-translate-y-1"
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/20">
                <BookOpen className="h-6 w-6" />
              </div>

              {course.isPremium ? (
                <span className="flex items-center gap-1 rounded-full bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-300 ring-1 ring-orange-300/20">
                  <Crown className="h-3.5 w-3.5" />
                  Premium
                </span>
              ) : (
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-300/20">
                  Grátis
                </span>
              )}
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {course.categoria ?? 'Engenharia'}
            </p>

            <h3 className="text-2xl font-semibold text-slate-50">
              {course.titulo}
            </h3>

            <p className="mt-3 min-h-24 leading-7 text-slate-300">
              {course.resumo ?? course.descricao}
            </p>

            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-cyan-300" />
                {course.totalModulos} módulos
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-300" />
                {course.cargaHoraria ?? 0} horas
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                Nível: {formatLevel(course.nivel)}
              </div>
            </div>

            <button
              onClick={() => navigate(`/courses/${course.slug}`)}
              className="mt-8 h-11 w-full rounded-2xl bg-cyan-400/90 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Ver trilha
            </button>

            <div className="isometric-icon-layer text-7xl">⌬</div>
          </article>
        ))}
      </div>
    </section>
  );
}