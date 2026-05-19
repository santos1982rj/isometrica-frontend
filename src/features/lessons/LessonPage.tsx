import { ArrowLeft, Clock3, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { LessonPlayer } from '../player/components/LessonPlayer';
import { getLessonById } from './lessons.service';

export function LessonPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: lesson, isLoading, isError } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => getLessonById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <section className="liquid-card rounded-3xl p-6">
        <p className="text-slate-300">Carregando aula...</p>
      </section>
    );
  }

  if (isError || !lesson) {
    return (
      <section className="liquid-card rounded-3xl p-6">
        <p className="text-red-300">Não foi possível carregar a aula.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <button
        onClick={() => navigate(`/courses/${lesson.modulo.curso.slug}`)}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-cyan-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a disciplina
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <LessonPlayer videoUrl={lesson.videoUrl} title={lesson.titulo} />

          <article className="liquid-card mt-6 rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              {lesson.modulo.curso.titulo}
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-50">
              {lesson.titulo}
            </h1>

            {lesson.descricao && (
              <p className="mt-4 leading-7 text-slate-300">
                {lesson.descricao}
              </p>
            )}

            {lesson.conteudo && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 leading-7 text-slate-300">
                {lesson.conteudo}
              </div>
            )}
          </article>
        </div>

        <aside className="liquid-card h-fit rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Informações da aula
          </p>

          <h2 className="mt-3 text-xl font-semibold text-slate-50">
            {lesson.modulo.titulo}
          </h2>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
              <Clock3 className="h-4 w-4 text-cyan-300" />
              {lesson.duracao ?? 0} minutos
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
              <Lock className="h-4 w-4 text-cyan-300" />
              {lesson.isGratuita ? 'Aula gratuita' : 'Aula premium'}
            </div>
          </div>

          <button className="mt-6 h-11 w-full rounded-2xl bg-emerald-400/90 font-semibold text-slate-950 transition hover:bg-emerald-300">
            Marcar como concluída
          </button>
        </aside>
      </div>
    </section>
  );
}