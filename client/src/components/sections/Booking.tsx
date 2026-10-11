import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, Smartphone, Building2, CalendarCheck, X } from 'lucide-react';
import {
  getServices,
  getStaff,
  getAvailableSlots,
  createBooking,
  
  
} from '../../api/client';
import { DEFAULT_SERVICES, DEFAULT_STAFF } from '../../data/constants';
import CustomSelect from '../ui/CustomSelect';
import type { Service, Staff } from '../../types';

const STEPS = ['Service', 'Schedule', 'Details', 'Confirm'];
const PAYMENT_METHODS = [
  { id: 'pay_at_salon', label: 'Pay Full Amount at Salon', icon: Building2 },
  { id: 'pay_advance', label: 'Pay Advance (20%) via UPI', icon: Smartphone }
];

declare global {
  interface Window {
    Razorpay: new (options: object) => { open: () => void };
  }
}

export default function Booking() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pay_at_salon');
  const [bookingSuccessData, setBookingSuccessData] = useState<any | null>(null);

  const [form, setForm] = useState({
    serviceId: '',
    staffId: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    requests: '',
    couponCode: '',
  });

  const [couponStatus, setCouponStatus] = useState<'idle' | 'applied' | 'invalid'>('idle');
  const [discountPercent, setDiscountPercent] = useState(0);

  const applyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    if (form.couponCode.toUpperCase() === 'WELCOME20') {
      setDiscountPercent(20);
      setCouponStatus('applied');
      toast.success('Coupon applied!');
    } else if (form.couponCode.trim() !== '') {
      setDiscountPercent(0);
      setCouponStatus('invalid');
      toast.error('Invalid coupon code');
    }
  };

  const selectedService = services.find((s) => s._id === form.serviceId);
  const baseDiscount = selectedService?.discount || 0;
  const totalDiscount = Math.min(baseDiscount + discountPercent, 100);
  
  const totalAmount = selectedService
    ? Math.round(selectedService.price * (1 - totalDiscount / 100))
    : 0;
  const advanceAmount = Math.round(totalAmount * 0.2);

  useEffect(() => {
    getServices()
      .then(({ data }) => {
        if (data && data.length > 0) setServices(data);
        else throw new Error('Empty');
      })
      .catch(() =>
        setServices(
          DEFAULT_SERVICES.map((s, i) => ({
            _id: String(i),
            ...s,
            category: s.category as Service['category'],
            image: '',
            isActive: true,
          }))
        )
      );
    getStaff()
      .then(({ data }) => {
        if (data && data.length > 0) setStaff(data);
        else throw new Error('Empty');
      })
      .catch(() =>
        setStaff(DEFAULT_STAFF.map((s, i) => ({ _id: String(i), ...s, isActive: true })))
      );
  }, []);

  useEffect(() => {
    if (form.date) {
      getAvailableSlots(form.date, form.staffId || undefined)
        .then(({ data }) => setSlots(data))
        .catch(() => {
          const times = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
          setSlots(times.map((time) => ({ time, available: true })));
        });
    }
  }, [form.date, form.staffId]);

  const updateForm = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canProceed = () => {
    if (step === 0) return !!form.serviceId;
    if (step === 1) return !!form.date && !!form.time;
    if (step === 2) return !!form.name && !!form.phone && !!form.email;
    return true;
  };

  const handlePayment = async () => {
    if (!selectedService) return;
    setLoading(true);

    const bookingData = {
      service: selectedService?.name || form.serviceId,
      staffId: form.staffId || undefined,
      date: form.date,
      time: form.time,
      customerName: form.name,
      customerPhone: form.phone,
      customerEmail: form.email,
      specialRequests: form.requests,
      advanceAmount: paymentMethod === 'pay_advance' ? advanceAmount : 0,
      totalAmount,
      paymentMethod,
      couponCode: form.couponCode || undefined,
    };

    try {
      await createBooking({ ...bookingData, paymentStatus: paymentMethod === 'pay_advance' ? 'partial' : 'pending', status: 'pending' });
      setBookingSuccessData({
        service: selectedService?.name || form.serviceId,
        date: form.date,
        time: form.time,
        name: form.name,
        totalAmount,
        advanceAmount: paymentMethod === 'pay_advance' ? advanceAmount : 0,
        paymentMethod,
      });
      toast.success('Booking successfully requested!');
      setStep(0);
      setForm({ serviceId: '', staffId: '', date: '', time: '', name: '', phone: '', email: '', requests: '', couponCode: '' });
    } catch (err) {
      toast.error('Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <section id="booking" className="section-padding bg-gradient-to-b from-cream to-beige dark:from-ink dark:to-charcoal text-charcoal dark:text-cream transition-colors duration-500">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Reserve Your Spot</p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Book Your <span className="text-gradient-gold italic">Appointment</span>
          </h2>
          <p className="mt-4 text-charcoal/60 dark:text-cream/60">
            Experience luxury beauty services. Reserve your appointment today.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-12 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  i <= step ? 'bg-gold text-white dark:text-ink' : 'border border-gold/30 text-gold/50'
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`hidden text-xs uppercase tracking-widest sm:inline ${i <= step ? 'text-gold' : 'text-charcoal/40 dark:text-cream/40'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`mx-1 h-px w-8 sm:w-12 ${i < step ? 'bg-gold' : 'bg-gold/20'}`} />
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-10 luxury-card p-6 md:p-8 bg-white/80 dark:bg-charcoal/80"
        >
          {step === 0 && (
            <div>
              <h3 className="mb-6 font-display text-xl font-semibold">Select Your Service</h3>
              <div className="grid gap-3 max-h-80 overflow-y-auto pr-2">
                {services.filter((s) => s.isActive !== false).map((s) => (
                  <button
                    key={s._id}
                    onClick={() => updateForm('serviceId', s._id)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                      form.serviceId === s._id
                        ? 'border-gold bg-gold/10'
                        : 'border-charcoal/10 dark:border-beige/20 hover:border-gold/40'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-charcoal dark:text-cream">{s.name}</p>
                      <p className="text-sm text-charcoal/50 dark:text-cream/50">{s.duration} min · {s.category}</p>
                    </div>
                    <p className="font-display text-lg font-bold text-gold">₹{s.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-semibold">Choose Date & Time</h3>
              <div>
                <label className="mb-2 block text-sm text-charcoal/60 dark:text-cream/60">Select Date</label>
                <input
                  type="date"
                  min={minDate}
                  value={form.date}
                  onChange={(e) => updateForm('date', e.target.value)}
                  className="w-full rounded-xl border border-charcoal/10 dark:border-beige/20 bg-white/50 dark:bg-ink/50 px-4 py-3 text-charcoal dark:text-cream focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-charcoal/60 dark:text-cream/60">Preferred Stylist (Optional)</label>
                <CustomSelect
                  value={form.staffId}
                  onChange={(val) => updateForm('staffId', val)}
                  placeholder="No Preference"
                  options={[
                    { value: '', label: 'No Preference' },
                    ...staff.map((s) => ({ value: s._id, label: `${s.name} - ${s.role}` })),
                  ]}
                />
              </div>
              {form.date && (
                <div>
                  <label className="mb-2 block text-sm text-charcoal/60 dark:text-cream/60">Select Time</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => updateForm('time', slot.time)}
                        className={`rounded-lg py-2 text-sm transition ${
                          form.time === slot.time
                            ? 'bg-gold text-white dark:text-ink font-semibold'
                            : slot.available
                            ? 'border border-charcoal/10 dark:border-beige/20 hover:border-gold'
                            : 'border border-black/5 dark:border-beige/10 text-charcoal/30 dark:text-cream/30 cursor-not-allowed line-through'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="mb-2 font-display text-xl font-semibold">Your Details</h3>
              {['name', 'phone', 'email'].map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-sm capitalize text-charcoal/60 dark:text-cream/60">
                    {field === 'name' ? 'Full Name' : field === 'phone' ? 'Phone Number' : 'Email'}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => updateForm(field, e.target.value)}
                    className="w-full rounded-xl border border-charcoal/10 dark:border-beige/20 bg-white/50 dark:bg-ink/50 px-4 py-3 text-charcoal dark:text-cream focus:border-gold focus:outline-none"
                  />
                </div>
              ))}

              <div>
                <label className="mb-1 block text-sm text-charcoal/60 dark:text-cream/60">Special Requests</label>
                <textarea
                  value={form.requests}
                  onChange={(e) => updateForm('requests', e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-charcoal/10 dark:border-beige/20 bg-white/50 dark:bg-ink/50 px-4 py-3 text-charcoal dark:text-cream focus:border-gold focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-semibold">Confirm Your Booking</h3>
              
              <div className="rounded-xl border border-gold/20 bg-gold/5 p-5 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-charcoal/60 dark:text-cream/60">Service</span><span>{selectedService?.name}</span></div>
                  <div className="flex justify-between"><span className="text-charcoal/60 dark:text-cream/60">Date</span><span>{form.date}</span></div>
                  <div className="flex justify-between"><span className="text-charcoal/60 dark:text-cream/60">Time</span><span>{form.time}</span></div>
                  <div className="flex justify-between"><span className="text-charcoal/60 dark:text-cream/60">Name</span><span>{form.name}</span></div>
                </div>
                
                <div className="border-t border-gold/20 pt-4">
                  <label className="mb-2 block text-sm text-charcoal/60 dark:text-cream/60">Coupon Code (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      value={form.couponCode}
                      onChange={(e) => updateForm('couponCode', e.target.value)}
                      placeholder="e.g. WELCOME20"
                      className={`flex-1 rounded-xl border bg-white/50 dark:bg-ink/50 px-4 py-2 text-sm text-charcoal dark:text-cream focus:border-gold focus:outline-none ${
                        couponStatus === 'applied' ? 'border-green-500' : couponStatus === 'invalid' ? 'border-red-500' : 'border-charcoal/10 dark:border-beige/20'
                      }`}
                    />
                    <button onClick={applyCoupon} className="btn-primary rounded-xl !py-2 !px-4 text-xs font-semibold">
                      Apply
                    </button>
                  </div>
                  {couponStatus === 'applied' && <p className="mt-1 text-xs text-green-500">Coupon applied! {discountPercent}% off.</p>}
                  {couponStatus === 'invalid' && <p className="mt-1 text-xs text-red-500">Invalid coupon code.</p>}
                </div>

                <div className="space-y-2 text-sm border-t border-gold/20 pt-4">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60 dark:text-cream/60">Base Price</span>
                    <span>₹{selectedService?.price || 0}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount ({totalDiscount}%)</span>
                      <span>-₹{Math.round((selectedService?.price || 0) * (totalDiscount / 100))}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2">
                    <span className="text-charcoal/60 dark:text-cream/60">Total</span>
                    <span className="font-bold text-gold text-lg">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60 dark:text-cream/60">Advance (20%)</span>
                    <span className="font-bold text-gold">₹{advanceAmount}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">Payment Preference</h4>
                <div className="grid gap-3 sm:grid-cols-2 mb-6">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-center gap-3 rounded-xl border p-4 transition ${
                        paymentMethod === m.id ? 'border-gold bg-gold/10' : 'border-charcoal/10 dark:border-beige/20 hover:border-gold/40'
                      }`}
                    >
                      <m.icon size={24} className="text-gold" />
                      <span className="text-sm font-semibold">{m.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'pay_advance' && (
                  <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-center">
                    <img
                      src="/payment-qr.png"
                      alt="UPI Payment QR"
                      className="mx-auto mb-4 max-w-[250px] rounded-lg"
                    />
                    <p className="text-gold font-semibold">Pay ₹{advanceAmount} Advance</p>
                    <p className="mt-2 text-sm text-charcoal/70 dark:text-cream/70">
                      After payment, send the payment screenshot on WhatsApp to confirm your booking.
                    </p>
                    <a
                      href="https://wa.me/918171537593"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-gold underline font-semibold"
                    >
                      Send Screenshot on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="btn-outline text-sm !px-6 !py-2.5 text-charcoal dark:text-cream border-charcoal/20 dark:border-gold/60 hover:bg-black/5 dark:hover:bg-gold/10">
                Back
              </button>
            ) : <div />}
            {step < 3 ? (
              <button
                onClick={() => canProceed() && setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary text-sm !px-6 !py-2.5 disabled:opacity-40 text-white dark:text-ink"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={loading}
                className="btn-primary text-sm !px-6 !py-2.5 disabled:opacity-40 text-white dark:text-ink"
              >
                {loading ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Luxury Themed Booking Confirmation Modal */}
      <AnimatePresence>
        {bookingSuccessData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md luxury-card bg-white dark:bg-charcoal p-6 sm:p-8 text-center border border-gold/30 shadow-2xl"
            >
              <button
                onClick={() => setBookingSuccessData(null)}
                className="absolute right-4 top-4 rounded-full p-1 text-charcoal/50 hover:bg-gold/10 hover:text-gold dark:text-cream/50 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/30 shadow-inner">
                <CalendarCheck size={32} />
              </div>

              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                ✦ Appointment Requested ✦
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream mt-2">
                Booking Confirmed!
              </h3>

              <p className="mt-2 text-sm text-charcoal/70 dark:text-cream/70 leading-relaxed">
                Thank you, <strong className="text-gold font-semibold">{bookingSuccessData.name}</strong>! We have received your appointment request.
              </p>

              <div className="mt-5 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-left space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/60 dark:text-cream/60">Service</span>
                  <span className="font-semibold text-charcoal dark:text-cream">{bookingSuccessData.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60 dark:text-cream/60">Date & Time</span>
                  <span className="font-semibold text-charcoal dark:text-cream">{bookingSuccessData.date} at {bookingSuccessData.time}</span>
                </div>
                <div className="flex justify-between border-t border-gold/15 pt-2">
                  <span className="text-charcoal/60 dark:text-cream/60">Total Amount</span>
                  <span className="font-bold text-gold">₹{bookingSuccessData.totalAmount}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => setBookingSuccessData(null)}
                  className="btn-primary w-full !py-3 text-xs sm:text-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
