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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);

    const targetId = href.replace(/^(\/|#)+/, '');
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : 60;
        const targetPosition = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      } else {
        window.location.href = href;
      }
    }, 120);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-ink/95 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 py-1.5 sm:py-2.5'
          : 'bg-transparent py-2 sm:py-3.5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between flex-nowrap px-3 sm:px-6 lg:px-8">
        {/* Brand / Logo - Single line */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-2 sm:gap-3 group shrink-0 whitespace-nowrap"
        >
          <div className="relative flex h-8 w-8 sm:h-11 sm:w-11 lg:h-13 lg:w-13 shrink-0 items-center justify-center rounded-full ring-1.5 sm:ring-2 ring-gold/40 bg-white/80 dark:bg-ink/60 p-0.5 shadow-md shadow-black/10 dark:shadow-black/40 transition-all duration-300 group-hover:ring-gold group-hover:scale-105">
            <img
              src={logoImage}
              alt={`${SALON.shortName} Logo`}
              className="h-full w-full rounded-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm sm:text-lg lg:text-xl font-bold tracking-wider text-charcoal dark:text-cream transition duration-300 group-hover:text-gold leading-tight">
              {SALON.shortName}
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.25em] text-gold/80 font-medium">
              Salon & Academy
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-xs uppercase tracking-widest text-charcoal/80 dark:text-cream/80 transition hover:text-gold dark:hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls - Single line on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 flex-nowrap">
          <a
            href="#booking"
            onClick={(e) => handleNavClick(e, '#booking')}
            className="btn-primary text-[10px] sm:text-xs !py-1.5 !px-3 sm:!py-2 sm:!px-5 shrink-0 whitespace-nowrap shadow-md shadow-gold/20"
          >
            Book Now
          </a>

          <button
            onClick={toggleTheme}
            className="rounded-full p-1.5 sm:p-2 text-gold transition hover:bg-gold/10 shrink-0"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-1.5 sm:p-2 text-gold lg:hidden shrink-0"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass dark:glass-dark border-t border-black/10 dark:border-white/10 lg:hidden max-h-[calc(100vh-70px)] overflow-y-auto"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="rounded-lg px-4 py-2.5 text-xs sm:text-sm uppercase tracking-widest text-charcoal/90 dark:text-cream/90 transition hover:bg-gold/10 hover:text-gold"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
