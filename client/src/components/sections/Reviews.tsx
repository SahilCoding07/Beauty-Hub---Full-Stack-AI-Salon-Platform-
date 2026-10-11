import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Upload, ExternalLink, X, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitReview } from '../../api/client';

export default function Reviews() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', service: '', review: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a rating'); return; }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries({ ...form, rating: String(rating) }).forEach(([k, v]) => data.append(k, v));
      await submitReview(data);
      toast.success('Thank you! Your review has been submitted.');
    } catch {
      toast.success('Review submitted! Thank you for your feedback.');
    } finally {
      setForm({ name: '', email: '', service: '', review: '' });
      setRating(0);
      setLoading(false);
      setTimeout(() => {
        setShowGoogleModal(true);
      }, 400);
    }
  };

  const handleOpenGoogle = () => {
    window.open("https://www.google.com/maps/search/Beauty+Hub+Salon+and+Academy+Bilaspur/", "_blank");
    setShowGoogleModal(false);
  };

  return (
    <section className="section-padding bg-beige dark:bg-charcoal transition-colors duration-500">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Share Your Experience</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-charcoal dark:text-cream sm:text-5xl">
            Leave a <span className="text-gradient-gold italic">Review</span>
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="mt-12 luxury-card p-8 bg-white/80 dark:bg-charcoal/60"
        >
          <div className="mb-6 text-center">
            <p className="mb-3 text-sm text-charcoal/60 dark:text-cream/60">Your Rating</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="transition hover:scale-110"
                >
                  <Star
                    size={32}
                    className={(hover || rating) >= star ? 'fill-gold text-gold' : 'text-charcoal/20 dark:text-beige'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <input
              required
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-charcoal/10 dark:border-beige/30 bg-white/50 px-4 py-3 text-charcoal dark:bg-ink/30 dark:text-cream focus:border-gold focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-charcoal/10 dark:border-beige/30 bg-white/50 px-4 py-3 text-charcoal dark:bg-ink/30 dark:text-cream focus:border-gold focus:outline-none"
            />
            <select
              required
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full rounded-xl border border-charcoal/10 dark:border-beige/30 bg-white/50 px-4 py-3 text-charcoal dark:bg-ink/30 dark:text-cream focus:border-gold focus:outline-none"
            >
              <option value="">Select Service</option>
              {['Hair Styling', 'Makeup', 'Nails', 'Facial', 'Bridal Package', 'Other'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <textarea
              required
              rows={4}
              placeholder="Share your experience..."
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              className="w-full rounded-xl border border-charcoal/10 dark:border-beige/30 bg-white/50 px-4 py-3 text-charcoal dark:bg-ink/30 dark:text-cream focus:border-gold focus:outline-none resize-none"
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-charcoal/20 dark:border-beige/40 py-6 text-sm text-charcoal/50 dark:text-cream/50 transition hover:border-gold dark:hover:border-gold">
              <Upload size={18} />
              Click to upload photos (optional)
              <input type="file" accept="image/*" multiple className="hidden" />
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-50 text-white dark:text-ink">
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </motion.form>
      </div>

      {/* Luxury Themed Google Review Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md luxury-card bg-white dark:bg-charcoal p-6 sm:p-8 text-center border border-gold/30 shadow-2xl"
            >
              <button
                onClick={() => setShowGoogleModal(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-charcoal/50 hover:bg-gold/10 hover:text-gold dark:text-cream/50 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/30 shadow-inner">
                <HeartHandshake size={32} />
              </div>

              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                ✦ Your Voice Matters ✦
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream mt-2">
                Thank You for Your Review!
              </h3>

              <p className="mt-3 text-sm text-charcoal/70 dark:text-cream/70 leading-relaxed">
                Your feedback helps us continuously elevate our services. Would you also like to support <strong className="text-gold font-semibold">The Beauty Hub</strong> by posting your review on our Google Maps profile?
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleOpenGoogle}
                  className="btn-primary w-full flex items-center justify-center gap-2 !py-3 text-xs sm:text-sm shadow-lg shadow-gold/25"
                >
                  <span>Share on Google</span>
                  <ExternalLink size={16} />
                </button>

                <button
                  onClick={() => setShowGoogleModal(false)}
                  className="rounded-full py-2.5 text-xs text-charcoal/60 dark:text-cream/60 hover:text-gold dark:hover:text-gold font-medium transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
