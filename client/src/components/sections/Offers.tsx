import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { getOffers } from '../../api/client';
import type { Offer } from '../../types';

const defaultOffers: Offer[] = [
  {
    _id: '1',
    title: 'Bridal Season Special — 40% OFF',
    description: 'Book your complete bridal package today and get 40% off. Includes hair, makeup, nails, and skincare treatments.',
    discount: 40,
    validUntil: '2026-12-31',
    category: 'Bridal Packages',
    isActive: true,
  },
  {
    _id: '2',
    title: 'First Visit — 20% OFF',
    description: 'New customers get 20% off on any service. Use code WELCOME20 at booking.',
    discount: 20,
    code: 'WELCOME20',
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    _id: '3',
    title: 'Festival Combo Offer',
    description: 'Hair Spa + Facial combo at just ₹2,199. Limited time festival special.',
    discount: 25,
    validUntil: '2026-08-31',
    category: 'Skin & Body',
    isActive: true,
  },
];

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>(defaultOffers);

  useEffect(() => {
    getOffers()
      .then(({ data }) => { if (data.length) setOffers(data); })
      .catch(() => {});
  }, []);

  const featured = offers.find((o) => o.isActive) || offers[0];

  return (
    <section className="section-padding bg-gradient-to-br from-beige via-cream to-beige dark:from-charcoal dark:via-ink dark:to-charcoal transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-8 md:p-12 shadow-sm"
        >
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
                <Flame size={14} /> Limited Time Offer
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold text-charcoal dark:text-cream sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-xl text-charcoal/70 dark:text-cream/70">{featured.description}</p>
              {featured.code && (
                <p className="mt-3 text-sm text-gold">
                  Use code: <span className="rounded bg-gold/20 px-3 py-1 font-mono font-bold">{featured.code}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a href="#booking" className="btn-primary text-center text-white dark:text-ink">Claim Offer</a>
              <a href="#services" className="btn-outline text-center text-charcoal dark:text-cream border-charcoal/20 dark:border-gold/60 hover:border-gold dark:hover:border-gold">View All Offers</a>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.slice(1).map((offer, i) => (
            <motion.div
              key={offer._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="luxury-card p-6 bg-white/80 dark:bg-charcoal/60"
            >
              <span className="text-3xl font-bold text-gold">{offer.discount}%</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-charcoal dark:text-cream">{offer.title}</h3>
              <p className="mt-2 text-sm text-charcoal/60 dark:text-cream/60">{offer.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
