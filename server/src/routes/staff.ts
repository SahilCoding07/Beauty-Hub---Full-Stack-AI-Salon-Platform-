import { Router } from 'express';
import { Staff } from '../models/index.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const staff = await Staff.find({ isActive: true });
    res.json(staff);
  } catch {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

export default router;
