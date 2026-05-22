import { useQuery } from '@tanstack/react-query';

import { getMyAnalytics } from './analytics.service';

/**
 * Hook responsável por buscar o resumo acadêmico do aluno autenticado.
 *
 * Centralizar essa query evita duplicação futura em:
 * - dashboard;
 * - página de perfil;
 * - cards de progresso;
 * - analytics avançado.
 *
 * @returns Query do React Query com os dados de analytics acadêmico.
 */
export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: getMyAnalytics,
  });
}