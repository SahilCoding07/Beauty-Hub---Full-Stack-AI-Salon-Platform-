import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag } from 'lucide-react';
import { getServices } from '../../api/client';
import { SERVICE_CATEGORIES, DEFAULT_SERVICES, IMAGES } from '../../data/constants';
import type { Service } from '../../types';

const categoryImages: Record<string, string> = {
  Hair: IMAGES.hair,
  'Party Makeup': IMAGES.after3,
  'Engagement Makeup': IMAGES.after2,
  'Bridal Makeup': IMAGES.new_bridal_makeup,
  Nails: IMAGES.nails,
  'Skin & Body': IMAGES.facial,
};

const serviceImages: Record<string, string> = {
  'Hair Styling': IMAGES.new_hair_styling,
  'Party Makeup (Normal)': IMAGES.after3,
  'Party Makeup (HD)': IMAGES.party1,
  'Party Makeup (Silicone)': IMAGES.after4,
  'Engagement Makeup (Normal)': IMAGES.after2,
  'Engagement Makeup (HD)': IMAGES.before3,
  'Engagement Makeup (Silicone)': IMAGES.before1,
  'Bridal & Reception (Normal)': IMAGES.new_bridal_makeup,
  'Bridal & Reception (HD)': IMAGES.bridal,
  'Bridal & Reception (Silicone)': IMAGES.new_bridal_package,
  'Hair Spa': IMAGES.salon2,
  'Hair Coloring': IMAGES.hair,
  'Makeup': IMAGES.new_makeup,
  'Bridal Makeup': IMAGES.new_bridal_makeup,
  'Nail Art': IMAGES.nails,
  'Nail Extensions': IMAGES.nails2,
  'Manicure': IMAGES.mani_pedi,
  'Pedicure': IMAGES.mani_pedi,
  'Waxing': IMAGES.waxing,
  'Facial': IMAGES.facial,
  'Skin Care': IMAGES.new_skincare,
  'Threading': IMAGES.threading,
  'Massage': IMAGES.massage,
  'Party Package': IMAGES.after3,
  'Bridal Package': IMAGES.new_bridal_package,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices(activeCategory === 'All' ? undefined : activeCategory)
      .then(({ data }) => {
        if (data && data.length > 0) setServices(data);
        else throw new Error('Empty');
      })
      .catch(() => {
        setServices(
          DEFAULT_SERVICES.map((s, i) => ({
            _id: String(i),
            ...s,
            category: s.category as Service['category'],
            image: serviceImages[s.name] || categoryImages[s.category] || categoryImages.Hair,
            isActive: true,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = activeCategory === 'All'
    ? services
    : services.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="section-padding bg-beige dark:bg-ink text-charcoal dark:text-cream transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-gold">What We Offer</p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Our <span className="text-gradient-gold italic">Premium Services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal/60 dark:text-cream/60">
            Indulge in our carefully curated beauty treatments designed to transform, rejuvenate, and inspire confidence.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gold text-white dark:text-ink font-semibold'
                  : 'border border-gold/30 text-gold/70 hover:border-gold hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-white/50 dark:bg-charcoal" />
            ))}
          </div>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group luxury-card overflow-hidden bg-white/80 dark:bg-charcoal/60 relative"
              >
                <div className="relative h-52 overflow-hidden">
                  <a href="/#booking" className="absolute inset-0 z-10" aria-label={`Book ${service.name}`}></a>
                  <img
                    src={service.image || serviceImages[service.name] || categoryImages[service.category]}
                    alt={service.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  {service.discount && service.discount > 0 && (
                    <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink shadow-md">
                      <Tag size={12} /> {service.discount}% OFF
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 dark:from-ink/80 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs uppercase tracking-widest text-gold font-semibold">
                    {service.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-charcoal dark:text-cream">{service.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-charcoal/60 dark:text-cream/60">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-charcoal/50 dark:text-cream/50">
                      <Clock size={14} />
                      {service.duration} min
                    </div>
                    <div className="text-right">
                      {service.discount && service.discount > 0 ? (
                        <>
                          <span className="text-sm text-charcoal/40 dark:text-cream/40 line-through">₹{service.price}</span>
                          <p className="font-display text-2xl font-bold text-gold">
                            ₹{Math.round(service.price * (1 - service.discount / 100))}
                          </p>
                        </>
                      ) : (
                        <p className="font-display text-2xl font-bold text-gold">₹{service.price}</p>
                      )}
                    </div>
                  </div>
                  <a
                    href="/#booking"
                    className="btn-primary mt-5 w-full text-center text-xs !py-2.5"
                  >
                    Book Now
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
