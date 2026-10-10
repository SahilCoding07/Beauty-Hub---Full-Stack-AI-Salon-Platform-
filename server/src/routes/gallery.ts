import { Router } from 'express';
import multer from 'multer';
import { Gallery } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.category) filter.category = req.query.category;
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, category, type } = req.body;
    const item = await Gallery.create({
      title, category,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
      type: type || 'image',
    });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

export default router;
