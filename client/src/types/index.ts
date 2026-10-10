export type ServiceCategory =
  | 'Hair'
  | 'Makeup'
  | 'Nails'
  | 'Skin & Body'
  | 'Bridal Packages'
  | 'Groom Packages'
  | 'Party Packages'
  | 'Academy';

export interface Service {
  _id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  duration: number;
  price: number;
  discount?: number;
  image: string;
  isActive: boolean;
}

export interface Staff {
  _id: string;
  name: string;
  role: string;
  image?: string;
  isActive: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  _id: string;
  service: Service | string;
  staff?: Staff | string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  advanceAmount: number;
  totalAmount: number;
  paymentId?: string;
  createdAt: string;
}

export interface Offer {
  _id: string;
  title: string;
  description: string;
  discount: number;
  code?: string;
  validUntil: string;
  category?: string;
  isActive: boolean;
  image?: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  rating: number;
  review: string;
  service?: string;
  image?: string;
  isApproved: boolean;
}

export interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  image: string;
  type: 'image' | 'video';
  isBeforeAfter?: boolean;
  beforeImage?: string;
  afterImage?: string;
}

export interface SiteSettings {
  salonName: string;
  ownerName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  whatsapp: string;
  workingHours: {
    weekdays: string;
    sunday: string;
  };
  heroImage: string;
  ownerImage: string;
  stats: {
    happyClients: number;
    yearsExperience: number;
    experts: number;
  };
}

export interface ReviewSubmission {
  name: string;
  rating: number;
  review: string;
  service: string;
  email?: string;
}
