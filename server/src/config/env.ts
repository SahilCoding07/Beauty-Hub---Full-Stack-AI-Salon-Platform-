import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

function resolveMongoUri(): string {
  let uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URL ||
    process.env.DATABASE_URL ||
    '';

  uri = uri.trim();

  // If user pasted connection string without protocol prefix (e.g. from Atlas)
  if (uri && !uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    if (uri.includes('@') || uri.includes('.mongodb.net')) {
      uri = `mongodb+srv://${uri}`;
    }
  }

  // Fallback to cluster connection if missing or invalid
  if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
    console.warn('⚠ No valid MONGODB_URI provided in environment. Using default Beauty Hub Atlas cluster.');
    uri = 'mongodb+srv://servesterkira_db_user:TheBeautyHubSalon07@cluster0.jgwxhjr.mongodb.net/beauty-hub-salon?retryWrites=true&w=majority&appName=Cluster0';
  }

  return uri;
}

const defaultJwtSecret = '7jk!92xPbeauty-hub-super-secret-key-change-in-production-2026';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'production',
  isProduction,
  port: parseInt(process.env.PORT || '5001', 10),
  mongodbUri: resolveMongoUri(),
  jwtSecret: (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16)
    ? process.env.JWT_SECRET
    : defaultJwtSecret,
  adminEmail: process.env.ADMIN_EMAIL || 'serversterkira@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Sahil07$',
  clientUrl: process.env.CLIENT_URL || '*',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
};

