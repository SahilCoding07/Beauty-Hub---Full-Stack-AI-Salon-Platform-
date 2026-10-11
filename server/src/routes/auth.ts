import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const rawEmail = (req.body?.email || '').toString().trim().toLowerCase();
    const rawPassword = (req.body?.password || '').toString().trim();

    if (!rawEmail || !rawPassword) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const secret = process.env.JWT_SECRET || 'beauty_hub_fallback_jwt_secret_key_2026';

    // 1. Check known primary/configured admin credentials directly
    const envEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const envPassword = (process.env.ADMIN_PASSWORD || '').trim();

    const allowedAdmins: Record<string, string[]> = {
      'serversterkira@gmail.com': ['Sahil07$'],
      'admin@thebeautyhub.in': ['admin123'],
    };

    if (envEmail && envPassword) {
      if (!allowedAdmins[envEmail]) {
        allowedAdmins[envEmail] = [];
      }
      allowedAdmins[envEmail].push(envPassword);
    }

    if (allowedAdmins[rawEmail] && allowedAdmins[rawEmail].includes(rawPassword)) {
      const token = jwt.sign({ email: rawEmail, role: 'admin' }, secret, { expiresIn: '7d' });
      return res.json({ token, name: 'Admin' });
    }

    // 2. Fall back to MongoDB Admin document query
    const escapedEmail = rawEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const admin = await Admin.findOne({
      email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') }
    });

    if (admin) {
      const valid = await bcrypt.compare(rawPassword, admin.password);
      if (valid) {
        const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, secret, { expiresIn: '7d' });
        return res.json({ token, name: admin.name || 'Admin' });
      }
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    console.error('Auth login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
