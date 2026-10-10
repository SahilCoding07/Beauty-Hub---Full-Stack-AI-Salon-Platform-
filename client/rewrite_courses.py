import re

with open('src/components/sections/Courses.tsx', 'r') as f:
    code = f.read()

# Replace defaultCourses with the new structured data
old_default = """const defaultCourses = [
  { _id: '1', title: 'Basic Makeup Course', description: 'Learn the fundamentals of makeup application, tools, and basic party looks.', duration: '1 Month', fees: 15000 },
  { _id: '2', title: 'Advanced Bridal Course', description: 'Master HD and Airbrush makeup, intricate hairstyles, and professional bridal draping.', duration: '3 Months', fees: 45000 },
  { _id: '3', title: 'Hair & Chemical Course', description: 'Comprehensive training in rebonding, smoothening, coloring, highlights, and advanced haircuts.', duration: '2 Months', fees: 25000 },
];"""

new_default = """const defaultCourses = [
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
];"""

code = code.replace(old_default, new_default)

# Import Check circle
if 'CheckCircle2' not in code:
    code = code.replace('X } from', 'X, CheckCircle2 } from')

# Update state
old_state = "const [enrollingCourse, setEnrollingCourse] = useState<any | null>(null);"
new_state = """const [viewingCourse, setViewingCourse] = useState<any | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<any | null>(null);"""
code = code.replace(old_state, new_state)

# Replace the grid render
old_grid = """        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <motion.div
              key={course._id}
              whileHover={{ y: -5 }}
              className="luxury-card flex flex-col justify-between p-6 bg-cream/50 dark:bg-charcoal/60"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-gold">
                  {course.title}
                </h3>
                <p className="mt-3 text-sm text-charcoal/70 dark:text-cream/70">
                  {course.description}
                </p>
                <div className="mt-4">
                  <p className="text-sm">
                    Duration:
                    <span className="text-gold"> {course.duration}</span>
                  </p>
                  <p className="text-lg font-bold text-gold mt-2">
                    ₹{course.fees}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setEnrollingCourse(course); setCoupon(''); setDiscount(0); }} 
                className="btn-primary mt-6 w-full text-xs !py-2.5"
              >
                Enroll Now
              </button>
            </motion.div>
          ))}
        </div>"""

new_grid = """        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        </div>"""
        
code = code.replace(old_grid, new_grid)

# Add the viewingCourse modal
modal_code = """      <AnimatePresence>
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
      </AnimatePresence>"""

# Insert it right before the enrollingCourse modal
code = code.replace('<AnimatePresence>\n        {enrollingCourse', modal_code + '\n\n      <AnimatePresence>\n        {enrollingCourse')

with open('src/components/sections/Courses.tsx', 'w') as f:
    f.write(code)
