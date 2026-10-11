import logoImage from '../../assets/logo.png';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SALON } from '../../data/constants';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Courses', href: '#courses' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 dark:bg-ink/95 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 py-2 sm:py-3'
          : 'bg-transparent py-2.5 sm:py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5 sm:gap-3.5 group">
          <div className="relative flex h-9 w-9 sm:h-12 sm:w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-full ring-2 ring-gold/40 bg-white/80 dark:bg-ink/60 p-0.5 sm:p-1 shadow-md shadow-black/10 dark:shadow-black/40 transition-all duration-300 group-hover:ring-gold group-hover:scale-105">
            <img
              src={logoImage}
              alt={`${SALON.shortName} Logo`}
              className="h-full w-full rounded-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-xl font-bold tracking-wider text-charcoal dark:text-cream transition duration-300 group-hover:text-gold leading-tight">
              {SALON.shortName}
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.25em] text-gold/80 font-medium">
              Salon & Academy
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-widest text-charcoal/80 dark:text-cream/80 transition hover:text-gold dark:hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-gold transition hover:bg-gold/10"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="/#booking" className="btn-primary hidden text-xs sm:inline-flex !py-2.5 !px-6">
            Book Now
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gold lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass dark:glass-dark border-t border-black/10 dark:border-white/10 lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm uppercase tracking-widest text-charcoal/90 dark:text-cream/90 transition hover:bg-gold/10 hover:text-gold"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#booking"
                onClick={() => setMobileOpen(false)}
                className="btn-primary mt-2 text-center text-xs"
              >
                Book Now
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
