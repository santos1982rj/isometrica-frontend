import { useQuery } from '@tanstack/react-query';

import { getLessonExercises } from './exercises.service';

/**
 * Hook responsável por buscar os exercícios de uma aula.
 *
 * @param lessonId ID da aula atual.
 * @returns Query com exercícios da aula.
 */
export function useLessonExercises(
  lessonId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ['lesson-exercises', lessonId],
    queryFn: () => getLessonExercises(lessonId!),
    enabled: !!lessonId && enabled,
  });
}
