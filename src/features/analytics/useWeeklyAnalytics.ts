import { useQuery } from '@tanstack/react-query';

import { getMyWeeklyAnalytics } from './analytics.service';

/**
 * Hook responsável por buscar o progresso semanal do aluno.
 */
export function useWeeklyAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'weekly'],
    queryFn: getMyWeeklyAnalytics,
  });
}