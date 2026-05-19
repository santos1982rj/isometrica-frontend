import {
  BookOpen,
  Clock3,
  Crown,
  Lock,
  PlayCircle,
} from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getCourseBySlug } from './courses.service';


function formatLevel(level: string) {
  const labels = {
    INICIANTE: 'Iniciante',
    INTERMEDIARIO: 'Intermediário',
    AVANCADO: 'Avançado',
  };

  return labels[level as keyof typeof labels] ?? level;
}

export function CourseDetailsPage() {
    const navigate = useNavigate();
    const { slug } = useParams();

  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['course-details', slug],
    queryFn: () => getCourseBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <section className="liquid-card rounded-3xl p-6">
        <p className="text-slate-300">Carregando disciplina...</p>
      </section>
    );
  }

  if (isError || !course) {
    return (
      <section className="liquid-card rounded-3xl p-6">
        <p className="text-red-300">
          Não foi possível carregar a disciplina.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="liquid-card rounded-[2rem] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              {course.categoria ?? 'Engenharia'}
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-50">
              {course.titulo}
            </h1>

            <p className="mt-5 max-w-3xl leading-8 text-slate-300">
              {course.descricao}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                Nível: {formatLevel(course.nivel)}
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                <Clock3 className="h-4 w-4 text-cyan-300" />
                {course.cargaHoraria ?? 0} horas
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                <BookOpen className="h-4 w-4 text-cyan-300" />
                {course.modulos.length} módulos
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            {course.isPremium ? (
              <>
                <div className="mb-5 flex items-center gap-2 text-orange-300">
                  <Crown className="h-5 w-5" />
                  Premium
                </div>

                <strong className="numeric text-4xl text-slate-50">
                  R$ {course.preco?.toFixed(2)}
                </strong>
              </>
            ) : (
              <>
                <div className="mb-5 text-emerald-300">
                  Acesso gratuito
                </div>

                <strong className="text-4xl text-slate-50">
                  Livre
                </strong>
              </>
            )}

            <button className="mt-8 h-12 w-full rounded-2xl bg-cyan-400/90 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Iniciar disciplina
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {course.modulos.map((module) => (
          <article
            key={module.id}
            className="liquid-card rounded-3xl p-6"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Módulo {module.ordem}
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-slate-50">
                {module.titulo}
              </h2>

              {module.descricao && (
                <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                  {module.descricao}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {module.aulas.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05] md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/20">
                      <PlayCircle className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-slate-50">
                        {lesson.titulo}
                      </h3>

                      {lesson.descricao && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                          {lesson.descricao}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-2 text-sm text-slate-300">
                      {lesson.duracao ?? 0} min
                    </div>

                    {lesson.isGratuita ? (
                      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-300/20">
                        Gratuita
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-300 ring-1 ring-orange-300/20">
                        <Lock className="h-3 w-3" />
                        Premium
                      </span>
                    )}

                    <button
  onClick={() => navigate(`/lessons/${lesson.id}`)}
  className="h-10 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
>
  Abrir aula
</button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}