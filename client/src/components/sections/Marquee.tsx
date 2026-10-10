const services = [
  'Hair Styling', 'Hair Spa', 'Makeup', 'Bridal Packages', 'Nails', 'Facials',
  'Massage', 'Waxing', 'Hair Coloring', 'Skin Care', 'Nail Extensions',
  'Groom Packages', 'Party Packages', 'Academy Courses',
];

export default function Marquee() {
  const items = [...services, ...services];

  return (
    <div className="overflow-hidden border-y border-gold/20 bg-charcoal py-4 dark:bg-ink">
      <div className="animate-marquee flex whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="mx-8 text-sm uppercase tracking-[0.2em] text-gold/80">
            ✦ {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
