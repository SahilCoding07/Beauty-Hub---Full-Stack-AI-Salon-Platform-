import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
});

const Admin = mongoose.model('Admin', AdminSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const hash = await bcrypt.hash('admin123', 10);

  await Admin.create({
    email: 'admin@thebeautyhub.in',
    password: hash,
    name: 'Tarannum Jahan',
  });

  console.log('Admin created successfully');

  process.exit(0);
}

run();