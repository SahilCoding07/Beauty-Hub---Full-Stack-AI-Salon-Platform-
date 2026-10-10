import logoImage from '../../assets/logo.png';
import { SALON } from '../../data/constants';
import { MapPin, Phone, Mail } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';

export default function Footer() {
  return (
    <footer className="bg-cream dark:bg-ink border-t border-charcoal/10 dark:border-gold/20 pt-16 pb-8 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full ring-2 ring-gold/40 bg-white dark:bg-ink/60 p-1 shadow-md shadow-black/40">
                <img
                  src={logoImage}
                  alt={`${SALON.shortName} Logo`}
                  className="h-full w-full rounded-full object-contain"
                />
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-charcoal dark:text-cream">{SALON.shortName}</p>
                <p className="text-xs uppercase tracking-widest text-gold/70">Salon & Academy</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-charcoal/60 dark:text-cream/60">
              Transforming beauty experiences since {SALON.founded}. Where elegance meets artistry under the guidance of {SALON.owner}.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-lg font-semibold text-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-charcoal/60 dark:text-cream/60">
              {['Home', 'About Us', 'Services', 'Gallery', 'Book Now'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="transition hover:text-gold">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-lg font-semibold text-gold">Services</h4>
            <ul className="space-y-2 text-sm text-charcoal/60 dark:text-cream/60">
              {['Hair Styling', 'Bridal Makeup', 'Nail Art', 'Skin Care', 'Academy Courses'].map((item) => (
                <li key={item}>
                  <a href="#services" className="transition hover:text-gold">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-lg font-semibold text-gold">Contact</h4>
            <ul className="space-y-3 text-sm text-charcoal/60 dark:text-cream/60">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>{SALON.address}, {SALON.city}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gold" />
                <a href={`tel:${SALON.phone}`} className="hover:text-gold">{SALON.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold" />
                <a href={`mailto:${SALON.email}`} className="hover:text-gold">{SALON.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon size={16} className="text-gold" />
                <a href={SALON.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                  {SALON.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-charcoal/10 dark:border-gold/10 pt-8 text-center text-sm text-charcoal/40 dark:text-cream/40">
          <p>© {new Date().getFullYear()} {SALON.name}. All rights reserved.</p>
          <p className="mt-1">Crafted with ✦ elegance & passion | Developed by Sahil</p>
        </div>
      </div>
    </footer>
  );
}
