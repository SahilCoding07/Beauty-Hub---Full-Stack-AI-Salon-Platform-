import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InstagramIcon } from '../ui/InstagramIcon';
import { X, Calendar } from 'lucide-react';
import { getGallery } from '../../api/client';
import { SALON, IMAGES } from '../../data/constants';
import type { GalleryItem } from '../../types';

const defaultGallery: GalleryItem[] = [
  { _id: '1', title: 'Signature Bridal Makeover', category: 'Bridal', image: IMAGES.real_red_bridal, type: 'image' },
  { _id: '2', title: 'Glam Engagement Look', category: 'Engagement', image: IMAGES.real_engagement_makeup, type: 'image' },
  { _id: '3', title: 'Luxury 3D Floral Nail Art', category: 'Nails', image: IMAGES.real_floral_nails, type: 'image' },
  { _id: '4', title: 'Pearl & Rhinestone Extensions', category: 'Nails', image: IMAGES.real_pearl_nails, type: 'image' },
  { _id: '5', title: 'Precision Threading & Waxing', category: 'Skin & Body', image: IMAGES.real_threading_waxing, type: 'image' },
  { _id: '6', title: 'Mocha Hair Highlights', category: 'Hair', image: IMAGES.hair, type: 'image' },
  { _id: '7', title: 'Party Glam Makeup', category: 'Party', image: IMAGES.party1, type: 'image' },
  { _id: '8', title: 'Textured Waves & Styling', category: 'Hair', image: IMAGES.hair2, type: 'image' },
];

const dedupeGallery = (list: GalleryItem[]): GalleryItem[] => {
  const seenImages = new Set<string>();
  const seenTitles = new Set<string>();
  return list.filter((item) => {
    const img = (item.image || '').trim();
    const title = (item.title || '').trim().toLowerCase();
    if (!img) return false;
    // Never allow old unsplash demo placeholders
    if (img.includes('unsplash.com')) return false;
    if (seenImages.has(img) || (title && seenTitles.has(title))) return false;
    seenImages.add(img);
    if (title) seenTitles.add(title);
    return true;
  });
};

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(() => dedupeGallery(defaultGallery));
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    getGallery()
      .then(({ data }) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const validCustomItems = data.filter(
            (item: GalleryItem) => item.image && !item.image.includes('unsplash.com')
          );
          const combined = dedupeGallery([...validCustomItems, ...defaultGallery]);
          if (combined.length > 0) {
            setItems(combined);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="gallery" className="section-padding bg-cream dark:bg-ink text-charcoal dark:text-cream transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Our Work</p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Beauty <span className="text-gradient-gold italic">Portfolio</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-charcoal/60 dark:text-cream/60">
            Tap any look to view details and reserve
          </p>
        </motion.div>

        <div className="mt-10 sm:mt-12 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedImage(item)}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-charcoal/10 dark:border-white/10 cursor-pointer shadow-sm transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-4 opacity-90 sm:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-xs uppercase tracking-widest text-gold font-medium">{item.category}</p>
                <p className="font-display text-base sm:text-lg font-semibold text-white">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={SALON.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2 text-charcoal border-charcoal/30 hover:border-gold hover:text-gold dark:text-gold dark:border-gold/60"
          >
            <InstagramIcon size={18} />
            Follow {SALON.instagram}
          </a>
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg luxury-card bg-white dark:bg-charcoal overflow-hidden rounded-2xl border border-gold/30 shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-gold hover:text-ink transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="relative max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-h-[60vh] w-full object-contain"
                />
              </div>

              <div className="p-5 sm:p-6 text-center">
                <span className="text-xs uppercase tracking-widest text-gold font-semibold">
                  {selectedImage.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-charcoal dark:text-cream mt-1">
                  {selectedImage.title}
                </h3>
                <a
                  href="#booking"
                  onClick={() => setSelectedImage(null)}
                  className="btn-primary mt-5 inline-flex items-center gap-2 !py-2.5 !px-6 text-xs"
                >
                  <Calendar size={14} />
                  Book an Appointment for this Look
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
