import { api } from '../../core/api/client';

export type PlatformSettings = {
  platformName: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  supportWhatsapp: string | null;
  supportEmail: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
  termsContent: string | null;
  privacyContent: string | null;
};

export async function getPublicPlatformSettings() {
  const response = await api.get<{ platform: PlatformSettings }>(
    '/tracking/platform',
  );

  return response.data.platform;
}
