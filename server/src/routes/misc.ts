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

// Cloud collection sync endpoints for mockDb
router.get('/db/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const db = (Settings.db as any);
    if (!db) return res.json([]);
    const doc = await db.collection(collection).findOne({ _id: 'array_store' as any });
    if (doc && Array.isArray((doc as any).data)) {
      return res.json((doc as any).data);
    }
    return res.json([]);
  } catch (err) {
    console.error('MongoDB GET Error:', err);
    res.json([]);
  }
});

router.post('/db/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const db = (Settings.db as any);
    if (!db) return res.status(503).json({ success: false, error: 'Database not connected' });
    const data = req.body;
    await db.collection(collection).updateOne(
      { _id: 'array_store' as any },
      { $set: { data } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('MongoDB POST Error:', err);
    res.status(500).json({ success: false });
  }
});

export default router;
