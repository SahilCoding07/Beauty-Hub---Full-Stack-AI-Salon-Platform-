import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { InstagramIcon } from '../ui/InstagramIcon';
import { getGallery } from '../../api/client';
import { SALON, IMAGES } from '../../data/constants';
import type { GalleryItem } from '../../types';

const defaultGallery: GalleryItem[] = [
  { _id: '1', title: 'Signature Bridal', category: 'Bridal', image: IMAGES.bridal, type: 'image' },
  { _id: '2', title: 'Mocha Highlights', category: 'Hair', image: IMAGES.hair, type: 'image' },
  { _id: '3', title: 'Gel Extensions', category: 'Nails', image: IMAGES.nails, type: 'image' },
  { _id: '4', title: 'Classic Bridal', category: 'Bridal', image: IMAGES.bridal2, type: 'image' },
  { _id: '5', title: 'Party Styling', category: 'Party', image: IMAGES.party1, type: 'image' },
  { _id: '6', title: 'Pearl Nail Art', category: 'Nails', image: IMAGES.nails2, type: 'image' },
  { _id: '7', title: 'Wavy Texture', category: 'Hair', image: IMAGES.hair2, type: 'image' },
];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(defaultGallery);

  useEffect(() => {
    getGallery()
      .then(({ data }) => { if (data.length) setItems(data); })
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
        </motion.div>

        <div className="mt-10 sm:mt-12 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-charcoal/10 dark:border-white/10"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/20 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                <p className="text-xs uppercase tracking-widest text-gold">{item.category}</p>
                <p className="font-display text-lg font-semibold text-white">{item.title}</p>
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
    </section>
  );
}
