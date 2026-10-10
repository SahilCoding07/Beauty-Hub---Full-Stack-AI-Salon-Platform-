import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from './config/env.js';
import { getCorsOptions, getCorsOriginLabel } from './config/cors.js';
import {
  connectDatabase,
  getDatabaseStatus,
  registerShutdownHandlers,
} from './config/database.js';
import { ensureUploadsDir, getUploadsDir, getUploadsStorageInfo } from './utils/uploads.js';

import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import staffRoutes from './routes/staff.js';
import bookingRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payments.js';
import offerRoutes from './routes/offers.js';
import coursesRoutes from './routes/courses.js';
import testimonialRoutes from './routes/testimonials.js';
import galleryRoutes from './routes/gallery.js';
import miscRoutes from './routes/misc.js';
import { seedIfEmpty } from './utils/seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
) as { version: string };

const app = express();

app.use(cors(getCorsOptions()));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(getUploadsDir()));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/reviews', testimonialRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api', miscRoutes);

app.get('/api/health', (_req, res) => {
  const db = getDatabaseStatus();
  const healthy = db.connected;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    service: 'beauty-hub-api',
    version: pkg.version,
    environment: env.nodeEnv,
    salon: 'The Beauty Hub Salon And Academy',
    cors: {
      allowedOrigin: getCorsOriginLabel(),
    },
    database: {
      connected: db.connected,
      host: db.host,
      name: db.database,
      provider: 'MongoDB Atlas',
    },
    storage: getUploadsStorageInfo(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.json({
    message: 'The Beauty Hub Salon API',
    health: '/api/health',
    docs: 'See DEPLOYMENT.md',
  });
});

async function start() {
  registerShutdownHandlers();
  ensureUploadsDir();

  try {
    await connectDatabase();
    await seedIfEmpty();

    app.listen(env.port, '0.0.0.0', () => {
      console.log(`✓ Server running on port ${env.port} (${env.nodeEnv})`);
      console.log(`✓ CORS origin: ${getCorsOriginLabel()}`);
      console.log(`✓ Health check: /api/health`);
      console.log(`✓ Database: ${getDatabaseStatus().database} @ ${getDatabaseStatus().host}`);

      const storage = getUploadsStorageInfo();
      if (storage.ephemeral) {
        console.warn(`⚠ Uploads: ephemeral local storage — use Cloudinary/S3 for production images`);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

start();
