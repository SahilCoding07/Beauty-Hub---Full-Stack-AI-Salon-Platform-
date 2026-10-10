import { Router } from 'express';
import { Settings, Booking, Testimonial } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/settings', async (_req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

router.get('/admin/stats', authMiddleware, async (_req, res) => {
  try {
    const bookings = await Booking.countDocuments();
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: { $in: ['partial', 'paid'] } } },
      { $group: { _id: null, total: { $sum: '$advanceAmount' } } },
    ]);
    const clients = await Booking.distinct('customerPhone');
    const avgRating = await Testimonial.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);

    res.json({
      bookings,
      revenue: revenue[0]?.total || 0,
      clients: clients.length,
      rating: avgRating[0]?.avg ? Math.round(avgRating[0].avg * 10) / 10 : 4.9,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
