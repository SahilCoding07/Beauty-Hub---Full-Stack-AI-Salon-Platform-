import type { CorsOptions } from 'cors';
import { env } from './env.js';

function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

/**
 * CORS is locked to CLIENT_URL in production.
 * In development, defaults to http://localhost:5173.
 */
export function getCorsOptions(): CorsOptions {
  const origins = env.clientUrl
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

  const primaryOrigin = origins[0] || 'http://localhost:5173';

  return {
    origin: origins.length === 1 ? primaryOrigin : origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}

export function getCorsOriginLabel(): string {
  const { origin } = getCorsOptions();
  return Array.isArray(origin) ? origin.join(', ') : String(origin);
}
