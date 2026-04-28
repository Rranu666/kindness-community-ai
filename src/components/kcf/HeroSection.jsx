/**
 * HeroSection — Centered light-theme hero
 * Matches copy-of-kindness-community-foundation.base44.app design:
 * • Warm #f0f0ef background + subtle grid overlay
 * • Top-right rose glow accent
 * • Centered large headline with rose accent line
 * • Tags row, black primary CTA + outlined secondary
 * • Stats row, marquee ticker
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Marquee ─────────────────────────────────────────────────────────────── */
const MARQUEE = [
  'KindWave — Live Now','Serve — Join Today','KindLearn — Coming Soon',
  'KindCalmUnity — Coming Soon','47+ Countries','12K+ Lives Impacted',
  '100% Free Access','Contribution-Based Model','Founded 2026','US Nonprofit',
];

/* ─── Tags ────────────────────────────────────────────────────────────────── */
const TAGS = [
  'Volunteering','Free Learning','Mental Wellness','Personal Growth',
  'Community','Global Impact','Career Tools','AI-Powered',
];

/* ─── Cycling kinetic word ────────────────────────────────────────────────── */
const CYCLE_WORDS = ['Communities', 'Futures', 'Ecosystems', 'Movements', 'Legacies'];

function KineticWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % CYCLE_WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      key={idx}
      className="kcf-cycle-word"
      style={{ color: '#f43f5e', display: 'inline' }}
    >
      {CYCLE_WORDS[idx]}
    </span>
  );
}

/* ─── Animated counter ────────────────────────────────────────────────────── */
function Counter({ end, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      ob.disconnect();
      const s = Date.now();
      const dur = 1800;
      const tick = () => {
        const p = Math.min((Date.now() - s) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        setVal(Math.round(ease * end));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [end]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Stats ───────────────────────────────────────────────────────────────── */
const STATS = [
  { value: 12,  suffix: 'K+', label: 'Lives Impacted'        },
  { value: 47,  suffix: '+',  label: 'Countries'             },
  { value: 6,   suffix: '+',  label: 'Active Programs'       },
  { value: 100, suffix: '%',  label: 'Free Access'           },
];

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function HeroSection() {
  const navigate = useNavigate();

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section
        id="home"
        style={{
          position: 'relative',
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#f0f0ef',
        }}
      >
        {/* Grid overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            pointerEvents: 'none',
            opacity: 0.04,
            backgroundImage:
              'linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Top-right rose glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, right: 0,
            width: 600, height: 600,
            borderRadius: '50%',
            pointerEvents: 'none',
            background: 'radial-gradient(circle at 100% 0%, rgba(244,63,94,0.09) 0%, transparent 65%)',
          }}
        />

        {/* ── Main content ── */}
        <div
          style={{
            position: 'relative', zIndex: 10,
            maxWidth: 900,
            width: '100%',
            margin: '0 auto',
            padding: 'clamp(7rem,14vw,11rem) 1.5rem clamp(3rem,6vw,5rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0.45rem 1.1rem',
              borderRadius: 999,
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              marginBottom: '1.8rem',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f43f5e', flexShrink: 0 }} />
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'rgba(0,0,0,0.55)',
            }}>
              A Contribution-Based Human Growth System
            </span>
          </div>

          {/* Headline */}
          <h1
            className="kcf-hero-h1"
            style={{
              fontSize: 'clamp(2.6rem, 7vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.03,
              letterSpacing: '-0.025em',
              color: '#0d0d0d',
              margin: '0 0 1.4rem',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Building Sustainable<br />
            <KineticWord /><br />
            for Lasting Impact
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)',
              color: 'rgba(0,0,0,0.48)',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 0 1.6rem',
            }}
          >
            A unified ecosystem for learning, volunteering, mental wellbeing, and life tools —
            built around contribution, not access barriers.
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: '1.8rem' }}>
            {TAGS.map(tag => (
              <span
                key={tag}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 999,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  color: 'rgba(0,0,0,0.5)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: '2.4rem' }}>
            <button
              onClick={() => navigate('/volunteer')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '0.8rem 1.8rem',
                borderRadius: 999,
                background: 'linear-gradient(135deg,#f43f5e,#ec4899)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Volunteer With Us →
            </button>
            <button
              onClick={() => navigate('/hub')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '0.8rem 1.8rem',
                borderRadius: 999,
                background: 'rgba(0,0,0,0.08)',
                color: '#0d0d0d',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: '1.5px solid rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Explore Team Portal ↗
            </button>
          </div>

          {/* Trust line */}
          <p style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.35)', marginBottom: '2rem', fontWeight: 500 }}>
            47+ countries • 12K+ lives impacted • 100% free
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 0,
            justifyContent: 'center',
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}>
            {STATS.map(({ value, suffix, label }, i) => (
              <div
                key={label}
                style={{
                  padding: '1.2rem 2rem',
                  borderRight: i < STATS.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  minWidth: 110,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: '#0d0d0d', lineHeight: 1 }}>
                  <Counter end={value} suffix={suffix} />
                </div>
                <div style={{
                  fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'rgba(0,0,0,0.38)', marginTop: 4,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll arrow */}
        <button
          className="kcf-scroll-arrow"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          style={{
            position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 20,
            background: '#0d0d0d',
            border: 'none', cursor: 'pointer',
            width: 40, height: 40, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Scroll down"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </section>

      {/* ══ Marquee ticker ════════════════════════════════════════════════ */}
      <div style={{
        background: '#f0f0ef',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        overflow: 'hidden',
        padding: '0.8rem 0',
        position: 'relative', zIndex: 10,
      }}>
        <div className="kcf-marquee-track">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '1rem',
              margin: '0 1rem',
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)',
              whiteSpace: 'nowrap',
            }}>
              {item}
              <span style={{ color: 'rgba(244,63,94,0.5)' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ Styles ════════════════════════════════════════════════════════ */}
      <style>{`
        @media (max-width: 640px) {
          .kcf-hero-h1 { font-size: clamp(2.2rem, 9vw, 3rem) !important; }
        }

        @keyframes kcf-cycle-word {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kcf-cycle-word {
          animation: kcf-cycle-word 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          display: inline-block;
        }

        @keyframes kcf-arrow-pulse {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.8; }
          50%       { transform: translateX(-50%) translateY(5px); opacity: 1; }
        }
        .kcf-scroll-arrow {
          animation: kcf-arrow-pulse 2s ease-in-out infinite !important;
        }

        .kcf-marquee-track {
          display: flex;
          white-space: nowrap;
          animation: kcf-marquee 32s linear infinite;
        }
        @keyframes kcf-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </>
  );
}
