import { Router } from 'express';
import { Booking } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const ALL_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

router.get('/slots', async (req, res) => {
  try {
    const { date, staffId } = req.query;
    if (!date) return res.status(400).json({ error: 'Date required' });

    const filter: Record<string, unknown> = {
      date: date as string,
      status: { $nin: ['rejected', 'cancelled'] },
    };
    if (staffId) filter.staff = staffId;

    const booked = await Booking.find(filter).select('time');
    const bookedTimes = new Set(booked.map((b) => b.time));

    const slots = ALL_SLOTS.map((time) => ({
      time,
      available: !bookedTimes.has(time),
    }));

    res.json(slots);
  } catch {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

router.get('/', authMiddleware, async (_req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('service')
      .populate('staff')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { serviceId, staffId, date, time, customerName, customerPhone, customerEmail,
      specialRequests, advanceAmount, totalAmount, paymentStatus, status, paymentMethod, couponCode } = req.body;

    const existing = await Booking.findOne({
      date, time,
      ...(staffId ? { staff: staffId } : {}),
      status: { $nin: ['rejected', 'cancelled'] },
    });

    if (existing) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const booking = await Booking.create({
      service: serviceId,
      staff: staffId || undefined,
      date, time, customerName, customerPhone, customerEmail,
      specialRequests: specialRequests || '',
      advanceAmount: advanceAmount || 0,
      totalAmount,
      paymentStatus: paymentStatus || 'pending',
      status: status || 'pending',
      paymentMethod: paymentMethod || '',
      couponCode: couponCode || '',
    });

    const populated = await booking.populate('service');
    res.status(201).json(populated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create booking';
    res.status(500).json({ error: message });
  }
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('service');
    res.json(booking);
  } catch {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking permanently deleted', id: req.params.id });
  } catch {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;
