import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

function requireEnv(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    console.error(`\n✗ Missing required environment variable: ${name}`);
    if (isProduction) {
      console.error(`  Set ${name} in your Render dashboard → Environment.\n`);
    } else {
      console.error(`  Copy server/.env.example to server/.env and fill in your values.\n`);
    }
    process.exit(1);
  }
  return value.trim();
}

function validateMongoUri(uri: string): void {
  const valid = uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
  if (!valid) {
    console.error('\n✗ Invalid MONGODB_URI format.');
    console.error('  Use mongodb:// or mongodb+srv:// (MongoDB Atlas connection string).\n');
    process.exit(1);
  }
}

function validateClientUrl(url: string): void {
  const origins = url.split(',').map((u) => u.trim()).filter(Boolean);
  for (const origin of origins) {
    if (!origin.startsWith('http://') && !origin.startsWith('https://')) {
      console.error(`\n✗ Invalid CLIENT_URL: ${origin}`);
      console.error('  Must start with http:// or https://\n');
      process.exit(1);
    }
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  port: parseInt(process.env.PORT || '5001', 10),
  mongodbUri: requireEnv('MONGODB_URI', process.env.MONGODB_URI),
  jwtSecret: isProduction
    ? requireEnv('JWT_SECRET', process.env.JWT_SECRET)
    : (process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production'),
  adminEmail: isProduction
    ? requireEnv('ADMIN_EMAIL', process.env.ADMIN_EMAIL)
    : (process.env.ADMIN_EMAIL || 'admin@thebeautyhub.in'),
  adminPassword: isProduction
    ? requireEnv('ADMIN_PASSWORD', process.env.ADMIN_PASSWORD)
    : (process.env.ADMIN_PASSWORD || 'admin123'),
  clientUrl: isProduction
    ? requireEnv('CLIENT_URL', process.env.CLIENT_URL)
    : (process.env.CLIENT_URL || 'http://localhost:5173'),
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
};

validateMongoUri(env.mongodbUri);
validateClientUrl(env.clientUrl);

if (isProduction && env.jwtSecret.length < 32) {
  console.error('\n✗ JWT_SECRET must be at least 32 characters in production.\n');
  process.exit(1);
}

if (isProduction && env.jwtSecret === 'dev-jwt-secret-change-in-production') {
  console.error('\n✗ JWT_SECRET must be set to a strong random value in production.\n');
  process.exit(1);
}
