import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { getApiBaseUrl } from '../../api/config';
import { getOfflineAiReply } from '../../utils/aiAssistant';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    {
      role: 'bot',
      text: 'Hi there! ✨ I am the Beauty Hub AI Assistant. How can I help you today? You can ask about our services, bridal packages, opening hours, or location!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    const apiBase = getApiBaseUrl();
    const endpoint = apiBase.endsWith('/api') ? `${apiBase}/chat` : `${apiBase}/api/chat`;

    let reply = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast response

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply && typeof data.reply === 'string' && !data.reply.includes('Cannot connect')) {
          reply = data.reply;
        }
      }
    } catch {
      // Backend is sleeping/cold-starting, offline, or network timed out
    }

    // If server didn't respond or timed out, use the intelligent built-in domain reasoning engine
    if (!reply) {
      reply = getOfflineAiReply(userMessage);
    }

    setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    setIsLoading(false);
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
        className={`fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gold text-ink shadow-lg shadow-gold/30 ${
          isOpen ? 'hidden' : 'flex'
        }`}
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
                <span>Beauty Hub AI</span>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-ink/10 px-2 py-0.5 rounded-full">
                  <Sparkles size={11} /> 24/7 Live
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-black/10 transition-colors"
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-ink/5 dark:bg-transparent text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                      <Bot size={16} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 whitespace-pre-line leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gold text-ink font-medium rounded-br-none'
                        : 'bg-white dark:bg-ink/60 text-charcoal dark:text-cream rounded-bl-none shadow-sm border border-gold/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === 'user' && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-2">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white dark:bg-ink/60 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gold/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-gold rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gold rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="border-t border-gold/15 bg-white dark:bg-charcoal p-3 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about hours, bridal, prices..."
                className="flex-1 rounded-full bg-ink/5 dark:bg-ink/50 px-4 py-2 text-sm text-charcoal dark:text-cream focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                aria-label="Send Message"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
