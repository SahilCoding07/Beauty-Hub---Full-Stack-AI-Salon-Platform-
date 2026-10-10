import bcrypt from 'bcryptjs';
import {
  Service, Staff, Offer, Testimonial, Gallery, Admin, Settings,
} from '../models/index.js';
import { env } from '../config/env.js';

const services = [
  { name: 'Hair Styling', category: 'Hair', description: 'Expert cuts, blow-dry & styling for every occasion.', duration: 60, price: 800, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80' },
  { name: 'Hair Spa', category: 'Hair', description: 'Deep conditioning treatment for silky, healthy hair.', duration: 90, price: 1500, discount: 10, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80' },
  { name: 'Hair Coloring', category: 'Hair', description: 'Premium color techniques from highlights to balayage.', duration: 120, price: 2500, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80' },
  { name: 'Makeup', category: 'Makeup', description: 'Flawless makeup for parties, events & photoshoots.', duration: 60, price: 2000, image: 'https://images.unsplash.com/photo-1487412949317-9a1e063e613a?w=600&q=80' },
  { name: 'Bridal Makeup', category: 'Bridal Packages', description: 'Complete bridal look with HD/airbrush makeup.', duration: 180, price: 15000, discount: 15, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' },
  { name: 'Nail Art', category: 'Nails', description: 'Creative nail designs with premium polish.', duration: 45, price: 600, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80' },
  { name: 'Nail Extensions', category: 'Nails', description: 'Gel & acrylic extensions for stunning nails.', duration: 90, price: 2000, image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&q=80' },
  { name: 'Manicure', category: 'Nails', description: 'Luxurious hand care with nail shaping & polish.', duration: 45, price: 500, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80' },
  { name: 'Pedicure', category: 'Nails', description: 'Relaxing foot spa with exfoliation & massage.', duration: 60, price: 700, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80' },
  { name: 'Waxing', category: 'Skin & Body', description: 'Gentle waxing with premium products.', duration: 30, price: 400, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d880?w=600&q=80' },
  { name: 'Facial', category: 'Skin & Body', description: 'Rejuvenating facial for glowing, radiant skin.', duration: 60, price: 1200, discount: 10, image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80' },
  { name: 'Skin Care', category: 'Skin & Body', description: 'Customized skincare treatments for your skin type.', duration: 75, price: 1800, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d880?w=600&q=80' },
  { name: 'Threading', category: 'Skin & Body', description: 'Precise eyebrow & facial threading.', duration: 20, price: 150, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d880?w=600&q=80' },
  { name: 'Massage', category: 'Skin & Body', description: 'Therapeutic body massage for deep relaxation.', duration: 60, price: 1500, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d880?w=600&q=80' },
  { name: 'Groom Package', category: 'Groom Packages', description: 'Complete grooming for the handsome groom.', duration: 120, price: 5000, discount: 10, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
  { name: 'Party Package', category: 'Party Packages', description: 'Hair + makeup combo for your special event.', duration: 90, price: 3500, discount: 15, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80' },
  { name: 'Bridal Package', category: 'Bridal Packages', description: 'All-inclusive bridal beauty package.', duration: 240, price: 25000, discount: 20, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' },
  { name: 'Beauty Course', category: 'Academy', description: 'Professional beauty training certification course.', duration: 480, price: 25000, image: 'https://images.unsplash.com/photo-1522335781262-129b431a6ccb?w=600&q=80' },
];

export async function seedIfEmpty() {
  const count = await Service.countDocuments();
  if (count > 0) return;

  console.log('Seeding database...');
  await Service.insertMany(services);
  await Staff.insertMany([
    { name: 'Tarannum Jahan', role: 'Founder & Lead Stylist' },
    { name: 'Neha Verma', role: 'Senior Makeup Artist' },
    { name: 'Aisha Khan', role: 'Nail Artist' },
    { name: 'Raj Patel', role: 'Hair Expert' },
  ]);
  await Offer.insertMany([
    { title: 'Bridal Season Special — 40% OFF', description: 'Book your complete bridal package today and get 40% off.', discount: 40, validUntil: '2026-12-31', category: 'Bridal Packages', isActive: true },
    { title: 'First Visit — 20% OFF', description: 'New customers get 20% off. Use code WELCOME20.', discount: 20, code: 'WELCOME20', validUntil: '2026-12-31', isActive: true },
    { title: 'Festival Combo Offer', description: 'Hair Spa + Facial combo at just ₹2,199.', discount: 25, validUntil: '2026-08-31', isActive: true },
  ]);
  await Testimonial.insertMany([
    { name: 'Ananya Singh', rating: 5, review: "My bridal makeup was absolutely stunning! Tarannum ma'am understood exactly what I wanted.", service: 'Bridal Makeup', isApproved: true },
    { name: 'Riya Patel', rating: 5, review: 'Best salon in Rampur! Professional, hygienic, and luxurious experience every time.', service: 'Hair Coloring', isApproved: true },
    { name: 'Meera Joshi', rating: 5, review: 'The academy course changed my career. Highly recommend!', service: 'Academy Course', isApproved: true },
  ]);
  await Gallery.insertMany([
    { title: 'Bridal Makeup', category: 'Makeup', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', type: 'image' },
    { title: 'Hair Styling', category: 'Hair', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80', type: 'image' },
    { title: 'Nail Art', category: 'Nails', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', type: 'image' },
    { title: 'Makeup', category: 'Makeup', image: 'https://images.unsplash.com/photo-1487412949317-9a1e063e613a?w=600&q=80', type: 'image' },
  ]);

  const adminExists = await Admin.findOne();
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(env.adminPassword, 10);
    await Admin.create({
      email: env.adminEmail,
      password: hashedPassword,
      name: 'Tarannum Jahan',
    });
  }

  await Settings.findOneAndUpdate({}, {
    salonName: 'The Beauty Hub Salon And Academy',
    ownerName: 'Tarannum Jahan',
    phone: '8171537593',
    address: 'Bilaspur Rampur, Near Nanital Bank',
  }, { upsert: true });

  console.log('✓ Database seeded');
}
