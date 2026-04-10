/**
 * HeroSection — Futuristic depth-map hero
 * Exact visual replica of larsen66/hero-futuristic:
 *  • Pre-rendered 3D blob image + depth map
 *  • Cell-noise (Worley) dot overlay that follows depth scan
 *  • Red glow scan line synced to shader progress
 *  • Depth-based mouse parallax
 *  • Word-by-word title reveal + subtitle fade
 *  • "Scroll to explore" bouncing button
 * Implemented with vanilla Three.js WebGL (no R3F needed)
 */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

/* ─── Textures ────────────────────────────────────────────────────────────── */
const TEXTURE_URL = 'https://i.postimg.cc/XYwvXN8D/img-4.png';
const DEPTH_URL   = 'https://i.postimg.cc/2SHKQh2q/raw-4.webp';

/* ─── Marquee ─────────────────────────────────────────────────────────────── */
const MARQUEE = [
  'Community Infrastructure','Ethical Technology','Volunteer Networks',
  'Transparent Governance','Sustainable Impact','AI-Accelerated Kindness',
  '47+ Nations','Revenue-Backed Model','Founded 2026','California Nonprofit',
];

/* ─── GLSL: Worley cell noise ─────────────────────────────────────────────── */
const WORLEY_GLSL = /* glsl */`
float hash21(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}
float cellNoise(vec2 uv) {
  vec2 i = floor(uv);
  vec2 f = fract(uv);
  float minD = 1.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 nb = vec2(float(x), float(y));
      vec2 pt = fract(vec2(hash21(i + nb), hash21(i + nb + 31.41)));
      float d = length(nb + pt - f);
      minD = min(minD, d);
    }
  }
  return minD;
}
`;

/* ─── Vertex shader ───────────────────────────────────────────────────────── */
const VERT = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

/* ─── Fragment shader ─────────────────────────────────────────────────────── */
const FRAG = /* glsl */`
${WORLEY_GLSL}

uniform sampler2D uMap;
uniform sampler2D uDepth;
uniform float     uProgress;   /* 0‒1 scan position */
uniform vec2      uPointer;    /* normalised mouse */
uniform float     uAspect;
uniform float     uOpacity;

varying vec2 vUv;

/* Screen blend */
vec3 screen(vec3 a, vec3 b) { return 1.0 - (1.0 - a) * (1.0 - b); }

void main() {
  /* depth parallax */
  float dep  = texture2D(uDepth, vUv).r;
  vec2  pUv  = vUv + dep * uPointer * 0.01;
  vec4  col  = texture2D(uMap, pUv);

  /* cell‑noise dot grid */
  vec2  tUv    = vec2(vUv.x * uAspect, vUv.y);
  float tiling = 120.0;
  vec2  tiledUv = mod(tUv * tiling, 2.0) - 1.0;
  float bright  = cellNoise(tUv * tiling / 2.0);
  float dist    = length(tiledUv);
  float dotMask = smoothstep(0.50, 0.49, dist) * bright;

  /* depth scan flow */
  float flow = 1.0 - smoothstep(0.0, 0.02, abs(dep - uProgress));

  /* red dot mask */
  vec3 mask = dotMask * flow * vec3(10.0, 0.0, 0.0);

  /* screen blend image + dots */
  vec3 final = screen(col.rgb, mask);

  gl_FragColor = vec4(final, col.a * uOpacity);
}`;

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
      style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg,#f43f5e 0%,#ec4899 50%,#f97316 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
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
      const dur = 2000;
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

/* ─── Stats data ──────────────────────────────────────────────────────────── */
const STATS = [
  { value: 6,   suffix: '+',  label: 'Strategic Initiatives' },
  { value: 47,  suffix: '+',  label: 'Nations Reached'       },
  { value: 100, suffix: '%',  label: 'Revenue-Backed'        },
  { value: 12,  suffix: 'K+', label: 'Lives Impacted'        },
];

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function HeroSection() {
  const navigate    = useNavigate();
  const canvasRef   = useRef(null);
  const scanLineRef = useRef(null);
  const opacityRef  = useRef(0);

  /* ── 3-phase word-by-word reveal ──
     Phase 1: reveal titleWords one by one (600ms each)
     Phase 2: show KineticWord line after all line-1 words are visible
     Phase 3: reveal titleWords2 one by one (500ms each)
     Phase 4: show description + CTA + stats
  */
  const titleWords  = ['Building', 'Sustainable'];
  const titleWords2 = ['for', 'Lasting', 'Impact'];

  const [visibleWords,    setVisibleWords]    = useState(0);
  const [showCycle,       setShowCycle]       = useState(false);
  const [visibleWords2,   setVisibleWords2]   = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  /* Phase 1 — reveal line-1 words */
  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const t = setTimeout(() => setVisibleWords(v => v + 1), 600);
      return () => clearTimeout(t);
    }
    /* Phase 2 — show KineticWord */
    const t = setTimeout(() => setShowCycle(true), 300);
    return () => clearTimeout(t);
  }, [visibleWords]);

  /* Phase 3 — reveal line-3 words after KineticWord appears */
  useEffect(() => {
    if (!showCycle) return;
    if (visibleWords2 < titleWords2.length) {
      const t = setTimeout(() => setVisibleWords2(v => v + 1), 500);
      return () => clearTimeout(t);
    }
    /* Phase 4 — show description / CTA / stats */
    const t = setTimeout(() => setSubtitleVisible(true), 400);
    return () => clearTimeout(t);
  }, [showCycle, visibleWords2]);

  /* ── Three.js scene ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const aspect = window.innerWidth / window.innerHeight;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uMap:      { value: null },
        uDepth:    { value: null },
        uProgress: { value: 0 },
        uPointer:  { value: new THREE.Vector2(0, 0) },
        uAspect:   { value: aspect },
        uOpacity:  { value: 0 },
      },
      vertexShader:   VERT,
      fragmentShader: FRAG,
      transparent: true,
    });

    /* plane sized to preserve blob image aspect (1:1) */
    const planeAspect = 1.0;
    let planeW, planeH;
    if (aspect >= planeAspect) {
      planeH = 1.0;
      planeW = planeAspect / aspect;
    } else {
      planeW = 1.0;
      planeH = aspect / planeAspect;
    }
    const scaleFactor = 0.82;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeW * scaleFactor * 2, planeH * scaleFactor * 2),
      mat,
    );
    scene.add(mesh);

    /* load textures */
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(TEXTURE_URL, t => { t.colorSpace = THREE.SRGBColorSpace; mat.uniforms.uMap.value = t; });
    loader.load(DEPTH_URL,   t => { mat.uniforms.uDepth.value = t; });

    /* mouse */
    let px = 0, py = 0;
    const onMM = (e) => {
      px = (e.clientX / window.innerWidth  - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMM, { passive: true });

    /* animate */
    let animId;
    const clock = new THREE.Clock();
    const tick = () => {
      animId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      const progress = Math.sin(t * 0.5) * 0.5 + 0.5;
      mat.uniforms.uProgress.value = progress;

      mat.uniforms.uPointer.value.x += (px - mat.uniforms.uPointer.value.x) * 0.08;
      mat.uniforms.uPointer.value.y += (py - mat.uniforms.uPointer.value.y) * 0.08;

      if (mat.uniforms.uMap.value && mat.uniforms.uDepth.value) {
        opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 1, 0.07);
        mat.uniforms.uOpacity.value = opacityRef.current;
      }

      /* sync red scan line DOM element */
      if (scanLineRef.current) {
        const pct = progress * 100;
        scanLineRef.current.style.top = `${pct}%`;
        const glow = Math.max(0, Math.sin(progress * Math.PI));
        scanLineRef.current.style.opacity = (0.5 + glow * 0.5).toString();
      }

      renderer.render(scene, camera);
    };
    tick();

    /* resize */
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      mat.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);


  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <div style={{ height: '100svh', position: 'relative', background: '#000', overflow: 'hidden' }}>

        {/* Three.js canvas */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}
        />

        {/* Red scan line — synced to shader progress via DOM ref */}
        <div
          ref={scanLineRef}
          style={{
            position: 'absolute', left: 0, right: 0,
            height: 2, zIndex: 15, pointerEvents: 'none',
            background: 'linear-gradient(90deg,transparent 0%,rgba(239,68,68,0.9) 20%,#ef4444 50%,rgba(239,68,68,0.9) 80%,transparent 100%)',
            boxShadow: '0 0 12px 4px rgba(239,68,68,0.6), 0 0 40px 10px rgba(239,68,68,0.25)',
            transform: 'translateY(-50%)',
          }}
        />

        {/* ── Text overlay ── */}
        <div
          className="kcf-hero-text"
          style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: 'clamp(4.5rem,8vw,6rem) clamp(1.5rem,5vw,3rem) clamp(4rem,6vw,5rem)',
            pointerEvents: 'none',
            maxWidth: 860,
          }}
        >
          {/* Badge */}
          <div
            className="kcf-badge-in"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#f43f5e', display: 'inline-block',
              }} />
              <span className="kcf-ping" />
            </span>
            <span style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
            }}>
              Building the Future of Kindness
            </span>
          </div>

          {/* ── Headline 3-line ── */}
          <div className="kcf-headline" style={{
            fontSize: 'clamp(1.45rem,4vw,4rem)',
            fontWeight: 900, lineHeight: 1.05,
            fontFamily: "'Inter',system-ui,sans-serif",
          }}>

            {/* Line 1: Building Sustainable */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2em', color: '#fff', overflow: 'hidden' }}>
              {titleWords.map((word, i) => (
                <span
                  key={i}
                  className={i < visibleWords ? 'kcf-word-in' : ''}
                  style={{
                    display: 'inline-block',
                    animationDelay: `${i * 0.13}s`,
                    opacity: i < visibleWords ? undefined : 0,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Line 2: KineticWord (cycling) */}
            <div style={{
              overflow: 'hidden', lineHeight: 1.1,
              opacity: showCycle ? 1 : 0,
              transform: showCycle ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)',
            }}>
              {showCycle && <KineticWord />}
            </div>

            {/* Line 3: for Lasting Impact */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2em', color: '#fff', overflow: 'hidden' }}>
              {titleWords2.map((word, i) => (
                <span
                  key={i}
                  className={i < visibleWords2 ? 'kcf-word-in' : ''}
                  style={{
                    display: 'inline-block',
                    animationDelay: `${i * 0.13}s`,
                    opacity: i < visibleWords2 ? undefined : 0,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* ── Description ── */}
          <div style={{
            marginTop: '0.6rem',
            opacity: subtitleVisible ? 1 : 0,
            transform: subtitleVisible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
            maxWidth: 540,
          }}>
            <p className="kcf-desc" style={{
              fontSize: 'clamp(0.85rem,1.6vw,1.05rem)',
              color: 'rgba(255,255,255,0.62)',
              lineHeight: 1.6,
              fontWeight: 400,
              margin: 0,
            }}>
              Kindness Community Foundation reinventing giving through kindness and helping others,
              empowering communities with technology, ethical commerce, and structured opportunities
              to amplify humanity.
            </p>
          </div>

          {/* ── CTA Buttons ── */}
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.6rem',
              marginTop: '0.85rem', pointerEvents: 'auto',
              opacity: subtitleVisible ? 1 : 0,
              transform: subtitleVisible ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s',
            }}
          >
            <button
              onClick={() => navigate('/volunteer')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.7rem 1.5rem', borderRadius: 999,
                background: 'linear-gradient(135deg,#f43f5e,#ec4899)',
                color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Volunteer With Us →
            </button>
            <button
              onClick={() => navigate('/hub')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.7rem 1.5rem', borderRadius: 999,
                background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)',
                color: '#fff', fontWeight: 600, fontSize: '0.875rem',
                border: '1.5px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
            >
              Explore Team Portal ↗
            </button>
          </div>

          {/* ── Stats ── */}
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.65rem',
              marginTop: '0.9rem',
              opacity: subtitleVisible ? 1 : 0,
              transform: subtitleVisible ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s',
            }}
          >
            {STATS.map(({ value, suffix, label }) => (
              <div
                key={label}
                style={{
                  padding: '0.55rem 0.9rem',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minWidth: 80,
                }}
              >
                <div style={{
                  fontSize: 'clamp(1.25rem,2.5vw,1.9rem)',
                  fontWeight: 800, color: '#fff', lineHeight: 1,
                }}>
                  <Counter end={value} suffix={suffix} />
                </div>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                  marginTop: '0.3rem',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scroll-down arrow ── */}
        <button
          className="kcf-scroll-arrow"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          style={{
            position: 'absolute', bottom: '1.75rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 30, background: 'rgba(244,63,94,0.85)', border: 'none', cursor: 'pointer',
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 0 rgba(244,63,94,0.5)',
            pointerEvents: 'auto',
          }}
          aria-label="Scroll down"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>

      </div>

      {/* ══ Marquee ticker ════════════════════════════════════════════════ */}
      <div style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', padding: '1rem 0', position: 'relative', zIndex: 10 }}>
        <div className="kcf-marquee-track">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', margin: '0 1rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
              {item}
              <span style={{ color: 'rgba(244,63,94,0.4)' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ Styles ════════════════════════════════════════════════════════ */}
      <style>{`
        /* mobile compact overrides */
        @media (max-width: 640px) {
          .kcf-hero-text { padding: 4rem 1.25rem 4.5rem !important; }
          .kcf-headline  { font-size: clamp(1.6rem,7.5vw,2.4rem) !important; }
          .kcf-desc      { font-size: 0.8rem !important; }
        }

        /* badge fade-in */
        @keyframes kcf-badge-in {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .kcf-badge-in {
          animation: kcf-badge-in 0.7s ease forwards;
        }

        /* animated ping dot on badge */
        .kcf-ping {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #f43f5e;
          animation: kcf-ping 1.5s ease-out infinite;
        }
        @keyframes kcf-ping {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* word entrance */
        @keyframes kcf-word-in {
          from { opacity:0; transform:translateY(42px); clip-path:inset(0 0 100% 0); }
          to   { opacity:1; transform:translateY(0);    clip-path:inset(0 0 0%   0); }
        }
        .kcf-word-in {
          animation: kcf-word-in 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        /* kinetic cycling word */
        @keyframes kcf-cycle-word {
          from { opacity:0; transform:translateY(32px) scaleY(0.8); clip-path:inset(0 0 100% 0); }
          to   { opacity:1; transform:translateY(0)    scaleY(1);   clip-path:inset(0 0 0%   0); }
        }
        .kcf-cycle-word {
          animation: kcf-cycle-word 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        /* scroll arrow pulse */
        @keyframes kcf-arrow-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(244,63,94,0.45); transform: translateX(-50%) translateY(0); }
          50%       { box-shadow: 0 0 0 10px rgba(244,63,94,0); transform: translateX(-50%) translateY(4px); }
        }
        .kcf-scroll-arrow {
          animation: kcf-arrow-pulse 2s ease-in-out infinite !important;
        }

        /* marquee */
        .kcf-marquee-track {
          display: flex;
          white-space: nowrap;
          animation: kcf-marquee 28s linear infinite;
        }
        @keyframes kcf-marquee {
          from { transform:translateX(0); }
          to   { transform:translateX(-33.333%); }
        }
      `}</style>
    </>
  );
}
