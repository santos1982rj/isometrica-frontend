import {
  CheckCircle2,
  Send,
  Sparkles,
  Trophy,
} from 'lucide-react';

import { useState } from 'react';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { IsoBadge } from '../../../components/ui/IsoBadge';
import { SectionHeader } from '../../../components/ui/SectionHeader';

import { attemptExercise } from '../exercises.service';

import type { Exercise } from '../exercises.types';

type LessonExercisesSectionProps = {
  lessonId: string;
  exercises: Exercise[];
};

/**
 * Seção responsável por renderizar e controlar
 * os exercícios de uma aula.
 *
 * Objetivos:
 * - manter LessonPage limpa;
 * - encapsular lógica de tentativa;
 * - preparar futuras evoluções:
 *   - IA monitora;
 *   - correção automática;
 *   - feedback técnico;
 *   - múltiplas tentativas.
 */
export function LessonExercisesSection({
  lessonId,
  exercises,
}: LessonExercisesSectionProps) {
  const queryClient = useQueryClient();

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const attemptExerciseMutation = useMutation({
    mutationFn: ({
      exerciseId,
      resposta,
    }: {
      exerciseId: string;
      resposta: string;
    }) =>
      attemptExercise(exerciseId, {
        resposta,
        correta: true,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lesson-exercises', lessonId],
      });

      queryClient.invalidateQueries({
        queryKey: ['analytics'],
      });
    },
  });

  return (
    <section className="mt-5">
      <SectionHeader
        eyebrow="Prática guiada"
        title="Exercícios da aula"
        description="Registre sua resolução, hipóteses e raciocínio técnico. A ISOMÉTRICA valoriza processo, não apenas resposta final."
        action={
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent-500)]">
            <Trophy className="h-5 w-5" />
          </div>
        }
      />

      {exercises.length === 0 ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <p className="text-[var(--text-muted)]">
            Nenhum exercício disponível para esta aula.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {exercises.map((exercise, index) => {
            const answer = answers[exercise.id] ?? '';
            const isSolved = exercise.resolvido;
            const lastXp = exercise.ultimaTentativa?.xpGanho ?? 0;

            return (
              <article
                key={exercise.id}
                className={[
                  'relative overflow-hidden rounded-lg border p-4 transition sm:p-5',
                  isSolved
                    ? 'border-[rgba(56,178,172,0.24)] bg-[rgba(56,178,172,0.06)]'
                    : 'border-[var(--border)] bg-[var(--surface-soft)] hover:bg-[var(--surface)]',
                ].join(' ')}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <IsoBadge>
                        Exercício {index + 1}
                      </IsoBadge>

                      <IsoBadge variant="orange">
                        {exercise.dificuldade}
                      </IsoBadge>

                      {isSolved && (
                        <IsoBadge variant="success">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Resolvido
                        </IsoBadge>
                      )}
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-[var(--text)]">
                      {exercise.titulo}
                    </h3>

                    <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--text-soft)]">
                      {exercise.enunciado}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--accent-bg)] px-3 py-2 text-sm font-semibold text-[var(--accent-600)] dark:text-[var(--accent-500)]">
                    <Sparkles className="h-4 w-4" />
                    +{exercise.xpRecompensa} XP
                  </div>
                </div>

                {isSolved ? (
                  <div className="mt-5 rounded-lg border border-[rgba(56,178,172,0.22)] bg-[rgba(56,178,172,0.1)] p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--success-500)]" />

                      <div>
                        <p className="font-bold text-[var(--text)]">
                          Resolução registrada com sucesso.
                        </p>

                        <p className="mt-1 text-sm leading-6 text-[var(--text-soft)]">
                          XP ganho nesta tentativa:{' '}
                          <strong className="iso-stat-number text-[var(--text)]">
                            {lastXp}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={answer}
                      onChange={(event) => {
                        setAnswers((previous) => ({
                          ...previous,
                          [exercise.id]: event.target.value,
                        }));
                      }}
                      placeholder="Digite sua resolução, hipóteses adotadas e raciocínio técnico..."
                      className="mt-5 min-h-40 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 leading-7 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)] focus:ring-4 focus:ring-[rgba(0,168,204,0.12)]"
                    />

                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        disabled={
                          !answer.trim() ||
                          attemptExerciseMutation.isPending
                        }
                        onClick={() => {
                          attemptExerciseMutation.mutate({
                            exerciseId: exercise.id,
                            resposta: answer,
                          });
                        }}
                        className="iso-button-primary gap-2 px-5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />

                        {attemptExerciseMutation.isPending
                          ? 'Enviando...'
                          : 'Enviar resolução'}
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
