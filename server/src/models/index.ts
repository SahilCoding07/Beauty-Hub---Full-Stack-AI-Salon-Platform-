import mongoose from 'mongoose';
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  specialRequests: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'partial', 'paid', 'refunded'], default: 'pending' },
  advanceAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentId: { type: String, default: '' },
  paymentMethod: { type: String, default: '' },
  couponCode: { type: String, default: '' },
}, { timestamps: true });

bookingSchema.index({ date: 1, time: 1, staff: 1 }, { unique: false });

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  discount: { type: Number, required: true },
  code: { type: String, default: '' },
  validUntil: { type: String, required: true },
  category: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  image: { type: String, default: '' },
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: String, required: true },
  fees: { type: Number, required: true },
  certificate: { type: Boolean, default: true },
  image: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  service: { type: String, default: '' },
  image: { type: String, default: '' },
  email: { type: String, default: '' },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  isBeforeAfter: { type: Boolean, default: false },
  beforeImage: { type: String, default: '' },
  afterImage: { type: String, default: '' },
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
}, { timestamps: true });

const settingsSchema = new mongoose.Schema({
  salonName: { type: String, default: 'The Beauty Hub Salon And Academy' },
  ownerName: { type: String, default: 'Tarannum Jahan' },
  tagline: { type: String, default: 'Where Elegance Meets Art' },
  phone: { type: String, default: '8171537593' },
  email: { type: String, default: 'hello@thebeautyhub.in' },
  address: { type: String, default: 'Bilaspur Rampur, Near Nanital Bank' },
  instagram: { type: String, default: '@thebeautyhub.salon' },
  whatsapp: { type: String, default: '918171537593' },
  workingHours: {
    weekdays: { type: String, default: 'Mon - Sat: 10:00 AM - 8:00 PM' },
    sunday: { type: String, default: 'Sunday: 10:00 AM - 6:00 PM' },
  },
  heroImage: { type: String, default: '' },
  ownerImage: { type: String, default: '' },
  stats: {
    happyClients: { type: Number, default: 2500 },
    yearsExperience: { type: Number, default: 12 },
    experts: { type: Number, default: 8 },
  },
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);
export const Staff = mongoose.model('Staff', staffSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
export const Offer = mongoose.model('Offer', offerSchema);
export const Course = mongoose.model('Course', courseSchema);
export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export const Gallery = mongoose.model('Gallery', gallerySchema);
export const Admin = mongoose.model('Admin', adminSchema);
export const Settings = mongoose.model('Settings', settingsSchema);
