import { api } from '../../core/api/client';

import type {
  CompleteLessonResponse,
  ProgressResponse,
  UpdateLessonNotesResponse,
  UpdateWatchTimeResponse,
} from './progress.types';

export async function getMyProgress() {
  const response = await api.get<ProgressResponse>('/progress/me');

  return response.data.progress;
}

export async function completeLesson(lessonId: string) {
  const response = await api.post<CompleteLessonResponse>(
    `/progress/lessons/${lessonId}/complete`,
  );

  return response.data.progress;
}

export async function updateLessonWatchTime(
  lessonId: string,
  tempoAssistido: number,
) {
  const response = await api.post<UpdateWatchTimeResponse>(
    `/progress/lessons/${lessonId}/watch-time`,
    {
      tempoAssistido,
    },
  );

  return response.data.progress;
}

export async function updateLessonNotes(
  lessonId: string,
  notas: string,
) {
  const response = await api.post<UpdateLessonNotesResponse>(
    `/progress/lessons/${lessonId}/notes`,
    {
      notas,
    },
  );

  return response.data.progress;
}
