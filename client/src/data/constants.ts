import salon1 from '../assets/salon1.jpg';
import salon2 from '../assets/salon2.jpg';
import salon3 from '../assets/salon3.jpg';
import salon4 from '../assets/salon4.jpg';
import nails from '../assets/real_work/nails.jpg';
import hair from '../assets/real_work/hair.jpg';
import bridal from '../assets/real_work/bridal.jpg';
import party1 from '../assets/real_work/party1.png';
import bridal2 from '../assets/real_work/bridal2.png';
import nails2 from '../assets/real_work/nails2.png';
import hair2 from '../assets/real_work/hair2.png';
import before1 from '../assets/real_work/before1.png';
import before2 from '../assets/real_work/before2.png';
import after2 from '../assets/real_work/after2.png';
import before3 from '../assets/real_work/before3.png';
import after3 from '../assets/real_work/after3.png';
import before4 from '../assets/real_work/before4.png';
import after4 from '../assets/real_work/after4.png';
import mani_pedi from '../assets/real_work/mani_pedi.jpg';
import waxing from '../assets/real_work/waxing.png';
import threading from '../assets/real_work/threading.png';
import facial from '../assets/real_work/facial.png';
import massage from '../assets/real_work/massage.png';
import new_hair_styling from '../assets/new_hair_styling.png';
import new_makeup from '../assets/new_makeup.png';
import new_skincare from '../assets/new_skincare.png';
import new_bridal_package from '../assets/new_bridal_package.jpg';
import new_bridal_makeup from '../assets/new_bridal_makeup.png';
import real_pearl_nails from '../assets/real_work/real_pearl_nails.png';
import real_red_bridal from '../assets/real_work/real_red_bridal.png';
import real_threading_waxing from '../assets/real_work/real_threading_waxing.png';
import real_engagement_makeup from '../assets/real_work/real_engagement_makeup.png';
import real_floral_nails from '../assets/real_work/real_floral_nails.png';

export const SALON = {
  name: 'Beauty Hub Salon And Academy',
  shortName: 'Beauty Hub',
  owner: 'Tarannum Jahan',
  tagline: 'Where Elegance Meets Art',
  subtitle: 'Premium Beauty Experience',
  phone: '8171537593',
  phoneDisplay: '+91 81715 37593',
  email: 'tarannumjahan077@gmail.com',
  address: 'Bilaspur, Near Nainital Bank, Matkhera, Bilaspur-Uttar Pradesh-244921, Uttar Pradesh',
  city: 'Rampur, Uttar Pradesh',
  instagram: 'beautyhub_salon_and_academy',
  instagramUrl: 'https://www.instagram.com/beautyhub_salon_and_academy?igsh=czhyb3NhY2Y2dmY1',
  whatsapp: '918171537593',
  workingHours: {
    weekdays: 'Sat - Thu: 9:00 AM - 7:00 PM',
    sunday: 'Friday: OFF (Call/WhatsApp for emergencies)',
  },
  founded: '20-jun-2022',
  stats: {
    happyClients: 2500,
    yearsExperience: 6,
    experts: 5,
  },
};

export const SERVICE_CATEGORIES = [
  'All',
  'Bridal Makeup',
  'Engagement Makeup',
  'Party Makeup',
  'Hair',
  'Nails',
  'Skin & Body',
] as const;

export const DEFAULT_SERVICES = [
  { name: 'Hair Styling', category: 'Hair', description: 'Expert cuts, blow-dry & styling for every occasion.', duration: 60, price: 1500, discount: 0 },
  { name: 'Hair Spa', category: 'Hair', description: 'Deep conditioning treatment for silky, healthy hair.', duration: 90, price: 1500, discount: 10 },
  { name: 'Hair Chemical Work', category: 'Hair', description: 'Starting from ₹3000. Smoothing, Keratin, and Coloring.', duration: 120, price: 3000, discount: 0 },
  { name: 'Party Makeup (Normal)', category: 'Party Makeup', description: 'Flawless normal makeup for parties and events.', duration: 60, price: 2000, discount: 0 },
  { name: 'Party Makeup (HD)', category: 'Party Makeup', description: 'High-definition party makeup for photoshoots.', duration: 75, price: 3000, discount: 0 },
  { name: 'Party Makeup (Silicone)', category: 'Party Makeup', description: 'Premium silicone-based long-lasting party makeup.', duration: 90, price: 5000, discount: 0 },
  { name: 'Engagement Makeup (Normal)', category: 'Engagement Makeup', description: 'Beautiful normal makeup for engagement ceremonies.', duration: 90, price: 10000, discount: 0 },
  { name: 'Engagement Makeup (HD)', category: 'Engagement Makeup', description: 'High-definition flawless engagement makeup.', duration: 120, price: 15000, discount: 0 },
  { name: 'Engagement Makeup (Silicone)', category: 'Engagement Makeup', description: 'Premium silicone engagement makeup for a perfect look.', duration: 150, price: 20000, discount: 0 },
  { name: 'Bridal & Reception (Normal)', category: 'Bridal Makeup', description: 'Complete traditional bridal & reception makeup.', duration: 150, price: 15000, discount: 0 },
  { name: 'Bridal & Reception (HD)', category: 'Bridal Makeup', description: 'High-definition complete bridal & reception look.', duration: 180, price: 20000, discount: 0 },
  { name: 'Bridal & Reception (Silicone)', category: 'Bridal Makeup', description: 'Premium silicone bridal makeup for maximum longevity.', duration: 210, price: 30000, discount: 0 },
  { name: 'Nail Art', category: 'Nails', description: 'Creative nail designs with premium polish.', duration: 45, price: 800, discount: 0 },
  { name: 'Nail Extensions (Both Hands)', category: 'Nails', description: 'Starting from ₹2000 for both hands. Gel & acrylic.', duration: 90, price: 2000, discount: 0 },
  { name: 'Manicure & Pedicure', category: 'Nails', description: 'Relaxing hand & foot spa with polish.', duration: 60, price: 1200, discount: 0 },
  { name: 'Skin Treatment', category: 'Skin & Body', description: 'Starting from ₹500 to ₹5000. Customized for your skin.', duration: 60, price: 500, discount: 0 },
  { name: 'Facial', category: 'Skin & Body', description: 'Rejuvenating facial for glowing, radiant skin.', duration: 60, price: 1800, discount: 10 },
  { name: 'Threading & Waxing', category: 'Skin & Body', description: 'Precise threading and gentle body waxing.', duration: 45, price: 500, discount: 0 },
  { name: 'Massage', category: 'Skin & Body', description: 'Therapeutic body massage for deep relaxation.', duration: 60, price: 2000, discount: 0 }
];

export const DEFAULT_STAFF = [
  { name: 'Tarannum Jahan', role: 'Founder & Lead Stylist' },
  { name: 'Muskan', role: 'Senior Makeup Artist' },
  { name: 'Vinita', role: 'Nail Artist' },
  { name: 'Palwinder', role: 'Hair Expert' },
];

export const IMAGES = {
  hero: salon1,
  heroShowcase: real_red_bridal,
  real_pearl_nails,
  real_red_bridal,
  real_threading_waxing,
  real_engagement_makeup,
  real_floral_nails,
  salon1,
  salon2,
  salon3,
  salon4,
  nails: real_floral_nails,
  nails2: real_pearl_nails,
  hair,
  bridal: real_red_bridal,
  party1: real_engagement_makeup,
  bridal2: real_engagement_makeup,
  hair2,
  before1,
  before2,
  after2,
  before3,
  after3,
  before4,
  after4,
  mani_pedi,
  waxing: real_threading_waxing,
  threading: real_threading_waxing,
  facial,
  massage,
  new_hair_styling,
  new_makeup: real_engagement_makeup,
  new_skincare,
  new_bridal_package: real_red_bridal,
  new_bridal_makeup: real_red_bridal,
  legacyNails: nails,
  legacyBridal: bridal,
  legacyParty1: party1,
  legacyBridal2: bridal2,
  legacyNails2: nails2,
  legacyWaxing: waxing,
  legacyThreading: threading,
  legacyNewMakeup: new_makeup,
  legacyNewBridalPackage: new_bridal_package,
  legacyNewBridalMakeup: new_bridal_makeup,
};