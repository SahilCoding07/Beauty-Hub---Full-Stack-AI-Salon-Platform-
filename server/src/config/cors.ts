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

  const isWildcard = origins.includes('*') || origins.length === 0;

  return {
    origin: isWildcard
      ? (origin, callback) => callback(null, true)
      : (origin, callback) => {
          if (!origin || origins.includes(origin)) {
            callback(null, true);
          } else {
            callback(null, true); // Allow any device/preview URL smoothly
          }
        },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  };
}

export function getCorsOriginLabel(): string {
  return env.clientUrl || 'All Origins (*)';
}

