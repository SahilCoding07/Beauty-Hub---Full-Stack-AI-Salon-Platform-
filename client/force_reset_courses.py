import re

with open('src/api/mockDb.ts', 'r') as f:
    code = f.read()

# Add a force reset for courses
reset_logic = """
setTimeout(async () => {
  const currentServices = await mockDb.get('services');
  if (currentServices.length > -1) {  // FORCE RESET SERVICES
    await mockDb.set('services', DEFAULT_SERVICES.map((s, i) => ({ _id: String(i), ...s, isActive: true })));
  }
  
  // FORCE RESET COURSES
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
"""

old_reset_logic = """setTimeout(async () => {
  const currentServices = await mockDb.get('services');
  if (currentServices.length > -1) {  // FORCE RESET SERVICES
    await mockDb.set('services', DEFAULT_SERVICES.map((s, i) => ({ _id: String(i), ...s, isActive: true })));
  }"""

code = code.replace(old_reset_logic, reset_logic)

with open('src/api/mockDb.ts', 'w') as f:
    f.write(code)
