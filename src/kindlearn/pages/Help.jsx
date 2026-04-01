import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '@/kindlearn/api/client';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, HelpCircle } from 'lucide-react';
import Navbar from '@/kindlearn/components/landing/Navbar';
import ContactForm from '@/kindlearn/components/help/ContactForm';

const SUGGESTED_QUESTIONS = [
  'How do I start the 30-day challenge?',
  'How does the streak system work?',
  'What badges can I earn?',
  'How does the Kids Zone work?',
  'How do I track my progress?',
  'What languages are available?',
];

const BOT_AVATAR = (
  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-primary/20">
    <Sparkles className="w-4 h-4 text-primary-foreground" />
  </div>
);

export default function Help() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactPrefill, setContactPrefill] = useState('');
  const [initiated, setInitiated] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setInput('');
    setInitiated(true);

    const userMsg = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await client.post('/api/chat', { message: trimmed });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble responding right now. Please use the Contact Us form for help."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleContactUs = (lastUserQuery = '') => {
    setContactPrefill(lastUserQuery);
    setShowContact(true);
  };

  const lastUserMessage = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';

  if (showContact) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-start justify-center px-4 py-10">
          <div className="w-full max-w-2xl bg-card rounded-3xl border shadow-xl overflow-hidden">
            <ContactForm prefillQuery={contactPrefill} onBack={() => setShowContact(false)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center px-4 pt-20 pb-6">
        <div className="w-full max-w-2xl flex flex-col flex-1">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-extrabold mb-1">KindBot</h1>
            <p className="text-muted-foreground text-sm">Your AI helper for everything KindLearn ✨</p>
          </motion.div>

          <div className="flex-1 bg-card rounded-3xl border shadow-sm overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[360px] max-h-[50vh]">

              {!initiated && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  {BOT_AVATAR}
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                    <p className="text-sm leading-relaxed">
                      Hi! I'm <strong>KindBot</strong> 👋 I can help you with anything about KindLearn — lessons, streaks, badges, the Kids Zone, and more. What would you like to know?
                    </p>
                  </div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && BOT_AVATAR}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-secondary rounded-tl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  {BOT_AVATAR}
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {!initiated && (
              <div className="px-5 pb-3">
                <p className="text-xs text-muted-foreground font-medium mb-2">Suggested questions</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs bg-secondary hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 text-foreground rounded-full px-3 py-1.5 transition-all font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {initiated && !loading && messages.length > 1 && (
              <div className="px-5 pb-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Still need help?</p>
                <button
                  onClick={() => handleContactUs(lastUserMessage)}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Contact Us
                </button>
              </div>
            )}

            <div className="border-t px-4 py-3 flex gap-3 items-end bg-card">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask KindBot anything…"
                className="flex-1 resize-none rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition max-h-28"
              />
              <Button
                size="icon"
                disabled={loading || !input.trim()}
                onClick={() => sendMessage()}
                className="rounded-xl h-10 w-10 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Prefer to reach us directly?{' '}
            <button onClick={() => handleContactUs('')} className="text-primary font-semibold hover:underline">
              Submit a support request
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
