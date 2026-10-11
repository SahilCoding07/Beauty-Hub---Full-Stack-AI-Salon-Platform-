import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Service } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const upload = multer({
  dest: 'uploads/',
  limits: {
    fieldSize: 25 * 1024 * 1024, // 25MB to accommodate phone photo base64 strings
    fileSize: 25 * 1024 * 1024,
  },
});

const categoryImages: Record<string, string> = {
  Hair: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
  Makeup: 'https://images.unsplash.com/photo-1487412949317-9a1e063e613a?w=600&q=80',
  Nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
  'Skin & Body': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d880?w=600&q=80',
  'Bridal Packages': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  'Groom Packages': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  'Party Packages': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  Academy: 'https://images.unsplash.com/photo-1522335781262-129b431a6ccb?w=600&q=80',
};

router.get('/', async (req, res) => {
  try {
    const filter: Record<string, unknown> = { isActive: true };
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    const services = await Service.find(filter).sort({ category: 1, name: 1 });
    res.json(services);
  } catch {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, duration, price, discount } = req.body;
    let image = req.body.image || categoryImages[category] || categoryImages.Hair;

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

    const service = await Service.create({
      name, category, description: description || '',
      duration: Number(duration), price: Number(price),
      discount: Number(discount) || 0, image,
    });
    res.status(201).json(service);
  } catch {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const mime = req.file.mimetype || 'image/jpeg';
        updates.image = `data:${mime};base64,${fileBuffer.toString('base64')}`;
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('File read error:', e);
        updates.image = `/uploads/${req.file.filename}`;
      }
    }

    if (updates.price) updates.price = Number(updates.price);
    if (updates.duration) updates.duration = Number(updates.duration);
    if (updates.discount) updates.discount = Number(updates.discount);

    const service = await Service.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(service);
  } catch {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
