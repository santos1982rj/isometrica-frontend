import { api } from '../../core/api/client';

import type {
  StudentAnalyticsResponse,
  WeeklyAnalyticsResponse,
} from './analytics.types';

/**
 * Busca o resumo acadêmico do aluno autenticado.
 */
export async function getMyAnalytics() {
  const response = await api.get<StudentAnalyticsResponse>(
    '/analytics/me',
  );

  return response.data.analytics;
}

/**
 * Busca os dados semanais do aluno autenticado.
 */
export async function getMyWeeklyAnalytics() {
  const response = await api.get<WeeklyAnalyticsResponse>(
    '/analytics/me/weekly',
  );

  return response.data.weekly;
}