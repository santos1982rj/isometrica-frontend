import { api } from '../../core/api/client';

import type {
  CompleteLessonResponse,
  ProgressResponse,
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