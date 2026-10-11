import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IMAGES } from '../../data/constants';
import { getBeforeAfter } from '../../api/client';

const defaultTransformations = [
  {
    title: 'Signature Bridal',
    before: IMAGES.before4,
    after: IMAGES.after4,
  },
  {
    title: 'Party Makeup',
    before: IMAGES.before3,
    after: IMAGES.after3,
  },
  {
    title: 'Bridal Transformation',
    before: IMAGES.before2,
    after: IMAGES.after2,
  },
];

function BeforeAfterSlider({ before, after, title }: { before: string; after: string; title: string }) {
  const [position, setPosition] = useState(50);

  return (
    <div className="luxury-card overflow-hidden dark:bg-charcoal/60">
      <div className="relative h-64 sm:h-80 select-none overflow-hidden touch-pan-y">
        <img src={after} alt={`${title} after`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img
            src={before}
            alt={`${title} before`}
            className="h-full w-full object-cover"
            style={{ width: `${100 / (position / 100)}%`, maxWidth: 'none' }}
          />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gold shadow-lg shadow-gold/50 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-9 w-9 sm:h-10 sm:w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-ink text-gold text-xs font-bold shadow-lg">
            ↔
          </div>
        </div>
        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-full bg-ink/75 px-2.5 py-1 text-[11px] sm:text-xs uppercase tracking-wider text-cream backdrop-blur-sm">
          Before
        </span>
        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-gold/90 px-2.5 py-1 text-[11px] sm:text-xs uppercase tracking-wider text-ink font-semibold shadow-md">
          After
        </span>
        <input
          type="range"
          min="5"
          max="95"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 z-10 w-full cursor-ew-resize opacity-0 touch-none"
          aria-label={`Compare before and after for ${title}`}
        />
      </div>
      <p className="p-4 text-center font-display text-base sm:text-lg font-semibold text-charcoal dark:text-cream">{title}</p>
    </div>
  );
}

export default function BeforeAfter() {
  const [transformations, setTransformations] = useState<any[]>(defaultTransformations);

  useEffect(() => {
    getBeforeAfter().then(({ data }) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const validCustom = data.filter(
          (d: any) => d.before && d.after && !d.before.includes('unsplash.com') && !d.after.includes('unsplash.com')
        );
        if (validCustom.length > 0) {
          setTransformations([...validCustom, ...defaultTransformations]);
        }
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-cream dark:bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Transformations</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-charcoal dark:text-cream sm:text-5xl">
            Before & <span className="text-gradient-gold italic">After</span>
          </h2>
          <p className="mt-4 text-charcoal/60 dark:text-cream/60">← Drag the slider to see transformations →</p>
        </motion.div>

        <div className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {transformations.map((t, i) => (
            <motion.div
              key={t._id || t.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <BeforeAfterSlider {...t} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
