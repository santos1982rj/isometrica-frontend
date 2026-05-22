import { api } from '../../core/api/client';

import type { LessonAttachmentsResponse } from './attachments.types';

/**
 * Busca os anexos vinculados a uma aula.
 *
 * @param lessonId ID da aula.
 * @returns Lista de anexos da aula.
 */
export async function getLessonAttachments(lessonId: string) {
  const response = await api.get<LessonAttachmentsResponse>(
    `/lessons/${lessonId}/attachments`,
  );

  return response.data.attachments;
}