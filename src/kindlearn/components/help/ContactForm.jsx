import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { contactApi } from '@/kindlearn/api/contact';
import { Send, CheckCircle2, ArrowLeft } from 'lucide-react';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium','Brazil','Canada',
  'Chile','China','Colombia','Croatia','Czech Republic','Denmark','Ecuador','Egypt','Ethiopia','Finland',
  'France','Germany','Ghana','Greece','Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
  'Japan','Jordan','Kenya','South Korea','Malaysia','Mexico','Morocco','Netherlands','New Zealand','Nigeria',
  'Norway','Pakistan','Peru','Philippines','Poland','Portugal','Romania','Russia','Saudi Arabia','South Africa',
  'Spain','Sri Lanka','Sweden','Switzerland','Thailand','Turkey','Uganda','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Vietnam','Other'
];

export default function ContactForm({ prefillQuery = '', onBack }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', query: prefillQuery });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.query) { setError('Please fill in your email and query.'); return; }
    setError('');
    setSubmitting(true);
    await contactApi.send(form);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-12 px-4"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground text-sm max-w-xs mb-6">
          We've received your query and sent a confirmation to <strong>{form.email}</strong>. We'll get back to you soon! 🌟
        </p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to KindBot
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to KindBot
      </button>

      <h2 className="text-xl font-bold mb-1">Contact Us</h2>
      <p className="text-muted-foreground text-sm mb-6">Can't find your answer? Our team is happy to help.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="Your name"
              className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Email <span className="text-destructive">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+1 234 567 8901"
              className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Country</label>
            <select
              value={form.country}
              onChange={set('country')}
              className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            >
              <option value="">Select country…</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Your Query <span className="text-destructive">*</span></label>
          <textarea
            value={form.query}
            onChange={set('query')}
            placeholder="Describe your question or issue in detail…"
            required
            rows={4}
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
          />
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full h-11 rounded-xl font-semibold">
          {submitting ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</span>
          ) : (
            <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Send Message</span>
          )}
        </Button>
      </form>
    </div>
  );
}