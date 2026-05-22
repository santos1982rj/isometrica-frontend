import { useQuery } from '@tanstack/react-query';

import { getLessonAttachments } from './attachments.service';

/**
 * Hook responsável por buscar anexos de uma aula.
 *
 * @param lessonId ID da aula atual.
 * @returns Query com anexos da aula.
 */
export function useLessonAttachments(
  lessonId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ['lesson-attachments', lessonId],
    queryFn: () => getLessonAttachments(lessonId!),
    enabled: !!lessonId && enabled,
  });
}
