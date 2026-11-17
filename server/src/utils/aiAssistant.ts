export function getSalonAiReply(userText: string): string {
  const query = (userText || '').trim().toLowerCase();

  // 1. TIMINGS & WORKING HOURS
  if (
    query.includes('time') ||
    query.includes('timing') ||
    query.includes('open') ||
    query.includes('close') ||
    query.includes('closing') ||
    query.includes('opening') ||
    query.includes('hours') ||
    query.includes('kab khulta') ||
    query.includes('samay') ||
    query.includes('schedule')
  ) {
    if (query.includes('friday') || query.includes('jumma') || query.includes('shukrawar')) {
      return `📌 **Friday Holiday Notice:**\nWe are officially **CLOSED on Fridays** for regular walk-ins.\n\n✨ However, for emergency bridal makeovers or urgent wedding bookings on Friday, please call or WhatsApp Tarannum Jahan directly at **+91 81715 37593** or **8077393195**!`;
    }

    return `✨ **Salon Working Hours:**\n\n• **Saturday to Thursday:** 9:00 AM – 7:00 PM\n• **Studio Service Hours:** 10:00 AM – 8:00 PM\n• **Friday:** Closed (Urgent wedding bookings available on call)\n\n📍 **Location:** Bilaspur, Near Nainital Bank, Matkhera, Rampur, UP.\n☕ Complimentary tea, coffee & snacks are provided for all guests! Would you like to book an appointment?`;
  }

  // 2. FRIDAY OFF / HOLIDAY
  if (query.includes('friday') || query.includes('holiday') || query.includes('chutti') || query.includes('closed')) {
    return `📌 **Friday Schedule:**\nThe salon is **CLOSED on Fridays**. However, we gladly accept prior bookings for bridal & wedding emergencies on Fridays! Please contact us at **+91 81715 37593**.`;
  }

  // 3. BRIDAL & RECEPTION MAKEUP
  if (
    query.includes('bridal') ||
    query.includes('dulhan') ||
    query.includes('wedding') ||
    query.includes('shadi') ||
    query.includes('shaadi') ||
    query.includes('reception')
  ) {
    return `👰 **Signature Bridal & Reception Makeup (by Tarannum Jahan):**\n\n• **Normal Bridal:** ₹15,000 (Traditional radiant glow)\n• **HD Bridal Makeup:** ₹20,000 (High-definition camera-ready finish)\n• **Silicone Bridal Makeup:** ₹30,000 (Ultra long-lasting, waterproof luxury look)\n\n✨ **What is Included:** Hair styling, jewelry setting, dupatta draping, eyelashes & premium brands (Huda Beauty, MAC, Kryolan, NARS). Duration is approximately 2.5 to 3 hours.\n\nWould you like to reserve a bridal slot online?`;
  }

  // 4. ENGAGEMENT MAKEUP
  if (query.includes('engagement') || query.includes('saghai') || query.includes('roka') || query.includes('ring ceremony')) {
    return `💍 **Engagement & Sagan Makeup Packages:**\n\n• **Normal Engagement:** ₹10,000\n• **HD Engagement:** ₹15,000\n• **Silicone Engagement:** ₹20,000\n\nIncludes complete hairstyle, draping, and customized shades tailored to your dress!`;
  }

  // 5. PARTY MAKEUP
  if (query.includes('party') || query.includes('guest') || query.includes('function') || query.includes('event')) {
    return `💄 **Party & Occasion Makeup:**\n\n• **Normal Party Makeup:** ₹2,000\n• **HD Party Makeup:** ₹3,000\n• **Silicone Party Makeup:** ₹5,000\n\nPerfect for family events, sangeet, anniversaries, and photoshoots! Quick 60–75 minute sessions.`;
  }

  // 6. HAIR SERVICES
  if (
    query.includes('hair') ||
    query.includes('spa') ||
    query.includes('keratin') ||
    query.includes('botox') ||
    query.includes('smoothening') ||
    query.includes('smoothing') ||
    query.includes('straightening') ||
    query.includes('color') ||
    query.includes('colour') ||
    query.includes('balayage') ||
    query.includes('haircut')
  ) {
    return `💇‍♀️ **Premium Hair Services:**\n\n• **Hair Styling & Blowdry:** ₹1,500\n• **Deep Conditioning Hair Spa:** ₹1,500 (10% OFF)\n• **Hair Chemical Work (Keratin, Botox, Smoothing):** Starts from ₹3,000\n• **Global Hair Color & Balayage:** Starts from ₹2,500\n\nWe use international hair care brands for silky, damage-free locks!`;
  }

  // 7. NAILS & EXTENSIONS
  if (query.includes('nail') || query.includes('extension') || query.includes('manicure') || query.includes('pedicure') || query.includes('gel')) {
    return `💅 **Luxury Nail Bar Services:**\n\n• **Nail Extensions (Both Hands):** Starts from ₹2,000 (Acrylic & Gel)\n• **Custom 3D / Floral Nail Art:** ₹800\n• **Relaxing Manicure & Pedicure Spa:** ₹1,200\n\nHigh-shine, long-lasting durability with rhinestones and pearl embellishments!`;
  }

  // 8. SKINCARE & FACIALS
  if (
    query.includes('skin') ||
    query.includes('facial') ||
    query.includes('hydra') ||
    query.includes('glow') ||
    query.includes('threading') ||
    query.includes('wax') ||
    query.includes('waxing') ||
    query.includes('massage')
  ) {
    return `✨ **Skin Care & Spa Rituals:**\n\n• **Custom Skin Treatments:** ₹500 to ₹5,000 (Targeted acne/pigmentation care)\n• **Rejuvenating Glow Facial:** ₹1,800 (10% OFF)\n• **Threading & Gentle Body Waxing:** ₹500\n• **Therapeutic Relaxing Massage:** ₹2,000 (60 mins)`;
  }

  // 9. LOCATION, ADDRESS & PARKING
  if (
    query.includes('location') ||
    query.includes('address') ||
    query.includes('where') ||
    query.includes('kahan') ||
    query.includes('kidhar') ||
    query.includes('place') ||
    query.includes('parking') ||
    query.includes('reach')
  ) {
    return `📍 **Our Location:**\n**Bilaspur, Near Nainital Bank, Matkhera, Bilaspur, Uttar Pradesh - 244921**\n\n🚗 **Parking:** Ample parking space is available for both two-wheelers and cars right outside the salon!`;
  }

  // 10. OWNER / FOUNDER
  if (query.includes('owner') || query.includes('founder') || query.includes('tarannum') || query.includes('who')) {
    return `👑 **About the Founder:**\n**The Beauty Hub** was established in June 2022 by **Tarannum Jahan**, a certified senior bridal makeup artist and beauty educator with over 6 years of expertise and 2,500+ satisfied clients!`;
  }

  // 11. ACADEMY / COURSES
  if (query.includes('course') || query.includes('academy') || query.includes('class') || query.includes('learn') || query.includes('fee')) {
    return `🎓 **The Beauty Hub Academy Programs:**\n\nWe provide professional hands-on certification courses:\n• **Master Bridal Makeup Artistry**\n• **Professional Hair Styling & Treatments**\n• **Nail Extensions & 3D Nail Art**\n• **Clinical Skin Therapy**\n\nCall **+91 81715 37593** for new batch dates & curriculum details!`;
  }

  // 12. OFFERS & DISCOUNTS
  if (query.includes('offer') || query.includes('discount') || query.includes('coupon') || query.includes('deal')) {
    return `🎁 **Special Offers & Discounts:**\n\n• **Welcome Offer:** 20% OFF on your first visit (Use code **WELCOME20**)\n• **Bridal Season Special:** Up to 40% OFF on all-inclusive bridal combos\n• Check the **Offers** section on our homepage or book an appointment online to claim your discount!`;
  }

  // 13. BOOKING / ADVANCE PAYMENT
  if (query.includes('book') || query.includes('appointment') || query.includes('slot') || query.includes('pay')) {
    return `📅 **Online Booking Process:**\n\n1. Click the **'Book Now'** button at the top right of this page.\n2. Choose your preferred service, date, and available hourly slot.\n3. Enter your contact details and confirm online!\n\nYour appointment will be confirmed instantly.`;
  }

  // 14. CONTACT & WHATSAPP
  if (query.includes('contact') || query.includes('phone') || query.includes('whatsapp') || query.includes('number')) {
    return `📞 **Get in Touch:**\n\n• **Phone / WhatsApp:** +91 81715 37593 or 8077393195\n• **Email:** tarannumjahan077@gmail.com\n• **Address:** Near Nainital Bank, Matkhera, Bilaspur, UP - 244921`;
  }

  // 15. GREETINGS
  if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('namaste')) {
    return `Hello! ✨ Welcome to **The Beauty Hub Salon & Academy** in Bilaspur. I am your 24/7 AI beauty concierge. How can I assist you today? You can ask me about our **services, pricing, bridal packages, opening hours, or location**!`;
  }

  // 16. DEFAULT HELPFUL FALLBACK
  return `Thank you for asking! ✨ At **The Beauty Hub Salon & Academy**, we specialize in Bridal & Party Makeovers, Hair Spa & Treatments, Luxury Nail Extensions, and Professional Academy Courses.\n\n📍 **Location:** Bilaspur, Near Nainital Bank, Matkhera road.\n🕒 **Timings:** Sat – Thu: 9:00 AM – 7:00 PM (Friday Closed).\n📞 **Call / WhatsApp:** +91 81715 37593`;
}
