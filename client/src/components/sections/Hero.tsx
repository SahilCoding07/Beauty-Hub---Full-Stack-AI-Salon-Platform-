import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';
import { SALON, IMAGES } from '../../data/constants';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) ref.current.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, suffix]);

  return <span ref={ref}>0</span>;
}

const SHOWCASE_TABS = [
  {
    id: 'bridal',
    label: 'Bridal Studio',
    tag: 'Signature Bridal Artistry',
    title: 'HD & Airbrush Bridal Makeovers',
    description: 'Complete luxury bridal packages with bespoke hair, HD makeup, draping & styling.',
    image: IMAGES.real_red_bridal,
    badge: 'Luxury Suite',
    perks: [
      'Personalized pre-bridal skin therapy',
      'Flawless HD & Airbrush makeup',
      'Exquisite jewellery & dupatta draping',
    ],
    ctaText: 'Book Bridal Consultation',
    ctaHref: '#booking',
  },
  {
    id: 'hair-skin',
    label: 'Hair & Skincare',
    tag: 'Couture Styling & Spa',
    title: 'Balayage, Keratin & Hydra-Facials',
    description: 'Transformative hair coloring, restorative therapies, and glowing skin treatments.',
    image: IMAGES.salon2,
    badge: 'Master Stylists',
    perks: [
      'International color & balayage techniques',
      'Intense repair keratin & botox hair spa',
      'Advanced clinical & organic skin care',
    ],
    ctaText: 'Explore Salon Services',
    ctaHref: '#services',
  },
  {
    id: 'academy',
    label: 'Academy',
    tag: 'Professional Certification',
    title: 'Certified Beauty & Styling Academy',
    description: 'Turn your passion into a career with hands-on professional courses taught by industry leaders.',
    image: IMAGES.salon3,
    badge: 'Govt. Recognized',
    perks: [
      'Live practical model demonstrations',
      'Complete makeup & hair kits included',
      'Professional certificate & job assistance',
    ],
    ctaText: 'View Academy Courses',
    ctaHref: '#courses',
  },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % SHOWCASE_TABS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Check if horizontal swipe is dominant and above 35px threshold
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swipe left -> next tab
        setActiveTab((prev) => (prev + 1) % SHOWCASE_TABS.length);
      } else {
        // Swipe right -> previous tab
        setActiveTab((prev) => (prev - 1 + SHOWCASE_TABS.length) % SHOWCASE_TABS.length);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    setTimeout(() => setIsPaused(false), 3000);
  };

  const curr = SHOWCASE_TABS[activeTab];

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-cream dark:bg-ink transition-colors duration-500">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={IMAGES.hero} alt="Luxury salon interior" className="h-full w-full object-cover opacity-20 dark:opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/70 via-cream/50 to-cream dark:from-ink/70 dark:via-ink/50 dark:to-ink transition-colors duration-500" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,169,98,0.25)_0%,_transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(201,169,98,0.15)_0%,_transparent_60%)]" />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-gold/60 dark:bg-gold/40"
          style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-24 pb-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-sm uppercase tracking-[0.3em] text-gold dark:text-gold"
          >
            ✦ {SALON.subtitle} ✦
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight text-charcoal dark:text-cream"
          >
            {SALON.tagline.split(' ').slice(0, 2).join(' ')}{' '}
            <span className="text-gradient-gold italic">
              {SALON.tagline.split(' ').slice(2).join(' ')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg text-charcoal/70 dark:text-cream/70 lg:mx-0 mx-auto"
          >
            Transform your beauty journey with luxury treatments crafted by experts who understand the art of elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start"
          >
            <a href="#booking" className="btn-primary w-full sm:w-auto text-center">Book Appointment</a>
            <a href="#services" className="btn-outline w-full sm:w-auto text-center text-charcoal border-charcoal/30 hover:border-gold hover:text-gold dark:text-cream dark:border-cream/30 dark:hover:border-gold dark:hover:text-gold">Explore Services</a>
          </motion.div>

          <motion.a
            href={SALON.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-xs sm:text-sm text-gold/80 transition hover:text-gold"
          >
            <InstagramIcon size={16} />
            Follow {SALON.instagram}
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-6 border-t border-gold/20 pt-6 sm:pt-8"
          >
            {[
              { label: 'Happy Clients', value: SALON.stats.happyClients },
              { label: 'Years Exp.', value: SALON.stats.yearsExperience },
              { label: 'Experts', value: SALON.stats.experts },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="font-display text-2xl sm:text-3xl font-bold text-gold">
                  <AnimatedCounter target={stat.value} suffix={stat.label === 'Happy Clients' ? '+' : ''} />
                </p>
                <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-charcoal/50 dark:text-cream/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mt-12 flex-shrink-0 lg:mt-0 w-full max-w-[420px] mx-auto lg:mx-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Ambient luxury glow */}
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-gold/25 via-gold/10 to-transparent blur-2xl opacity-60 pointer-events-none" />

          {/* Interactive Showcase Card */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative rounded-[2rem] border border-gold/30 bg-white/95 dark:bg-ink/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-colors duration-500 touch-pan-y"
          >
            {/* Top: Tab Switcher */}
            <div className="flex rounded-full bg-cream/90 dark:bg-charcoal/90 p-1 border border-gold/20 backdrop-blur-md transition-colors duration-500">
              {SHOWCASE_TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 rounded-full py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${
                    activeTab === idx
                      ? 'bg-gold text-white dark:text-ink font-semibold shadow-md'
                      : 'text-charcoal/70 hover:text-charcoal hover:bg-black/5 dark:text-cream/70 dark:hover:text-cream dark:hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Visual Showcase with Animated Crossfade */}
            <div className="relative mt-3 h-52 sm:h-56 w-full overflow-hidden rounded-xl border border-gold/25 shadow-inner">
              <AnimatePresence mode="wait">
                <a href="#booking"><motion.img
                  key={curr.id}
                  src={curr.image}
                  alt={curr.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full w-full object-cover"
                />
              </a></AnimatePresence>

              {/* Luxury gradient blend */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 dark:from-ink dark:via-ink/20 to-transparent transition-colors duration-500" />

              {/* Floating Pill Tag */}
              <div className="absolute top-3 right-3 rounded-full px-3 py-1 bg-white/85 dark:bg-ink/85 backdrop-blur-md border border-gold/40 text-[11px] font-semibold text-gold shadow-lg transition-colors duration-500">
                ✦ {curr.badge}
              </div>

              {/* Live Salon Status */}
              <div className="absolute bottom-2.5 left-3 flex items-center gap-2 rounded-full px-3 py-1 bg-white/90 dark:bg-black/75 backdrop-blur-md border border-charcoal/10 dark:border-white/10 text-[11px] text-charcoal/90 dark:text-cream/90 transition-colors duration-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium">Studio Open: 10 AM – 8 PM</span>
              </div>
            </div>

            {/* Service Details */}
            <div className="mt-3.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                {curr.tag}
              </p>
              <h3 className="font-display text-lg sm:text-xl font-bold text-charcoal dark:text-cream mt-0.5 leading-snug transition-colors duration-500">
                {curr.title}
              </h3>
              <p className="text-xs text-charcoal/65 dark:text-cream/65 mt-1 leading-relaxed transition-colors duration-500">
                {curr.description}
              </p>

              {/* Key Perks */}
              <ul className="mt-3 space-y-1.5">
                {curr.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-charcoal/80 dark:text-cream/80 transition-colors duration-500">
                    <CheckCircle2 size={13} className="text-gold shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA & Slide Indicators */}
            <div className="mt-4 pt-3 border-t border-gold/15 flex flex-col gap-2.5">
              <a
                href={curr.ctaHref}
                className="btn-primary w-full text-center !py-2.5 text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/30 group/btn"
              >
                <span>{curr.ctaText}</span>
                <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
              </a>

              {/* Slide Indicators */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex justify-center gap-1.5">
                  {SHOWCASE_TABS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeTab === i ? 'w-6 bg-gold' : 'w-1.5 bg-charcoal/20 hover:bg-charcoal/40 dark:bg-cream/20 dark:hover:bg-cream/40'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gold/60 font-medium sm:hidden">
                  ← Swipe to switch tabs →
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-gold/60 hover:text-gold"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown size={20} />
      </motion.a>
    </section>
  );
}

