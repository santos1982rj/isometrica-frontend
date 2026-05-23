import { api } from '../../core/api/client';

type UpdateProfileInput = {
  nome: string;
  avatar?: string | null;
  headline?: string | null;
  location?: string | null;
  bio?: string | null;
  experience?: string | null;
  education?: string | null;
  skills?: string | null;
  interests?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  instagramUrl?: string | null;
  whatsapp?: string | null;
};

function cleanText(value?: string | null) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function cleanUrl(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

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
    nome: data.nome.trim(),
    avatar: cleanText(data.avatar),
    headline: cleanText(data.headline),
    location: cleanText(data.location),
    bio: cleanText(data.bio),
    experience: cleanText(data.experience),
    education: cleanText(data.education),
    skills: cleanText(data.skills),
    interests: cleanText(data.interests),
    linkedinUrl: cleanUrl(data.linkedinUrl),
    githubUrl: cleanUrl(data.githubUrl),
    portfolioUrl: cleanUrl(data.portfolioUrl),
    instagramUrl: cleanUrl(data.instagramUrl),
    whatsapp: cleanText(data.whatsapp),
  });

  return response.data.user;
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post('/students/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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
