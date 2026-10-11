import { motion } from 'framer-motion';
import { Award, Sparkles, Shield, Heart } from 'lucide-react';
import { SALON, IMAGES } from '../../data/constants';

const features = [
  { icon: Award, title: 'Certified Experts', desc: 'Internationally trained stylists' },
  { icon: Sparkles, title: 'Premium Products', desc: 'Only the finest brands' },
  { icon: Shield, title: 'Hygiene First', desc: 'Medical-grade sterilization' },
  { icon: Heart, title: 'Personalized Care', desc: 'Tailored to your needs' },
];

const galleryImages = [IMAGES.salon1, IMAGES.salon2, IMAGES.salon3, IMAGES.salon4];

export default function About() {
  return (
    <section id="about" className="section-padding bg-white dark:bg-charcoal transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 h-64' : 'h-40'}`}
                >
                  <img src={img} alt={`Salon ${i + 1}`} className="h-full w-full object-cover transition duration-500 hover:scale-110" />
                </motion.div>
              ))}
            </div>
            <div className="absolute -bottom-4 right-2 sm:-bottom-6 sm:-right-6 rounded-xl sm:rounded-2xl bg-gold px-5 py-4 sm:px-8 sm:py-6 text-ink shadow-xl">
              <p className="font-display text-2xl sm:text-4xl font-bold">{SALON.stats.yearsExperience}+</p>
              <p className="text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest">Years of Excellence</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Our Story</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-charcoal dark:text-cream sm:text-5xl">
              Crafting Beauty<br />
              <span className="text-gradient-gold italic">Since {SALON.founded}</span>
            </h2>
            <p className="mt-6 leading-relaxed text-charcoal/70 dark:text-cream/70">
              Founded by <strong className="text-gold">{SALON.owner}</strong>, {SALON.name} was born from a passion for transforming the ordinary into the extraordinary. What started as a small studio in Bilaspur Rampur has evolved into the region's most sought-after beauty destination.
            </p>
            <p className="mt-4 leading-relaxed text-charcoal/70 dark:text-cream/70">
              Every treatment is a masterpiece — meticulously designed to enhance your natural beauty while providing an experience of pure luxury and relaxation. We believe every person deserves to feel extraordinary.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="luxury-card p-5 bg-cream/50 dark:bg-charcoal/80"
                >
                  <f.icon className="mb-3 text-gold" size={24} />
                  <h4 className="font-semibold text-charcoal dark:text-cream">{f.title}</h4>
                  <p className="mt-1 text-sm text-charcoal/60 dark:text-cream/60">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            <a href="#services" className="btn-primary mt-10 inline-flex text-white dark:text-ink">Discover Our Services</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
