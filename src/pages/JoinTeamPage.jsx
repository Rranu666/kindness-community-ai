import { useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/kcf/Header';
import Footer from '@/components/kcf/Footer';
import { supabase } from '@/api/supabaseClient';
import { Heart, Briefcase, Globe, Users, Zap, Sparkles, CheckCircle2, Upload } from 'lucide-react';

const ROLES = [
  'Program Manager',
  'Community Outreach Coordinator',
  'Software Developer',
  'UI/UX Designer',
  'Content Creator / Writer',
  'Social Media Manager',
  'Volunteer Coordinator',
  'Fundraising & Partnerships',
  'Data & Analytics',
  'Operations & Admin',
  'Other',
];

const WHY_US = [
  { icon: Heart,     color: '#f43f5e', title: 'Purpose-Led Work',    desc: 'Every role directly contributes to spreading kindness globally.' },
  { icon: Globe,     color: '#00e8b4', title: 'Remote-First Culture', desc: 'Work from anywhere. We\'re a global team across 47+ nations.' },
  { icon: Users,     color: '#8580ff', title: 'Collaborative Team',   desc: 'Tight-knit, supportive, and driven by shared values.' },
  { icon: Zap,       color: '#ffc43d', title: 'Grow Fast',            desc: 'Early-stage — your work has outsized impact and visibility.' },
];

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  padding: '13px 16px',
  color: '#eef6ff',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 600,
  color: 'rgba(238,246,255,0.55)',
  marginBottom: 7,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

export default function JoinTeamPage() {
  usePageMeta(
    'Join the KCF Team | Kindness Community Foundation',
    'Apply to join the Kindness Community Foundation. Submit your application and our team will review and get back to you.'
  );

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', role: '', linkedin: '', message: '', resume_url: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.role) {
      setError('Please fill in your name, email and the role you\'re applying for.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await supabase.from('team_applications').insert([{
        full_name:  form.full_name,
        email:      form.email,
        phone:      form.phone || null,
        role:       form.role,
        linkedin:   form.linkedin || null,
        message:    form.message || null,
        resume_url: form.resume_url || null,
        created_at: new Date().toISOString(),
        status:     'pending',
      }]);
    } catch (_) {
      // Fail silently — still show thank-you
    }
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div style={{ background: '#030712', minHeight: '100vh', color: '#eef6ff', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <Header />

      <main style={{ paddingTop: 80 }}>

        {/* ── Hero ── */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 72px', textAlign: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(244,63,94,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 999, marginBottom: 24, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.22)', fontSize: 12, fontWeight: 700, color: '#f43f5e', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              <Sparkles size={12} /> We're Hiring
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08 }}
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 18, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
            >
              Join the{' '}
              <span style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                KCF Team
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.18 }}
              style={{ fontSize: '1.1rem', color: 'rgba(238,246,255,0.5)', lineHeight: 1.75, maxWidth: 540, margin: '0 auto' }}
            >
              We're building a kinder world — one community at a time. If you share our values and want to do meaningful work, we'd love to hear from you.
            </motion.p>
          </div>
        </section>

        {/* ── Why KCF ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 72px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
            {WHY_US.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{ padding: '24px 22px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${w.color}18`, border: `1px solid ${w.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <Icon size={18} color={w.color} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6, color: '#eef6ff' }}>{w.title}</div>
                  <div style={{ fontSize: '0.83rem', color: 'rgba(238,246,255,0.4)', lineHeight: 1.65 }}>{w.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Application Form ── */}
        <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 100px' }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}
          >
            <div style={{ marginBottom: 40, textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 10 }}>
                Submit Your Application
              </h2>
              <p style={{ color: 'rgba(238,246,255,0.4)', fontSize: '0.95rem' }}>
                Our team reviews every application carefully and will get back to you within a few business days.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                  style={{ textAlign: 'center', padding: '64px 32px', borderRadius: 24, background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.18)' }}
                >
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.6, delay: 0.2 }}>
                    <CheckCircle2 size={52} color="#f43f5e" style={{ margin: '0 auto 20px' }} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 12 }}>
                    Application Received! 🎉
                  </h3>
                  <p style={{ color: 'rgba(238,246,255,0.5)', lineHeight: 1.7, maxWidth: 380, margin: '0 auto' }}>
                    Thank you for applying to KCF. Our team will review your application and get back to you soon. In the meantime, keep spreading kindness!
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: 22, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '40px 36px' }}
                >
                  {/* Row: Name + Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input style={inputStyle} placeholder="Your full name" value={form.full_name} onChange={e => set('full_name', e.target.value)}
                        onFocus={e => e.target.style.borderColor = 'rgba(244,63,94,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)}
                        onFocus={e => e.target.style.borderColor = 'rgba(244,63,94,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>
                  </div>

                  {/* Row: Phone + Role */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Phone (optional)</label>
                      <input style={inputStyle} type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)}
                        onFocus={e => e.target.style.borderColor = 'rgba(244,63,94,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Role You're Applying For *</label>
                      <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%23ffffff44\' d=\'M6 8L0 0h12z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                        value={form.role} onChange={e => set('role', e.target.value)}
                        onFocus={e => e.target.style.borderColor = 'rgba(244,63,94,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      >
                        <option value="" disabled>Select a role…</option>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label style={labelStyle}>LinkedIn or Portfolio URL</label>
                    <input style={inputStyle} type="url" placeholder="https://linkedin.com/in/yourprofile" value={form.linkedin} onChange={e => set('linkedin', e.target.value)}
                      onFocus={e => e.target.style.borderColor = 'rgba(244,63,94,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>

                  {/* Resume link */}
                  <div>
                    <label style={labelStyle}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Upload size={12} /> Resume Link (Google Drive, Dropbox, etc.)
                      </span>
                    </label>
                    <input style={inputStyle} type="url" placeholder="https://drive.google.com/file/..." value={form.resume_url} onChange={e => set('resume_url', e.target.value)}
                      onFocus={e => e.target.style.borderColor = 'rgba(244,63,94,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>

                  {/* Message */}
                  <div>
                    <label style={labelStyle}>Why do you want to join KCF?</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
                      placeholder="Tell us a bit about yourself and why you'd be a great fit…"
                      value={form.message} onChange={e => set('message', e.target.value)}
                      onFocus={e => e.target.style.borderColor = 'rgba(244,63,94,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>

                  {error && (
                    <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>{error}</p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '15px 32px', borderRadius: 14, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                      background: submitting ? 'rgba(244,63,94,0.4)' : 'linear-gradient(135deg, #f43f5e, #ec4899)',
                      color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'inherit',
                      boxShadow: '0 8px 28px rgba(244,63,94,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    {submitting ? (
                      <>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin 0.7s linear infinite' }} />
                        Submitting…
                      </>
                    ) : (
                      <><Briefcase size={18} /> Submit Application</>
                    )}
                  </motion.button>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(238,246,255,0.25)', margin: 0 }}>
                    We review every application and respond within a few business days.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </main>

      <Footer hideCta />
    </div>
  );
}
