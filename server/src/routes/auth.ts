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
      'servesterkira@gmail.com': ['Sahil07$'],
      'serversterkira@gmail.com': ['Sahil07$'],
      'servseterkira@gmail.com': ['Sahil07$'],
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

router.post('/change-credentials', async (req, res) => {
  try {
    const rawEmail = (req.body?.email || '').toString().trim().toLowerCase();
    const rawPassword = (req.body?.password || '').toString().trim();

    if (!rawEmail || !rawPassword) {
      return res.status(400).json({ error: 'New email and password are required' });
    }

    if (rawPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const secret = process.env.JWT_SECRET || 'beauty_hub_fallback_jwt_secret_key_2026';

    // Upsert admin in MongoDB
    let admin = await Admin.findOne();
    if (admin) {
      admin.email = rawEmail;
      admin.password = hashedPassword;
      await admin.save();
    } else {
      admin = await Admin.create({
        email: rawEmail,
        password: hashedPassword,
        name: 'Admin',
      });
    }

    const token = jwt.sign({ id: admin._id, email: rawEmail, role: 'admin' }, secret, { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'Admin credentials updated successfully',
      token,
      email: rawEmail,
    });
  } catch (err) {
    console.error('Change credentials error:', err);
    res.status(500).json({ error: 'Failed to update credentials' });
  }
});

export default router;
