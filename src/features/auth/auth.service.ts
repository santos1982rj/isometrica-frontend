import { api } from '../../core/api/client';

export async function requestPasswordReset(email: string) {
  const response = await api.post<{
    message: string;
    resetUrl?: string;
  }>('/auth/forgot-password', {
    email,
  });

  return response.data;
}

export async function resetPassword(token: string, senha: string) {
  const response = await api.post<{ message: string }>('/auth/reset-password', {
    token,
    senha,
  });

  return response.data;
}

export async function verifyEmail(token: string) {
  const response = await api.post<{ message: string }>('/auth/verify-email', {
    token,
  });

  return response.data;
}
