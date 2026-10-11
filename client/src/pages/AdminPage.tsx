import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, GraduationCap, Calendar, Scissors, Tag, MessageSquare, Image, Settings, LogOut, IndianRupee, Users, Star,
  Plus, Trash2, Menu, X, Edit, Check, Upload, Camera, Brain, AlertTriangle, TrendingUp, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  getDashboardStats, getBookings, updateBookingStatus, getServices, deleteService, createService, updateService,
  getOffers, deleteOffer, createOffer, getCourses, createCourse, deleteCourse,
  getAllTestimonials, approveTestimonial, deleteTestimonial,
  getGallery, createGalleryItem, deleteGalleryItem,
  getBeforeAfter, createBeforeAfter, deleteBeforeAfter
} from '../api/client';
import type { Booking, Service, Offer, Testimonial } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'insights', label: 'AI Insights', icon: Brain },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'services', label: 'Services', icon: Scissors },
  { id: 'offers', label: 'Offers', icon: Tag },
  { id: 'courses', label: 'Courses', icon: GraduationCap },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'beforeafter', label: 'Before & After', icon: Camera },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPw = password.trim();

    if (!cleanEmail || !cleanPw) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await login(cleanEmail, cleanPw);
      toast.success('Welcome back, Admin!');
    } catch (err: any) {
      toast.error(err?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md luxury-card p-6 sm:p-8 dark:bg-charcoal/90 border border-gold/30 shadow-2xl"
      >
        <div className="mb-6 sm:mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-gold/50 bg-gold/10 font-display text-2xl sm:text-3xl font-bold text-gold shadow-inner">
            B
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-cream">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-gold mt-1 font-medium">Manage your salon & academy</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
              autoComplete="email"
              className="w-full rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 text-cream placeholder-cream/35 focus:border-gold focus:outline-none text-sm"
              placeholder="serversterkira@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="current-password"
                className="w-full rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 pr-11 text-cream placeholder-cream/35 focus:border-gold focus:outline-none text-sm"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/50 hover:text-gold transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="btn-primary w-full shadow-lg shadow-gold/25 mt-2 !py-3.5 text-xs font-bold"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN TO ADMIN'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

function Dashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [churnRisk, setChurnRisk] = useState<any>(null);
  const [demandForecast, setDemandForecast] = useState<any>(null);
  
  // Data states
  const [stats, setStats] = useState({ bookings: 0, revenue: 0, clients: 0, rating: 4.9 });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [beforeAfter, setBeforeAfter] = useState<any[]>([]);

  // Form states
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '', fees: '' });
  const [newService, setNewService] = useState({ name: '', category: 'Hair', price: '', duration: '', description: '', image: '' });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newOffer, setNewOffer] = useState({ title: '', description: '', discount: '', code: '' });
  
  // File states
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryCategory, setGalleryCategory] = useState('Hair');
  const [baBefore, setBaBefore] = useState<File | null>(null);
  const [baAfter, setBaAfter] = useState<File | null>(null);
  const [baTitle, setBaTitle] = useState('');

  const loadData = () => {
    getDashboardStats().then(({ data }) => setStats(data || { bookings: 0, revenue: 0, clients: 0, rating: 4.9 })).catch(() => {});
    getBookings().then(({ data }) => setBookings(data)).catch(() => {});
    getServices().then(({ data }) => setServices(data)).catch(() => {});
    getOffers().then(({ data }) => setOffers(data)).catch(() => {});
    getCourses().then(({ data }) => setCourses(data)).catch(() => {});
    getAllTestimonials().then(({ data }) => setTestimonials(data)).catch(() => {});
    getGallery().then(({ data }) => setGallery(data)).catch(() => {});
    getBeforeAfter().then(({ data }) => setBeforeAfter(data)).catch(() => {});
  };

  useEffect(() => {
    getDashboardStats().then(({ data }) => setStats(data)).catch(() => {});
    if (activeTab === 'dashboard' || activeTab === 'bookings') getBookings().then(({ data }) => setBookings(data)).catch(() => {});
    if (activeTab === 'dashboard' || activeTab === 'services') getServices().then(({ data }) => setServices(data)).catch(() => {});
    if (activeTab === 'dashboard' || activeTab === 'offers') getOffers().then(({ data }) => setOffers(data)).catch(() => {});
    if (activeTab === 'dashboard' || activeTab === 'courses') getCourses().then(({ data }) => setCourses(data)).catch(() => {});
    if (activeTab === 'dashboard' || activeTab === 'reviews') getAllTestimonials().then(({ data }) => setTestimonials(data)).catch(() => {});
    if (activeTab === 'gallery') getGallery().then(({ data }) => setGallery(data)).catch(() => {});
            if (activeTab === 'insights') {
      fetch(`${BASE_URL}/api/sentiment`)
        .then(res => res.json())
        .then(data => setAiInsights(data))
        .catch(err => console.error("ML service offline", err));
        
      fetch(`${BASE_URL}/api/churn-risk`)
        .then(res => res.json())
        .then(data => setChurnRisk(data))
        .catch(err => console.error("ML service offline", err));
        
      fetch(`${BASE_URL}/api/forecast`)
        .then(res => res.json())
        .then(data => setDemandForecast(data))
        .catch(err => console.error("ML service offline", err));
    }
    if (activeTab === 'before-after') getBeforeAfter().then(({ data }) => setBeforeAfter(data)).catch(() => {});
  }, [activeTab]);

  const handleBookingAction = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      loadData();
    } catch { toast.error('Failed to update'); }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(newService).forEach(([k, v]) => fd.append(k, String(v)));
    try {
      if (editingServiceId) {
        await updateService(editingServiceId, fd);
        toast.success('Service updated!');
        setEditingServiceId(null);
      } else {
        await createService(fd);
        toast.success('Service added!');
      }
      setNewService({ name: '', category: 'Hair', price: '', duration: '', description: '', image: '' });
      loadData();
    } catch { toast.error('Failed to save service'); }
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOffer({ ...newOffer, discount: Number(newOffer.discount), isActive: true, validUntil: '2026-12-31' });
      toast.success('Offer created!');
      setNewOffer({ title: '', description: '', discount: '', code: '' });
      loadData();
    } catch { toast.error('Failed to create offer'); }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCourse({ ...newCourse, fees: Number(newCourse.fees), isActive: true });
      toast.success('Course added!');
      setNewCourse({ title: '', description: '', duration: '', fees: '' });
      loadData();
    } catch { toast.error('Failed to add course'); }
  };
  
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile) return toast.error('Select an image');
    const fd = new FormData();
    fd.append('image', galleryFile);
    fd.append('category', galleryCategory);
    try {
      await createGalleryItem(fd);
      toast.success('Uploaded to Gallery!');
      setGalleryFile(null);
      loadData();
    } catch { toast.error('Upload failed. Image might be too large for offline mode.'); }
  };

  const handleAddBA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baBefore || !baAfter || !baTitle) return toast.error('Missing fields');
    const fd = new FormData();
    fd.append('before', baBefore);
    fd.append('after', baAfter);
    fd.append('title', baTitle);
    try {
      await createBeforeAfter(fd);
      toast.success('Transformation added!');
      setBaBefore(null); setBaAfter(null); setBaTitle('');
      loadData();
    } catch { toast.error('Upload failed. Images might be too large for offline mode.'); }
  };

  return (
    <div className="flex min-h-screen bg-ink text-cream">
      {/* Sidebar Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gold/20 bg-charcoal p-6 transition-transform duration-300 ease-in-out lg:static lg:block lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileMenuOpen(false)} className="absolute right-4 top-4 text-cream/60 lg:hidden"><X size={24} /></button>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-gold/10 font-display text-lg font-bold text-gold">B</div>
          <div>
            <p className="font-display font-semibold">Beauty Hub</p>
            <p className="text-xs text-gold/70">Admin Panel</p>
          </div>
        </div>
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                activeTab === tab.id ? 'bg-gold/20 text-gold' : 'text-cream/60 hover:bg-white/5 hover:text-cream'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </motion.button>
          ))}
        </nav>
        <button onClick={logout} className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-400/10">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full h-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-gold/10 bg-charcoal p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-gold/10 font-display text-sm font-bold text-gold">B</div>
            <span className="font-display font-semibold text-gold">Beauty Hub Admin</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="text-gold"><Menu size={24} /></button>
        </div>
        <div className="p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            
            {activeTab === 'insights' && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <Brain className="text-gold" size={32} />
                  <h2 className="font-display text-2xl font-semibold">AI Sentiment Analysis</h2>
                </div>
                
                {!aiInsights ? (
                  <p className="text-cream/60">Loading AI models...</p>
                ) : aiInsights.error ? (
                  <p className="text-red-400">Error: {aiInsights.error}</p>
                ) : (
                  <div className="space-y-8">
                    <div className="luxury-card p-6 dark:bg-charcoal/60">
                      <h3 className="mb-4 text-lg font-semibold text-gold">
                        Customer Satisfaction {aiInsights.total_reviews ? `(Live: ${aiInsights.total_reviews} ${aiInsights.total_reviews === 1 ? 'Review' : 'Reviews'})` : '(Live Analytics)'}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-4 rounded-full bg-ink/50 overflow-hidden flex">
                          <div style={{ width: `${aiInsights.positive_pct}%` }} className="bg-green-500 h-full"></div>
                          <div style={{ width: `${aiInsights.neutral_pct}%` }} className="bg-yellow-500 h-full"></div>
                          <div style={{ width: `${aiInsights.negative_pct}%` }} className="bg-red-500 h-full"></div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between text-sm">
                        <span className="text-green-400 font-bold">{aiInsights.positive_pct}% Positive</span>
                        <span className="text-yellow-400 font-bold">{aiInsights.neutral_pct}% Neutral</span>
                        <span className="text-red-400 font-bold">{aiInsights.negative_pct}% Negative</span>
                      </div>
                    </div>

                    <div className="luxury-card p-6 border border-red-500/20 bg-red-500/5">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-400">
                        <AlertTriangle size={20} /> Action Required: Recent Negative Feedback
                      </h3>
                      <div className="space-y-4">
                        {aiInsights.action_required?.length > 0 ? (
                          aiInsights.action_required.map((review: any, i: number) => (
                            <div key={i} className="bg-ink/50 p-4 rounded-lg">
                              <p className="text-cream/90 italic">"{review.review_text}"</p>
                              <p className="text-xs text-cream/50 mt-2">Date: {review.date}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-green-400">No negative reviews currently flagged!</p>
                        )}
                      </div>
                    </div>
                  
                    <div className="luxury-card p-6 border border-gold/20 dark:bg-charcoal/60 mt-8">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gold">
                        <Brain size={20} /> Machine Learning Churn Prediction
                      </h3>
                      {!churnRisk ? (
                        <p className="text-cream/60">Training Random Forest Model...</p>
                      ) : churnRisk.error ? (
                        <p className="text-red-400">Error: {churnRisk.error}</p>
                      ) : (
                        <div>
                          <p className="text-sm text-cream/80 mb-4">
                            Model Status: Tracking {churnRisk.total_active} active customers. <span className="text-red-400 font-bold">{churnRisk.total_churned} customers</span> haven't visited in over 60 days (Churned).
                          </p>
                          <div className="space-y-4">
                            <h4 className="text-md font-semibold text-cream">High-Risk Customers (Approaching 60 Days)</h4>
                            {churnRisk.at_risk_customers?.length > 0 ? (
                              churnRisk.at_risk_customers.map((c: any, i: number) => (
                                <div key={i} className="bg-ink/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                  <div>
                                    <p className="font-bold text-gold">{c.name} <span className="text-xs text-cream/50 ml-2 font-normal">({c.total_visits} total visits)</span></p>
                                    <p className="text-xs text-cream/70 mt-1">📞 {c.phone}</p>
                                    <p className="text-sm text-red-400 mt-1">Last visit: {c.days_since} days ago (Risk Score: {c.risk_score}%)</p>
                                  </div>
                                  <button onClick={() => toast.success(`20% Retention offer sent to ${c.name} (${c.phone})!`)} className="btn-primary text-xs !px-4 !py-2 shrink-0">
                                    Send 20% Retention Offer
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-green-400">No customers currently at high risk!</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="luxury-card p-6 border border-gold/20 dark:bg-charcoal/60 mt-8">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gold">
                        <TrendingUp size={20} /> AI Demand Forecasting
                      </h3>
                      {!demandForecast ? (
                        <p className="text-cream/60">Running Linear Regression on time-series data...</p>
                      ) : demandForecast.error ? (
                        <p className="text-red-400">Error: {demandForecast.error}</p>
                      ) : (
                        <div>
                          <div className="bg-gold/10 border border-gold/30 p-4 rounded-lg mb-6">
                            <p className="text-gold font-semibold flex items-center gap-2">
                              💡 Actionable Insight
                            </p>
                            <p className="text-cream/90 mt-1">{demandForecast.insight}</p>
                          </div>
                          
                          <h4 className="text-md font-semibold text-cream mb-4">Predicted Bookings (Next 7 Days)</h4>
                          <div className="flex items-end gap-2 h-40 mt-4 border-b border-cream/10 pb-2">
                            {demandForecast.forecast?.map((f: any, i: number) => {
                              // Find max to scale bars
                              const maxBookings = Math.max(...demandForecast.forecast.map((d:any) => d.expected_bookings));
                              const heightPct = (f.expected_bookings / maxBookings) * 100;
                              return (
                                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group h-full">
                                  <div className="w-full bg-gold/40 rounded-t-sm relative transition-all duration-300 group-hover:bg-gold" style={{ height: `${heightPct}%` }}>
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-cream opacity-0 group-hover:opacity-100 transition-opacity">{f.expected_bookings}</span>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs font-bold text-cream/80">{f.day}</p>
                                    <p className="text-[10px] text-cream/50">{f.date}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
  
  
                  </div>
                )}
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold">Dashboard Overview</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Bookings', value: stats.bookings || 0, icon: Calendar },
                    { label: 'Revenue', value: `₹${(stats.revenue || 0).toLocaleString()}`, icon: IndianRupee },
                    { label: 'Clients', value: stats.clients || 0, icon: Users },
                    { label: 'Rating', value: stats.rating || 4.9, icon: Star },
                  ].map((s, i) => (
                    <motion.div whileHover={{ y: -5 }} key={i} className="luxury-card p-6 dark:bg-charcoal/60 shadow-xl">
                      <s.icon size={24} className="mb-4 text-gold" />
                      <p className="font-display text-3xl font-semibold text-gold">{s.value}</p>
                      <p className="text-sm text-cream/60 mt-1">{s.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold">Manage Bookings</h2>
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={b._id} className="luxury-card flex flex-col justify-between p-6 dark:bg-charcoal/60 sm:flex-row sm:items-center">
                      <div>
                        <p className="font-semibold text-gold text-lg">{b.customerName}</p>
                        <p className="text-sm text-cream/80 mb-1">{new Date(b.date).toLocaleDateString()} at {b.time}</p>
                        <p className="text-xs text-cream/60 mb-2">📞 {b.customerPhone} | ✉️ {b.customerEmail}</p>
                        <p className="text-xs text-cream/60 bg-gold/10 inline-block px-2 py-1 rounded mb-2">
                          Service: {typeof b.service === 'string' ? b.service : b.service?.name || 'Unknown'}
                        </p>
                        {b.specialRequests && <p className="text-sm text-gold/80 italic mb-1">📝 Note: {b.specialRequests}</p>}
                        {(b as any).paymentMethod && <p className="text-xs text-cream/80">💳 {(b as any).paymentMethod === 'pay_advance' ? `Pay Advance (₹${b.advanceAmount}) via UPI` : 'Pay Full Amount at Salon'} | Total: ₹{b.totalAmount}</p>}
                      </div>
                      <div className="mt-4 flex gap-2 sm:mt-0">
                        {b.status === 'pending' && (
                          <>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBookingAction(b._id, 'confirmed')} className="rounded-lg bg-green-500/20 px-4 py-2 text-sm text-green-400 hover:bg-green-500/30 font-medium">Confirm</motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBookingAction(b._id, 'cancelled')} className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/30 font-medium">Cancel</motion.button>
                          </>
                        )}
                        {b.status !== 'pending' && (
                          <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {b.status}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {bookings.length === 0 && <p className="text-cream/50">No bookings yet.</p>}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold">Manage Services</h2>
                <form onSubmit={handleAddService} className="mb-8 luxury-card p-6 dark:bg-charcoal/60">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-gold">{editingServiceId ? <Edit size={18} /> : <Plus size={18} />} {editingServiceId ? "Edit Service" : "Add New Service"}</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 text-cream focus:border-gold focus:outline-none" />
                    <select value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 text-cream focus:border-gold focus:outline-none">
                      {['Hair', 'Bridal Makeup', 'Engagement Makeup', 'Party Makeup', 'Nails', 'Skin & Body'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gold">Service Image (Optional)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewService({ ...newService, image: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-sm text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gold/20 file:text-gold hover:file:bg-gold/30 cursor-pointer"
                      />
                    </div>
                    <input required type="number" placeholder="Price (₹)" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 text-cream focus:border-gold focus:outline-none" />
                    <input required type="number" placeholder="Duration (min)" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 text-cream focus:border-gold focus:outline-none" />
                    <input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className="sm:col-span-2 rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 text-cream focus:border-gold focus:outline-none" />
                  </div>
                  <div className="flex gap-4 items-center mt-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary text-sm !py-3 px-8">
                      {editingServiceId ? 'Update Service' : 'Save Service'}
                    </motion.button>
                    {editingServiceId && (
                      <button type="button" onClick={() => { setEditingServiceId(null); setNewService({ name: '', category: 'Hair', price: '', duration: '', description: '', image: '' }); }} className="text-sm text-cream/60 hover:text-gold transition">Cancel</button>
                    )}
                  </div>
                </form>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((s) => (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={s._id} className="luxury-card flex items-center justify-between p-5 dark:bg-charcoal/60">
                      <div>
                        <p className="font-semibold text-lg text-cream">{s.name}</p>
                        <p className="text-xs text-cream/60 mt-1">{s.category} · {s.duration}min · ₹{s.price}</p>
                      </div>
                      <div className="flex gap-1">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setEditingServiceId(s._id); setNewService({ name: s.name, category: s.category, price: String(s.price), duration: String(s.duration), description: s.description || '', image: s.image || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-gold p-2 hover:bg-gold/10 rounded-full"><Edit size={18} /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteService(s._id).then(() => { toast.success('Deleted'); loadData(); })} className="text-red-400 p-2 hover:bg-red-400/10 rounded-full"><Trash2 size={18} /></motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold">Manage Courses</h2>
                <form onSubmit={handleAddCourse} className="mb-8 luxury-card p-6 dark:bg-charcoal/60">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-gold"><GraduationCap size={18} /> Add New Course</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required placeholder="Course Title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3" />
                    <input required placeholder="Duration (e.g. 3 Months)" value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3" />
                    <input required type="number" placeholder="Fees (₹)" value={newCourse.fees} onChange={(e) => setNewCourse({ ...newCourse, fees: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3" />
                    <input placeholder="Course Description" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary mt-4 text-sm !py-3 px-8">Add Course</motion.button>
                </form>
                <div className="grid gap-4 sm:grid-cols-2">
                  {courses.map((c) => (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={c._id} className="luxury-card p-5 dark:bg-charcoal/60 border-l-4 border-l-gold">
                      <h3 className="font-semibold text-xl text-gold">{c.title}</h3>
                      <p className="text-sm text-cream/80 mt-1 font-medium">{c.duration} | ₹{c.fees}</p>
                      <p className="mt-3 text-sm text-cream/60 leading-relaxed">{c.description}</p>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => deleteCourse(c._id).then(() => { toast.success('Deleted'); loadData(); })} className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20">Remove Course</motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'offers' && (
              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold">Manage Offers</h2>
                <form onSubmit={handleAddOffer} className="mb-8 luxury-card p-6 dark:bg-charcoal/60">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-gold"><Tag size={18} /> Create Offer</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required placeholder="Offer Title" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3" />
                    <input required type="number" placeholder="Discount %" value={newOffer.discount} onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3" />
                    <input placeholder="Coupon Code (e.g. SUMMER20)" value={newOffer.code} onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 uppercase" />
                    <input required placeholder="Description" value={newOffer.description} onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })} className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary mt-4 text-sm !py-3 px-8">Save Offer</motion.button>
                </form>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {offers.map((o) => (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={o._id} className="luxury-card flex flex-col justify-between p-5 dark:bg-charcoal/60 border-t-4 border-t-gold">
                      <div>
                        <p className="font-semibold text-xl">{o.title}</p>
                        <p className="text-md text-gold mt-1">{o.discount}% off {o.code ? `· Code: ${o.code}` : ''}</p>
                        <p className="text-sm text-cream/60 mt-2">{o.description}</p>
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => deleteOffer(o._id).then(() => { toast.success('Deleted'); loadData(); })} className="text-red-400 self-end mt-4 p-2 bg-red-400/10 rounded-full"><Trash2 size={18} /></motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold">Gallery Management</h2>
                <form onSubmit={handleAddGallery} className="mb-8 luxury-card p-6 dark:bg-charcoal/60">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-gold"><Image size={18} /> Upload New Photo</h3>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input type="file" accept="image/*" onChange={(e) => setGalleryFile(e.target.files?.[0] || null)} className="flex-1 w-full text-sm text-cream/70 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gold/20 file:text-gold hover:file:bg-gold/30 cursor-pointer" />
                    <select value={galleryCategory} onChange={(e) => setGalleryCategory(e.target.value)} className="w-full sm:w-auto rounded-xl border border-beige/20 bg-ink/50 px-6 py-3 text-cream focus:border-gold">
                      {['Hair', 'Makeup', 'Nails', 'Bridal'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="btn-primary w-full sm:w-auto !py-3 px-8"><Upload size={18} className="inline mr-2"/> Upload</motion.button>
                  </div>
                </form>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {gallery.map((g) => (
                    <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} key={g._id} className="relative group overflow-hidden rounded-2xl shadow-lg border border-gold/10">
                      <img src={g.image} alt="Gallery" className="h-48 w-full object-cover transition duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-ink/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center gap-2">
                        <span className="text-white font-semibold tracking-wider uppercase text-xs">{g.category}</span>
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => deleteGalleryItem(g._id).then(() => { toast.success('Deleted'); loadData(); })} className="rounded-full bg-red-500/80 p-3 text-white shadow-lg"><Trash2 size={20} /></motion.button>
                      </div>
                    </motion.div>
                  ))}
                  {gallery.length === 0 && <p className="col-span-full text-cream/50">No images uploaded yet.</p>}
                </div>
              </div>
            )}

            {activeTab === 'beforeafter' && (
              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold">Before & After Management</h2>
                <form onSubmit={handleAddBA} className="mb-8 luxury-card p-6 dark:bg-charcoal/60">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-gold"><Camera size={18} /> Add Transformation</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="bg-ink/30 p-4 rounded-xl border border-beige/10">
                      <label className="block text-sm font-semibold text-cream mb-2">Before Image</label>
                      <input type="file" accept="image/*" onChange={(e) => setBaBefore(e.target.files?.[0] || null)} className="w-full text-sm text-cream/70 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-ink file:text-gold cursor-pointer" />
                    </div>
                    <div className="bg-ink/30 p-4 rounded-xl border border-beige/10">
                      <label className="block text-sm font-semibold text-cream mb-2">After Image</label>
                      <input type="file" accept="image/*" onChange={(e) => setBaAfter(e.target.files?.[0] || null)} className="w-full text-sm text-cream/70 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold file:text-ink cursor-pointer" />
                    </div>
                    <input required placeholder="Transformation Title (e.g. Bridal Magic)" value={baTitle} onChange={(e) => setBaTitle(e.target.value)} className="sm:col-span-2 rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 text-lg focus:border-gold" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary mt-6 !py-3 px-8"><Upload size={18} className="inline mr-2"/> Save Transformation</motion.button>
                </form>
                <div className="grid gap-6 lg:grid-cols-2">
                  {beforeAfter.map((ba) => (
                    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={ba._id} className="luxury-card overflow-hidden shadow-xl">
                      <div className="flex h-56 relative group">
                        <img src={ba.before} className="w-1/2 object-cover" />
                        <img src={ba.after} className="w-1/2 object-cover border-l-2 border-gold/50" />
                        <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                          <span className="bg-ink/80 text-white px-4 py-2 rounded-full font-semibold tracking-widest text-sm border border-gold/30">PREVIEW</span>
                        </div>
                      </div>
                      <div className="p-5 flex justify-between items-center dark:bg-charcoal/80">
                        <p className="font-display font-semibold text-xl">{ba.title}</p>
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => deleteBeforeAfter(ba._id).then(() => { toast.success('Deleted'); loadData(); })} className="text-red-400 p-2 bg-red-400/10 rounded-full"><Trash2 size={18} /></motion.button>
                      </div>
                    </motion.div>
                  ))}
                  {beforeAfter.length === 0 && <p className="col-span-full text-cream/50">No transformations added yet.</p>}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold">Manage Reviews</h2>
                <div className="space-y-4">
                  {testimonials.map((t) => (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={t._id} className="luxury-card flex items-start justify-between p-6 dark:bg-charcoal/60">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-xl text-gold">{t.name}</p>
                          {!t.isApproved && <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400">Pending</span>}
                        </div>
                        <p className="mt-3 text-cream/80 italic text-lg leading-relaxed">"{t.review}"</p>
                      </div>
                      <div className="flex gap-3 ml-6 shrink-0">
                        {!t.isApproved && (
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => approveTestimonial(t._id).then(() => { toast.success('Approved'); loadData(); })} className="text-green-400 p-3 bg-green-400/10 rounded-full hover:bg-green-400/20"><Check size={20} /></motion.button>
                        )}
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteTestimonial(t._id).then(() => { toast.success('Deleted'); loadData(); })} className="text-red-400 p-3 bg-red-400/10 rounded-full hover:bg-red-400/20"><Trash2 size={20} /></motion.button>
                      </div>
                    </motion.div>
                  ))}
                  {testimonials.length === 0 && <p className="text-cream/50">No reviews yet.</p>}
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold">Quick Settings</h2>
                <div className="luxury-card space-y-6 p-8 dark:bg-charcoal/60">
                  {[
                    { label: 'Auto-accept bookings', default: false, desc: 'Automatically confirm all incoming booking requests.' },
                    { label: 'Show availability online', default: true, desc: 'Let customers see available slots before booking.' },
                    { label: 'Advance payment required', default: true, desc: 'Require partial payment to confirm the appointment.' },
                  ].map((s) => (
                    <label key={s.label} className="flex items-start justify-between cursor-pointer group">
                      <div>
                        <span className="block text-lg font-medium group-hover:text-gold transition">{s.label}</span>
                        <span className="block text-sm text-cream/50 mt-1">{s.desc}</span>
                      </div>
                      <input type="checkbox" defaultChecked={s.default} className="h-6 w-6 accent-gold mt-1" />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <LoginForm />;
}
