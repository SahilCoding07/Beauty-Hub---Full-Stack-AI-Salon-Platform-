import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: (string | Option)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  name,
  required = false,
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to { value, label }
  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {name && <input type="hidden" name={name} value={value} required={required} />}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl border border-charcoal/10 dark:border-beige/30 bg-white/50 dark:bg-ink/30 px-4 py-3 text-left text-sm text-charcoal dark:text-cream transition-all duration-200 hover:border-gold/60 focus:border-gold focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? 'font-medium' : 'text-charcoal/40 dark:text-cream/40'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 z-50 max-h-60 overflow-y-auto rounded-xl border border-gold/30 bg-white/95 dark:bg-charcoal/95 p-1.5 shadow-2xl backdrop-blur-xl"
            role="listbox"
          >
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm text-left transition-all duration-150 ${
                    isSelected
                      ? 'bg-gold/15 text-gold font-semibold'
                      : 'text-charcoal/80 dark:text-cream/80 hover:bg-gold/10 hover:text-gold'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={16} className="text-gold" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
