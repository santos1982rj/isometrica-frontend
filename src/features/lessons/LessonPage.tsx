import { ArrowLeft, CheckCircle2, Clock3, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { LessonPlayer } from '../player/components/LessonPlayer';
import { getLessonById } from './lessons.service';
import { completeLesson, getMyProgress } from '../progress/progress.service';

export function LessonPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data: lesson, isLoading, isError } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => getLessonById(id!),
    enabled: !!id,
  });

  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: getMyProgress,
  });

  const isCompleted = progress?.some(
    (item) => item.aulaId === lesson?.id && item.concluida,
  );

  const completeLessonMutation = useMutation({
    mutationFn: () => completeLesson(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['progress'],
      });
    },
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

            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold text-slate-50">
                {lesson.titulo}
              </h1>

              {isCompleted && (
                <span className="flex w-fit items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-300/20">
                  <CheckCircle2 className="h-4 w-4" />
                  Aula concluída
                </span>
              )}
            </div>

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

          <button
            disabled={isCompleted || completeLessonMutation.isPending}
            onClick={() => completeLessonMutation.mutate()}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400/90 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-400/30 disabled:text-slate-300"
          >
            <CheckCircle2 className="h-5 w-5" />
            {isCompleted
              ? 'Aula concluída'
              : completeLessonMutation.isPending
                ? 'Salvando...'
                : 'Marcar como concluída'}
          </button>
        </aside>
      </div>
    </section>
  );
}