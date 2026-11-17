import { Router } from 'express';
import multer from 'multer';
import { Testimonial } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', async (_req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.get('/all', authMiddleware, async (_req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const name = (req.body.name || 'Anonymous').trim();
    const rating = Math.max(1, Math.min(5, Number(req.body.rating) || 5));
    const review = (req.body.review || req.body.text || (rating <= 2 ? 'Customer reported dissatisfaction with the experience.' : 'Great experience and wonderful service!')).trim();
    const service = (req.body.service || '').trim();
    const email = (req.body.email || '').trim();

    const testimonial = await Testimonial.create({
      name: name || 'Anonymous',
      rating,
      review,
      service,
      email,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      isApproved: rating >= 4,
    });
    res.status(201).json(testimonial);
  } catch (err) {
    console.error('Failed to submit review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

router.patch('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id, { isApproved: true }, { new: true }
    );
    res.json(testimonial);
  } catch {
    res.status(500).json({ error: 'Failed to approve' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

export default router;
