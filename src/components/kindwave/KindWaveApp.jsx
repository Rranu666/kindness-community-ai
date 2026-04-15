import { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/api/supabaseClient";

/* ═══════════════════════════════════════════════════════
   KINDWAVE 3.0  ·  "Deep Space Bioluminescence"
   Font: Syne (display) + Plus Jakarta Sans (body)
   Philosophy: Healing flows from serving others first
═══════════════════════════════════════════════════════ */

// ── Design Tokens ─────────────────────────────────────
const T = {
  void:     "#030712",
  deep:     "#030712",
  navy:     "#0d0d14",
  panel:    "rgba(3,7,18,0.82)",
  glass:    "rgba(255,255,255,0.04)",
  teal:     "#f43f5e",
  tealDim:  "#ec4899",
  tealGlow: "rgba(244,63,94,0.18)",
  gold:     "#fbbf24",
  goldLow:  "rgba(251,191,36,0.15)",
  urgent:   "#f43f5e",
  warm:     "#fb923c",
  violet:   "#a78bfa",
  emerald:  "#34d399",
  rose:     "#f9a8d4",
  white:    "#f0f4ff",
  muted:    "rgba(240,244,255,0.45)",
  border:   "rgba(255,255,255,0.07)",
  borderHi: "rgba(244,63,94,0.3)",
};

// ── Gamification Data ──────────────────────────────────
const LEVELS = [
  { name:"Seedling",  emoji:"🌱", min:0,    max:100  },
  { name:"Helper",    emoji:"🤝", min:100,  max:300  },
  { name:"Beacon",    emoji:"💫", min:300,  max:700  },
  { name:"Guide",     emoji:"🌟", min:700,  max:1500 },
  { name:"Guardian",  emoji:"🛡️", min:1500, max:9999 },
];

const BADGES = [
  { id:"journey",   name:"Journey Begun",   emoji:"🚀", desc:"Completed onboarding",              xp:30  },
  { id:"first",     name:"First Ripple",    emoji:"🌊", desc:"Helped someone for the first time",  xp:50  },
  { id:"listener",  name:"Kind Ear",        emoji:"👂", desc:"Gave emotional support",             xp:40  },
  { id:"verified",  name:"Trusted Heart",   emoji:"💚", desc:"Verified identity",                  xp:20  },
  { id:"streak3",   name:"3-Day Flame",     emoji:"🔥", desc:"Helped 3 days in a row",             xp:60  },
  { id:"streak7",   name:"Week Warrior",    emoji:"🌟", desc:"7-day kindness streak",              xp:120 },
  { id:"streak30",  name:"Month of Grace",  emoji:"🏆", desc:"30-day kindness streak",             xp:400 },
  { id:"video1",    name:"Live Helper",     emoji:"📹", desc:"First instant video help session",   xp:80  },
  { id:"share1",    name:"Ripple Spreader", emoji:"✨", desc:"Shared your first impact card",      xp:25  },
];

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];
const LEAGUE = [
  { name:"Priya T.",    avatar:"🌸", streak:28, ripples:84  },
  { name:"Hamid A.",    avatar:"⭐", streak:21, ripples:63  },
  { name:"Mrs. Kapoor", avatar:"🌙", streak:14, ripples:42  },
  { name:"Green GGN",   avatar:"🌱", streak:9,  ripples:27  },
];

// ── Help Categories (default fallback) ────────────────
const DEFAULT_CATS = [
  { id:"urgent",    label:"Urgent Physical",    color:T.urgent,  emoji:"🚨", desc:"Emergency non-medical help" },
  { id:"emotional", label:"Emotional Support",  color:T.warm,    emoji:"💬", desc:"Listening & encouragement"  },
  { id:"prayer",    label:"Prayer & Spiritual", color:T.violet,  emoji:"🙏", desc:"Faith & spiritual support"   },
  { id:"general",   label:"General Help",       color:T.emerald, emoji:"✅", desc:"Errands, tasks, guidance"    },
  { id:"community", label:"Community Group",    color:T.rose,    emoji:"🏘️", desc:"Events & volunteering"       },
];

// ── Seed Data (default fallback) ───────────────────────
const DEFAULT_PINS = [
  { id:1, title:"Need a ride to Medanta",      cat:"urgent",    urgency:"Urgent",   x:36,y:40, user:"Aanya S.",    time:"3m",  desc:"Car broke down near Sector 14. Hospital appointment urgent.", verified:true  },
  { id:2, title:"Someone to talk to tonight",  cat:"emotional", urgency:"Standard", x:58,y:28, user:"Anonymous",   time:"11m", desc:"Going through a rough week. Just need a kind ear.",          verified:false },
  { id:3, title:"Prayer circle this Sunday",   cat:"prayer",    urgency:"Flexible", x:72,y:54, user:"Faith Circle",time:"1h",  desc:"Open interfaith prayer at DLF park. All are welcome.",       verified:true  },
  { id:4, title:"Help carrying groceries",     cat:"general",   urgency:"Standard", x:23,y:66, user:"Mrs. Kapoor", time:"18m", desc:"3rd floor, lift broken. Heavy bags from the market.",        verified:true  },
  { id:5, title:"Neighbourhood cleanup drive", cat:"community", urgency:"Flexible", x:64,y:74, user:"Green GGN",   time:"2h",  desc:"Saturday 8am, Sector 56 park. Gloves provided!",            verified:true  },
  { id:6, title:"Stranded at metro station",   cat:"urgent",    urgency:"Urgent",   x:47,y:57, user:"Rahul M.",    time:"1m",  desc:"Wallet stolen. Need cab fare home to Sector 82.",           verified:false },
  { id:7, title:"Grief support needed",        cat:"emotional", urgency:"Standard", x:82,y:33, user:"Anonymous",   time:"43m", desc:"Lost someone last week. Feeling very alone.",               verified:false },
  { id:8, title:"Tutor for kids (Math)",       cat:"general",   urgency:"Flexible", x:17,y:44, user:"Priya T.",    time:"3h",  desc:"2 kids need help with Math & Science, Grade 7-8.",          verified:true  },
];

// ── Module-level alias (used by catOf + sub-components) ─
const CATS = DEFAULT_CATS;
const PINS = DEFAULT_PINS;

// ── Supabase data hook ──────────────────────────────────
function useKindWaveData() {
  const [pins, setPins] = useState(DEFAULT_PINS);
  useEffect(() => {
    supabase.from('kindwave_requests').select('*').eq('is_active', true).order('created_at')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPins(data.map(r => ({ id: r.id, title: r.title, cat: r.category, urgency: r.urgency, x: r.x_pos, y: r.y_pos, user: r.user_name, time: '·', desc: r.description || '', verified: r.verified })));
        }
      });
  }, []);
  return { pins };
}

const AVATARS = ["🌟","🌊","🌱","💚","🦋","☀️","🌙","⭐","🔮","🌸","🦄","🎯"];

// ── Global CSS ─────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:rgba(244,63,94,0.25);border-radius:3px}
input,textarea,button{font-family:'Plus Jakarta Sans',system-ui,sans-serif}

@keyframes fadeUp    {from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn    {from{opacity:0} to{opacity:1}}
@keyframes kwMarqueeV {from{transform:translateY(0)} to{transform:translateY(calc(-100% - 12px))}}
.kw-marquee-col{animation:kwMarqueeV var(--kw-dur,40s) linear infinite}
.kw-marquee-col.rev{animation-direction:reverse}
.kw-marquee-wrap:hover .kw-marquee-col{animation-play-state:paused}
@keyframes scaleIn   {from{opacity:0;transform:scale(0.94) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)}}
.section-hero{background:linear-gradient(180deg,rgba(244,63,94,0.06) 0%,transparent 100%)}
@keyframes slideL    {from{opacity:0;transform:translateX(36px)} to{opacity:1;transform:translateX(0)}}
@keyframes slideR    {from{opacity:0;transform:translateX(-36px)} to{opacity:1;transform:translateX(0)}}
@keyframes float3d   {0%,100%{transform:perspective(500px) rotateX(0deg) rotateY(0deg) translateZ(0px)} 33%{transform:perspective(500px) rotateX(5deg) rotateY(-4deg) translateZ(10px)} 66%{transform:perspective(500px) rotateX(-4deg) rotateY(5deg) translateZ(14px)}}
@keyframes heartbeat {0%,100%{transform:scale(1)} 50%{transform:scale(1.14)}}
@keyframes pulse     {0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.9)}}
@keyframes rippleOut {0%{transform:scale(.5);opacity:.9} 100%{transform:scale(4);opacity:0}}
@keyframes orbFloat  {0%,100%{transform:translate(0,0)} 38%{transform:translate(28px,-20px)} 70%{transform:translate(-18px,14px)}}
@keyframes glow      {0%,100%{box-shadow:0 0 20px rgba(244,63,94,.18)} 50%{box-shadow:0 0 42px rgba(244,63,94,.42)}}
@keyframes pinBounce {0%{transform:translate(-50%,-100%) scale(0.15);opacity:0} 65%{transform:translate(-50%,-100%) scale(1.12)} 100%{transform:translate(-50%,-100%) scale(1);opacity:1}}
@keyframes msgIn     {from{opacity:0;transform:scale(.88) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes xpFill    {from{width:0%} to{width:var(--xp-w,60%)}}
@keyframes badgeIn   {0%{opacity:0;transform:scale(0.2) rotate(-20deg)} 60%{transform:scale(1.18) rotate(4deg)} 80%{transform:scale(.96) rotate(-1deg)} 100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes confetti  {0%{transform:translateY(0) rotate(0)} 100%{transform:translateY(120px) rotate(540deg);opacity:0}}
@keyframes shimmer   {0%{background-position:200% 50%} 100%{background-position:-200% 50%}}
@keyframes countUp   {from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1}}
@keyframes popIn     {0%{transform:scale(0);opacity:0} 70%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1}}
@keyframes goldShine {0%,100%{text-shadow:0 0 8px rgba(251,191,36,.15)} 50%{text-shadow:0 0 22px rgba(251,191,36,.5)}}
@keyframes tooltipIn {from{opacity:0;transform:translateY(8px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes fireDance {0%,100%{transform:scale(1) rotate(-2deg)} 33%{transform:scale(1.12) rotate(2deg)} 66%{transform:scale(1.06) rotate(-1deg)}}
@keyframes sonarRing {0%{transform:scale(.4);opacity:.9} 100%{transform:scale(2.8);opacity:0}}
@keyframes radarSpin {from{transform:rotate(0deg)} to{transform:rotate(360deg)}}
@keyframes cardReveal{0%{opacity:0;transform:scale(.82) translateY(32px)} 70%{transform:scale(1.03) translateY(-4px)} 100%{opacity:1;transform:scale(1) translateY(0)}}
@keyframes streakPop {0%{transform:scale(0) rotate(-15deg);opacity:0} 65%{transform:scale(1.18) rotate(3deg)} 100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes spin      {from{transform:rotate(0deg)} to{transform:rotate(360deg)}}
.kw-popup .leaflet-popup-content-wrapper{background:transparent;border:none;box-shadow:none;padding:0}
.kw-popup .leaflet-popup-content{margin:0}
.kw-popup .leaflet-popup-tip-container{display:none}
@keyframes dotBounce {0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)}}
@keyframes callPulse {0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,.5)} 50%{box-shadow:0 0 0 16px rgba(52,211,153,0)}}
@keyframes kwFadeSlide {from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)}}
.kwhi-1{animation:kwFadeSlide .65s .08s both}
.kwhi-2{animation:kwFadeSlide .65s .22s both}
.kwhi-3{animation:kwFadeSlide .65s .36s both}
.kwhi-4{animation:kwFadeSlide .65s .50s both}
.kwhi-5{animation:kwFadeSlide .65s .64s both}
.kw-cosmos{background:linear-gradient(rgba(3,7,18,0.80),rgba(3,7,18,0.80)),url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0e2dbea0-c0a9-413f-a57b-af279633c0df_3840w.jpg') center/cover fixed}
.kw-ob-grid{display:grid;grid-template-columns:1fr 1fr;min-height:100vh}
@media(max-width:768px){.kw-ob-grid{grid-template-columns:1fr}.kw-ob-left{display:none!important}.kw-ob-right{padding:100px 24px 48px!important}}
@keyframes shieldFloat{0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)}}
@keyframes heatIn    {from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)}}
@keyframes bounceY   {0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)}}
@keyframes gradShift {0%,100%{background-position:0% 50%} 50%{background-position:100% 50%}}
@keyframes pulseRing {0%{box-shadow:0 0 0 0 rgba(244,63,94,.55),0 4px 26px rgba(244,63,94,.22)} 70%{box-shadow:0 0 0 18px rgba(244,63,94,0),0 4px 26px rgba(244,63,94,.22)} 100%{box-shadow:0 0 0 0 rgba(244,63,94,0),0 4px 26px rgba(244,63,94,.22)}}

.fu{animation:fadeUp  .52s cubic-bezier(.22,1,.36,1) both}
.si{animation:scaleIn .4s  cubic-bezier(.22,1,.36,1) both}
.sl{animation:slideL  .45s cubic-bezier(.22,1,.36,1) both}
.sr{animation:slideR  .45s cubic-bezier(.22,1,.36,1) both}
.d1{animation-delay:.06s}.d2{animation-delay:.14s}.d3{animation-delay:.22s}
.d4{animation-delay:.30s}.d5{animation-delay:.40s}.d6{animation-delay:.52s}

.glass   {background:rgba(3,7,18,0.82);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.07)}
.glassHi {background:rgba(3,7,18,0.94);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);border:1px solid rgba(244,63,94,0.3)}
.neu     {background:linear-gradient(145deg,rgba(15,15,22,.92),rgba(3,7,18,.96));box-shadow:6px 6px 16px rgba(0,0,0,.55),-3px -3px 8px rgba(255,255,255,.022)}
.press   {transition:transform .12s;cursor:pointer}
.press:active{transform:scale(.955)}
.hov     {transition:transform .22s,box-shadow .22s}
.hov:hover{transform:translateY(-3px)}
.btn-p   {background:linear-gradient(135deg,#f43f5e,#ec4899);color:#fff;border:none;border-radius:16px;padding:16px 28px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 4px 26px rgba(244,63,94,0.35);transition:transform .12s,box-shadow .15s;width:100%}
.btn-p:hover{transform:translateY(-1px);box-shadow:0 8px 34px rgba(244,63,94,.48),0 0 0 1px rgba(244,63,94,.2)}
.btn-p:active{transform:scale(.962)}
.btn-pulse{animation:pulseRing 2.2s ease-out infinite}
.btn-s   {background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:15px 28px;font-size:15px;font-weight:600;color:rgba(240,244,255,0.45);cursor:pointer;width:100%;transition:all .2s}
.btn-s:hover{border-color:rgba(244,63,94,0.3);color:#f0f4ff;background:rgba(244,63,94,.08)}
.inp     {width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px 18px;color:#f0f4ff;font-size:15px;outline:none;transition:border-color .2s,box-shadow .2s}
.inp:focus{border-color:#ec4899;box-shadow:0 0 0 3px rgba(244,63,94,.15)}
.inp::placeholder{color:rgba(240,244,255,0.35)}
`;

// ── Utilities ──────────────────────────────────────────
const catOf   = (id) => CATS.find(c => c.id === id) || CATS[3];
const levelOf = (xp) => LEVELS.reduce((best, l) => xp >= l.min ? l : best, LEVELS[0]);
const xpPct   = (xp) => {
  const lv = levelOf(xp);
  return Math.round(((xp - lv.min) / (lv.max - lv.min)) * 100);
};

// ══════════════════════════════════════════════════════
// SHARED COMPONENTS
// ══════════════════════════════════════════════════════

function ParticleCanvas() {
  const ref = useRef();
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let raf;
    const resize = () => { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * 2000, y: Math.random() * 2000,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.5 + .35, a: Math.random() * Math.PI * 2,
    }));
    const tick = () => {
      const W = cvs.width, H = cvs.height;
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.a += .007;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const op = (Math.sin(p.a) + 1) / 2 * .52;
        ctx.beginPath(); ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,63,94,${op})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 105) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(244,63,94,${.11 * (1 - d / 105)})`; ctx.lineWidth = .5; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

function OrbBg({ cols }) {
  const colors = cols || [T.teal, T.violet, T.warm];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {colors.map((col, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: 260 + i * 80 + "px", height: 260 + i * 80 + "px",
          background: `radial-gradient(circle, ${col}16 0%, transparent 68%)`,
          left: `${[12, 54, 30][i % 3]}%`, top: `${[6, 50, 80][i % 3]}%`,
          transform: "translate(-50%,-50%)",
          animation: `orbFloat ${7 + i * 3}s ease-in-out infinite`,
          animationDelay: `${i * 2.4}s`,
        }} />
      ))}
    </div>
  );
}

function TiltCard({ children, style, className, onClick }) {
  const ref = useRef();
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * 11}deg) rotateY(${x * 11}deg) translateZ(8px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      style={{ transition: "transform .35s ease", ...style }} className={className}>
      {children}
    </div>
  );
}

function XPBar({ xp, inline }) {
  const lv = levelOf(xp);
  const pct = xpPct(xp);
  if (inline) return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 14 }}>{lv.emoji}</span>
      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.08)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg,${T.teal},${T.tealDim})`, borderRadius: 3, width: pct + "%", transition: "width 1s cubic-bezier(.22,1,.36,1)" }} />
      </div>
      <span style={{ fontSize: 11, color: T.teal, fontWeight: 700 }}>{xp} XP</span>
    </div>
  );
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: T.teal, fontSize: 13, fontWeight: 700 }}>{lv.emoji} {lv.name}</span>
        <span style={{ color: T.muted, fontSize: 12 }}>{xp} / {lv.max} XP</span>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ "--xp-w": pct + "%", height: "100%", background: `linear-gradient(90deg,${T.teal},${T.tealDim})`, borderRadius: 4, animation: "xpFill 1.2s .3s cubic-bezier(.22,1,.36,1) both" }} className="xp-bar-fill" />
      </div>
    </div>
  );
}

function BadgeUnlock({ badge, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(2,4,15,.82)", backdropFilter: "blur(18px)", animation: "fadeIn .3s both" }}>
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 88, animation: "badgeIn .7s cubic-bezier(.22,1,.36,1) both", display: "block", marginBottom: 20 }}>{badge.emoji}</div>
        <div style={{ color: T.gold, fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 6, animation: "goldShine 2s infinite" }}>{badge.name}</div>
        <div style={{ color: T.muted, fontSize: 14, marginBottom: 20 }}>{badge.desc}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.goldLow, border: `1px solid ${T.gold}44`, borderRadius: 20, padding: "8px 20px", color: T.gold, fontWeight: 700, fontSize: 15, animation: "popIn .5s .4s both" }}>
          +{badge.xp} XP earned!
        </div>
      </div>
    </div>
  );
}

function XPToast({ xp, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: "fixed", top: 70, right: 16, zIndex: 8000, background: T.goldLow, border: `1px solid ${T.gold}55`, borderRadius: 14, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8, animation: "slideL .35s both", backdropFilter: "blur(20px)" }}>
      <span style={{ fontSize: 18 }}>⭐</span>
      <span style={{ color: T.gold, fontWeight: 700, fontSize: 15 }}>+{xp} XP</span>
    </div>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="glassHi" style={{ position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)", borderRadius: 16, padding: "13px 20px", color: T.white, fontSize: 14, zIndex: 9500, display: "flex", gap: 10, alignItems: "center", boxShadow: `0 8px 32px rgba(0,0,0,.55),0 0 40px ${T.tealGlow}`, maxWidth: "90vw", animation: "fadeUp .32s both" }}>
      <span>{msg}</span>
      <button onClick={onDone} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
    </div>
  );
}

function ToggleSwitch({ def }) {
  const [on, setOn] = useState(def ?? false);
  return (
    <div onClick={() => setOn(v => !v)} style={{ width: 48, height: 26, borderRadius: 13, cursor: "pointer", flexShrink: 0, background: on ? `linear-gradient(90deg,${T.teal},${T.tealDim})` : "rgba(255,255,255,.09)", position: "relative", boxShadow: on ? `0 0 12px ${T.tealGlow}` : "none", transition: "all .3s" }}>
      <div style={{ position: "absolute", top: 3, left: on ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .3s", boxShadow: "0 1px 5px rgba(0,0,0,.35)" }} />
    </div>
  );
}

// ══════════════════════════════════════════════════════
// ONBOARDING SCREENS
// ══════════════════════════════════════════════════════

// Step 0 — Cinematic Splash
function OnboardSplash({ onNext }) {
  return (
    <div style={{ padding: "60px 0", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T.teal}18`, border: `1px solid ${T.borderHi}`, borderRadius: 20, padding: "7px 18px", width: "fit-content", animation: "fadeUp .4s both" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.teal, display: "inline-block", animation: "pulse 2s infinite" }} />
        <span style={{ color: T.teal, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Live · Real-Time Community Kindness</span>
      </div>
      <h2 className="fu d1" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 800, color: T.white, lineHeight: 1.1, letterSpacing: -1 }}>
        Welcome to<br /><span style={{ background: `linear-gradient(135deg,${T.teal},${T.violet})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KindWave</span>
      </h2>
      <p className="fu d2" style={{ color: T.muted, fontSize: 17, lineHeight: 1.75, maxWidth: 420 }}>
        A GPS-powered platform where finding and giving help happens in real time — for everyone in your community.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", animation: "fadeUp .5s .2s both" }}>
        {CATS.map(c => (
          <span key={c.id} style={{ display: "flex", alignItems: "center", gap: 5, background: `${c.color}15`, border: `1px solid ${c.color}40`, borderRadius: 20, padding: "6px 14px", color: c.color, fontSize: 13, fontWeight: 600 }}>
            {c.emoji} {c.id}
          </span>
        ))}
      </div>
      <div style={{ animation: "fadeUp .5s .3s both" }}>
        <button className="btn-p press btn-pulse" onClick={onNext} style={{ marginBottom: 10 }}>
          Begin Your Journey ✦
        </button>
        <p style={{ color: T.muted, fontSize: 12, marginTop: 12 }}>Free forever · No credit card · Available worldwide</p>
      </div>

      {/* Feature highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, animation: "fadeUp .5s .45s both" }}>
        {[
          { emoji: "🗺️", title: "Live Map",       desc: "See who needs help near you in real time" },
          { emoji: "📹", title: "Video Help",      desc: "Instant 60-second video calls for urgent support" },
          { emoji: "🏆", title: "Earn Badges",     desc: "Track streaks and grow your kindness impact" },
        ].map((f, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{f.emoji}</div>
            <div style={{ color: T.white, fontWeight: 700, fontSize: 13, marginBottom: 5 }}>{f.title}</div>
            <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Testimonial */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px", animation: "fadeUp .5s .55s both" }}>
        <p style={{ color: "rgba(240,244,255,0.7)", fontSize: 14, lineHeight: 1.7, fontStyle: "italic", marginBottom: 12 }}>
          "Helped a stranger get to their chemo appointment. Got a thank-you that changed my whole week. KindWave is something different."
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${T.teal},${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌟</div>
          <div>
            <div style={{ color: T.white, fontSize: 13, fontWeight: 600 }}>Marcus T.</div>
            <div style={{ color: T.muted, fontSize: 11 }}>KindWave member · Oakland, CA</div>
          </div>
          <div style={{ marginLeft: "auto", color: T.gold, fontSize: 13 }}>★★★★★</div>
        </div>
      </div>
    </div>
  );
}

// Step 1 — Value Proposition (Swipeable Story Cards)
function OnboardValueProp({ onNext }) {
  const [idx, setIdx] = useState(0);
  const cards = [
    { emoji: "🗺️", color: T.teal,   title: "Live GPS Help Map",        body: "Real-time color-coded pins show who needs help near you. Filter by urgency, category, and distance in seconds." },
    { emoji: "💜", color: T.violet,  title: "Healing Through Service",   body: "Science-backed: helping others releases serotonin and oxytocin — literally healing you while you help them." },
    { emoji: "🌊", color: T.warm,    title: "Your Ripple Effect",        body: "Every act of kindness is tracked. Watch your personal ripple expand across your community over time." },
  ];
  const go = (n) => { if (n >= cards.length) { onNext(); return; } setIdx(n); };
  const c = cards[idx];
  return (
    <div style={{ padding: "48px 0", display: "flex", flexDirection: "column" }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
        {cards.map((_, i) => (
          <div key={i} style={{ flex: i === idx ? 2 : 1, height: 5, borderRadius: 3, background: i <= idx ? T.teal : T.border, transition: "all .4s", boxShadow: i === idx ? `0 0 10px ${T.teal}` : "none" }} />
        ))}
      </div>
      <TiltCard key={idx} style={{ background: T.panel, border: `1.5px solid ${c.color}60`, borderRadius: 24, padding: "32px 24px", textAlign: "center", marginBottom: 24, boxShadow: `0 16px 48px rgba(0,0,0,.45), 0 0 40px ${c.color}14` }}>
        <div style={{ fontSize: 72, marginBottom: 20, animation: "float3d 6s ease-in-out infinite", display: "inline-block", filter: `drop-shadow(0 0 24px ${c.color}80)` }}>{c.emoji}</div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 800, color: T.white, marginBottom: 12, lineHeight: 1.2 }}>{c.title}</h2>
        <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.75 }}>{c.body}</p>
      </TiltCard>
      <div style={{ display: "flex", gap: 10 }}>
        {idx > 0 && (
          <button className="btn-s press" onClick={() => go(idx - 1)} style={{ width: "auto", padding: "15px 22px", flex: 0 }}>←</button>
        )}
        <button className="btn-p press" onClick={() => go(idx + 1)}>
          {idx < cards.length - 1 ? "Next →" : "Got it! Let's go →"}
        </button>
      </div>
      <button onClick={onNext} style={{ background: "none", border: "none", color: T.muted, fontSize: 13, cursor: "pointer", marginTop: 14 }}>Skip intro</button>
    </div>
  );
}

// Step 2 — Quick Auth
function OnboardAuth({ onNext, profile, setProfile }) {
  const [mode, setMode] = useState("options"); // options | email
  const [email, setEmail] = useState("");

  const continueEmail = () => {
    if (!email.includes("@")) return;
    setProfile(p => ({ ...p, email }));
    onNext();
  };

  return (
    <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", gap: 0 }}>
      <p className="fu" style={{ color: T.teal, fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 12 }}>Step 1 of 4</p>
      <h2 className="fu d1" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: T.white, marginBottom: 8, lineHeight: 1.1 }}>How would you<br />like to continue?</h2>
      <p className="fu d2" style={{ color: T.muted, fontSize: 15, marginBottom: 32 }}>No passwords required. We respect your privacy.</p>

      {mode === "options" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TiltCard className="fu d2" onClick={() => setMode("email")} style={{ background: T.panel, border: `1px solid ${T.borderHi}`, borderRadius: 18, padding: "18px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: `0 8px 30px rgba(0,0,0,.3)` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.teal}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: `0 0 14px ${T.tealGlow}` }}>📧</div>
            <div>
              <div style={{ color: T.white, fontWeight: 700, fontSize: 15 }}>Continue with Email</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>Quick & secure one-time code</div>
            </div>
          </TiltCard>
          <TiltCard className="fu d3" onClick={onNext} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 18, padding: "18px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: `0 8px 30px rgba(0,0,0,.3)` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📱</div>
            <div>
              <div style={{ color: T.white, fontWeight: 700, fontSize: 15 }}>Continue with Phone</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>Verified & trusted in community</div>
            </div>
          </TiltCard>
          <button className="btn-s press fu d4" onClick={onNext} style={{ marginTop: 8 }}>Skip for now — explore first</button>
        </div>
      )}
      {mode === "email" && (
        <div style={{ animation: "slideL .38s both" }}>
          <label style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email Address</label>
          <input className="inp" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && continueEmail()} style={{ marginBottom: 14 }} />
          <button className="btn-p press" onClick={continueEmail} style={{ opacity: email.includes("@") ? 1 : .4 }}>Send Magic Link →</button>
          <button className="btn-s press" onClick={() => setMode("options")} style={{ marginTop: 10 }}>← Back</button>
        </div>
      )}
    </div>
  );
}

// Step 3 — Smart Goal Quiz (3D Tilt Cards)
function OnboardGoal({ onNext, profile, setProfile }) {
  const [sel, setSel] = useState(profile.goal || null);
  const goals = [
    { id: "give",    emoji: "🤝", color: T.teal,   title: "Give Help",        sub: "I want to support others in my community" },
    { id: "receive", emoji: "🙏", color: T.violet, title: "Receive Help",      sub: "I could use some support right now" },
    { id: "both",    emoji: "💚", color: T.warm,   title: "Both — Give & Receive", sub: "I want to connect deeply with community" },
  ];
  const pick = (id) => {
    setSel(id);
    setProfile(p => ({ ...p, goal: id }));
    setTimeout(onNext, 380);
  };
  return (
    <div style={{ padding: "48px 0" }}>
      <p className="fu" style={{ color: T.teal, fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 12 }}>Step 2 of 4</p>
      <h2 className="fu d1" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: T.white, marginBottom: 8, lineHeight: 1.1 }}>What brings you<br />to KindWave?</h2>
      <p className="fu d2" style={{ color: T.muted, fontSize: 15, marginBottom: 28 }}>We'll personalise your experience.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {goals.map((g, i) => {
          const isSel = sel === g.id;
          return (
            <TiltCard key={g.id} className={`fu d${i + 2} press`} onClick={() => pick(g.id)} style={{ background: isSel ? `${g.color}18` : T.panel, border: `2px solid ${isSel ? g.color : T.border}`, borderRadius: 20, padding: "20px 22px", display: "flex", gap: 16, alignItems: "center", boxShadow: isSel ? `0 0 30px ${g.color}28, 0 10px 30px rgba(0,0,0,.3)` : `0 8px 28px rgba(0,0,0,.28)`, transition: "border-color .25s, background .25s, box-shadow .25s" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: isSel ? `${g.color}28` : `${g.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, boxShadow: isSel ? `0 0 18px ${g.color}44` : "none", transition: "all .25s" }}>{g.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: isSel ? g.color : T.white, fontWeight: 700, fontSize: 16, marginBottom: 4, transition: "color .25s" }}>{g.title}</div>
                <div style={{ color: T.muted, fontSize: 13 }}>{g.sub}</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: isSel ? g.color : "transparent", border: `2px solid ${isSel ? g.color : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .25s" }}>
                {isSel && <span style={{ color: T.deep, fontSize: 13, fontWeight: 800 }}>✓</span>}
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}

// Step 4 — Category Picker (Duolingo-style)
function OnboardCategories({ onNext, profile, setProfile }) {
  const [sel, setSel] = useState(profile.cats || []);
  const toggle = (id) => {
    setSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const next = () => {
    setProfile(p => ({ ...p, cats: sel }));
    onNext();
  };
  return (
    <div style={{ padding: "48px 0", display: "flex", flexDirection: "column" }}>
      <p className="fu" style={{ color: T.teal, fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 12 }}>Step 3 of 4</p>
      <h2 className="fu d1" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: T.white, marginBottom: 8, lineHeight: 1.1 }}>What kinds of help<br />resonate with you?</h2>
      <p className="fu d2" style={{ color: T.muted, fontSize: 15, marginBottom: 20 }}>Pick all that apply — you can change anytime.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {CATS.map((c, i) => {
          const on = sel.includes(c.id);
          return (
            <button key={c.id} className="press" onClick={() => toggle(c.id)} style={{ display: "flex", alignItems: "center", gap: 14, background: on ? `linear-gradient(135deg,${c.color}22,${c.color}0a)` : "rgba(255,255,255,.025)", border: `1px solid ${on ? c.color : T.border}`, borderRadius: 16, padding: "14px 18px", animation: `fadeUp .45s ${.06 + i * .08}s both`, transition: "background .2s, border-color .2s, box-shadow .2s", boxShadow: on ? `0 0 24px ${c.color}30` : "none", textAlign: "left", width: "100%" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: on ? `${c.color}35` : `${c.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, transition: "all .2s", boxShadow: on ? `0 0 16px ${c.color}50` : "none" }}>{c.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: on ? c.color : T.white, fontWeight: 700, fontSize: 15, transition: "color .2s" }}>{c.label}</div>
                <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{c.desc}</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: on ? c.color : "transparent", border: `2px solid ${on ? c.color : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .22s" }}>
                {on && <span style={{ color: T.deep, fontSize: 13, fontWeight: 800 }}>✓</span>}
              </div>
            </button>
          );
        })}
      </div>
      <button className="btn-p press" onClick={next}>{sel.length > 0 ? `Continue (${sel.length} selected) →` : "Skip for now →"}</button>
    </div>
  );
}

// Step 5 — Profile Setup
function OnboardProfile({ onNext, profile, setProfile }) {
  const [name, setName] = useState(profile.name || "");
  const [avatar, setAvatar] = useState(profile.avatar || AVATARS[0]);
  const next = () => {
    setProfile(p => ({ ...p, name: name || "Friend", avatar }));
    onNext();
  };
  return (
    <div style={{ padding: "48px 0" }}>
      <p className="fu" style={{ color: T.teal, fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 12 }}>Step 4 of 4</p>
      <h2 className="fu d1" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: T.white, marginBottom: 8, lineHeight: 1.1 }}>Create your<br />identity</h2>
      <p className="fu d2" style={{ color: T.muted, fontSize: 15, marginBottom: 28 }}>Quick and optional — you can update anytime.</p>
      <div className="fu d2" style={{ marginBottom: 24 }}>
        <label style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Choose your avatar</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
          {AVATARS.map(a => (
            <button key={a} className="press" onClick={() => setAvatar(a)} style={{ fontSize: 30, background: avatar === a ? `${T.teal}20` : "rgba(255,255,255,.03)", border: `2px solid ${avatar === a ? T.teal : T.border}`, borderRadius: 14, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", boxShadow: avatar === a ? `0 0 14px ${T.tealGlow}` : "none" }}>{a}</button>
          ))}
        </div>
      </div>
      <div className="fu d3" style={{ marginBottom: 20 }}>
        <label style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Your Name</label>
        <input className="inp" placeholder="What should we call you?" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && next()} />
      </div>
      <div className="fu d4" style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 32 }}>{avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: T.white, fontWeight: 700, fontSize: 15 }}>{name || "Your Name"}</div>
            <div style={{ color: T.teal, fontSize: 12, marginTop: 2 }}>🌱 Seedling · 0 XP</div>
          </div>
        </div>
      </div>
      <button className="btn-p press" onClick={next}>{name ? "Let's go! →" : "Skip — continue anonymously →"}</button>
    </div>
  );
}

// Step 6 — Aha Moment: Real person needs help NOW
function OnboardAha({ onNext, onXP, profile }) {
  const urgentPin = PINS.find(p => p.urgency === "Urgent");
  const c = catOf(urgentPin.cat);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState("");

  const send = () => {
    if (!msg.trim() && !sent) return;
    setSent(true);
    onXP(25);
    setTimeout(onNext, 1800);
  };

  return (
    <div style={{ padding: "40px 0" }}>
      <div className="fu" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.urgent, boxShadow: `0 0 8px ${T.urgent}`, animation: "pulse 1.5s infinite" }} />
        <div style={{ color: T.urgent, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>HAPPENING RIGHT NOW NEAR YOU</div>
      </div>
      <h2 className="fu d1" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: T.white, lineHeight: 1.2, marginBottom: 6 }}>Someone needs you</h2>
      <p className="fu d2" style={{ color: T.muted, fontSize: 15, marginBottom: 24 }}>This is why KindWave exists. Send a quick note.</p>
      <TiltCard className="fu d2" style={{ background: T.panel, border: `2px solid ${c.color}44`, borderLeft: `4px solid ${c.color}`, borderRadius: 20, padding: 22, marginBottom: 22, boxShadow: `0 16px 48px rgba(0,0,0,.45)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ color: c.color, fontSize: 11, fontWeight: 700 }}>{c.emoji} {c.label.toUpperCase()}</span>
          <span style={{ color: T.urgent, fontSize: 10, background: `${T.urgent}18`, border: `1px solid ${T.urgent}35`, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>URGENT</span>
        </div>
        <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, color: T.white, fontSize: 18, marginBottom: 8 }}>{urgentPin.title}</div>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.65 }}>{urgentPin.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
          <span style={{ color: T.muted, fontSize: 12 }}>👤 {urgentPin.user}</span>
          <span style={{ color: T.urgent, fontSize: 12, fontWeight: 600 }}>🕐 {urgentPin.time} ago</span>
        </div>
      </TiltCard>
      {!sent ? (
        <div className="fu d3">
          <label style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Send {urgentPin.user} a quick note</label>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input className="inp" placeholder="Hi, I can help! I'm nearby..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} style={{ flex: 1 }} />
            <button className="press" onClick={send} style={{ background: `linear-gradient(135deg,${T.teal},${T.tealDim})`, border: "none", borderRadius: 12, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", color: T.deep, fontSize: 20, flexShrink: 0, opacity: msg.trim() ? 1 : .5 }}>↑</button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Hi, I can help!", "On my way!", "Sending support 🙏"].map(q => (
              <button key={q} className="press" onClick={() => setMsg(q)} style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${T.border}`, borderRadius: 20, padding: "6px 12px", color: T.muted, fontSize: 12 }}>{q}</button>
            ))}
          </div>
          <button onClick={onNext} style={{ background: "none", border: "none", color: T.muted, fontSize: 13, cursor: "pointer", marginTop: 16, display: "block" }}>Skip for now — go to map</button>
        </div>
      ) : (
        <div style={{ background: `${T.teal}14`, border: `1px solid ${T.teal}44`, borderRadius: 16, padding: 18, textAlign: "center", animation: "scaleIn .4s both" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🌊</div>
          <div style={{ color: T.teal, fontWeight: 700, fontSize: 17 }}>Message sent! Your first ripple.</div>
          <div style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>+25 XP earned</div>
        </div>
      )}
    </div>
  );
}

// Step 7 — Badge Unlock + XP Bar = Dopamine Moment
function OnboardComplete({ onFinish, profile, totalXP }) {
  const [phase, setPhase] = useState(0); // 0: loading, 1: badge, 2: xp, 3: done
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => setPhase(3), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const badge = BADGES.find(b => b.id === "journey");
  const lv = levelOf(totalXP);

  return (
    <div style={{ padding: "48px 0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 380 }}>

        {phase >= 1 && (
          <div style={{ marginBottom: 28, animation: "badgeIn .7s cubic-bezier(.22,1,.36,1) both" }}>
            <div style={{ fontSize: 90, display: "inline-block", filter: `drop-shadow(0 0 28px ${T.gold}66)` }}>{badge.emoji}</div>
          </div>
        )}

        {phase >= 1 && (
          <div style={{ animation: "fadeUp .5s .1s both" }}>
            <div style={{ color: T.gold, fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 6, animation: "goldShine 2s infinite" }}>
              Badge Unlocked!
            </div>
            <div style={{ color: T.white, fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{badge.name}</div>
            <div style={{ color: T.muted, fontSize: 14, marginBottom: 28 }}>{badge.desc}</div>
          </div>
        )}

        {phase >= 2 && (
          <div style={{ background: T.panel, border: `1px solid ${T.borderHi}`, borderRadius: 20, padding: "22px 24px", marginBottom: 28, animation: "scaleIn .45s both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 36 }}>{profile.avatar || "🌱"}</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ color: T.white, fontWeight: 700, fontSize: 16 }}>{profile.name || "Friend"}</div>
                <div style={{ color: T.teal, fontSize: 13 }}>{lv.emoji} {lv.name}</div>
              </div>
              <div style={{ color: T.gold, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, animation: "countUp .5s both" }}>{totalXP} XP</div>
            </div>
            <div style={{ height: 10, background: "rgba(255,255,255,.07)", borderRadius: 5, overflow: "hidden" }}>
              <div style={{ "--xp-w": xpPct(totalXP) + "%", height: "100%", background: `linear-gradient(90deg,${T.gold},${T.teal})`, borderRadius: 5 }} className="xp-bar-fill" />
            </div>
          </div>
        )}

        {phase >= 3 && (
          <button className="btn-p press" onClick={onFinish} style={{ animation: "fadeUp .5s both" }}>
            Enter KindWave →
          </button>
        )}
      </div>
    </div>
  );
}

// Onboarding Manager
function Onboarding({ onComplete }) {
  const [step, setStep]       = useState(0);
  const [k, setK]             = useState(0);
  const [profile, setProfile] = useState({ name: "", avatar: AVATARS[0], goal: null, cats: [], email: "" });
  const [xp, setXp]           = useState(30);

  const next = () => { setStep(s => s + 1); setK(v => v + 1); };
  const addXP = (n) => setXp(v => v + n);

  const screens = [
    <OnboardSplash       onNext={next} key="s0" />,
    <OnboardValueProp    onNext={next} key="s1" />,
    <OnboardAuth         onNext={next} profile={profile} setProfile={setProfile} key="s2" />,
    <OnboardGoal         onNext={next} profile={profile} setProfile={setProfile} key="s3" />,
    <OnboardCategories   onNext={next} profile={profile} setProfile={setProfile} key="s4" />,
    <OnboardProfile      onNext={next} profile={profile} setProfile={setProfile} key="s5" />,
    <OnboardAha          onNext={next} profile={profile} onXP={addXP} key="s6" />,
    <OnboardComplete     onFinish={() => onComplete(profile, xp)} profile={profile} totalXP={xp} key="s7" />,
  ];

  const LEFT_CONTENT = [
    { headline: "Help Others.", sub: "Heal Yourself.", body: "A GPS-powered community where every act of kindness creates a ripple that heals both giver and receiver.", emoji: "🌊" },
    { headline: "Three ways", sub: "to give.", body: "A live GPS map, instant video help, and an emotional support feed — all in one platform.", emoji: "🗺️" },
    { headline: "No passwords.", sub: "No friction.", body: "Join with email or phone in seconds. Your privacy is protected throughout.", emoji: "🔒" },
    { headline: "Give, receive,", sub: "or both.", body: "KindWave meets you wherever you are — whether you need help today or want to offer it.", emoji: "💚" },
    { headline: "Your skills", sub: "are needed.", body: "From urgent rides to emotional support — your unique abilities can change someone's day.", emoji: "✦" },
    { headline: "Your face,", sub: "your name.", body: "Pick an avatar and set your display name. Your real identity stays private until you choose.", emoji: "👤" },
    { headline: "Every act", sub: "earns XP.", body: "Track streaks, earn badges, and watch your kindness ripple outward across your community.", emoji: "🏆" },
    { headline: "You're in.", sub: "Let's go.", body: "The map is live. People nearby are waiting for your kindness right now.", emoji: "🎉" },
  ];
  const lc = LEFT_CONTENT[step] || LEFT_CONTENT[0];

  return (
    <div className="kw-cosmos kw-ob-grid" style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: T.white }}>
      <style>{CSS}</style>

      {/* ── LEFT BRANDED PANEL ── */}
      <div className="kw-ob-left" style={{ position: "relative", overflow: "hidden", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "80px 64px" }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
          {/* KCF wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 64 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg,${T.teal},${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 18 }}>K</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 16, color: T.white }}>KindWave</div>
              <div style={{ fontSize: 11, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase" }}>by KCF</div>
            </div>
          </div>

          {/* Dynamic headline */}
          <div key={`lc-${step}`} style={{ animation: "fadeUp .5s both" }}>
            <div style={{ fontSize: 72, marginBottom: 24, filter: `drop-shadow(0 0 24px ${T.teal}66)`, display: "inline-block", animation: "float3d 6s ease-in-out infinite" }}>{lc.emoji}</div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(2.4rem,4vw,3.6rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-1.5px", marginBottom: 16 }}>
              <span style={{ color: T.white }}>{lc.headline}</span><br />
              <span style={{ background: `linear-gradient(135deg,${T.teal},${T.violet})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{lc.sub}</span>
            </h1>
            <p style={{ color: T.muted, fontSize: 17, lineHeight: 1.75, marginBottom: 48 }}>{lc.body}</p>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 40 }}>
            {[["47K+", "Kind acts"], ["91", "Countries"], ["Free", "Forever"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, color: T.teal }}>{v}</div>
                <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Live activity feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.teal, display: "inline-block", animation: "pulse 2s infinite" }} />
              Happening right now
            </div>
            {[
              { emoji: "🚨", cat: "URGENT",    catColor: T.warm,   title: "Need a ride to the hospital",   time: "2m ago",  loc: "San Francisco" },
              { emoji: "💬", cat: "EMOTIONAL", catColor: T.violet, title: "Someone to talk to tonight",     time: "5m ago",  loc: "Oakland" },
              { emoji: "✅", cat: "GENERAL",   catColor: T.teal,   title: "Help carrying groceries",        time: "11m ago", loc: "Berkeley" },
            ].map((p, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, animation: `fadeUp .5s ${0.1 + i * 0.12}s both`, backdropFilter: "blur(8px)" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{p.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: T.white, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                  <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>{p.time} · {p.loc}</div>
                </div>
                <span style={{ flexShrink: 0, background: p.catColor + "20", border: `1px solid ${p.catColor}40`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: p.catColor, fontWeight: 700, letterSpacing: 0.5 }}>{p.cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="kw-ob-right" style={{ display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Progress bar (steps 2–6) */}
        {step >= 2 && step <= 6 && (
          <div style={{ display: "flex", gap: 4, padding: "24px 48px 0", flexShrink: 0 }}>
            {[2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: step >= i ? T.teal : T.border, transition: "background .4s", boxShadow: step >= i ? `0 0 6px ${T.tealGlow}` : "none" }} />
            ))}
          </div>
        )}
        <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px", animation: "fadeUp .45s cubic-bezier(.22,1,.36,1) both", minHeight: 0 }}>
          {screens[step]}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN APP SCREENS
// ══════════════════════════════════════════════════════

// Tooltip Guide (first-time overlay)
function TooltipGuide({ tab, onDismiss }) {
  const tips = {
    map:  { emoji: "🗺️", text: "Tap any pin to see a request. Tap + to post your own.", y: "70%" },
    help: { emoji: "💚", text: "Swipe cards to browse. Toggle the switch to offer help.", y: "30%" },
    heal: { emoji: "✦",  text: "Your healing journey starts here. Log a moment.", y: "50%" },
    me:   { emoji: "👤", text: "Track your XP, badges, and help history.", y: "50%" },
  };
  const tip = tips[tab];
  if (!tip) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "rgba(3,7,18,.95)", border: `1px solid ${T.borderHi}`, borderRadius: 16, padding: "14px 20px", width: 260, textAlign: "center", animation: "tooltipIn .35s both", backdropFilter: "blur(20px)", pointerEvents: "auto" }}>
        <div style={{ fontSize: 24, marginBottom: 6 }}>{tip.emoji}</div>
        <div style={{ color: T.white, fontSize: 13, lineHeight: 1.6 }}>{tip.text}</div>
        <button onClick={onDismiss} style={{ background: "none", border: `1px solid ${T.borderHi}`, borderRadius: 10, color: T.teal, fontSize: 12, fontWeight: 700, padding: "6px 16px", marginTop: 10, cursor: "pointer" }}>Got it ✓</button>
      </div>
    </div>
  );
}

// ── Modal overlay ─────────────────────────────────────
function Modal({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(3,7,18,0.88)", backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", animation: "fadeIn .2s both"
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#0d0d18", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24, width: "100%", maxWidth: 700,
        maxHeight: "88vh", overflowY: "auto",
        animation: "scaleIn .25s cubic-bezier(.22,1,.36,1) both",
        boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(244,63,94,0.08)"
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Geolocation + city name hook ────────────────────────
function useUserLocation() {
  const [loc, setLoc] = useState(null);       // { lat, lng }
  const [city, setCity] = useState("Your Area");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoc({ lat: 37.7749, lng: -122.4194 }); // San Francisco fallback
      setCity("Your Area");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLoc({ lat, lng });
        // Reverse geocode via Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const a = data.address || {};
          const name = a.city || a.town || a.village || a.county || a.state || "Your Area";
          setCity(name);
        } catch {
          setCity("Your Area");
        }
        setLoading(false);
      },
      () => {
        // Permission denied or unavailable — use a generic fallback
        setLoc({ lat: 37.7749, lng: -122.4194 });
        setCity("Your Area");
        setLoading(false);
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  return { loc, city, loading };
}

// Build a coloured SVG inline divIcon for Leaflet
function makePinIcon(color) {
  return L.divIcon({
    html: `<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 3px 5px ${color}aa);display:block"><path d="M17 0C7.6 0 0 7.6 0 17c0 11 17 27 17 27s17-16 17-27C34 7.6 26.4 0 17 0z" fill="${color}"/><circle cx="17" cy="16" r="7" fill="#030712" opacity=".85"/></svg>`,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -48],
    className: "",
  });
}

// "My location" pulse icon
const MY_LOC_ICON = L.divIcon({
  html: `<div style="position:relative;width:18px;height:18px"><div style="position:absolute;inset:-14px;border-radius:50%;background:rgba(244,63,94,.12);animation:pulse 2.2s infinite"></div><div style="width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#f43f5e,#ec4899);border:3px solid rgba(255,255,255,.92);box-shadow:0 0 0 4px rgba(244,63,94,.22),0 4px 14px rgba(244,63,94,.22)"></div></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  className: "",
});

// Scatter offset helper — places pins at real GPS offsets around user location
const SCATTER = [
  [-0.012, -0.018], [0.018, -0.008], [0.022, 0.019], [-0.009, 0.024],
  [0.031, -0.002], [-0.026, 0.013], [0.005, -0.031], [0.014, 0.028],
];

// Pans map to user's location when it becomes available
function MapAutoCenter({ loc }) {
  const map = useMap();
  useEffect(() => {
    if (loc) map.setView([loc.lat, loc.lng], 14, { animate: true });
  }, [loc, map]);
  return null;
}

// Map View
function MapView({ pins, onPin, onAdd, filterCats, setFilterCats }) {
  const { loc, city, loading } = useUserLocation();
  const vis = pins.filter(p => filterCats.length === 0 || filterCats.includes(p.cat));

  // Assign real lat/lng to each pin using scatter offsets
  const geopins = useMemo(() => {
    const base = loc || { lat: 37.7749, lng: -122.4194 };
    return vis.map((pin, i) => {
      const [dlat, dlng] = SCATTER[i % SCATTER.length];
      return { ...pin, lat: base.lat + dlat, lng: base.lng + dlng };
    });
  }, [vis, loc]);

  return (
    <div style={{ width: "100%" }}>
      {/* Hero bar */}
      <div className="section-hero" style={{ padding: "52px 32px 28px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ color: T.muted, fontSize: 13, fontWeight: 500, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.teal, display: "inline-block", animation: "pulse 2s infinite" }} />
              📍 {loading ? "Locating…" : city}
            </div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 40, fontWeight: 800, color: T.white, lineHeight: 1.1, letterSpacing: -1, marginBottom: 10 }}>
              Find Help Near You
            </h2>
            <p style={{ color: T.muted, fontSize: 15, marginBottom: 20 }}>
              <span style={{ color: T.teal, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{pins.length}</span> active requests nearby · tap any pin to view details
            </p>
            {/* Filter chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button className="press" onClick={() => setFilterCats([])} style={{ borderRadius: 20, padding: "7px 16px", background: filterCats.length === 0 ? `${T.teal}18` : "rgba(255,255,255,.04)", border: `1px solid ${filterCats.length === 0 ? T.tealDim : T.border}`, color: filterCats.length === 0 ? T.teal : T.muted, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>All</button>
              {CATS.map(c => {
                const on = filterCats.includes(c.id);
                return (
                  <button key={c.id} className="press" onClick={() => setFilterCats(f => on ? f.filter(x => x !== c.id) : [...f, c.id])} style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 20, padding: "7px 15px", background: on ? `${c.color}18` : "rgba(255,255,255,.04)", border: `1px solid ${on ? c.color : T.border}`, color: on ? c.color : T.muted, fontSize: 13, fontWeight: on ? 700 : 400, whiteSpace: "nowrap", transition: "all .2s" }}>
                    {c.emoji} {c.id}
                  </button>
                );
              })}
            </div>
          </div>
          <button className="btn-p press" onClick={onAdd} style={{ width: "auto", padding: "14px 28px", fontSize: 15, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>+</span> Post Request
          </button>
        </div>
      </div>

      {/* Real Leaflet Map — full width, no maxWidth */}
      <div style={{ height: "65vh", minHeight: 480, position: "relative" }}>
        {loading && (
          <div style={{ position: "absolute", inset: 0, zIndex: 500, background: T.deep, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${T.teal}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
            <span style={{ color: T.muted, fontSize: 13 }}>Getting your location…</span>
          </div>
        )}
        <MapContainer
          center={loc ? [loc.lat, loc.lng] : [37.7749, -122.4194]}
          zoom={14}
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {loc && <MapAutoCenter loc={loc} />}

          {/* User's real location */}
          {loc && (
            <Marker position={[loc.lat, loc.lng]} icon={MY_LOC_ICON} zIndexOffset={1000} />
          )}

          {/* Request pins */}
          {geopins.map((pin) => {
            const c = catOf(pin.cat);
            return (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={makePinIcon(c.color)}
                eventHandlers={{ click: () => onPin(pin) }}
              >
                <Popup className="kw-popup">
                  <div style={{ background: T.navy, border: `1px solid ${T.borderHi}`, borderRadius: 12, padding: "10px 14px", minWidth: 180, color: T.white, fontFamily: "inherit" }}>
                    <div style={{ fontSize: 12, color: c.color, fontWeight: 700, marginBottom: 4 }}>{c.emoji} {pin.urgency}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{pin.title}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{pin.user} · {pin.time} ago</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="glass" style={{ position: "absolute", bottom: 16, left: 16, borderRadius: 12, padding: "7px 11px", display: "flex", gap: 8, flexWrap: "wrap", maxWidth: "56%", zIndex: 1000 }}>
          {CATS.map(c => (<div key={c.id} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: c.color }} /><span style={{ fontSize: 10, color: T.muted }}>{c.id}</span></div>))}
        </div>
      </div>

      {/* Recent Requests preview strip */}
      <div style={{ padding: "24px 32px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ color: T.muted, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Recent Requests</div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
          {pins.slice(0, 8).map((pin) => {
            const c = catOf(pin.cat);
            return (
              <button key={pin.id} onClick={() => onPin(pin)} className="press" style={{ flexShrink: 0, background: T.panel, border: `1px solid ${T.border}`, borderLeft: `3px solid ${c.color}`, borderRadius: 14, padding: "14px 16px", textAlign: "left", width: 220, transition: "transform .2s, box-shadow .2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,.4)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 11, color: c.color, fontWeight: 700, marginBottom: 6 }}>{c.emoji} {c.id.toUpperCase()}</div>
                <div style={{ color: T.white, fontWeight: 700, fontSize: 13, marginBottom: 4, lineHeight: 1.3 }}>{pin.title}</div>
                <div style={{ color: T.muted, fontSize: 11 }}>🕐 {pin.time} ago</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Help Feed
function HelpFeed({ pins, onPin, isVol, setIsVol, onAdd, onXP, streak, checkedToday, onCheckIn, setView }) {
  const [tab, setTab] = useState("nearby");
  const list = tab === "urgent" ? pins.filter(p => p.urgency === "Urgent") : tab === "mine" ? pins.slice(0, 3) : pins;
  return (
    <div style={{ width: "100%" }}>
      {/* Section header */}
      <div className="section-hero" style={{ padding: "52px 32px 0", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 40, fontWeight: 800, color: T.white, lineHeight: 1.1, letterSpacing: -1, marginBottom: 8 }}>Help Requests</h2>
            <p style={{ color: isVol ? T.emerald : T.muted, fontSize: 15, fontWeight: isVol ? 600 : 400 }}>
              {isVol ? "● You're visible as available to nearby helpers" : "Browse requests or toggle to offer your help"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: isVol ? T.emerald : T.muted, fontWeight: 600 }}>{isVol ? "Online" : "Offline"}</span>
              <div onClick={() => { setIsVol(v => !v); if (!isVol) onXP(5); }} style={{ width: 48, height: 26, borderRadius: 13, cursor: "pointer", transition: "background .3s", background: isVol ? `linear-gradient(90deg,${T.emerald},${T.tealDim})` : "rgba(255,255,255,.1)", position: "relative", boxShadow: isVol ? `0 0 14px ${T.emerald}40` : "none" }}>
                <div style={{ position: "absolute", top: 3, left: isVol ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .3s" }} />
              </div>
            </div>
            <button className="btn-p press" onClick={onAdd} style={{ width: "auto", padding: "11px 22px", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <span>+</span> Post Request
            </button>
            <button className="press" onClick={() => setView("video")} style={{ background: `linear-gradient(135deg,${T.emerald}18,${T.teal}10)`, border: `1px solid ${T.emerald}44`, borderRadius: 12, padding: "11px 18px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📹</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: T.emerald, fontWeight: 700, fontSize: 13 }}>Help NOW</div>
                <div style={{ color: T.muted, fontSize: 11 }}>Instant video · 60s</div>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.emerald, animation: "callPulse 2s infinite" }} />
            </button>
          </div>
        </div>

        {/* Streak banner */}
        <div style={{ background: streak > 0 ? `linear-gradient(135deg,rgba(255,124,58,.12),rgba(255,61,90,.08))` : T.panel, border: `1px solid ${streak > 0 ? T.warm + "44" : T.border}`, borderRadius: 16, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, marginBottom: 20, backdropFilter: "blur(20px)" }}>
          <div style={{ fontSize: 36, animation: streak > 0 ? "fireDance 2s ease-in-out infinite" : "none", lineHeight: 1 }}>{streak > 0 ? "🔥" : "🌱"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 24, color: streak > 0 ? T.warm : T.muted }}>{streak}</span>
              <span style={{ color: T.muted, fontSize: 14 }}>day streak</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,.08)", borderRadius: 3, overflow: "hidden", maxWidth: 280 }}>
              <div style={{ height: "100%", background: streak > 0 ? `linear-gradient(90deg,${T.warm},${T.urgent})` : T.muted, borderRadius: 3, width: Math.round((streak / ((() => { const m = [3,7,14,30,60,100]; return m.find(x => x > streak) || 100; })()) * 100)) + "%", transition: "width 1s cubic-bezier(.22,1,.36,1)" }} />
            </div>
          </div>
          {!checkedToday ? (
            <button className="press" onClick={onCheckIn} style={{ background: `linear-gradient(135deg,${T.warm},${T.urgent})`, border: "none", borderRadius: 12, padding: "10px 18px", color: T.white, fontSize: 13, fontWeight: 700, flexShrink: 0, boxShadow: `0 4px 14px ${T.warm}44` }}>
              Check in +20 XP
            </button>
          ) : (
            <div style={{ background: `${T.emerald}18`, border: `1px solid ${T.emerald}44`, borderRadius: 10, padding: "8px 14px", fontSize: 12, color: T.emerald, fontWeight: 700 }}>✓ Done today!</div>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 0 }}>
          {[["nearby", "Nearby"], ["urgent", "🚨 Urgent"], ["mine", "My Posts"]].map(([v, l]) => (
            <button key={v} className="press" onClick={() => setTab(v)} style={{ padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: tab === v ? 700 : 400, background: tab === v ? `${T.teal}16` : "rgba(255,255,255,.04)", border: `1px solid ${tab === v ? T.tealDim : T.border}`, color: tab === v ? T.teal : T.muted, transition: "all .2s" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div style={{ padding: "24px 32px 60px", maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 24 }}>
        {list.map((pin, i) => {
          const c = catOf(pin.cat);
          return (
            <button key={pin.id} onClick={() => onPin(pin)} className="press" style={{ width: "100%", textAlign: "left", background: T.panel, backdropFilter: "blur(20px)", border: `1px solid ${T.border}`, borderLeft: `4px solid ${c.color}`, borderRadius: 18, padding: 24, boxShadow: `0 4px 20px rgba(0,0,0,.22)`, animation: `fadeUp .4s ${i * .06}s both`, transition: "transform .22s, box-shadow .22s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,.4), 0 0 0 1px ${c.color}33`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,.22)`; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, boxShadow: `0 0 7px ${c.color}` }} />
                  <span style={{ fontSize: 11, color: c.color, fontWeight: 700, letterSpacing: .5 }}>{c.label.toUpperCase()}</span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {pin.urgency === "Urgent" && <span style={{ fontSize: 10, color: T.urgent, background: `${T.urgent}1a`, border: `1px solid ${T.urgent}38`, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>URGENT</span>}
                  {pin.verified && <span style={{ fontSize: 13, color: T.teal }}>✦</span>}
                </div>
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, color: T.white, fontSize: 16, marginBottom: 7 }}>{pin.title}</div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.55 }}>{pin.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 12, color: T.muted }}>👤 {pin.user}</span>
                <span style={{ fontSize: 12, color: T.muted }}>🕐 {pin.time} ago</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Pin Detail
function PinDetail({ pin, onBack, onChat, onAccept, accepted }) {
  const c = catOf(pin.cat);
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", paddingBottom: 60 }}>
      <div style={{ height: 4, background: `linear-gradient(90deg,${c.color},${c.color}55)`, boxShadow: `0 0 16px ${c.color}60` }} />
      <div style={{ padding: "24px 24px 40px" }}>
        <button className="glass press" onClick={onBack} style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: "7px 14px", color: T.muted, fontSize: 13, marginBottom: 22 }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, boxShadow: `0 0 9px ${c.color}` }} />
          <span style={{ color: c.color, fontWeight: 700, fontSize: 12, letterSpacing: .8 }}>{c.label.toUpperCase()}</span>
          {pin.urgency === "Urgent" && <span style={{ fontSize: 10, color: T.urgent, background: `${T.urgent}16`, border: `1px solid ${T.urgent}38`, padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>🚨 URGENT</span>}
        </div>
        <h2 className="fu" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 26, fontWeight: 800, color: T.white, lineHeight: 1.22, marginBottom: 14 }}>{pin.title}</h2>
        <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.75, marginBottom: 22 }}>{pin.desc}</p>
        <div className="glass" style={{ borderRadius: 16, padding: 18, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[["Posted by", pin.user], ["Time", pin.time + " ago"], ["Urgency", pin.urgency]].map(([l, v]) => (
            <div key={l}><div style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: .5, marginBottom: 4 }}>{l.toUpperCase()}</div><div style={{ color: T.white, fontWeight: 600, fontSize: 13 }}>{v}</div></div>
          ))}
        </div>
        {pin.urgency === "Urgent" && (
          <div style={{ background: `${T.urgent}0e`, border: `1px solid ${T.urgent}28`, borderRadius: 14, padding: 14, marginBottom: 18 }}>
            <p style={{ color: T.urgent, fontSize: 13, margin: 0, lineHeight: 1.6 }}>⚠️ Not a substitute for emergency services. Immediate danger? Call <strong>112</strong>.</p>
          </div>
        )}
        {accepted ? (
          <div className="glassHi si" style={{ borderRadius: 16, padding: 18, textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <div style={{ color: T.teal, fontWeight: 700, fontSize: 17 }}>You accepted this request!</div>
            <div style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>Chat with {pin.user} to coordinate</div>
          </div>
        ) : (
          <button className="btn-p press" onClick={() => onAccept(pin)} style={{ marginBottom: 10 }}>✓ Accept This Request</button>
        )}
        <button className="press glass" onClick={() => onChat(pin)} style={{ width: "100%", border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px 0", color: T.muted, fontSize: 15, fontWeight: 600 }}>💬 Open Chat</button>
      </div>
    </div>
  );
}

// Chat
function ChatView({ pin, onBack }) {
  const [msgs, setMsgs] = useState([
    { from: "them", text: "Hi! I saw your request. About 10 min away.", time: "5:42 PM" },
    { from: "me", text: "Oh thank god! I'm outside the pharmacy on MG Road.", time: "5:43 PM" },
    { from: "them", text: "Perfect. Blue Honda City. On my way 🙏", time: "5:44 PM" },
  ]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const bot = useRef();
  const c = catOf(pin.cat);

  useEffect(() => { bot.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = () => {
    if (!inp.trim()) return;
    const now = new Date(), tm = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} PM`;
    setMsgs(m => [...m, { from: "me", text: inp, time: tm }]);
    setInp(""); setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs(m => [...m, { from: "them", text: "Thank you so much 🙏", time: tm }]); }, 2000);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", minHeight: 560 }}>
      <div className="glass" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 13, borderBottom: `1px solid ${T.border}` }}>
        <button className="press" onClick={onBack} style={{ background: "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 10, padding: "7px 11px", color: T.muted, fontSize: 13 }}>←</button>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${c.color}38,${c.color}18)`, border: `1.5px solid ${c.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.emoji}</div>
        <div style={{ flex: 1 }}><div style={{ color: T.white, fontWeight: 700, fontSize: 15 }}>{pin.user}</div><div style={{ color: c.color, fontSize: 12 }}>{pin.title.slice(0, 32)}…</div></div>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.emerald, boxShadow: `0 0 6px ${T.emerald}` }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="glass" style={{ borderRadius: 12, padding: 11, textAlign: "center", marginBottom: 4 }}>
          <p style={{ color: T.muted, fontSize: 12, margin: 0 }}>🔒 Contact masked until mutual consent · About: <strong style={{ color: T.white }}>{pin.title.slice(0, 28)}…</strong></p>
        </div>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start", animation: "msgIn .25s both" }}>
            <div style={{ maxWidth: "72%", background: m.from === "me" ? `linear-gradient(135deg,${T.teal},${T.tealDim})` : T.panel, backdropFilter: "blur(20px)", color: m.from === "me" ? T.deep : T.white, padding: "11px 15px", borderRadius: m.from === "me" ? "20px 20px 4px 20px" : "20px 20px 20px 4px", fontSize: 14, lineHeight: 1.5, boxShadow: m.from === "me" ? `0 4px 16px ${T.tealGlow}` : "0 4px 12px rgba(0,0,0,.3)" }}>
              {m.text}
              <div style={{ fontSize: 10, opacity: .6, marginTop: 4, textAlign: "right" }}>{m.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 4, padding: "11px 15px", background: T.panel, backdropFilter: "blur(20px)", borderRadius: "20px 20px 20px 4px", width: "fit-content" }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.muted, animation: `pulse .9s ${i * .2}s infinite` }} />)}
          </div>
        )}
        <div ref={bot} />
      </div>
      <div style={{ padding: "10px 16px 16px", display: "flex", gap: 10, background: `rgba(5,9,26,.96)`, borderTop: `1px solid ${T.border}` }}>
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message…"
          style={{ flex: 1, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 24, padding: "11px 17px", color: T.white, fontSize: 14, outline: "none", transition: "border-color .2s", backdropFilter: "blur(20px)" }}
          onFocus={e => { e.target.style.borderColor = T.tealDim; }} onBlur={e => { e.target.style.borderColor = T.border; }} />
        <button className="press" onClick={send} style={{ background: `linear-gradient(135deg,${T.teal},${T.tealDim})`, border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: T.deep, fontSize: 18, boxShadow: `0 4px 12px ${T.tealGlow}`, flexShrink: 0 }}>↑</button>
      </div>
    </div>
  );
}

// Post Request
function PostRequest({ onBack, onPost }) {
  const [form, setForm] = useState({ title: "", desc: "", cat: "general", urgency: "Standard" });
  const [done, setDone] = useState(false);
  const submit = () => {
    if (!form.title) return;
    setDone(true);
    setTimeout(() => { onPost(form); onBack(); }, 2200);
  };
  if (done) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", position: "relative" }}>
      <OrbBg cols={[T.teal, T.emerald]} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 28px" }}>
          {[1, 2, 3].map(i => <div key={i} style={{ position: "absolute", inset: `${-i * 16}px`, borderRadius: "50%", border: `2px solid ${T.teal}`, opacity: 1 - i * .24, animation: `rippleOut ${1 + i * .4}s ease-out infinite`, animationDelay: `${i * .25}s` }} />)}
          <div style={{ position: "absolute", inset: 22, borderRadius: "50%", background: `linear-gradient(135deg,${T.teal},${T.tealDim})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>🌊</div>
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 28, fontWeight: 800, color: T.teal, marginBottom: 10 }}>Request Posted!</h2>
        <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.65 }}>Your request is now live on the map.<br />Nearby helpers have been notified. 🙏</p>
      </div>
    </div>
  );
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
      <div className="glass" style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${T.border}` }}>
        <button className="press" onClick={onBack} style={{ background: "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 10, padding: "7px 13px", color: T.muted, fontSize: 13 }}>← Back</button>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 20, color: T.white }}>Post a Request</h2>
      </div>
      <div style={{ padding: "24px 24px 60px", display: "flex", flexDirection: "column", gap: 17 }}>
        <div><label style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Title</label>
          <input className="inp" maxLength={80} placeholder="What do you need help with?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
        <div><label style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Description</label>
          <textarea className="inp" maxLength={500} rows={4} placeholder="Describe your situation…" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} style={{ resize: "none", lineHeight: 1.6 }} /></div>
        <div><label style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Category</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {CATS.map(c => {
              const sel = form.cat === c.id;
              return (
                <button key={c.id} className="press" onClick={() => setForm(f => ({ ...f, cat: c.id }))} style={{ display: "flex", alignItems: "center", gap: 12, background: sel ? `${c.color}10` : "rgba(255,255,255,.02)", border: `1px solid ${sel ? c.color : T.border}`, borderRadius: 14, padding: "12px 15px", transition: "all .2s", textAlign: "left", width: "100%" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: sel ? `${c.color}25` : `${c.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, transition: "all .2s" }}>{c.emoji}</div>
                  <span style={{ color: sel ? c.color : T.muted, fontWeight: sel ? 700 : 400, fontSize: 14, flex: 1 }}>{c.label}</span>
                  {sel && <span style={{ color: c.color, fontSize: 16 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div><label style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 9 }}>Urgency</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[["Urgent", T.urgent], ["Standard", T.teal], ["Flexible", T.muted]].map(([v, col]) => (
              <button key={v} className="press" onClick={() => setForm(f => ({ ...f, urgency: v }))} style={{ flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 13, fontWeight: form.urgency === v ? 700 : 400, background: form.urgency === v ? `${col}14` : "rgba(255,255,255,.02)", border: `1px solid ${form.urgency === v ? col : T.border}`, color: form.urgency === v ? col : T.muted, transition: "all .2s" }}>{v}</button>
            ))}
          </div>
        </div>
        <button className="btn-p press" onClick={submit} style={{ opacity: form.title ? 1 : .38, pointerEvents: form.title ? "auto" : "none" }}>
          Post to Map 🗺️
        </button>
      </div>
    </div>
  );
}

// Healing View
function HealingView({ user, xp, onXP }) {
  const [tab, setTab] = useState("log");
  const [mood, setMood] = useState(null);
  const [jt, setJt] = useState("");
  const [entries, setEntries] = useState([]);
  const helpsGiven = Math.floor(xp / 40);
  const MOODS = ["😔", "😐", "🙂", "😊", "🌟"];

  const saveJournal = () => {
    if (!jt.trim()) return;
    setEntries(prev => [{ text: jt, date: new Date().toLocaleDateString(), mood }, ...prev]);
    setJt(""); setMood(null);
    onXP(15);
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ padding: "52px 32px 28px", maxWidth: 1100, margin: "0 auto", background: `linear-gradient(180deg,rgba(167,139,250,0.08) 0%,transparent 100%)`, position: "relative" }}>
        <OrbBg cols={[T.violet, T.warm]} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 40, fontWeight: 800, color: T.white, letterSpacing: -1, lineHeight: 1.1, marginBottom: 10 }}>Your Healing Journey</h2>
          <p style={{ color: T.muted, fontSize: 16, marginBottom: 20 }}>Track your growth, gratitude & impact</p>
          <XPBar xp={xp} inline />
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            {[["log", "✦ Miracles"], ["journal", "📝 Journal"], ["ripple", "🌊 Ripple"]].map(([v, l]) => (
              <button key={v} className="press" onClick={() => setTab(v)} style={{ padding: "12px 24px", borderRadius: 14, fontSize: 14, fontWeight: tab === v ? 700 : 400, background: tab === v ? `${T.violet}1e` : "rgba(255,255,255,.04)", border: `1px solid ${tab === v ? T.violet : T.border}`, color: tab === v ? T.violet : T.muted, transition: "all .2s" }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: "24px 32px 60px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "log" && (
          <div className="fu">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 20 }}>
              {[["Helps Given", helpsGiven, T.urgent], ["Ripples", helpsGiven * 3, T.teal], ["XP", xp, T.gold]].map(([l, v, col]) => (
                <div key={l} className="glass" style={{ borderRadius: 16, padding: 15, textAlign: "center", border: `1px solid ${col}22`, boxShadow: `0 0 18px ${col}0e` }}>
                  <div style={{ color: col, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, animation: "countUp .5s both" }}>{v}</div>
                  <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", color: T.white, fontWeight: 700, fontSize: 16, marginBottom: 11 }}>Badges Earned</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {BADGES.slice(0, 4).map(b => (
                <TiltCard key={b.id} className="glass" style={{ borderRadius: 14, padding: "16px 14px", textAlign: "center", border: `1px solid ${T.gold}22`, boxShadow: `0 0 12px ${T.gold}0c` }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{b.emoji}</div>
                  <div style={{ color: T.white, fontSize: 13, fontWeight: 700 }}>{b.name}</div>
                  <div style={{ color: T.muted, fontSize: 11, marginTop: 3 }}>{b.desc}</div>
                  <div style={{ color: T.gold, fontSize: 11, marginTop: 5, fontWeight: 700 }}>+{b.xp} XP</div>
                </TiltCard>
              ))}
            </div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", color: T.white, fontWeight: 700, fontSize: 16, marginBottom: 11 }}>Recent Moments</h3>
            {[{ icon: "💜", col: T.urgent, title: "Helped Rahul M.", desc: "Provided cab fare · 2h ago", badge: "+3 ripples" }, { icon: "💬", col: T.warm, title: "Emotional support", desc: "Listened for 30 min · Yesterday", badge: "+5 ripples" }, { icon: "✦", col: T.teal, title: "Gratitude received", desc: '"You changed my day" · 2d ago', badge: "✨ Miracle" }].map((item, i) => (
              <div key={i} className="glass hov" style={{ display: "flex", gap: 12, borderRadius: 16, padding: "13px 15px", marginBottom: 9, alignItems: "flex-start", animation: `fadeUp .4s ${i * .08}s both`, borderLeft: `3px solid ${item.col}30` }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${item.col}16`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: T.white, fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                  <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>{item.desc}</div>
                </div>
                <span style={{ fontSize: 11, color: T.teal, background: `${T.teal}13`, border: `1px solid ${T.teal}28`, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{item.badge}</span>
              </div>
            ))}
          </div>
        )}
        {tab === "journal" && (
          <div className="fu">
            <div className="glass" style={{ borderRadius: 18, padding: 20, marginBottom: 14 }}>
              <div style={{ color: T.teal, fontStyle: "italic", fontSize: 15, lineHeight: 1.65, marginBottom: 16, borderLeft: `3px solid ${T.teal}`, paddingLeft: 13 }}>
                "How did helping someone today shift your own heart?"
              </div>
              <div style={{ marginBottom: 13 }}>
                <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: .9, marginBottom: 10 }}>HOW ARE YOU FEELING?</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  {MOODS.map((e, i) => (<button key={i} className="press" onClick={() => setMood(i)} style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer", transform: mood === i ? "scale(1.35)" : "scale(1)", transition: "transform .2s", filter: mood === i ? "drop-shadow(0 0 8px gold)" : "none" }}>{e}</button>))}
                </div>
              </div>
              <textarea className="inp" value={jt} onChange={e => setJt(e.target.value)} placeholder="Write your thoughts here…" rows={5} style={{ resize: "none", lineHeight: 1.65, width: "100%", boxSizing: "border-box" }} />
              <button className="btn-p press" onClick={saveJournal} style={{ marginTop: 13 }}>Save Entry (+15 XP)</button>
            </div>
            {entries.map((e, i) => (
              <div key={i} className="glass" style={{ borderRadius: 16, padding: 15, marginBottom: 9, animation: "fadeUp .3s both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}><span style={{ color: T.muted, fontSize: 12 }}>{e.date}</span>{e.mood != null && <span style={{ fontSize: 20 }}>{MOODS[e.mood]}</span>}</div>
                <p style={{ color: T.muted, fontSize: 14, margin: 0, lineHeight: 1.65 }}>{e.text}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "ripple" && (
          <div className="fu" style={{ textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", color: T.white, fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Your Ripple Effect</h3>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 30 }}>Each act of kindness ripples outward forever</p>
            <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto 28px" }}>
              {[1, 2, 3, 4].map(i => (<div key={i} style={{ position: "absolute", inset: `${i * 18}px`, borderRadius: "50%", border: `1.5px solid ${T.teal}`, opacity: 1 - i * .2, animation: `rippleOut ${1.2 + i * .5}s ease-out infinite`, animationDelay: `${i * .3}s` }} />))}
              <div style={{ position: "absolute", inset: 70, borderRadius: "50%", background: `linear-gradient(135deg,${T.teal},${T.tealDim})`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: `0 0 34px ${T.tealGlow}` }}>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 28, color: T.deep }}>{helpsGiven * 3}</div>
                <div style={{ fontSize: 10, color: `${T.deep}99`, fontWeight: 700 }}>ripples</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
              {[["People Helped", helpsGiven, T.urgent], ["2nd Connections", helpsGiven * 2, T.warm], ["Gratitude Notes", Math.floor(helpsGiven * .7), T.violet], ["Impact Score", `${helpsGiven * 12}pts`, T.teal]].map(([l, v, col]) => (
                <div key={l} className="glass" style={{ borderRadius: 16, padding: 17, border: `1px solid ${col}22` }}>
                  <div style={{ color: col, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26 }}>{v}</div>
                  <div style={{ color: T.muted, fontSize: 12, marginTop: 5 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Profile View
function ProfileView({ user, xp, onXP, onLogout }) {
  const [tab, setTab] = useState("me");
  const lv = levelOf(xp);

  return (
    <div style={{ width: "100%" }}>
      {/* Profile hero strip */}
      <div style={{ padding: "52px 32px 28px", maxWidth: 900, margin: "0 auto", background: `linear-gradient(180deg,rgba(244,63,94,0.07) 0%,transparent 100%)`, position: "relative" }}>
        <OrbBg cols={[T.teal, T.violet]} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Avatar + name — horizontal hero */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${T.teal},${T.violet})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, boxShadow: `0 0 0 4px ${T.deep},0 0 0 6px ${T.tealDim}`, animation: "float3d 8s ease-in-out infinite" }}>{user.avatar || "🌱"}</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", color: T.white, fontWeight: 800, fontSize: 32, lineHeight: 1.1, marginBottom: 6 }}>{user.name || "Friend"}</div>
              <div style={{ color: T.teal, fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{lv.emoji} {lv.name} · {xp} XP</div>
              <div style={{ color: T.muted, fontSize: 13 }}>Member since March 2026</div>
            </div>
          </div>
          <XPBar xp={xp} inline />
          {/* Tab bar */}
          <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
            {[["me", "Profile"], ["settings", "Settings"], ["admin", "Admin"]].map(([v, l]) => (
              <button key={v} className="press" onClick={() => setTab(v)} style={{ padding: "12px 24px", borderRadius: 14, fontSize: 14, fontWeight: tab === v ? 700 : 400, background: tab === v ? `${T.teal}16` : "rgba(255,255,255,.04)", border: `1px solid ${tab === v ? T.tealDim : T.border}`, color: tab === v ? T.teal : T.muted, transition: "all .2s" }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px 60px", maxWidth: 900, margin: "0 auto" }}>
        {tab === "me" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: 18 }}>
              {[["Given", Math.floor(xp / 40), T.teal], ["Received", 2, T.violet], ["Ripples", Math.floor(xp / 40) * 3, T.warm]].map(([l, v, col]) => (
                <div key={l} className="glass" style={{ borderRadius: 16, padding: 15, textAlign: "center", border: `1px solid ${col}22` }}>
                  <div style={{ color: col, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26 }}>{v}</div>
                  <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
            <h3 style={{ color: T.white, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>My Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
              {(user.cats && user.cats.length > 0 ? user.cats : ["emotional", "general"]).map(s => {
                const c = catOf(s);
                return (<span key={s} style={{ background: `${c.color}13`, color: c.color, border: `1px solid ${c.color}32`, borderRadius: 20, padding: "5px 13px", fontSize: 13, fontWeight: 600 }}>{c.emoji} {c.label}</span>);
              })}
            </div>
            <h3 style={{ color: T.white, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Help History</h3>
            {[["Emotional support session", "emotional", "Today", true], ["Carry groceries – Mrs. Kapoor", "general", "Yesterday", true], ["Ride to hospital", "urgent", "Mar 24", false]].map(([t, ci, d, given], i) => {
              const c = catOf(ci);
              return (
                <div key={i} className="glass hov" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 14, padding: "13px 15px", marginBottom: 8, animation: `fadeUp .3s ${i * .08}s both`, borderLeft: `3px solid ${c.color}28` }}>
                  <div><div style={{ color: T.white, fontWeight: 600, fontSize: 14 }}>{t}</div><div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{d}</div></div>
                  <span style={{ fontSize: 11, color: given ? T.teal : T.violet, background: given ? `${T.teal}13` : `${T.violet}13`, border: `1px solid ${given ? T.tealDim + "44" : T.violet + "44"}`, padding: "4px 11px", borderRadius: 20 }}>{given ? "Given" : "Received"}</span>
                </div>
              );
            })}
          </div>
        )}
        {tab === "settings" && (
          <div>
            {[["Anonymous mode", "Post without showing your name", true], ["Location privacy", "Approximate zone only", true], ["Urgent alerts", "Notifications for nearby urgent requests", false], ["Audio features", "Background music & narration", false]].map(([l, s, d], i) => (
              <div key={i} className="glass" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 16, padding: "15px 17px", marginBottom: 9, animation: `fadeUp .3s ${i * .08}s both` }}>
                <div><div style={{ color: T.white, fontSize: 14, fontWeight: 600 }}>{l}</div><div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{s}</div></div>
                <ToggleSwitch def={d} />
              </div>
            ))}
            <button className="press" onClick={onLogout} style={{ width: "100%", marginTop: 22, background: "transparent", border: `1px solid ${T.urgent}44`, borderRadius: 16, padding: "14px 0", color: T.urgent, fontSize: 15, fontWeight: 600, transition: "background .2s" }}>Sign Out</button>
          </div>
        )}
        {tab === "admin" && (
          <div>
            <div style={{ background: `${T.violet}10`, border: `1px solid ${T.violet}28`, borderRadius: 14, padding: 13, marginBottom: 14 }}>
              <div style={{ color: T.violet, fontWeight: 700, fontSize: 14 }}>🛡️ Admin Panel · Demo Mode</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Real-time moderation and analytics</div>
            </div>
            {[["🚨", "Flagged Queue", "3 pending", T.urgent], ["⚡", "Urgent Active", "2 now", T.warm], ["👤", "New Today", "47 users", T.teal], ["✦", "Active Now", "1,204", T.emerald], ["💬", "Live Chats", "89", T.violet], ["✓", "Fulfilled Today", "127", T.rose]].map(([ic, l, v, col], i) => (
              <div key={i} className="glass hov" style={{ display: "flex", alignItems: "center", gap: 13, borderRadius: 16, padding: "13px 15px", marginBottom: 9, animation: `fadeUp .3s ${i * .07}s both`, border: `1px solid ${col}13` }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${col}16`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{ic}</div>
                <div style={{ flex: 1, color: T.white, fontSize: 14, fontWeight: 600 }}>{l}</div>
                <span style={{ color: col, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 18 }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// FEATURE 1: DAILY KINDNESS STREAK
// ══════════════════════════════════════════════════════

function StreakBanner({ streak, checkedToday, onCheckIn }) {
  const nextMilestone = STREAK_MILESTONES.find(m => m > streak) || 100;
  const pct = Math.round((streak / nextMilestone) * 100);
  return (
    <div style={{ margin: "20px auto 0", maxWidth: 1280, padding: "0 24px" }}>
    <div style={{ background: streak > 0 ? `linear-gradient(135deg,rgba(255,124,58,.12),rgba(255,61,90,.08))` : T.panel, border: `1px solid ${streak > 0 ? T.warm + "44" : T.border}`, borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, backdropFilter: "blur(20px)" }}>
      <div style={{ fontSize: 32, animation: streak > 0 ? "fireDance 2s ease-in-out infinite" : "none", lineHeight: 1 }}>
        {streak > 0 ? "🔥" : "🌱"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, color: streak > 0 ? T.warm : T.muted }}>{streak}</span>
          <span style={{ color: T.muted, fontSize: 13 }}>day streak · next milestone: {nextMilestone}</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,.08)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", background: streak > 0 ? `linear-gradient(90deg,${T.warm},${T.urgent})` : T.muted, borderRadius: 3, width: pct + "%", transition: "width 1s cubic-bezier(.22,1,.36,1)" }} />
        </div>
      </div>
      {!checkedToday && (
        <button className="press" onClick={onCheckIn} style={{ background: `linear-gradient(135deg,${T.warm},${T.urgent})`, border: "none", borderRadius: 12, padding: "8px 14px", color: T.white, fontSize: 12, fontWeight: 700, flexShrink: 0, boxShadow: `0 4px 14px ${T.warm}44` }}>
          Check in
        </button>
      )}
      {checkedToday && (
        <div style={{ background: `${T.emerald}18`, border: `1px solid ${T.emerald}44`, borderRadius: 10, padding: "6px 10px", fontSize: 11, color: T.emerald, fontWeight: 700 }}>Done today!</div>
      )}
    </div>
    </div>
  );
}

function StreakView({ streak, shields, checkedToday, onCheckIn, onUseShield, user, xp, badgeList }) {
  const [tab, setTab] = useState("streak");
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const activeDays = Array.from({ length: 7 }, (_, i) => i < (streak % 7 || (streak > 0 ? 7 : 0)));
  const nextMilestone = STREAK_MILESTONES.find(m => m > streak) || 100;
  const pct = Math.round((streak / nextMilestone) * 100);

  return (
    <div style={{ width: "100%" }}>
      {/* Hero header */}
      <div style={{ padding: "52px 32px 32px", maxWidth: 900, margin: "0 auto", background: `linear-gradient(180deg,rgba(255,90,40,.10) 0%,transparent 100%)`, position: "relative" }}>
        <OrbBg cols={[T.warm, T.urgent, T.gold]} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Big flame + count — HERO element */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 96, animation: streak > 0 ? "fireDance 1.8s ease-in-out infinite" : "none", display: "inline-block", filter: streak > 0 ? `drop-shadow(0 0 32px ${T.warm}99)` : "none", lineHeight: 1, marginBottom: 8 }}>
              {streak > 0 ? "🔥" : "🌱"}
            </div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 88, fontWeight: 800, color: streak > 0 ? T.warm : T.muted, lineHeight: 1, animation: streak > 0 ? "streakPop .6s both" : "none" }}>
              {streak}
            </div>
            <div style={{ color: T.muted, fontSize: 18, marginTop: 10, fontWeight: 500 }}>day kindness streak</div>
          </div>

          {/* Progress to next milestone — as a proper card */}
          <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 20, padding: "18px 24px", marginBottom: 20, backdropFilter: "blur(20px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: T.muted, fontSize: 14 }}>Toward {nextMilestone}-day milestone</span>
              <span style={{ color: T.warm, fontSize: 14, fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={{ height: 10, background: "rgba(255,255,255,.07)", borderRadius: 5, overflow: "hidden" }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg,${T.gold},${T.warm},${T.urgent})`, borderRadius: 5, width: pct + "%", transition: "width 1.2s cubic-bezier(.22,1,.36,1)" }} />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8 }}>
            {[["streak", "🔥 Streak"], ["league", "🏆 League"], ["milestones", "🎯 Goals"]].map(([v, l]) => (
              <button key={v} className="press" onClick={() => setTab(v)} style={{ flex: 1, padding: "12px 8px", borderRadius: 14, fontSize: 14, fontWeight: tab === v ? 700 : 400, background: tab === v ? `${T.warm}18` : "rgba(255,255,255,.04)", border: `1px solid ${tab === v ? T.warm : T.border}`, color: tab === v ? T.warm : T.muted, transition: "all .2s" }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 32px 60px", maxWidth: 900, margin: "0 auto" }}>

        {/* STREAK TAB */}
        {tab === "streak" && (
          <div className="fu">
            {/* 7-day calendar strip */}
            <div className="glass" style={{ borderRadius: 16, padding: "16px", marginBottom: 14 }}>
              <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>This week</div>
              <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
                {days.map((d, i) => {
                  const active = activeDays[i];
                  const isToday = i === new Date().getDay() - 1 || i === 6;
                  return (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>{d}</div>
                      <div style={{ width: "100%", aspectRatio: "1", borderRadius: 10, background: active ? `linear-gradient(135deg,${T.warm},${T.urgent})` : "rgba(255,255,255,.05)", border: `1px solid ${isToday ? T.teal : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: active ? `0 0 10px ${T.warm}44` : "none", animation: active ? `heatIn .4s ${i * .06}s both` : "none" }}>
                        {active ? "🔥" : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shield bank */}
            <div className="glass" style={{ borderRadius: 16, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ color: T.white, fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Streak Shields</div>
                  <div style={{ color: T.muted, fontSize: 12 }}>Use one to protect a missed day</div>
                </div>
                <div style={{ color: T.violet, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22 }}>{shields}</div>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} style={{ width: 48, height: 48, borderRadius: 12, background: i < shields ? `${T.violet}22` : "rgba(255,255,255,.04)", border: `1px solid ${i < shields ? T.violet : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, animation: i < shields ? `shieldFloat ${2 + i * .5}s ease-in-out infinite` : "none" }}>
                    {i < shields ? "🛡️" : ""}
                  </div>
                ))}
              </div>
              {shields > 0 && streak === 0 && (
                <button className="btn-p press" onClick={onUseShield} style={{ padding: "12px 0", fontSize: 14 }}>
                  Use Shield — protect yesterday's streak
                </button>
              )}
              {shields === 0 && (
                <div style={{ color: T.muted, fontSize: 13 }}>Earn shields by reaching 3-day milestones</div>
              )}
            </div>

            {/* Check-in CTA */}
            {!checkedToday ? (
              <button className="btn-p press" onClick={onCheckIn} style={{ animation: "glow 3s ease-in-out infinite" }}>
                🔥 Check in for today (+20 XP)
              </button>
            ) : (
              <div style={{ background: `${T.emerald}14`, border: `1px solid ${T.emerald}44`, borderRadius: 16, padding: 18, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔥</div>
                <div style={{ color: T.emerald, fontWeight: 700, fontSize: 16 }}>Streak alive! Come back tomorrow.</div>
                <div style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>You've checked in for day {streak}</div>
              </div>
            )}
          </div>
        )}

        {/* LEAGUE TAB */}
        {tab === "league" && (
          <div className="fu">
            <div className="glass" style={{ borderRadius: 16, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Gurugram Weekly League</div>
              {[{ name: user?.name || "You", avatar: user?.avatar || "🌱", streak, ripples: streak * 3, isMe: true }, ...LEAGUE].sort((a, b) => b.streak - a.streak).map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < LEAGUE.length ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ width: 24, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 14, color: i === 0 ? T.gold : i === 1 ? T.muted : i === 2 ? T.warm : T.muted, textAlign: "center" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: p.isMe ? `linear-gradient(135deg,${T.teal},${T.violet})` : `${T.warm}22`, border: p.isMe ? `2px solid ${T.teal}` : `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {p.avatar || p.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: p.isMe ? T.teal : T.white, fontWeight: p.isMe ? 700 : 500, fontSize: 14 }}>{p.name}{p.isMe ? " (you)" : ""}</div>
                    <div style={{ color: T.muted, fontSize: 12 }}>{p.ripples} ripples this week</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 14 }}>🔥</span>
                    <span style={{ color: T.warm, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 16 }}>{p.streak}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ color: T.muted, fontSize: 12, textAlign: "center" }}>League resets every Sunday · Top 3 earn bonus XP</div>
          </div>
        )}

        {/* MILESTONES TAB */}
        {tab === "milestones" && (
          <div className="fu">
            {STREAK_MILESTONES.map((m, i) => {
              const done = streak >= m;
              const next = streak < m && (i === 0 || streak >= STREAK_MILESTONES[i - 1]);
              return (
                <div key={m} style={{ display: "flex", alignItems: "center", gap: 14, background: done ? `${T.warm}10` : "rgba(255,255,255,.025)", border: `1px solid ${done ? T.warm + "44" : next ? T.teal + "44" : T.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10, animation: `fadeUp .4s ${i * .08}s both` }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: done ? `linear-gradient(135deg,${T.warm},${T.urgent})` : next ? `${T.teal}18` : "rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: done ? `0 0 16px ${T.warm}44` : "none", flexShrink: 0 }}>
                    {done ? "🔥" : next ? "🎯" : "🔒"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: done ? T.warm : next ? T.white : T.muted, fontWeight: done || next ? 700 : 400, fontSize: 15, marginBottom: 2 }}>{m}-day streak</div>
                    <div style={{ color: T.muted, fontSize: 12 }}>{done ? "Completed!" : next ? `${m - streak} days to go` : `Locked`}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: done ? T.gold : T.muted, fontSize: 13, fontWeight: 700 }}>+{m * 12} XP</div>
                    {m <= 7 && <div style={{ color: T.violet, fontSize: 11, marginTop: 2 }}>+1 Shield</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// FEATURE 2: INSTANT VIDEO HELP MODE
// ══════════════════════════════════════════════════════

function VideoMatchView({ onBack, onComplete, user }) {
  const [phase, setPhase] = useState("standby"); // standby | searching | matched | call | done
  const [countdown, setCountdown] = useState(60);
  const [matched, setMatched] = useState(null);
  const [callTime, setCallTime] = useState(0);
  const timerRef = useRef(null);

  const startSearch = () => {
    setPhase("searching");
    let t = 60;
    timerRef.current = setInterval(() => {
      t--;
      setCountdown(t);
      if (t <= 45 && phase !== "matched") {
        clearInterval(timerRef.current);
        setMatched({ name: "Aanya S.", avatar: "🌸", cat: "urgent", need: "Need a ride to Medanta", dist: "0.8 km away", time: "3m ago" });
        setPhase("matched");
      }
    }, 1000);
  };

  const acceptCall = () => {
    setPhase("call");
    let s = 0;
    timerRef.current = setInterval(() => { s++; setCallTime(s); }, 1000);
    setTimeout(() => {
      clearInterval(timerRef.current);
      setPhase("done");
    }, 8000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const fmtTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const c = catOf("urgent");

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", minHeight: 600 }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Header */}
        <div className="glass" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${T.border}` }}>
          <button className="press" onClick={onBack} style={{ background: "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 10, padding: "7px 12px", color: T.muted, fontSize: 13 }}>← Back</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 18, color: T.white }}>Instant Video Help</div>
            <div style={{ color: T.teal, fontSize: 12 }}>Be available for someone right now</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, position: "relative" }}>
          <OrbBg cols={[T.emerald, T.teal, T.violet]} />

          {/* STANDBY */}
          {phase === "standby" && (
            <div style={{ textAlign: "center", position: "relative", zIndex: 1, animation: "fadeUp .5s both" }}>
              <div style={{ fontSize: 80, marginBottom: 24, animation: "float3d 6s ease-in-out infinite", filter: `drop-shadow(0 0 24px ${T.emerald}66)` }}>📹</div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 26, fontWeight: 800, color: T.white, marginBottom: 10 }}>Help Someone Live</h2>
              <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 32, maxWidth: 280 }}>
                Tap "I'm Available Now" and get matched with someone who needs help — within 60 seconds.
              </p>
              {[["📹 Video", "See & guide in real time"], ["📞 Voice only", "Audio call, no camera"], ["💬 Chat", "Text-based live support"]].map(([type, sub], i) => (
                <div key={i} className="glass hov press" style={{ borderRadius: 14, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, textAlign: "left", cursor: "pointer", animation: `fadeUp .4s ${.1 + i * .08}s both`, border: `1px solid ${i === 0 ? T.teal + "44" : T.border}` }} onClick={i === 0 ? startSearch : undefined}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{type.split(" ")[0]}</div>
                  <div>
                    <div style={{ color: T.white, fontWeight: 600, fontSize: 14 }}>{type.split(" ").slice(1).join(" ")}</div>
                    <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{sub}</div>
                  </div>
                  {i === 0 && <div style={{ marginLeft: "auto", background: `${T.teal}22`, border: `1px solid ${T.teal}44`, borderRadius: 8, padding: "4px 10px", color: T.teal, fontSize: 11, fontWeight: 700 }}>GO LIVE</div>}
                </div>
              ))}
            </div>
          )}

          {/* SEARCHING */}
          {phase === "searching" && (
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              {/* Sonar rings */}
              <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto 28px" }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ position: "absolute", inset: `${i * 18}px`, borderRadius: "50%", border: `2px solid ${T.emerald}`, animation: `sonarRing ${1.4 + i * .4}s ease-out infinite`, animationDelay: `${i * .35}s` }} />
                ))}
                <div style={{ position: "absolute", inset: 54, borderRadius: "50%", background: `${T.emerald}18`, border: `2px solid ${T.emerald}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, animation: "callPulse 2s infinite" }}>
                  {user?.avatar || "🌱"}
                </div>
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 22, fontWeight: 800, color: T.white, marginBottom: 8 }}>Matching you now…</div>
              <div style={{ color: T.teal, fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", marginBottom: 8 }}>{countdown}s</div>
              <div style={{ color: T.muted, fontSize: 14, marginBottom: 28 }}>Looking for someone who needs help nearby</div>
              <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: T.teal, animation: `dotBounce .9s ${i * .2}s infinite` }} />)}
              </div>
            </div>
          )}

          {/* MATCHED */}
          {phase === "matched" && matched && (
            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 340, animation: "cardReveal .6s both" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ color: T.emerald, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>MATCH FOUND</div>
                <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 22, fontWeight: 800, color: T.white }}>Someone needs you!</h2>
              </div>
              <TiltCard style={{ background: T.panel, border: `2px solid ${c.color}55`, borderRadius: 22, padding: 22, marginBottom: 20, boxShadow: `0 20px 50px rgba(0,0,0,.5), 0 0 30px ${c.color}18`, backdropFilter: "blur(20px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${T.warm}22`, border: `2px solid ${T.warm}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, animation: "callPulse 2s infinite" }}>
                    {matched.avatar}
                  </div>
                  <div>
                    <div style={{ color: T.white, fontWeight: 700, fontSize: 16 }}>{matched.name}</div>
                    <div style={{ color: c.color, fontSize: 12, marginTop: 2 }}>{matched.dist}</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: T.urgent, fontSize: 10, background: `${T.urgent}18`, border: `1px solid ${T.urgent}35`, padding: "3px 8px", borderRadius: 20, fontWeight: 700 }}>URGENT</div>
                </div>
                <div style={{ color: T.white, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{matched.need}</div>
                <div style={{ color: T.muted, fontSize: 13 }}>{matched.time} · tap to accept video call</div>
              </TiltCard>
              <button className="btn-p press" onClick={acceptCall} style={{ marginBottom: 10, animation: "glow 2s ease-in-out infinite" }}>
                📹 Accept Video Call
              </button>
              <button className="press btn-s" onClick={() => setPhase("searching")}>Skip — find another match</button>
            </div>
          )}

          {/* IN CALL */}
          {phase === "call" && (
            <div style={{ position: "relative", zIndex: 1, width: "100%", textAlign: "center" }}>
              {/* Simulated video frame */}
              <div style={{ background: `linear-gradient(135deg,#0d0d14,#030712)`, border: `2px solid ${T.emerald}44`, borderRadius: 20, padding: 0, overflow: "hidden", marginBottom: 16, position: "relative", height: 240 }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <div style={{ fontSize: 64 }}>{matched?.avatar || "🌸"}</div>
                  <div style={{ color: T.muted, fontSize: 13, marginTop: 8 }}>Live video · {matched?.name}</div>
                </div>
                <div style={{ position: "absolute", bottom: 12, right: 12, width: 64, height: 64, borderRadius: 12, background: `${T.emerald}22`, border: `1px solid ${T.emerald}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                  {user?.avatar || "🌱"}
                </div>
                <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,.6)", borderRadius: 8, padding: "4px 10px", color: T.emerald, fontSize: 12, fontWeight: 700 }}>
                  {fmtTime(callTime)}
                </div>
              </div>
              {/* Controls */}
              <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
                {[["🎤", T.teal, "Mute"], ["📹", T.teal, "Camera"], ["💬", T.violet, "Chat"]].map(([ic, col, lbl]) => (
                  <div key={lbl} style={{ textAlign: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${col}18`, border: `1px solid ${col}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 4 }}>{ic}</div>
                    <div style={{ color: T.muted, fontSize: 11 }}>{lbl}</div>
                  </div>
                ))}
                <div style={{ textAlign: "center" }}>
                  <div className="press" onClick={() => { clearInterval(timerRef.current); setPhase("done"); }} style={{ width: 52, height: 52, borderRadius: "50%", background: `${T.urgent}18`, border: `1px solid ${T.urgent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 4, cursor: "pointer" }}>📵</div>
                  <div style={{ color: T.urgent, fontSize: 11 }}>End</div>
                </div>
              </div>
            </div>
          )}

          {/* DONE */}
          {phase === "done" && (
            <div style={{ position: "relative", zIndex: 1, textAlign: "center", animation: "scaleIn .5s both" }}>
              <div style={{ fontSize: 72, marginBottom: 20, animation: "streakPop .7s both" }}>🌊</div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 26, fontWeight: 800, color: T.emerald, marginBottom: 8 }}>Session complete!</h2>
              <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>You helped {matched?.name} for {fmtTime(callTime)}.<br />That moment mattered.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }}>
                {["+80 XP", "+1 Shield", "+3 Ripples"].map(b => (
                  <span key={b} style={{ background: `${T.teal}18`, border: `1px solid ${T.teal}44`, borderRadius: 20, padding: "6px 14px", color: T.teal, fontSize: 13, fontWeight: 700, animation: "popIn .5s both" }}>{b}</span>
                ))}
              </div>
              <button className="btn-p press" onClick={() => { onComplete(80); onBack(); }}>Back to map</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// FEATURE 3: MILESTONE SHARE CARDS
// ══════════════════════════════════════════════════════

const SHARE_TEMPLATES = {
  first:   { emoji: "🌊", title: "First Ripple",    sub: "Just helped someone in my community.",      gradient: ["#f43f5e","#ec4899"] },
  streak7: { emoji: "🔥", title: "7-Day Streak!",   sub: "7 days of kindness in a row.",              gradient: ["#fb923c","#f43f5e"] },
  streak30:{ emoji: "🏆", title: "30-Day Champion", sub: "30 days of making a difference.",           gradient: ["#fbbf24","#fb923c"] },
  xp100:   { emoji: "💫", title: "100 XP Earned",   sub: "Growing through giving.",                   gradient: ["#a78bfa","#f43f5e"] },
  video1:  { emoji: "📹", title: "Live Helper",      sub: "Just helped someone via video in real time.",gradient: ["#34d399","#f43f5e"] },
};

function ShareCardOverlay({ type, user, xp, streak, onShare, onClose }) {
  const tpl = SHARE_TEMPLATES[type] || SHARE_TEMPLATES.first;
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef();

  const handleShare = () => {
    setCopied(true);
    onShare();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 8500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(2,4,15,.88)", backdropFilter: "blur(20px)", padding: 24, animation: "fadeIn .3s both" }}>
      <ParticleCanvas />

      {/* The share card */}
      <div ref={canvasRef} style={{ width: "100%", maxWidth: 320, background: `linear-gradient(145deg,#0d0d14,#030712)`, border: `1px solid rgba(244,63,94,0.3)`, borderRadius: 24, padding: 28, textAlign: "center", position: "relative", overflow: "hidden", animation: "cardReveal .6s cubic-bezier(.22,1,.36,1) both", zIndex: 1 }}>
        {/* Shimmer bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${tpl.gradient[0]},${tpl.gradient[1]},${tpl.gradient[0]})`, backgroundSize: "200% 100%", animation: "shimmerSlide 2s linear infinite" }} />

        {/* KCF icon mark (compact) */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <svg viewBox="0 0 96 96" style={{ width: 36, height: 36 }}>
            <rect x="0" y="0" width="96" height="96" rx="17" fill={tpl.gradient[0]} />
            <rect x="22" y="19" width="17" height="58" rx="4" fill="#030712" />
            <polygon points="39,48 72,19 83,19 83,31 50,52" fill="#030712" />
            <polygon points="39,52 72,77 83,77 83,65 50,46" fill="#030712" />
            <circle cx="68" cy="27" r="5" fill={tpl.gradient[0]} />
          </svg>
        </div>

        {/* Big emoji */}
        <div style={{ fontSize: 64, marginBottom: 16, animation: "streakPop .7s .2s both", display: "block" }}>{tpl.emoji}</div>

        {/* Achievement */}
        <div style={{ background: `linear-gradient(90deg,${tpl.gradient[0]},${tpl.gradient[1]})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{tpl.title}</div>
        <div style={{ color: T.muted, fontSize: 14, marginBottom: 20 }}>{tpl.sub}</div>

        {/* User + stats */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: tpl.gradient[0], fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22 }}>{xp}</div>
            <div style={{ color: T.muted, fontSize: 11 }}>XP</div>
          </div>
          <div style={{ width: 1, background: T.border }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: tpl.gradient[0], fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22 }}>{streak}</div>
            <div style={{ color: T.muted, fontSize: 11 }}>day streak</div>
          </div>
          <div style={{ width: 1, background: T.border }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: tpl.gradient[0], fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22 }}>{streak * 3}</div>
            <div style={{ color: T.muted, fontSize: 11 }}>ripples</div>
          </div>
        </div>

        {/* Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${tpl.gradient[0]},${tpl.gradient[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{user?.avatar || "🌱"}</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: T.white, fontWeight: 700, fontSize: 13 }}>{user?.name || "A Helper"}</div>
            <div style={{ color: T.muted, fontSize: 11 }}>kindness · community · healing</div>
          </div>
        </div>

        {/* Watermark */}
        <div style={{ marginTop: 16, color: T.muted, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>KindWave · Help Others → Heal Yourself</div>
      </div>

      {/* Actions */}
      <div style={{ width: "100%", maxWidth: 320, marginTop: 16, display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 1 }}>
        <button className="btn-p press" onClick={handleShare}>
          {copied ? "✓ Copied to clipboard!" : "📤 Share your impact card"}
        </button>
        <button className="btn-s press" onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

// ── Streak header pill (used in HelpFeed) ───────────────
function StreakPill({ streak, checkedToday, onGoToStreak }) {
  return (
    <button className="press" onClick={onGoToStreak} style={{ display: "flex", alignItems: "center", gap: 6, background: streak > 0 ? `${T.warm}18` : "rgba(255,255,255,.05)", border: `1px solid ${streak > 0 ? T.warm + "44" : T.border}`, borderRadius: 20, padding: "5px 12px 5px 8px" }}>
      <span style={{ fontSize: 16, animation: streak > 0 ? "fireDance 2s ease-in-out infinite" : "none" }}>{streak > 0 ? "🔥" : "🌱"}</span>
      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 15, color: streak > 0 ? T.warm : T.muted }}>{streak}</span>
      {checkedToday && <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald, display: "inline-block" }} />}
    </button>
  );
}

// Bottom Nav
function BottomNav({ active, setActive, isVol, streak }) {
  const tabs = [
    { id: "map",    icon: "🗺️", l: "Map"     },
    { id: "help",   icon: "💚", l: "Help Feed" },
    { id: "streak", icon: streak > 0 ? "🔥" : "🌱", l: streak > 0 ? `${streak}-day Streak` : "Streak" },
    { id: "heal",   icon: "✦",  l: "Heal"   },
    { id: "me",     icon: "👤", l: "Profile" },
  ];
  return (
    <div style={{
      display: "flex", gap: 4, padding: "10px 24px",
      background: "rgba(3,7,18,0.95)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      overflowX: "auto", flexShrink: 0,
      position: "sticky", top: 80, zIndex: 100,
      boxShadow: "0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)",
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        const isStreak = t.id === "streak";
        return (
          <button key={t.id} className="press" onClick={() => setActive(t.id)} style={{
            position: "relative", display: "flex", flexDirection: "row", alignItems: "center", gap: 8,
            background: on ? (isStreak && streak > 0 ? "rgba(255,123,58,0.12)" : "rgba(244,63,94,0.10)") : "transparent",
            border: `1px solid ${on ? (isStreak && streak > 0 ? "rgba(255,123,58,0.5)" : "rgba(244,63,94,0.4)") : "rgba(255,255,255,0.08)"}`,
            borderRadius: 10, padding: "8px 18px", transition: "all .22s", whiteSpace: "nowrap",
            boxShadow: on ? "0 2px 12px rgba(244,63,94,0.18)" : "none",
          }}>
            <span style={{ fontSize: 16, animation: isStreak && streak > 0 && on ? "fireDance 2s ease-in-out infinite" : "none" }}>{t.icon}</span>
            <span style={{ fontSize: 13, color: on ? (isStreak && streak > 0 ? T.warm : "#fda4af") : "rgba(255,255,255,0.45)", fontWeight: on ? 700 : 500, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>{t.l}</span>
            {t.id === "help" && isVol && <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.emerald, boxShadow: `0 0 6px ${T.emerald}` }} />}
          </button>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// LANDING PAGE  (shown when user hasn't onboarded yet)
// ══════════════════════════════════════════════════════
function LandingPage({ onBegin }) {
  const Btn = ({ children, onClick, secondary }) => (
    <button onClick={onClick} style={{
      background: secondary ? "transparent" : `linear-gradient(135deg,${T.teal},${T.tealDim})`,
      border: secondary ? `1.5px solid rgba(255,255,255,0.2)` : "none",
      borderRadius: 16, padding: "16px 36px",
      color: secondary ? "rgba(240,244,255,0.8)" : "#fff",
      fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 16, fontWeight: 700,
      cursor: "pointer", transition: "all .22s",
      boxShadow: secondary ? "none" : `0 8px 32px rgba(244,63,94,0.35)`,
      display: "flex", alignItems: "center", gap: 8,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; if (!secondary) e.currentTarget.style.boxShadow = `0 14px 40px rgba(244,63,94,0.5)`; else e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; if (!secondary) e.currentTarget.style.boxShadow = `0 8px 32px rgba(244,63,94,0.35)`; else e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
    >{children}</button>
  );

  return (
    <div className="kw-cosmos" style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: T.white }}>
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <section style={{ width: "100%", minHeight: "100vh", position: "relative", isolation: "isolate" }}>
        {/* Background image */}
        <img
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0e2dbea0-c0a9-413f-a57b-af279633c0df_3840w.jpg"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(3,7,18,0.55) 0%,rgba(3,7,18,0.72) 60%,rgba(3,7,18,0.92) 100%)", pointerEvents: "none" }} />
        {/* Ring */}
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3)", pointerEvents: "none" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", paddingTop: 80 }}>
          {/* Center content */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(48px,8vw,96px) 24px clamp(32px,5vw,64px)" }}>
            <div style={{ maxWidth: 780, width: "100%", textAlign: "center" }}>

              {/* Badge */}
              <div className="kwhi-1" style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "8px 10px 8px 20px", marginBottom: 28, backdropFilter: "blur(12px)" }}>
                <span style={{ color: "rgba(240,244,255,0.9)", fontSize: 14, fontWeight: 500, letterSpacing: 0.2 }}>Real-Time Community Kindness Network</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.9)", borderRadius: 999, padding: "3px 10px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.teal, display: "inline-block", animation: "pulse 2s infinite" }} />
                  <span style={{ color: "#030712", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>LIVE</span>
                </span>
              </div>

              {/* Headline */}
              <h1 className="kwhi-2" style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(3.2rem,8.5vw,6.5rem)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-1px", marginBottom: 28, color: T.white }}>
                Help Others.
                <br />
                <span style={{ fontStyle: "italic" }}>Heal Yourself.</span>
              </h1>

              {/* Description */}
              <p className="kwhi-3" style={{ color: "rgba(240,244,255,0.78)", fontSize: "clamp(16px,2vw,19px)", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 44px" }}>
                A GPS-powered community where giving help is the fastest path to healing — for everyone involved.
              </p>

              {/* CTAs */}
              <div className="kwhi-4" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 72 }}>
                <button
                  onClick={onBegin}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "14px 28px", color: T.white, fontSize: 15, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(12px)", transition: "all .2s", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = ""; }}
                >
                  Begin Your Journey
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>

              {/* Stats */}
              <div className="kwhi-5" style={{ display: "flex", gap: "clamp(24px,6vw,72px)", justifyContent: "center", flexWrap: "wrap" }}>
                {[["47K+","Acts of Kindness"],["91","Countries"],["Live","GPS-Powered"],["Free","Always & Forever"]].map(([v, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: T.white }}>{v}</div>
                    <div style={{ color: "rgba(240,244,255,0.5)", fontSize: 13, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Partners strip */}
          <div style={{ padding: "28px 32px 40px", borderTop: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", background: "rgba(3,7,18,0.35)" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <p style={{ textAlign: "center", color: "rgba(240,244,255,0.45)", fontSize: 13, marginBottom: 20, letterSpacing: 0.5 }}>Partnering with leading organizations worldwide</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(24px,4vw,56px)", flexWrap: "wrap" }}>
                {["Feeding America","Water.org","UNICEF","One Tree Planted","Save the Children"].map((name) => (
                  <div key={name} style={{ color: "rgba(240,244,255,0.4)", fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "color .2s", cursor: "default" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,244,255,0.75)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,244,255,0.4)"; }}
                  >{name}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// ══════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════
export default function KindWaveApp() {
  const { pins: DB_PINS } = useKindWaveData();
  const [user, setUser]               = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [xp, setXp]                   = useState(0);
  const [tab, setTab]                 = useState("map");
  const [pins, setPins]               = useState(DB_PINS);
  const [filterCats, setFilterCats]   = useState([]);
  const [view, setView]               = useState("main");
  const [selPin, setSelPin]           = useState(null);
  const [chatPin, setChatPin]         = useState(null);
  const [isVol, setIsVol]             = useState(false);
  const [accepted, setAccepted]       = useState(false);
  const [toast, setToast]             = useState(null);
  const [xpToast, setXpToast]         = useState(null);
  const [badgeQ, setBadgeQ]           = useState([]);
  const [firstVisit, setFirstVisit]   = useState(true);
  const [tooltipDismissed, setTooltipDismissed] = useState({});

  // Sync pins from Supabase when loaded
  useEffect(() => { setPins(DB_PINS); }, [DB_PINS]);

  // ── Feature 1: Streak ──────────────────────────────
  const [streak, setStreak]           = useState(0);
  const [shields, setShields]         = useState(2);
  const [checkedToday, setCheckedToday] = useState(false);

  // ── Feature 3: Share card ──────────────────────────
  const [shareCard, setShareCard]     = useState(null);
  const [sharedOnce, setSharedOnce]   = useState(false);

  const notify = (msg) => setToast(msg);

  const addXP = (n) => {
    setXp(prev => prev + n);
    setXpToast(n);
  };

  const handleCheckIn = () => {
    if (checkedToday) return;
    const newStreak = streak + 1;
    setStreak(newStreak);
    setCheckedToday(true);
    addXP(20);
    notify(`🔥 Streak: ${newStreak} days! Keep it going!`);

    // Streak milestone badges
    if (newStreak === 3) setBadgeQ(prev => [...prev, BADGES.find(b => b.id === "streak3")]);
    if (newStreak === 7) {
      setBadgeQ(prev => [...prev, BADGES.find(b => b.id === "streak7")]);
      setTimeout(() => setShareCard("streak7"), 3500);
    }
    if (newStreak === 30) {
      setBadgeQ(prev => [...prev, BADGES.find(b => b.id === "streak30")]);
      setTimeout(() => setShareCard("streak30"), 3500);
    }
    // Earn a shield at milestones
    if (STREAK_MILESTONES.slice(0, 3).includes(newStreak)) {
      setShields(s => Math.min(3, s + 1));
      notify("🛡️ Streak Shield earned!");
    }
  };

  const handleUseShield = () => {
    if (shields < 1) return;
    setShields(s => s - 1);
    setStreak(prev => Math.max(prev, 1));
    setCheckedToday(true);
    notify("🛡️ Shield used — streak protected!");
  };

  const handleComplete = (profile, initialXP) => {
    setUser(profile);
    setXp(initialXP);
    setBadgeQ([BADGES.find(b => b.id === "journey")]);
    notify(`Welcome, ${profile.name || "Friend"}! ✦ Help Others → Heal Yourself`);
  };

  const handleAccept = (p) => {
    setAccepted(true);
    addXP(50);
    notify(`Accepted! Chat with ${p.user} to coordinate.`);
    setBadgeQ(prev => [...prev, BADGES.find(b => b.id === "first")]);
    // Trigger share card after first accepted help
    setTimeout(() => setShareCard("first"), 3500);
  };

  const handleVideoComplete = (earnedXP) => {
    addXP(earnedXP);
    setBadgeQ(prev => [...prev, BADGES.find(b => b.id === "video1")]);
    setTimeout(() => setShareCard("video1"), 3500);
  };

  const handleShare = () => {
    if (!sharedOnce) {
      setSharedOnce(true);
      addXP(25);
      setBadgeQ(prev => [...prev, BADGES.find(b => b.id === "share1")]);
    }
    notify("Impact card copied! Share it to spread kindness. ✨");
  };

  // Onboarding full-page flow
  if (!user && showOnboarding) return (<Onboarding onComplete={handleComplete} />);

  // Landing page (marketing) — not yet signed up
  if (!user) return (<LandingPage onBegin={() => setShowOnboarding(true)} />);

  const showTooltip = firstVisit && !tooltipDismissed[tab];
  const dismissTooltip = () => {
    setTooltipDismissed(prev => ({ ...prev, [tab]: true }));
    if (Object.keys(tooltipDismissed).length >= 3) setFirstVisit(false);
  };

  return (
    <div className="kw-cosmos" style={{ minHeight: "100vh", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: "#f0f4ff", paddingTop: 80 }}>
      <style>{CSS}</style>

      {/* Notification overlays */}
      {toast   && <Toast msg={toast} onDone={() => setToast(null)} />}
      {xpToast && <XPToast xp={xpToast} onDone={() => setXpToast(null)} />}
      {badgeQ.length > 0 && <BadgeUnlock badge={badgeQ[0]} onDone={() => setBadgeQ(prev => prev.slice(1))} />}

      {/* Share card overlay */}
      {shareCard && view === "main" && (
        <ShareCardOverlay
          type={shareCard}
          user={user}
          xp={xp}
          streak={streak}
          onShare={handleShare}
          onClose={() => setShareCard(null)}
        />
      )}

      {/* Modal overlays for detail views */}
      {view === "detail" && selPin && (
        <Modal onClose={() => setView("main")}>
          <PinDetail
            pin={selPin}
            onBack={() => setView("main")}
            onChat={p => { setChatPin(p); setView("chat"); }}
            onAccept={handleAccept}
            accepted={accepted}
          />
        </Modal>
      )}
      {view === "chat" && chatPin && (
        <Modal onClose={() => setView(selPin ? "detail" : "main")}>
          <ChatView pin={chatPin} onBack={() => setView(selPin ? "detail" : "main")} />
        </Modal>
      )}
      {view === "post" && (
        <Modal onClose={() => setView("main")}>
          <PostRequest
            onBack={() => setView("main")}
            onPost={f => {
              setPins(prev => [{ id: Date.now(), title: f.title, desc: f.desc, cat: f.cat, urgency: f.urgency, x: 38 + Math.random() * 18, y: 38 + Math.random() * 18, user: user?.name || "You", time: "Just now", verified: false }, ...prev]);
              addXP(20);
              notify("🗺️ Your request is live on the map!");
            }}
          />
        </Modal>
      )}
      {view === "video" && (
        <Modal onClose={() => setView("main")}>
          <VideoMatchView
            onBack={() => setView("main")}
            onComplete={handleVideoComplete}
            user={user}
          />
        </Modal>
      )}

      {/* Sticky tab nav — always visible */}
      <BottomNav active={tab} setActive={setTab} isVol={isVol} streak={streak} />

      {/* Page sections */}
      <div style={{ position: "relative" }}>
        {tab === "map" && (
          <MapView
            pins={pins}
            onPin={p => { setSelPin(p); setAccepted(false); setView("detail"); }}
            onAdd={() => setView("post")}
            filterCats={filterCats}
            setFilterCats={setFilterCats}
          />
        )}
        {tab === "help" && (
          <HelpFeed
            pins={pins}
            onPin={p => { setSelPin(p); setAccepted(false); setView("detail"); }}
            isVol={isVol}
            setIsVol={v => { setIsVol(v); if (v) { notify("🟢 You're now visible as available!"); addXP(5); } else notify("⚪ You're now offline."); }}
            onAdd={() => setView("post")}
            onXP={addXP}
            streak={streak}
            checkedToday={checkedToday}
            onCheckIn={handleCheckIn}
            setView={setView}
          />
        )}
        {tab === "streak" && (
          <StreakView
            streak={streak}
            shields={shields}
            checkedToday={checkedToday}
            onCheckIn={handleCheckIn}
            onUseShield={handleUseShield}
            user={user}
            xp={xp}
            badgeList={badgeQ}
          />
        )}
        {tab === "heal" && <HealingView user={user} xp={xp} onXP={addXP} />}
        {tab === "me"   && <ProfileView user={user} xp={xp} onXP={addXP} onLogout={() => setUser(null)} />}

        {/* Tooltip guide */}
        {view === "main" && showTooltip && <TooltipGuide tab={tab} onDismiss={dismissTooltip} />}
      </div>
    </div>
  );
}
