import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { X, CheckCircle2 } from 'lucide-react';
import { getCourses, getOffers } from '../../api/client';

const defaultCourses = [
  {
    _id: 'master', 
    title: 'Full Master Course (Basic to Advance)', 
    description: 'The ultimate beautician program covering all modules (Makeup, Skin, Hair, Nails, Eyelashes). Start your career as a professional!', 
    duration: '6 Months', 
    fees: 180000,
    highlight: true,
    topics: [
      'Master Makeup Course (Bridal, Party, HD)',
      'Advanced Skin & Aesthetics (Hydra, Facials)',
      'Hair Styling & Chemical Work (Keratin, Global)',
      'Nail Art & Extensions Masterclass',
      'Eyelash Extensions Professional'
    ]
  },
  { 
    _id: 'makeup', 
    title: 'Master Makeup Course', 
    description: 'Comprehensive training from basic day looks to advanced bridal and cocktail makeup.', 
    duration: '1.5 Months', 
    fees: 40000,
    topics: ['Theory, Skin prep & types, Colour theory', 'Day look & Self look', 'Party, Mehndi, Haldi makeup', 'Engagement, Bridal, Reception, Cocktail makeup']
  },
  { 
    _id: 'skin', 
    title: 'Advanced Skin & Aesthetics', 
    description: 'Professional skin treatments, facials, and grooming essentials.', 
    duration: '1 Month', 
    fees: 25000,
    topics: ['Theory, Waxing, Threading', 'All types of Basic to Advance Facial', 'Cleanup, D-tan, Hydra treatment', 'Manicure & Pedicure']
  },
  { 
    _id: 'hair', 
    title: 'Hair Styling & Chemical Work', 
    description: 'Master thermal styling, advanced coloring, and chemical treatments.', 
    duration: '1.5 Months', 
    fees: 35000,
    topics: ['Theory, Thermal styling, Curls, Straight, Crimping', 'Global Color & Highlights', 'Smoothing, Keratin, Kerasmooth', 'Hair Spa, Root touch up']
  },
  { 
    _id: 'nails', 
    title: 'Nail Art & Extensions Masterclass', 
    description: 'Learn structural nail extensions and intricate 3D nail artistry.', 
    duration: '1 Month', 
    fees: 20000,
    topics: ['Theory, Structure, Nail prep', 'Temporary, Gel & Acrylic extensions', 'Different types of Nail Art (Basic to Advance)', 'Chrome, 3D nails, Font art, Cat eye']
  },
  { 
    _id: 'lashes', 
    title: 'Eyelash Extensions Professional', 
    description: 'Specialized course for applying flawless eyelash extensions.', 
    duration: '15 Days', 
    fees: 15000,
    topics: ['Theory & Safety protocols', 'Volume style', 'Hybrid style', 'Mega style']
  }
];

export default function Courses() {
  const [courses, setCourses] = useState<any[]>(defaultCourses);
  const [offers, setOffers] = useState<any[]>([]);
  const [viewingCourse, setViewingCourse] = useState<any | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<any | null>(null);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    getCourses()
      .then(({ data }) => { if (data.length) setCourses(data); })
      .catch(() => {});
    getOffers()
      .then(({ data }) => { if (data.length) setOffers(data); })
      .catch(() => {});
  }, []);

  const handleApplyCoupon = () => {
    const validOffer = offers.find(o => o.code && o.code.toUpperCase() === coupon.toUpperCase());
    if (validOffer) {
      setDiscount(validOffer.discount);
      toast.success(`Coupon applied! ${validOffer.discount}% OFF`);
    } else if (coupon.toUpperCase() === 'WELCOME20') {
      setDiscount(20);
      toast.success(`Coupon applied! 20% OFF (Demo Code)`);
    } else if (coupon.trim() !== '') {
      setDiscount(0);
      toast.error('Invalid coupon code');
    }
  };

  const finalFees = enrollingCourse ? Math.round(enrollingCourse.fees * (1 - discount / 100)) : 0;

  const handleEnroll = () => {
    if (!enrollingCourse) return;
    const text = `Hi, I want to enroll in the ${enrollingCourse.title}.\nOriginal Fee: ₹${enrollingCourse.fees}\nDiscount: ${discount}%\nFinal Fee: ₹${finalFees}\n${discount > 0 ? `Coupon Applied: ${coupon}` : ''}`;
    window.open(`https://wa.me/918171537593?text=${encodeURIComponent(text)}`, '_blank');
    setEnrollingCourse(null);
    setCoupon('');
    setDiscount(0);
  };

  return (
    <section id="courses" className="section-padding relative bg-white dark:bg-charcoal text-charcoal dark:text-cream transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">
            Professional Training
          </p>

          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Courses We Offer
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <motion.div
              key={course._id}
              whileHover={{ y: -5 }}
              className={`luxury-card flex flex-col justify-between p-6 relative overflow-hidden ${course.highlight ? 'bg-gold/10 border-gold shadow-lg shadow-gold/20 md:col-span-2 lg:col-span-3 lg:w-2/3 lg:mx-auto' : 'bg-cream/50 dark:bg-charcoal/60'}`}
            >
              {course.highlight && (
                <div className="absolute top-0 right-0 bg-gold text-ink text-xs font-bold px-3 py-1 rounded-bl-xl shadow-md">BEST VALUE</div>
              )}
              <div>
                <h3 className={`font-display text-xl font-semibold ${course.highlight ? 'text-gold text-2xl' : 'text-gold'}`}>
                  {course.title}
                </h3>
                <p className="mt-3 text-sm text-charcoal/70 dark:text-cream/70">
                  {course.description}
                </p>
                
                <div className="mt-5 space-y-2">
                  {course.topics?.slice(0, 3).map((topic: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-charcoal/80 dark:text-cream/80">
                      <CheckCircle2 size={14} className="text-gold mt-0.5 shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                  {course.topics?.length > 3 && (
                    <p className="text-xs text-gold italic pl-6">+ {course.topics.length - 3} more modules</p>
                  )}
                </div>

                <div className="mt-6 flex justify-between items-end">
                  <p className="text-sm">
                    Duration:
                    <span className="text-gold font-semibold"> {course.duration}</span>
                  </p>
                  <div className="text-right">
                    {course.highlight && <p className="text-[10px] uppercase tracking-widest text-gold/70">Total Package</p>}
                    <p className={`font-display font-bold text-gold ${course.highlight ? 'text-4xl' : 'text-2xl'}`}>
                      ₹{course.fees.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button 
                  onClick={() => setViewingCourse(course)} 
                  className="rounded-xl border border-gold text-gold text-xs font-bold py-2.5 hover:bg-gold/10 transition"
                >
                  Know More
                </button>
                <button 
                  onClick={() => { setEnrollingCourse(course); setCoupon(''); setDiscount(0); }} 
                  className="btn-primary text-xs !py-2.5"
                >
                  Enroll Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

            <AnimatePresence>
        {viewingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg luxury-card bg-white p-8 dark:bg-charcoal max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setViewingCourse(null)} className="absolute right-4 top-4 text-charcoal/50 hover:text-gold dark:text-cream/50"><X size={20} /></button>
              
              <p className="text-xs tracking-widest uppercase text-gold">Course Syllabus</p>
              <h3 className="font-display text-3xl font-semibold text-charcoal dark:text-cream mb-4 mt-1">{viewingCourse.title}</h3>
              <p className="text-sm text-charcoal/70 dark:text-cream/70 mb-6">{viewingCourse.description}</p>
              
              <div className="bg-ink/5 dark:bg-ink/30 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gold mb-3 flex items-center gap-2">What you will learn:</h4>
                <ul className="space-y-3">
                  {viewingCourse.topics?.map((topic: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-charcoal/80 dark:text-cream/90">
                      <CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center bg-gold/10 rounded-xl p-4 mb-6 border border-gold/20">
                <div>
                  <p className="text-xs text-charcoal/60 dark:text-cream/60">Duration</p>
                  <p className="font-semibold text-gold">{viewingCourse.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-charcoal/60 dark:text-cream/60">Course Fees</p>
                  <p className="font-display font-bold text-2xl text-gold">₹{viewingCourse.fees.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <button 
                onClick={() => { setEnrollingCourse(viewingCourse); setViewingCourse(null); setCoupon(''); setDiscount(0); }} 
                className="btn-primary w-full !py-3"
              >
                Proceed to Enrollment
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {enrollingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md luxury-card bg-white p-6 dark:bg-charcoal"
            >
              <button
                onClick={() => setEnrollingCourse(null)}
                className="absolute right-4 top-4 text-charcoal/50 hover:text-gold dark:text-cream/50"
              >
                <X size={20} />
              </button>
              
              <h3 className="font-display text-2xl font-semibold text-gold mb-1">Enroll in Course</h3>
              <p className="text-sm text-charcoal/70 dark:text-cream/70 mb-6">{enrollingCourse.title}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm border-b border-charcoal/10 dark:border-cream/10 pb-2">
                  <span>Course Fee:</span>
                  <span>₹{enrollingCourse.fees}</span>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm text-charcoal/60 dark:text-cream/60">Have a Coupon?</label>
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 rounded-xl border border-charcoal/10 dark:border-beige/20 bg-white/50 dark:bg-ink/50 px-4 py-2 text-charcoal dark:text-cream focus:border-gold focus:outline-none"
                    />
                    <button onClick={handleApplyCoupon} className="btn-primary rounded-xl !py-2 !px-4 text-xs font-semibold">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-lg pt-2 text-gold">
                  <span>Final Fee:</span>
                  <span>₹{finalFees}</span>
                </div>

                <button onClick={handleEnroll} className="btn-primary w-full mt-4 !py-3 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  Enroll via WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}