import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: 'Hi there! I am the Beauty Hub Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I cannot connect to the server right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gold text-ink shadow-lg shadow-gold/30 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-6 sm:left-6 z-50 flex h-[78vh] sm:h-[500px] max-h-[560px] w-auto sm:w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-charcoal border border-gold/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gold p-4 text-ink">
              <div className="flex items-center gap-2 font-semibold">
                <Bot size={20} />
                Beauty Hub AI
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-black/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-ink/5 dark:bg-transparent">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold"><Bot size={16} /></div>}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-gold text-ink rounded-br-none' : 'bg-white dark:bg-ink/50 text-charcoal dark:text-cream rounded-bl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                  {msg.role === 'user' && <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-ink"><User size={16} /></div>}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-2">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold"><Bot size={16} /></div>
                  <div className="bg-white dark:bg-ink/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="border-t border-gold/10 bg-white dark:bg-charcoal p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our services..."
                className="flex-1 rounded-full bg-ink/5 dark:bg-ink/50 px-4 py-2 text-sm text-charcoal dark:text-cream focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink disabled:opacity-50 transition-colors"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
