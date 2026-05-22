import { api } from '../../core/api/client';

export type PublicTrackingConfig = {
  googleTagManagerId: string | null;
  googleAnalyticsMeasurementId: string | null;
  metaPixelId: string | null;
};

export async function getPublicTrackingConfig() {
  const response = await api.get<{ tracking: PublicTrackingConfig }>(
    '/tracking/config',
  );

  return response.data.tracking;
}
