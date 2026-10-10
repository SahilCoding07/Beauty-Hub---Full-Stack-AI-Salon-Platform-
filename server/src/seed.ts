import bcrypt from 'bcryptjs';
import {
  Service, Staff, Offer, Testimonial, Gallery, Admin, Settings, Booking,
} from './models/index.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

const services = [
  { name: 'Hair Styling', category: 'Hair', description: 'Expert cuts, blow-dry & styling for every occasion.', duration: 60, price: 800, image: '' },
  { name: 'Hair Spa', category: 'Hair', description: 'Deep conditioning treatment for silky, healthy hair.', duration: 90, price: 1500, discount: 10, image: '' },
  { name: 'Hair Coloring', category: 'Hair', description: 'Premium color techniques from highlights to balayage.', duration: 120, price: 2500, image: '' },
  { name: 'Makeup', category: 'Makeup', description: 'Flawless makeup for parties, events & photoshoots.', duration: 60, price: 2000, image: '' },
  { name: 'Bridal Makeup', category: 'Bridal Packages', description: 'Complete bridal look with HD/airbrush makeup.', duration: 180, price: 15000, discount: 15, image: '' },
  { name: 'Nail Art', category: 'Nails', description: 'Creative nail designs with premium polish.', duration: 45, price: 600, image: '' },
  { name: 'Nail Extensions', category: 'Nails', description: 'Gel & acrylic extensions for stunning nails.', duration: 90, price: 2000, image: '' },
  { name: 'Manicure', category: 'Nails', description: 'Luxurious hand care with nail shaping & polish.', duration: 45, price: 500, image: '' },
  { name: 'Pedicure', category: 'Nails', description: 'Relaxing foot spa with exfoliation & massage.', duration: 60, price: 700, image: '' },
  { name: 'Waxing', category: 'Skin & Body', description: 'Gentle waxing with premium products.', duration: 30, price: 400, image: '' },
  { name: 'Facial', category: 'Skin & Body', description: 'Rejuvenating facial for glowing, radiant skin.', duration: 60, price: 1200, discount: 10, image: '' },
  { name: 'Skin Care', category: 'Skin & Body', description: 'Customized skincare treatments for your skin type.', duration: 75, price: 1800, image: '' },
  { name: 'Threading', category: 'Skin & Body', description: 'Precise eyebrow & facial threading.', duration: 20, price: 150, image: '' },
  { name: 'Massage', category: 'Skin & Body', description: 'Therapeutic body massage for deep relaxation.', duration: 60, price: 1500, image: '' },
  { name: 'Groom Package', category: 'Groom Packages', description: 'Complete grooming for the handsome groom.', duration: 120, price: 5000, discount: 10, image: '' },
  { name: 'Party Package', category: 'Party Packages', description: 'Hair + makeup combo for your special event.', duration: 90, price: 3500, discount: 15, image: '' },
  { name: 'Bridal Package', category: 'Bridal Packages', description: 'All-inclusive bridal beauty package.', duration: 240, price: 25000, discount: 20, image: '' },
  { name: 'Beauty Course', category: 'Academy', description: 'Professional beauty training certification course.', duration: 480, price: 25000, image: '' },
];

const staff = [
  { name: 'Tarannum Jahan', role: 'Founder & Lead Stylist' },
  { name: 'Neha Verma', role: 'Senior Makeup Artist' },
  { name: 'Aisha Khan', role: 'Nail Artist' },
  { name: 'Raj Patel', role: 'Hair Expert' },
];

const offers = [
  { title: 'Bridal Season Special — 40% OFF', description: 'Book your complete bridal package today and get 40% off. Includes hair, makeup, nails, and skincare treatments.', discount: 40, validUntil: '2026-12-31', category: 'Bridal Packages', isActive: true },
  { title: 'First Visit — 20% OFF', description: 'New customers get 20% off on any service. Use code WELCOME20 at booking.', discount: 20, code: 'WELCOME20', validUntil: '2026-12-31', isActive: true },
  { title: 'Festival Combo Offer', description: 'Hair Spa + Facial combo at just ₹2,199. Limited time festival special.', discount: 25, validUntil: '2026-08-31', category: 'Skin & Body', isActive: true },
];

const testimonials = [
  { name: 'Ananya Singh', rating: 5, review: "My bridal makeup was absolutely stunning! Tarannum ma'am understood exactly what I wanted. The entire team made me feel like a princess on my special day.", service: 'Bridal Makeup', isApproved: true },
  { name: 'Riya Patel', rating: 5, review: 'Best salon in Rampur! The hair coloring turned out exactly as I envisioned. Professional, hygienic, and luxurious experience every time.', service: 'Hair Coloring', isApproved: true },
  { name: 'Meera Joshi', rating: 5, review: 'The academy course changed my career. Tarannum Jahan is an incredible teacher with deep knowledge of beauty techniques. Highly recommend!', service: 'Academy Course', isApproved: true },
  { name: 'Priya Sharma', rating: 5, review: 'Their nail art is next level! Creative designs, premium products, and such a relaxing atmosphere. My go-to salon for everything beauty.', service: 'Nail Art', isApproved: true },
];

const gallery = [
  { title: 'Bridal Makeup', category: 'Makeup', image: '', type: 'image' },
  { title: 'Hair Styling', category: 'Hair', image: '', type: 'image' },
  { title: 'Nail Art', category: 'Nails', image: '', type: 'image' },
  { title: 'Makeup', category: 'Makeup', image: '', type: 'image' },
  { title: 'Hair Color', category: 'Hair', image: '', type: 'image' },
  { title: 'Bridal Look', category: 'Bridal', image: '', type: 'image' },
  { title: 'Facial', category: 'Skin', image: '', type: 'image' },
  { title: 'Nail Extensions', category: 'Nails', image: '', type: 'image' },
];

async function seed() {
  await connectDatabase();
  console.log('Connected to MongoDB Atlas');

  await Promise.all([
    Service.deleteMany({}),
    Staff.deleteMany({}),
    Offer.deleteMany({}),
    Testimonial.deleteMany({}),
    Gallery.deleteMany({}),
    Admin.deleteMany({}),
    Settings.deleteMany({}),
    Booking.deleteMany({}),
  ]);

  await Service.insertMany(services);
  await Staff.insertMany(staff);
  await Offer.insertMany(offers);
  await Testimonial.insertMany(testimonials);
  await Gallery.insertMany(gallery);

  const hashedPassword = await bcrypt.hash(env.adminPassword, 10);
  await Admin.create({
    email: env.adminEmail,
    password: hashedPassword,
    name: 'Tarannum Jahan',
  });

  await Settings.create({
    salonName: 'The Beauty Hub Salon And Academy',
    ownerName: 'Tarannum Jahan',
    tagline: 'Where Elegance Meets Art',
    phone: '8171537593',
    email: 'hello@thebeautyhub.in',
    address: 'Bilaspur Rampur, Near Nanital Bank',
    instagram: '@thebeautyhub.salon',
    whatsapp: '918171537593',
    heroImage: '',
    ownerImage: '',
    stats: { happyClients: 2500, yearsExperience: 12, experts: 8 },
  });

  console.log(`  Admin login: ${env.adminEmail} / (password from ADMIN_PASSWORD in .env)`);
  await disconnectDatabase();
}

seed().catch((err) => {
  console.error('Seed failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
