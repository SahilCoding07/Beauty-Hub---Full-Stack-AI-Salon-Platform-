/**
 * Resolves the API base URL for the current environment.
 *
 * Development: `/api` → Vite dev-server proxy → http://localhost:5001/api
 * Production:  `VITE_API_URL` from build-time env (e.g. https://api.example.com/api)
 */

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export function getApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return '/api';
  }

  const productionUrl = import.meta.env.VITE_API_URL;

  if (!productionUrl?.trim()) {
    console.error(
      '[API] VITE_API_URL is not set. Production builds require a backend URL.\n' +
        'Set VITE_API_URL in client/.env.production or your hosting platform env vars.\n' +
        'Example: VITE_API_URL=https://your-api.onrender.com/api'
    );
    return '/api';
  }

  return normalizeBaseUrl(productionUrl.trim());
}

export const API_BASE_URL = getApiBaseUrl();

export const isDevelopmentApi = import.meta.env.DEV;
