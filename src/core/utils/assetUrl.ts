import { api } from '../api/client';

export function resolveAssetUrl(value?: string | null) {
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value) || value.startsWith('blob:') || value.startsWith('data:')) {
    return value;
  }

  return new URL(value, api.defaults.baseURL).toString();
}
