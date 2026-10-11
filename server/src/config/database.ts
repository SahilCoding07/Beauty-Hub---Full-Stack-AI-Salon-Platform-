import mongoose from 'mongoose';
import { env } from './env.js';

export type DatabaseStatus = {
  connected: boolean;
  host: string;
  database: string;
  readyState: number;
};

const ATLAS_OPTIONS: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 15_000,
  socketTimeoutMS: 45_000,
  connectTimeoutMS: 15_000,
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  w: 'majority',
  autoIndex: env.nodeEnv !== 'production',
};

function maskUri(uri: string): string {
  return uri.replace(/:([^:@/]+)@/, ':***@');
}

function parseConnectionLabel(uri: string): { host: string; database: string } {
  try {
    const parsed = new URL(uri.replace('mongodb+srv://', 'https://').replace('mongodb://', 'https://'));
    const database = parsed.pathname.replace(/^\//, '').split('?')[0] || 'beauty-hub-salon';
    return { host: parsed.hostname, database };
  } catch {
    return { host: 'unknown', database: 'beauty-hub-salon' };
  }
}

function explainConnectionError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (lower.includes('authentication failed') || lower.includes('bad auth')) {
    return [
      'MongoDB authentication failed.',
      '  → Check DB username/password in MONGODB_URI.',
      '  → In Atlas: Database Access → verify user has readWrite on your database.',
    ].join('\n');
  }

  if (lower.includes('timed out') || lower.includes('server selection')) {
    return [
      'Could not reach MongoDB Atlas cluster.',
      '  → In Atlas: Network Access → add your IP (or 0.0.0.0/0 for dev).',
      '  → Verify MONGODB_URI cluster hostname is correct.',
      '  → Check internet connection and firewall.',
    ].join('\n');
  }

  if (lower.includes('dns') || lower.includes('enotfound')) {
    return [
      'MongoDB hostname could not be resolved.',
      '  → Verify your Atlas connection string cluster name.',
    ].join('\n');
  }

  if (lower.includes('invalid connection string')) {
    return [
      'Invalid MongoDB connection string.',
      '  → Copy the full URI from Atlas → Connect → Drivers.',
      '  → URL-encode special characters in the password.',
    ].join('\n');
  }

  return message;
}

export async function connectDatabase(): Promise<void> {
  const { host, database } = parseConnectionLabel(env.mongodbUri);

  console.log(`Connecting to MongoDB Atlas…`);
  console.log(`  Host:     ${host}`);
  console.log(`  Database: ${database}`);
  console.log(`  URI:      ${maskUri(env.mongodbUri)}`);

  try {
    await mongoose.connect(env.mongodbUri, ATLAS_OPTIONS);
    await validateConnection();
    console.log('✓ MongoDB Atlas connected and validated');
  } catch (error) {
    console.error('\n✗ MongoDB connection attempt failed:');
    console.error(explainConnectionError(error));
    if (error instanceof Error && error.message && !explainConnectionError(error).includes(error.message)) {
      console.error(`\nDetails: ${error.message}`);
    }
    console.error('Server will continue running and retry database operations.\n');
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected — attempting to recover on next operation');
  });
}

export async function validateConnection(): Promise<void> {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Mongoose is not in connected state');
  }

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database handle unavailable after connect');
  }

  await db.admin().command({ ping: 1 });
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

export function getDatabaseStatus(): DatabaseStatus {
  const { host, database } = parseConnectionLabel(env.mongodbUri);
  return {
    connected: mongoose.connection.readyState === 1,
    host,
    database: mongoose.connection.name || database,
    readyState: mongoose.connection.readyState,
  };
}

export function registerShutdownHandlers(): void {
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received — closing MongoDB connection…`);
    await disconnectDatabase();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}
