import { api } from '../../core/api/client';
import type { LessonResponse } from './lessons.types';

export async function getLessonById(id: string) {
  const response = await api.get<LessonResponse>(`/lessons/${id}`);

  return response.data.lesson;
}