
import { DEFAULT_SERVICES } from '../data/constants';


export const mockDb = {
  get: async (collection: string): Promise<any[]> => {
    try {
      const res = await fetch(`/api/db/${collection}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('MongoDB Get Error', e);
      return [];
    }
  },
  set: async (collection: string, data: any): Promise<boolean> => {
    try {
      await fetch(`/api/db/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return true;
    } catch (e) {
      console.error('MongoDB Set Error', e);
      return false;
    }
  },
  add: async (collection: string, item: any) => {
    const data = await mockDb.get(collection);
    const newItem = { ...item, _id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    await mockDb.set(collection, [...data, newItem]);
    return newItem;
  },
  update: async (collection: string, id: string, updates: any) => {
    const data = await mockDb.get(collection);
    const index = data.findIndex((i: any) => i._id === id);
    if (index > -1) {
      data[index] = { ...data[index], ...updates };
      await mockDb.set(collection, data);
      return data[index];
    }
    return null;
  },
  remove: async (collection: string, id: string) => {
    const data = await mockDb.get(collection);
    await mockDb.set(collection, data.filter((i: any) => i._id !== id));
    return true;
  }
};


setTimeout(async () => {
  const currentServices = await mockDb.get('services');
  if (currentServices.length === 0) {
    await mockDb.set('services', DEFAULT_SERVICES.map((s, i) => ({ _id: String(i), ...s, isActive: true })));
  }
  
  const currentCourses = await mockDb.get('courses');
  if (currentCourses.length === 0) {
    await mockDb.set('courses', [
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
  ]);
  }

  const currentTestimonials = await mockDb.get('testimonials');
  if (currentTestimonials.length === 0) {
    await mockDb.set('testimonials', [
      { _id: '1', name: 'Ananya Singh', rating: 5, review: 'My bridal makeup was absolutely stunning!', service: 'Bridal Makeup', isApproved: true },
      { _id: '2', name: 'Riya Patel', rating: 5, review: 'Best salon in Rampur! The hair coloring turned out exactly as I envisioned.', service: 'Hair Coloring', isApproved: true }
    ]);
  }
}, 500);
