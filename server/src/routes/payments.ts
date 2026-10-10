import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Booking } from '../models/index.js';

const router = Router();

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const razorpay = getRazorpay();

    if (!razorpay) {
      return res.json({
        mock: true,
        message: 'Payment simulated (add RAZORPAY keys for live payments)',
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `booking_${Date.now()}`,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch {
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body;

    const razorpay = getRazorpay();
    if (razorpay) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');

      if (expected !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid payment signature' });
      }
    }

    const existing = await Booking.findOne({
      date: bookingData.date,
      time: bookingData.time,
      status: { $nin: ['rejected', 'cancelled'] },
    });

    if (existing) {
      return res.status(409).json({ error: 'Slot already booked' });
    }

    const booking = await Booking.create({
      service: bookingData.serviceId,
      staff: bookingData.staffId || undefined,
      date: bookingData.date,
      time: bookingData.time,
      customerName: bookingData.customerName,
      customerPhone: bookingData.customerPhone,
      customerEmail: bookingData.customerEmail,
      specialRequests: bookingData.specialRequests || '',
      advanceAmount: bookingData.advanceAmount,
      totalAmount: bookingData.totalAmount,
      paymentStatus: 'partial',
      status: 'pending',
      paymentId: razorpay_payment_id,
      paymentMethod: bookingData.paymentMethod || '',
    });

    res.json({ success: true, booking });
  } catch {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

export default router;
