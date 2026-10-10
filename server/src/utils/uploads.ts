import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to the uploads directory (server/uploads/) */
export function getUploadsDir(): string {
  return path.join(__dirname, '../../uploads');
}

/**
 * Render and similar platforms use ephemeral filesystems.
 * Files written to uploads/ are lost on redeploy, restart, or scale events.
 */
export function isEphemeralStorage(): boolean {
  return process.env.NODE_ENV === 'production' && !process.env.UPLOADS_PERSISTENT;
}

export function ensureUploadsDir(): string {
  const dir = getUploadsDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created uploads directory: ${dir}`);
  }
  return dir;
}

export function getUploadsStorageInfo() {
  const ephemeral = isEphemeralStorage();
  return {
    type: 'local-filesystem',
    directory: 'uploads/',
    ephemeral,
    persistent: !ephemeral,
    recommendation: ephemeral
      ? 'Use Cloudinary or S3 for production image uploads. Local uploads are lost on Render redeploy.'
      : 'Local uploads directory is available.',
  };
}
