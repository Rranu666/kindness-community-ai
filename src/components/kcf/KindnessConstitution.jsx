import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, BrainCircuit, Heart, ChevronDown, ChevronUp, Zap, Shield, Globe, Users } from "lucide-react";

const traditions = [
  { num: 1, title: "Unity Before Self", text: "Our shared welfare comes first. A thriving community depends on cooperation, trust, and a common purpose.", icon: Users, color: "from-rose-500 to-pink-500" },
  { num: 2, title: "Leadership Through Service", text: "For our shared mission, the ultimate authority is the collective wisdom and conscience of the community, guided by kindness and truth. Our leaders are trusted servants—they serve the mission, not control it.", icon: Heart, color: "from-pink-500 to-fuchsia-500" },
  { num: 3, title: "An Open Door for All", text: "The only requirement for participation is a sincere desire to live with kindness and contribute to the well-being of others.", icon: Globe, color: "from-fuchsia-500 to-violet-500" },
  { num: 4, title: "Local Freedom, Global Responsibility", text: "Each community or group may operate autonomously, except in matters that affect the unity and integrity of the whole.", icon: Globe, color: "from-violet-500 to-indigo-500" },
  { num: 5, title: "Our Primary Purpose", text: "Our purpose is to help individuals and communities grow through acts of kindness, service, and mutual support.", icon: Sparkles, color: "from-indigo-500 to-sky-500" },
  { num: 6, title: "Mission Above Influence", text: "The Foundation does not lend its name or resources to outside enterprises that could compromise or distract from its mission.", icon: Shield, color: "from-sky-500 to-cyan-500" },
  { num: 7, title: "Self-Supporting Spirit", text: "We remain self-supporting through voluntary contributions, generosity, and responsible stewardship of resources.", icon: Zap, color: "from-cyan-500 to-teal-500" },
  { num: 8, title: "Service Over Status", text: "Kindness is an act of service, not a position of status. While skilled professionals may assist when needed, the heart of our work is volunteer service.", icon: Heart, color: "from-teal-500 to-emerald-500" },
  { num: 9, title: "Organized for Service", text: "Structures may be created to support the mission, but authority always flows from the shared purpose of the community.", icon: Users, color: "from-emerald-500 to-green-500" },
  { num: 10, title: "Unity Over Division", text: "We avoid public controversies and political entanglements that could distract from our mission of kindness and service.", icon: Shield, color: "from-amber-500 to-orange-500" },
  { num: 11, title: "Attraction Through Example", text: "Our message spreads through the example of compassionate lives—not through promotion.", icon: Sparkles, color: "from-orange-500 to-rose-500" },
  { num: 12, title: "Principles Before Personalities", text: "Humility and respect guide our actions. No individual stands above the mission.", icon: Heart, color: "from-rose-500 to-pink-600" },
];

const ecosystemSteps = [
  { label: "Kindness Constitution", desc: "The guiding principles for all", color: "from-rose-500 to-pink-500", glow: "rgba(244,63,94,0.3)" },
  { label: "KCF Foundation", desc: "Nonprofit stewardship & mission leadership", color: "from-pink-500 to-fuchsia-500", glow: "rgba(236,72,153,0.2)" },
  { label: "Technology Platforms", desc: "ServiceLink & supporting tools for connection", color: "from-fuchsia-500 to-violet-500", glow: "rgba(167,139,250,0.2)" },
  { label: "Volunteer Networks", desc: "People putting kindness into action", color: "from-violet-500 to-indigo-500", glow: "rgba(99,102,241,0.2)" },
  { label: "Future Innovation", desc: "Tools & systems that scale kindness-based cooperation", color: "from-indigo-500 to-sky-500", glow: "rgba(59,130,246,0.2)" },
];

function TraditionCard({ t, index, isActive, onClick }) {
  const Icon = t.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden group"
      style={{
        background: isActive ? "rgba(244,63,94,0.08)" : "rgba(255,255,255,0.02)",
        borderColor: isActive ? "rgba(244,63,94,0.4)" : "rgba(255,255,255,0.07)",
        boxShadow: isActive ? "0 0 24px rgba(244,63,94,0.1)" : "none",
      }}
    >
      <div className="flex items-start gap-4 p-5">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0 text-white text-sm font-black shadow-lg`}>
          {t.num}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm mb-1 transition-colors ${isActive ? "text-rose-300" : "text-white/80 group-hover:text-white"}`}>
            {t.title}
          </div>
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white/55 text-xs leading-relaxed"
              >
                {t.text}
              </motion.div>
            )}
          </AnimatePresence>
          {!isActive && <div className="text-white/30 text-xs line-clamp-1">{t.text}</div>}
        </div>
        <div className={`transition-transform duration-300 flex-shrink-0 ${isActive ? "rotate-180" : ""}`}>
          <ChevronDown className={`w-4 h-4 ${isActive ? "text-rose-400" : "text-white/20"}`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function KindnessConstitution({ inView }) {
  const [activeCard, setActiveCard] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const visibleTraditions = showAll ? traditions : traditions.slice(0, 6);

  return (
    <div className="relative overflow-hidden" style={{ background: "#030712" }}>
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(ellipse, rgba(244,63,94,0.06) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/20 mb-6"
            style={{ background: "rgba(244,63,94,0.06)" }}>
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-rose-400 text-xs font-bold tracking-widest uppercase">Guiding Charter</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            The Kindness{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400">
              Constitution
            </span>
          </h2>
          <p className="text-white/40 text-base tracking-widest uppercase font-medium">A Guiding Charter for the Kindness Community</p>

          {/* AI live pulse */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {[
              { icon: BrainCircuit, label: "AI-Guided Principles", color: "text-indigo-400" },
              { icon: Sparkles, label: "Living Document", color: "text-rose-400" },
              { icon: Globe, label: "47+ Nations Aligned", color: "text-cyan-400" },
            ].map((badge, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.07]"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
                <span className="text-white/50 text-xs font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── PREAMBLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative rounded-3xl p-8 mb-16 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(244,63,94,0.5), rgba(236,72,153,0.5), transparent)" }} />

          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(244,63,94,0.2), rgba(236,72,153,0.1))" }}>
              <BookOpen className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-rose-400 text-xs font-bold tracking-widest uppercase">Preamble</span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(244,63,94,0.3), transparent)" }} />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "rgba(244,63,94,0.08)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  <span className="text-rose-400 text-[10px] font-bold">Active Principle</span>
                </div>
              </div>
              <div className="space-y-4 text-white/65 text-sm leading-relaxed">
                <p>Humanity flourishes when people care for one another with compassion, responsibility, and respect.</p>
                <p>The Kindness Community Foundation exists to nurture a culture where individuals, communities, and organizations work together to create a world grounded in kindness, service, and shared well-being.</p>
                <p>Guided by enduring human values and supported by responsible innovation — including emerging technologies such as artificial intelligence — we aim to expand humanity's ability to solve problems, support one another, and build a more peaceful and cooperative society.</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                  <Sparkles className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <p className="text-white font-semibold text-sm">Our purpose is simple: To help create a Haven on Earth through kindness in action.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── TWELVE TRADITIONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.07] mb-4"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-white/50 text-xs font-bold tracking-widest uppercase">Interactive · Click to Expand</span>
            </div>
            <h3 className="text-white font-black text-2xl sm:text-3xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              The Twelve Traditions
            </h3>
            <p className="text-white/35 text-sm mt-2">of the Kindness Community</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {visibleTraditions.map((t, i) => (
              <TraditionCard
                key={t.num}
                t={t}
                index={i}
                isActive={activeCard === t.num}
                onClick={() => setActiveCard(activeCard === t.num ? null : t.num)}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: "rgba(244,63,94,0.08)", borderColor: "rgba(244,63,94,0.25)", color: "#f43f5e" }}
            >
              {showAll ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> View All 12 Traditions</>}
            </button>
          </div>
        </motion.div>

        {/* ── ECOSYSTEM FLOW ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-white font-black text-2xl sm:text-3xl mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>How the Kindness Ecosystem Works</h3>
            <p className="text-white/35 text-sm">Click each layer to explore</p>
          </div>

          <div className="flex flex-col items-center gap-2 max-w-xl mx-auto">
            {ecosystemSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center w-full">
                <motion.button
                  onClick={() => setActiveStep(i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-2xl border text-center transition-all duration-300 overflow-hidden"
                  style={{
                    background: activeStep === i ? `linear-gradient(135deg, ${step.color.replace("from-", "").replace(" to-", ", ")})` : "rgba(255,255,255,0.03)",
                    borderColor: activeStep === i ? "transparent" : "rgba(255,255,255,0.07)",
                    boxShadow: activeStep === i ? `0 8px 32px ${step.glow}` : "none",
                    padding: activeStep === i ? "20px 24px" : "14px 24px",
                  }}
                >
                  <div className={`font-bold text-sm ${activeStep === i ? "text-white" : "text-white/55"}`}>{step.label}</div>
                  <AnimatePresence>
                    {activeStep === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-white/75 text-xs mt-1"
                      >
                        {step.desc}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
                {i < ecosystemSteps.length - 1 && (
                  <div className="flex flex-col items-center py-1">
                    <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.15)" }} />
                    <div className="text-white/20 text-xs leading-none">↓</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CLOSING AFFIRMATION ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="relative rounded-3xl p-8 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(244,63,94,0.07), rgba(236,72,153,0.04))", border: "1px solid rgba(244,63,94,0.15)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(244,63,94,0.08) 0%, transparent 70%)" }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(244,63,94,0.4), transparent)" }} />
          <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
          <p className="text-white/65 text-sm leading-relaxed italic mb-4 max-w-2xl mx-auto">
            "These principles are living guidelines intended to help humanity grow toward greater cooperation, compassion, and wisdom. As the world evolves, we remain open to learning — from human experience, collective insight, and emerging technologies that help people serve one another more effectively."
          </p>
          <p className="text-white font-bold text-base">Together, we work toward a Haven on Earth.</p>
        </motion.div>

      </div>
    </div>
  );
}