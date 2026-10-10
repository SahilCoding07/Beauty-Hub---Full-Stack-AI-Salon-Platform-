import { Router } from 'express';
import { Offer } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(offers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json(offer);
  } catch {
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(offer);
  } catch {
    res.status(500).json({ error: 'Failed to update offer' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete offer' });
  }
});

export default router;
