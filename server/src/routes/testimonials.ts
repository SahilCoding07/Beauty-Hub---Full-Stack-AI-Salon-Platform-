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
    const { name, rating, review, service, email } = req.body;
    const testimonial = await Testimonial.create({
      name, rating: Number(rating), review,
      service: service || '', email: email || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
      isApproved: false,
    });
    res.status(201).json(testimonial);
  } catch {
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
