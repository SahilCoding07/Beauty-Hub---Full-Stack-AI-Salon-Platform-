import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppButton from '../components/layout/WhatsAppButton';
import Hero from '../components/sections/Hero';
import Marquee from '../components/sections/Marquee';
import About from '../components/sections/About';
import Offers from '../components/sections/Offers';
import Courses from '../components/sections/Courses';
import Services from '../components/sections/Services';
import BeforeAfter from '../components/sections/BeforeAfter';
import Gallery from '../components/sections/Gallery';
import Testimonials from '../components/sections/Testimonials';
import Booking from '../components/sections/Booking';
import Contact from '../components/sections/Contact';
import Reviews from '../components/sections/Reviews';

export default function HomePage() {
  return (
    <div className="min-h-screen dark:bg-ink dark:text-cream">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Offers />
        <Services />
        <Courses />
        <BeforeAfter />
        <Gallery />
        <Testimonials />
        <Booking />
        <Contact />
        <Reviews />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
