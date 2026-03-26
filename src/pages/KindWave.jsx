import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/kcf/Header";
import {
  Heart, Globe, Flame, Map, Trophy, Star, EyeOff,
  Share2, Zap, Languages, ArrowRight, ChevronDown,
  Smartphone, Users, Activity, Sparkles, BookOpen,
  Send, CheckCircle, Brain, Building2, Link2,
  ShieldCheck, Lock, MessageSquare, Lightbulb,
  TrendingUp, Crown, HandHeart, PlayCircle
} from "lucide-react";

// ─── TAB CONFIG ───────────────────────────────────────────────────────────
const tabs = [
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "vision",   label: "The Vision", icon: PlayCircle },
  { id: "features", label: "Features",   icon: Zap },
  { id: "journey",  label: "Your Journey", icon: TrendingUp },
];

// ─── STATS ────────────────────────────────────────────────────────────────
const stats = [
  { value: "47,382", label: "Acts Shared",  icon: Heart },
  { value: "91",     label: "Countries",    icon: Globe },
  { value: "9,240",  label: "Members",      icon: Users },
  { value: "138",    label: "Acts Today",   icon: Activity },
];

// ─── CORE FEATURES ────────────────────────────────────────────────────────
const coreFeatures = [
  {
    icon: BookOpen,
    title: "Story Feed",
    desc: "Post text, photos, or short videos of your acts. Filter by country, category, or mood. The heart of everything.",
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.15)",
  },
  {
    icon: Send,
    title: "Pay It Forward Chains",
    desc: "Tag someone and say \"your turn.\" Watch kindness ripple person to person across the globe — our signature feature nobody else has.",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
  },
  {
    icon: Flame,
    title: "Kindness Streaks",
    desc: "Log one act a day. Build your streak. Don't break it. The single most powerful habit loop in human behaviour.",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.15)",
  },
  {
    icon: Brain,
    title: "Kindness Quotient (KQ)",
    desc: "Science-based quiz to discover your kindness score. Inspired by kindness.org's viral KQ test. Share it, grow it, compare globally.",
    color: "#34d399",
    glow: "rgba(52,211,153,0.15)",
  },
];

// ─── PLATFORM FEATURES ────────────────────────────────────────────────────
const platformFeatures = [
  { icon: Heart,       label: "Custom Reactions",     desc: "Inspired · Warmed my heart · This gave me strength. Emotional reactions, not just likes.", color: "#f43f5e" },
  { icon: Map,         label: "Live Kindness Map",     desc: "World map with real-time story pins. See your city light up. Nothing hits harder emotionally.", color: "#34d399" },
  { icon: Trophy,      label: "Country Leaderboard",   desc: "India vs Brazil vs Philippines. Friendly global competition that drives organic sharing.", color: "#fbbf24" },
  { icon: Star,        label: "Featured Story Daily",  desc: "Community-voted spotlight. Gives everyone a reason to post quality content.", color: "#a78bfa" },
  { icon: EyeOff,      label: "Anonymous Posting",     desc: "The most powerful stories are private. Share without your name — unlocks a whole category.", color: "#60a5fa" },
  { icon: Share2,      label: "Shareable Story Cards", desc: "Auto-generate beautiful cards for WhatsApp & Instagram. Every share is free marketing.", color: "#f472b6" },
  { icon: Zap,         label: "AI Kindness Nudges",    desc: "Context-aware suggestions based on mood, time, location. Smart, never pushy.", color: "#34d399" },
  { icon: Languages,   label: "Multi-language",        desc: "Hindi, Spanish, Portuguese, French — covering 3 billion people. Kindness has no language.", color: "#fb923c" },
  { icon: Building2,   label: "NGO Integration",       desc: "Verified nonprofits from Tiramisu-style partnerships. Real volunteering opportunities.", color: "#60a5fa" },
  { icon: Brain,       label: "Kindness Quotient",     desc: "Take the science-based KQ quiz, share your score, and challenge friends globally.", color: "#a78bfa" },
];

// ─── DIFFERENTIATORS ─────────────────────────────────────────────────────
const differentiators = [
  {
    icon: Link2,
    title: "Pay It Forward Chains",
    desc: "Kindli has QR cards. BeKind has daily ideas. Nobody has trackable viral kindness chains — this is KindWave's signature moat.",
    color: "#a78bfa",
  },
  {
    icon: Trophy,
    title: "Country vs Country",
    desc: "No kindness platform has a competitive global leaderboard. India vs Brazil vs Philippines creates massive social energy.",
    color: "#fbbf24",
  },
  {
    icon: TrendingUp,
    title: "Growth + Giving Combined",
    desc: "We link personal growth to kindness action — vision board, journal, streaks, and community in one coherent loop.",
    color: "#34d399",
  },
];

// ─── USER ENTRY POINTS ───────────────────────────────────────────────────
const entryPoints = [
  { emoji: "🌫️", label: "Just Exploring",       desc: "No commitment. Just looking around.", color: "#60a5fa" },
  { emoji: "🌱", label: "Curious to Help",       desc: "Open to the idea. Taking first steps.", color: "#34d399" },
  { emoji: "🤝", label: "Ready to Engage",       desc: "I want to connect and contribute.", color: "#a78bfa" },
  { emoji: "🔥", label: "Committed to Growth",   desc: "This is a lifestyle, not a moment.", color: "#f43f5e" },
];

// ─── JOURNEY LEVELS ──────────────────────────────────────────────────────
const levels = [
  { level: 1, icon: "🌱", title: "Explorer",  desc: "You've shown up. That's everything. First act logged.", color: "#34d399" },
  { level: 2, icon: "🤝", title: "Helper",    desc: "5+ acts. People are starting to notice. So are you.", color: "#60a5fa" },
  { level: 3, icon: "🔗", title: "Connector", desc: "You link people. You build bridges. The ripple effect is yours.", color: "#a78bfa" },
  { level: 4, icon: "🌟", title: "Leader",    desc: "You initiate. You start chains. People follow your example.", color: "#fbbf24" },
  { level: 5, icon: "👑", title: "Mentor",    desc: "Your story transforms others. You are the platform now.", color: "#f43f5e" },
];

// ─── REWARD TYPES ────────────────────────────────────────────────────────
const rewards = [
  {
    rank: "1",
    type: "Primary",
    icon: "💛",
    title: "Emotional Rewards",
    desc: "Gratitude messages · Progress tracking · Healing insights · Reflection prompts. These are irreplaceable.",
    color: "#fbbf24",
  },
  {
    rank: "2",
    type: "Secondary",
    icon: "🌟",
    title: "Social Recognition",
    desc: "Community status · Leaderboards · Feature spotlights · Invitations to lead. You earn standing.",
    color: "#a78bfa",
  },
  {
    rank: "3",
    type: "Optional",
    icon: "🔮",
    title: "Karma Bridge",
    desc: "Optional tokens / credits. Not required. Not the point. Carefully used. Integrity stays intact.",
    color: "#60a5fa",
  },
];

// ─── SAFETY FEATURES ─────────────────────────────────────────────────────
const safetyItems = [
  { icon: CheckCircle, label: "Verified profiles",     desc: "Email and phone verification. No bots. No fake acts.", color: "#34d399" },
  { icon: Lock,        label: "Privacy controls",      desc: "Anonymous posting. Location optional. You control your data.", color: "#60a5fa" },
  { icon: MessageSquare, label: "Safe communication",  desc: "No direct messages until trust is established. Kindness is the only currency.", color: "#a78bfa" },
  { icon: ShieldCheck, label: "Zero tolerance",        desc: "One report and negative content is removed instantly.", color: "#f43f5e" },
];

// ─── APP SCREEN ITEMS ────────────────────────────────────────────────────
const appScreenItems = [
  { icon: Flame,  label: "🔥 Day 12 Streak",  sub: "You're on fire! Keep your streak alive today.", color: "#fb923c" },
  { icon: Star,   label: "⭐ Featured today",  sub: "Priya paid for 10 strangers' chai...", color: "#fbbf24" },
  { icon: Send,   label: "🔗 Your turn!",       sub: "Arjun passed the kindness chain to you.", color: "#a78bfa" },
  { icon: Brain,  label: "🧠 Your KQ Score",   sub: "You scored 78 — Compassion Leader 🌟", color: "#34d399" },
];

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ label, color = "rose" }) {
  const colorMap = {
    rose:   { bg: "rgba(244,63,94,0.07)",    border: "rgba(244,63,94,0.25)",    text: "#fda4af" },
    violet: { bg: "rgba(167,139,250,0.07)",  border: "rgba(167,139,250,0.25)",  text: "#c4b5fd" },
    blue:   { bg: "rgba(96,165,250,0.07)",   border: "rgba(96,165,250,0.25)",   text: "#93c5fd" },
    green:  { bg: "rgba(52,211,153,0.07)",   border: "rgba(52,211,153,0.25)",   text: "#6ee7b7" },
    amber:  { bg: "rgba(251,191,36,0.07)",   border: "rgba(251,191,36,0.25)",   text: "#fde68a" },
  };
  const c = colorMap[color] || colorMap.rose;
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs tracking-widest uppercase font-bold mb-6"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      {label}
    </span>
  );
}

// ─── OVERVIEW TAB ────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div className="space-y-24">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div className="flex flex-col items-center gap-2 p-6 rounded-2xl border border-white/[0.07] relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(244,63,94,0.07) 0%, transparent 70%)" }} />
                <Icon className="w-5 h-5 text-rose-400/70 relative z-10" />
                <span className="text-3xl md:text-4xl font-black text-white relative z-10">{s.value}</span>
                <span className="text-sm text-white/50 font-semibold relative z-10">{s.label}</span>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Core Features */}
      <div>
        <FadeIn className="text-center mb-12">
          <SectionLabel label="What We Do" color="violet" />
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Kindness as a{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f43f5e, #a78bfa)" }}>
              practice,
            </span>
            <br />not an accident.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Every feature answers one question: does this help you take one small step right now?
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 gap-6">
          {coreFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.title} delay={i * 0.1}>
                <div className="p-7 rounded-3xl border border-white/[0.08] relative overflow-hidden group hover:border-white/[0.14] transition-all duration-500 h-full"
                  style={{ background: "rgba(255,255,255,0.025)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 30% 30%, ${f.glow} 0%, transparent 70%)` }} />
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                    style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                    <Icon style={{ color: f.color }} className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 relative z-10">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed relative z-10">{f.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* What nobody else has */}
      <div>
        <FadeIn className="text-center mb-12">
          <SectionLabel label="Competitive Edge" color="amber" />
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            What{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f43f5e)" }}>
              nobody else
            </span>{" "}
            has built.
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {differentiators.map((d, i) => {
            const Icon = d.icon;
            return (
              <FadeIn key={d.title} delay={i * 0.1}>
                <div className="p-6 rounded-3xl border border-white/[0.08] h-full"
                  style={{ background: "rgba(255,255,255,0.025)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${d.color}18`, border: `1px solid ${d.color}30` }}>
                    <Icon style={{ color: d.color }} className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{d.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{d.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* App Preview */}
      <AppPreview />
    </div>
  );
}

// ─── VISION TAB ──────────────────────────────────────────────────────────
function VisionTab() {
  const scenes = [
    {
      num: "01",
      label: "The Universal Truth",
      content: (
        <div className="space-y-6">
          <p className="text-2xl md:text-3xl text-white/80 leading-relaxed font-light">
            "No matter who we are… at some point, we all feel{" "}
            <em className="text-rose-300 not-italic font-semibold">lost… disconnected… or stuck.</em>"
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {["🌙 Scrolling alone","😰 Stressed parent","🎒 Anxious teenager","🪑 Quietly alone","💼 Empty success"].map(s => (
              <span key={s} className="px-4 py-2 rounded-full text-sm font-semibold text-white/60 border border-white/[0.1]"
                style={{ background: "rgba(255,255,255,0.04)" }}>{s}</span>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: "02",
      label: "The Shift",
      content: (
        <div className="space-y-6">
          <p className="text-2xl md:text-3xl text-white/80 leading-relaxed font-light">
            "What if the fastest way to heal was{" "}
            <em className="text-violet-300 not-italic font-bold">not receiving help</em>… but giving it?"
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            {[
              { e: "🛒", t: "Carry the groceries", d: "A small gesture. Someone's whole day shifts." },
              { e: "💬", t: '"Are you okay?"',     d: "Three words. The most powerful sentence in any language." },
              { e: "👂", t: "Listen fully",          d: "A volunteer who listens. Not fixes. Just listens." },
            ].map(item => (
              <div key={item.t} className="p-4 rounded-2xl border border-white/[0.07]" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-2xl mb-2">{item.e}</div>
                <div className="text-white font-semibold text-sm mb-1">{item.t}</div>
                <div className="text-white/45 text-xs leading-relaxed">{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: "03",
      label: "The Science",
      content: (
        <div className="space-y-6">
          <p className="text-xl text-white/70 leading-relaxed">
            "Reducing stress… rebuilding connection… and reconnecting you to life. This isn't philosophy — it's biology."
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: "🧠", t: "Dopamine releases on giving",   d: "The brain rewards kindness the same way it rewards food and love." },
              { icon: "💓", t: "Cortisol drops after helping",  d: "Stress hormones decrease measurably within minutes of a kind act." },
              { icon: "✨", t: "Meaning replaces emptiness",     d: "Purpose is the antidote to disconnection. Helping creates purpose instantly." },
            ].map(item => (
              <div key={item.t} className="p-5 rounded-2xl border border-emerald-500/20"
                style={{ background: "rgba(52,211,153,0.05)" }}>
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="text-emerald-300 font-bold text-sm mb-2">{item.t}</div>
                <div className="text-white/50 text-xs leading-relaxed">{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: "04",
      label: "Imagine a World",
      content: (
        <div className="space-y-6">
          <p className="text-2xl md:text-3xl text-white/80 leading-relaxed font-light">
            "Imagine a world where help is{" "}
            <em className="text-blue-300 not-italic font-bold">visible</em>… and anyone can step in."
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {[["Mumbai","420"],["São Paulo","280"],["Manila","340"],["London","180"],["New York","240"]].map(([city, acts]) => (
              <div key={city} className="p-3 rounded-xl border border-blue-500/20 text-center"
                style={{ background: "rgba(96,165,250,0.06)" }}>
                <div className="text-blue-400 font-black text-lg">{acts}</div>
                <div className="text-white/50 text-xs mt-0.5">{city}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {["📍 Find Help Near Me","🤝 Give Help","🗺️ See Near Me"].map(b => (
              <button key={b} className="px-4 py-2 rounded-xl text-sm font-semibold text-white border border-white/[0.1] hover:border-white/[0.2] transition-colors"
                style={{ background: "rgba(255,255,255,0.04)" }}>{b}</button>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: "05",
      label: "The Connection Moment",
      content: (
        <div className="space-y-6">
          <p className="text-xl text-white/70 leading-relaxed">
            "A stranger becomes a connection. A moment becomes meaning."
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-white/[0.08]" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-white/40 text-sm font-semibold mb-3 uppercase tracking-widest">The Ask</div>
              {['"I need someone to talk to."','"Can anyone help me move next weekend?"','"My dog needs walking. I\'m recovering."'].map(r => (
                <div key={r} className="py-2 border-b border-white/[0.06] text-white/70 text-sm last:border-0">{r}</div>
              ))}
            </div>
            <div className="p-5 rounded-2xl border border-emerald-500/20" style={{ background: "rgba(52,211,153,0.05)" }}>
              <div className="text-emerald-400 text-sm font-semibold mb-3 uppercase tracking-widest">The Answer</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-lg">🌿</div>
                <div>
                  <div className="text-white font-bold text-sm">Arjun K.</div>
                  <div className="text-emerald-400 text-xs">0.4km away · Responding now</div>
                </div>
              </div>
              <div className="px-4 py-3 rounded-xl bg-emerald-500/10 text-white/70 text-sm italic">
                "I'll be there in 5 minutes. Happy to help."
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <FadeIn className="text-center mb-10">
        <SectionLabel label="The Vision" color="violet" />
        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
          Help Others.{" "}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #f43f5e)" }}>
            Heal Yourself.
          </span>
        </h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          A movement disguised as an app. Built not for engagement — but for transformation.
        </p>
      </FadeIn>

      {scenes.map((scene, i) => (
        <FadeIn key={scene.num} delay={i * 0.05}>
          <div className="rounded-3xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-white/[0.06]">
              <span className="text-white/20 font-black text-2xl font-mono">{scene.num}</span>
              <span className="text-white/60 text-sm font-bold uppercase tracking-widest">{scene.label}</span>
            </div>
            <div className="p-6">{scene.content}</div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// ─── FEATURES TAB ────────────────────────────────────────────────────────
function FeaturesTab() {
  return (
    <div className="space-y-24">
      {/* All platform features */}
      <div>
        <FadeIn className="text-center mb-12">
          <SectionLabel label="Platform Features" color="blue" />
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Built to{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}>
              scale
            </span>{" "}
            with you.
          </h2>
        </FadeIn>
        <div className="grid sm:grid-cols-2 gap-4">
          {platformFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.label} delay={i * 0.06}>
                <div className="flex gap-4 p-5 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${f.color}18`, border: `1px solid ${f.color}25` }}>
                    <Icon style={{ color: f.color }} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{f.label}</h4>
                    <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Safety & Trust */}
      <div>
        <FadeIn className="text-center mb-12">
          <SectionLabel label="Safety & Trust" color="green" />
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Built with{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #34d399, #60a5fa)" }}>
              dignity
            </span>{" "}
            at the core.
          </h2>
          <p className="text-white/45 mt-3 max-w-lg mx-auto">Safety, trust, and dignity — the foundation that makes mass adoption possible.</p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 gap-5">
          {safetyItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.label} delay={i * 0.08}>
                <div className="flex gap-4 p-6 rounded-2xl border border-white/[0.07]" style={{ background: "rgba(255,255,255,0.025)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                    <Icon style={{ color: item.color }} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{item.label}</h4>
                    <p className="text-xs text-white/45 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* App Preview */}
      <AppPreview />
    </div>
  );
}

// ─── JOURNEY TAB ─────────────────────────────────────────────────────────
function JourneyTab() {
  const [selectedEntry, setSelectedEntry] = useState(null);

  return (
    <div className="space-y-24">
      {/* Entry Points */}
      <div>
        <FadeIn className="text-center mb-12">
          <SectionLabel label="Start Where You Are" color="rose" />
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            No pressure.{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f43f5e, #a78bfa)" }}>
              No expectations.
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            We meet you exactly where you are today. Choose what resonates — you can always change.
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {entryPoints.map((e, i) => (
            <FadeIn key={e.label} delay={i * 0.08}>
              <button
                onClick={() => setSelectedEntry(selectedEntry === i ? null : i)}
                className="w-full p-6 rounded-2xl border text-left transition-all duration-300"
                style={{
                  background: selectedEntry === i ? `${e.color}12` : "rgba(255,255,255,0.03)",
                  borderColor: selectedEntry === i ? `${e.color}40` : "rgba(255,255,255,0.07)",
                }}
              >
                <div className="text-3xl mb-3">{e.emoji}</div>
                <div className="text-white font-bold text-sm mb-1">{e.label}</div>
                <div className="text-white/45 text-xs leading-relaxed">{e.desc}</div>
              </button>
            </FadeIn>
          ))}
        </div>
        {selectedEntry !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 rounded-2xl border border-rose-500/20 text-center"
            style={{ background: "rgba(244,63,94,0.06)" }}
          >
            <p className="text-white/70 text-sm">
              Great! We'll personalise your KindWave experience for: <span className="text-white font-bold">{entryPoints[selectedEntry].label}</span>
            </p>
            <p className="text-white/40 text-xs mt-1">
              "We remove fear and resistance before anything else. You don't need to be ready. You just need to begin."
            </p>
          </motion.div>
        )}
      </div>

      {/* Journey Levels */}
      <div>
        <FadeIn className="text-center mb-12">
          <SectionLabel label="Your Journey" color="amber" />
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            Your impact grows.{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f43f5e)" }}>
              And so do you.
            </span>
          </h2>
          <p className="text-white/45 max-w-lg mx-auto">This is where most platforms fail. You won't.</p>
        </FadeIn>
        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/[0.08] hidden sm:block" />
          <div className="space-y-4">
            {levels.map((l, i) => (
              <FadeIn key={l.level} delay={i * 0.1}>
                <div className="flex gap-5 items-start p-5 rounded-2xl border border-white/[0.07] relative"
                  style={{ background: "rgba(255,255,255,0.025)" }}>
                  <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 font-black"
                    style={{ background: `${l.color}15`, border: `1px solid ${l.color}30` }}>
                    {l.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/30 text-xs font-mono">Level {l.level}</span>
                      <h4 className="text-white font-bold" style={{ color: l.color }}>{l.title}</h4>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{l.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Reward System */}
      <div>
        <FadeIn className="text-center mb-12">
          <SectionLabel label="Reward System" color="violet" />
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            The real reward is{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #f43f5e)" }}>
              who you become.
            </span>
          </h2>
          <p className="text-white/45 max-w-lg mx-auto">"Everything else is just support." — Three types of reward, in the right order.</p>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-5">
          {rewards.map((r, i) => (
            <FadeIn key={r.title} delay={i * 0.1}>
              <div className="p-6 rounded-2xl border border-white/[0.08] relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.025)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: `${r.color}20`, color: r.color }}>
                    {r.rank}
                  </span>
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{r.type}</span>
                </div>
                <div className="text-3xl mb-3">{r.icon}</div>
                <h4 className="text-white font-bold mb-2">{r.title}</h4>
                <p className="text-white/45 text-sm leading-relaxed">{r.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Community Scale */}
      <div>
        <FadeIn className="text-center mb-12">
          <SectionLabel label="Community Scale" color="blue" />
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            What starts with one act{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #34d399)" }}>
              transforms entire communities.
            </span>
          </h2>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { e: "🏘️", t: "Neighbourhood",  d: "One act. One block. Someone sees it and does one too." },
            { e: "🏙️", t: "City",           d: "The map starts to glow. Your city on the leaderboard. Pride drives action." },
            { e: "🌍", t: "World",           d: "91 countries. 47,000 acts. A living proof that kindness is universal." },
          ].map((item, i) => (
            <FadeIn key={item.t} delay={i * 0.1}>
              <div className="p-6 rounded-2xl border border-white/[0.08] text-center" style={{ background: "rgba(255,255,255,0.025)" }}>
                <div className="text-4xl mb-3">{item.e}</div>
                <h4 className="text-white font-bold mb-2">{item.t}</h4>
                <p className="text-white/45 text-sm leading-relaxed">{item.d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP PREVIEW (shared) ─────────────────────────────────────────────────
function AppPreview() {
  return (
    <div>
      <FadeIn className="text-center mb-12">
        <SectionLabel label="The App" color="rose" />
        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
          Your kindness,{" "}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f43f5e, #ec4899)" }}>
            in your pocket.
          </span>
        </h2>
      </FadeIn>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="space-y-4">
          {[
            { title: "Story Feed",              desc: "Text, photo, or video acts — filtered by country, category, and mood." },
            { title: "Pay It Forward Chain",    desc: "Tag someone and pass the wave. The feature no one else has." },
            { title: "Kindness Quotient Quiz",  desc: "Science-based KQ score. Share it, grow it, compare globally." },
            { title: "Vision Board & Journal",  desc: "Set intentions, track your growth, stay aligned." },
            { title: "Kindness Passport",       desc: "Every act given and received. Your legacy of goodness, beautifully logged." },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold text-sm">{item.title}</span>
                  <p className="text-white/45 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Phone mock */}
        <FadeIn delay={0.2} className="flex justify-center">
          <div className="relative">
            <div className="w-64 rounded-[2.5rem] border-4 border-white/[0.12] overflow-hidden"
              style={{ background: "rgba(10,15,30,0.95)", boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
              <div className="flex items-center justify-between px-5 py-3 text-xs text-white/40 font-semibold">
                <span>9:41</span>
                <div className="w-4 h-2 border border-white/30 rounded-sm relative">
                  <div className="absolute inset-0.5 right-1 bg-green-400 rounded-[1px]" />
                </div>
              </div>
              <div className="px-4 pb-3 pt-1 border-b border-white/[0.07]">
                <div className="text-white/40 text-xs mb-1">Good morning ✨</div>
                <div className="text-white font-black text-lg">KindWave</div>
              </div>
              <div className="p-3 space-y-2">
                {appScreenItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="p-3 rounded-2xl border border-white/[0.07] flex items-start gap-3"
                      style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${item.color}18` }}>
                        <Icon style={{ color: item.color }} className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">{item.label}</div>
                        <div className="text-white/40 text-[11px] mt-0.5">{item.sub}</div>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-3 flex items-center justify-around py-2 border-t border-white/[0.07]">
                  {[Heart, Globe, Flame, Users, Sparkles].map((Icon, i) => (
                    <button key={i} className={`p-1.5 rounded-xl ${i === 0 ? "text-rose-400" : "text-white/30"}`}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
              className="absolute -right-6 top-16 px-3 py-2 rounded-xl border border-rose-500/25 text-xs font-bold text-white whitespace-nowrap"
              style={{ background: "rgba(244,63,94,0.12)", backdropFilter: "blur(10px)" }}>
              🔥 47k acts shared
            </motion.div>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -left-8 bottom-24 px-3 py-2 rounded-xl border border-violet-500/25 text-xs font-bold text-white whitespace-nowrap"
              style={{ background: "rgba(167,139,250,0.12)", backdropFilter: "blur(10px)" }}>
              🌍 91 countries
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────
export default function KindWave() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [emailInput, setEmailInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleNotify = (e) => {
    e.preventDefault();
    if (emailInput.trim()) setSubmitted(true);
  };

  const renderTab = () => {
    if (activeTab === "overview") return <OverviewTab />;
    if (activeTab === "vision")   return <VisionTab />;
    if (activeTab === "features") return <FeaturesTab />;
    if (activeTab === "journey")  return <JourneyTab />;
  };

  return (
    <div className="min-h-screen" style={{ background: "#030712", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
          style={{ background: "radial-gradient(ellipse, rgba(244,63,94,0.08) 0%, transparent 65%)" }} />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px]"
          style={{ background: "radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px]"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 65%)" }} />
      </div>

      <Header />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden z-10">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{
                width: `${120 + i * 40}px`, height: `${120 + i * 40}px`,
                left: `${10 + i * 18}%`, top: `${15 + (i % 3) * 22}%`,
                background: `radial-gradient(circle, ${["rgba(244,63,94,0.08)","rgba(167,139,250,0.06)","rgba(251,146,60,0.06)","rgba(52,211,153,0.05)","rgba(96,165,250,0.06)"][i]} 0%, transparent 70%)`,
              }}
              animate={{ y: [0, -18, 0], scale: [1, 1.04, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/25 mb-8"
            style={{ background: "rgba(244,63,94,0.07)" }}>
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-xs font-bold text-rose-300/80 tracking-widest uppercase">A KCF Initiative</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none mb-6">
            Kind<span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #f43f5e, #ec4899, #a78bfa)" }}>Wave</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed max-w-2xl mx-auto mb-3">
            Kindness as a <em className="text-white/80 not-italic font-semibold">practice,</em> not an accident.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
            className="text-base text-white/40 max-w-xl mx-auto mb-12">
            KindWave is where kindness is shared, celebrated, and passed forward — across 91 countries and counting.
          </motion.p>

          {/* ── EXPLORER CARDS ──────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-3xl mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); document.querySelector("#explore")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300"
                  style={{
                    background: isActive ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.04)",
                    borderColor: isActive ? "rgba(244,63,94,0.4)" : "rgba(255,255,255,0.08)",
                  }}>
                  <Icon className="w-5 h-5" style={{ color: isActive ? "#fb7185" : "rgba(255,255,255,0.4)" }} />
                  <span className="text-xs font-bold" style={{ color: isActive ? "#fda4af" : "rgba(255,255,255,0.5)" }}>{tab.label}</span>
                </button>
              );
            })}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={() => { setActiveTab("journey"); document.querySelector("#explore")?.scrollIntoView({ behavior: "smooth" }); }}
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-base relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)" }} />
              <HandHeart className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Start My Journey</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              onClick={() => { setActiveTab("vision"); document.querySelector("#explore")?.scrollIntoView({ behavior: "smooth" }); }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white/70 hover:text-white transition-colors border border-white/[0.1] hover:border-white/[0.2]">
              <PlayCircle className="w-5 h-5" />
              Watch the Story
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mt-14 flex justify-center">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
              className="text-white/20 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold tracking-widest uppercase">Scroll</span>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TAB EXPLORER ─────────────────────────────────────────────────── */}
      <section id="explore" className="relative z-10 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Sticky tab bar */}
          <div className="sticky top-0 z-30 py-4 mb-12"
            style={{ background: "rgba(3,7,18,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                    style={{
                      background: isActive ? "linear-gradient(135deg, #f43f5e, #ec4899)" : "rgba(255,255,255,0.05)",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                    }}>
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}>
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── WAITLIST CTA ─────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-10 md:p-14 rounded-3xl border border-white/[0.08] relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(244,63,94,0.12) 0%, transparent 65%)" }} />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(244,63,94,0.5), transparent)" }} />

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10"
              style={{ background: "linear-gradient(135deg, rgba(244,63,94,0.2), rgba(167,139,250,0.2))", border: "1px solid rgba(244,63,94,0.25)" }}>
              <Heart className="w-8 h-8 text-rose-400" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 relative z-10">
              Every wave starts with{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #f43f5e, #ec4899)" }}>
                one small act.
              </span>
            </h2>
            <p className="text-white/50 text-lg mb-10 relative z-10">
              No sign-up required. No pressure. Start exactly where you are.
            </p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleNotify}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
                  <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email..." required
                    className="flex-1 px-5 py-3.5 rounded-xl text-white text-sm font-medium placeholder-white/30 outline-none border border-white/[0.1] focus:border-rose-500/50 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }} />
                  <motion.button type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="px-6 py-3.5 rounded-xl font-bold text-white text-sm whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}>
                    Get Early Access
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 text-green-400 font-bold relative z-10">
                  <CheckCircle className="w-6 h-6" />
                  <span>You're on the list! We'll be in touch soon.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-white/30 text-xs mt-5 relative z-10">
              Join 9,240+ members spreading kindness worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 py-10 border-t border-white/[0.05] text-center px-4">
        <p className="text-white/30 text-sm font-medium">
          KindWave is an initiative of{" "}
          <button onClick={() => navigate("/")} className="text-rose-400/70 hover:text-rose-400 transition-colors">
            Kindness Community Foundation
          </button>
          . Spreading kindness across 91 countries.
        </p>
      </div>
    </div>
  );
}