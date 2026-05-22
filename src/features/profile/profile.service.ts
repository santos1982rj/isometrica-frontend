import { api } from '../../core/api/client';

type UpdateProfileInput = {
  nome: string;
  avatar: string;
};

export type StudentPurchase = {
  id: string;
  mpPaymentId: string;
  valorTotal: number;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO' | 'ESTORNADO';
  metodoPagamento: string;
  referenciaCompra: string;
  linkPagamento: string | null;
  statusDetail: string | null;
  installments: number | null;
  approvedAt: string | null;
  curso: {
    id: string;
    titulo: string;
    slug: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export async function updateProfile(data: UpdateProfileInput) {
  const response = await api.patch('/students/me/profile', {
    nome: data.nome,
    avatar: data.avatar || null,
  });

  return response.data.user;
}

export async function listMyPurchases() {
  const response = await api.get<{ purchases: StudentPurchase[] }>(
    '/students/me/purchases',
  );

  return response.data.purchases;
}

export async function refreshMyPurchase(purchaseId: string) {
  const response = await api.post<{ purchase: StudentPurchase }>(
    `/students/me/purchases/${purchaseId}/refresh`,
  );

  return response.data.purchase;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const response = await api.patch<{ message: string }>(
    '/students/me/password',
    data,
  );

  return response.data;
}

export async function updatePreferences(data: {
  marketingConsent: boolean;
  trackingConsent: boolean;
}) {
  const response = await api.patch<{
    preferences: {
      marketingConsent: boolean;
      trackingConsent: boolean;
    };
  }>('/students/me/preferences', data);

  return response.data.preferences;
}

export async function requestEmailVerification() {
  const response = await api.post<{
    message: string;
    verificationUrl?: string;
  }>('/students/me/email-verification');

  return response.data;
}
