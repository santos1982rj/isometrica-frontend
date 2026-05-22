import { api } from '../../core/api/client';

import type {
  AttemptExerciseRequest,
  AttemptExerciseResponse,
  LessonExercisesResponse,
} from './exercises.types';

/**
 * Busca os exercícios vinculados a uma aula.
 *
 * @param lessonId ID da aula.
 * @returns Lista de exercícios da aula com status do aluno.
 */
export async function getLessonExercises(lessonId: string) {
  const response = await api.get<LessonExercisesResponse>(
    `/lessons/${lessonId}/exercises`,
  );

  return response.data.exercises;
}

/**
 * Registra uma tentativa de exercício.
 *
 * Nesta fase MVP, o frontend ainda envia se a tentativa está correta.
 * Depois essa responsabilidade deve migrar para correção técnica no backend.
 *
 * @param exerciseId ID do exercício.
 * @param data Dados da tentativa.
 * @returns Tentativa registrada.
 */
export async function attemptExercise(
  exerciseId: string,
  data: AttemptExerciseRequest,
) {
  const response = await api.post<AttemptExerciseResponse>(
    `/exercises/${exerciseId}/attempt`,
    data,
  );

  return response.data.attempt;
}