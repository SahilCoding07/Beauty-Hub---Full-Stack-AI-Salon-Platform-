import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';
import { SALON } from '../../data/constants';

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-beige dark:bg-ink text-charcoal dark:text-cream transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Get In Touch</p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Visit Our <span className="text-gradient-gold italic">Salon</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { icon: MapPin, title: 'Our Location', lines: [SALON.address, SALON.city] },
              { icon: Phone, title: 'Call Us', lines: [SALON.phoneDisplay] },
              { icon: Clock, title: 'Working Hours', lines: [SALON.workingHours.weekdays, SALON.workingHours.sunday] },
              { icon: Mail, title: 'Email Us', lines: [SALON.email] },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="luxury-card p-6 bg-white/80 dark:bg-charcoal/60"
              >
                <item.icon className="mb-3 text-gold" size={24} />
                <h4 className="font-semibold text-charcoal dark:text-cream">{item.title}</h4>
                {item.lines.map((line) => (
                  <p key={line} className="mt-1 text-sm text-charcoal/60 dark:text-cream/60">{line}</p>
                ))}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="luxury-card p-8 bg-white/80 dark:bg-charcoal/60"
          >
            <h3 className="mb-6 font-display text-xl font-semibold">Send us a Message</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const data = new FormData(form);
                const name = data.get('name');
                const email = data.get('email');
                const subject = data.get('subject');
                const message = data.get('message');
                const text = `Hi, my name is ${name} (${email}).\nQuery Type: ${subject}\n\nMessage: ${message}`;
                window.open(`https://wa.me/918171537593?text=${encodeURIComponent(text)}`, '_blank');
                form.reset();
              }}
              className="space-y-4"
            >
              <input name="name" required placeholder="Your Name" className="w-full rounded-xl border border-charcoal/10 dark:border-beige/20 bg-white/50 dark:bg-ink/50 px-4 py-3 text-charcoal dark:text-cream placeholder:text-charcoal/40 dark:placeholder:text-cream/40 focus:border-gold focus:outline-none" />
              <input name="email" type="email" required placeholder="Email Address" className="w-full rounded-xl border border-charcoal/10 dark:border-beige/20 bg-white/50 dark:bg-ink/50 px-4 py-3 text-charcoal dark:text-cream placeholder:text-charcoal/40 dark:placeholder:text-cream/40 focus:border-gold focus:outline-none" />
              <select name="subject" className="w-full rounded-xl border border-charcoal/10 dark:border-beige/20 bg-white/50 dark:bg-ink/50 px-4 py-3 text-charcoal dark:text-cream focus:border-gold focus:outline-none">
                <option value="General Inquiry">General Inquiry</option>
                <option value="Booking Question">Booking Question</option>
                <option value="Feedback">Feedback</option>
                <option value="Partnership">Partnership</option>
              </select>
              <textarea name="message" required rows={4} placeholder="Your message..." className="w-full rounded-xl border border-charcoal/10 dark:border-beige/20 bg-white/50 dark:bg-ink/50 px-4 py-3 text-charcoal dark:text-cream placeholder:text-charcoal/40 dark:placeholder:text-cream/40 focus:border-gold focus:outline-none resize-none" />
              <button type="submit" className="btn-primary w-full text-white dark:text-ink">Send Message</button>
            </form>

            <a
              href={SALON.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 text-sm text-gold hover:underline"
            >
              <InstagramIcon size={16} />
              Follow us on Instagram {SALON.instagram}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 overflow-hidden rounded-2xl border border-charcoal/10 dark:border-gold/20"
        >
        <iframe
  title="Salon Location"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3493.283253933343!2d79.26035940952454!3d28.889929775423045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390a85a65df2b2bb%3A0x8e6a3798cc2d7653!2sBeauty%20Hub%20Salon%20and%20Academy%20Bilaspur!5e0!3m2!1sen!2sin!4v1782157044416!5m2!1sen!2sin"
  width="100%"
  height="450"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
        </motion.div>
      </div>
    </section>
  );
}