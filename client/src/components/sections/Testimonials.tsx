import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTestimonials } from '../../api/client';
import type { Testimonial } from '../../types';

const defaultTestimonials: Testimonial[] = [
  { _id: '1', name: 'Ananya Singh', rating: 5, review: 'My bridal makeup was absolutely stunning! Tarannum ma\'am understood exactly what I wanted. The entire team made me feel like a princess on my special day.', service: 'Bridal Makeup', isApproved: true },
  { _id: '2', name: 'Riya Patel', rating: 5, review: 'Best salon in Rampur! The hair coloring turned out exactly as I envisioned. Professional, hygienic, and luxurious experience every time.', service: 'Hair Coloring', isApproved: true },
  { _id: '3', name: 'Meera Joshi', rating: 5, review: 'The academy course changed my career. Tarannum Jahan is an incredible teacher with deep knowledge of beauty techniques. Highly recommend!', service: 'Academy Course', isApproved: true },
  { _id: '4', name: 'Priya Sharma', rating: 5, review: 'Their nail art is next level! Creative designs, premium products, and such a relaxing atmosphere. My go-to salon for everything beauty.', service: 'Nail Art', isApproved: true },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getTestimonials()
      .then(({ data }) => { if (data.length) setTestimonials(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const t = testimonials[current];

  return (
    <section id="reviews" className="section-padding bg-cream dark:bg-charcoal">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Client Love</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-charcoal dark:text-cream sm:text-5xl">
            What They <span className="text-gradient-gold italic">Say</span>
          </h2>
        </motion.div>

        <div className="relative mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={t._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="luxury-card p-8 md:p-12 text-center dark:bg-charcoal/60"
            >
              <div className="mb-6 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < t.rating ? 'fill-gold text-gold' : 'text-beige'}
                  />
                ))}
              </div>
              <p className="font-display text-xl italic leading-relaxed text-charcoal dark:text-cream md:text-2xl">
                "{t.review}"
              </p>
              <div className="mt-8">
                <p className="font-semibold text-charcoal dark:text-cream">{t.name}</p>
                {t.service && (
                  <p className="mt-1 text-sm text-gold">{t.service}</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
              className="rounded-full border border-gold/30 p-2 text-gold transition hover:bg-gold/10"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? 'w-8 bg-gold' : 'w-2 bg-gold/30'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
              className="rounded-full border border-gold/30 p-2 text-gold transition hover:bg-gold/10"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
