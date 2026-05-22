import axios from 'axios';

function normalizeApiUrl(apiUrl?: string) {
  const configuredApiUrl = apiUrl?.trim();

  if (!configuredApiUrl) {
    return 'http://localhost:3333';
  }

  if (/^https?:\/\//i.test(configuredApiUrl)) {
    return configuredApiUrl;
  }

  return `https://${configuredApiUrl}`;
}

export const api = axios.create({
  baseURL: normalizeApiUrl(import.meta.env.VITE_API_URL),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@isometrica:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
