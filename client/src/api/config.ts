/**
 * Resolves the API base URL for the current environment.
 *
 * Development: `/api` → Vite dev-server proxy → http://localhost:5001/api
 * Production:  `VITE_API_URL` from build-time env (e.g. https://api.example.com/api)
 */

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export const DEFAULT_PROD_API_URL = 'https://beauty-hub-full-stack-ai-salon-platform.onrender.com/api';

export function getApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return '/api';
  }

  const productionUrl = import.meta.env.VITE_API_URL;

  if (!productionUrl?.trim()) {
    return DEFAULT_PROD_API_URL;
  }

  return normalizeBaseUrl(productionUrl.trim());
}

export const API_BASE_URL = getApiBaseUrl();

export const isDevelopmentApi = import.meta.env.DEV;
