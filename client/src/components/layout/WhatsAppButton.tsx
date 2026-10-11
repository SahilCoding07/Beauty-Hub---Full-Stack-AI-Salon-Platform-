import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { SALON } from '../../data/constants';

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${SALON.whatsapp}?text=Hi! I'd like to book an appointment at The Beauty Hub Salon.`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring' }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3 sm:px-5 sm:py-3.5 text-white shadow-lg shadow-[#25D366]/30 transition-shadow hover:shadow-xl"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} />
      <span className="hidden text-sm font-medium sm:inline">Chat on WhatsApp</span>
    </motion.a>
  );
}
