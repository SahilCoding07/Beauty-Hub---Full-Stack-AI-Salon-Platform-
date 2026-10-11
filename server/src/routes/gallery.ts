import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import { Gallery } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, category, type } = req.body;
    let image = req.body.image || '';

    if (req.file) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const mime = req.file.mimetype || 'image/jpeg';
        image = `data:${mime};base64,${fileBuffer.toString('base64')}`;
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('File read error:', e);
        image = `/uploads/${req.file.filename}`;
      }
    }

    const item = await Gallery.create({
      title: title || 'Salon Look',
      category: category || 'Hair',
      image,
      type: type || 'image',
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Gallery save error:', err);
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
