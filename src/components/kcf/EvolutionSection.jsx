import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Cpu, ArrowRight, Leaf, Zap } from "lucide-react";

const stages = [
  {
    number: "01",
    phase: "Stage 1",
    label: "The Digital Steam Age",
    sublabel: "Extraction 2.0",
    color: "from-slate-700 to-slate-900",
    accentColor: "text-sky-400",
    accentBg: "bg-sky-400/10",
    accentBorder: "border-sky-400/20",
    dotColor: "bg-sky-400",
    icon: Cpu,
    description:
      "This is where we are now. Not Victorian factories — but algorithmic labor, data mining, attention extraction, and AI serving profit first. We look advanced. But structurally? Still clockwork. Humans remain cogs — now inside digital systems.",
    traits: [
      "Productivity = identity",
      "Busyness = virtue",
      "Visibility = value",
      "Monetization = purpose",
    ],
    tag: "Where We Are Now",
    tagColor: "bg-sky-400/15 text-sky-300 border-sky-400/20",
  },
  {
    number: "02",
    phase: "Stage 2",
    label: "The Ethical Reconfiguration",
    sublabel: "Structured Altruistic Capitalism",
    color: "from-emerald-700 to-teal-900",
    accentColor: "text-emerald-400",
    accentBg: "bg-emerald-400/10",
    accentBorder: "border-emerald-400/20",
    dotColor: "bg-emerald-400",
    icon: Leaf,
    description:
      "This is our core function. Not destruction — reconfiguration. We reward contribution over extraction, elevate service over attention, coordinate abundance over scarcity, and make governance transparent. Boringly stable. That's what gives us credibility.",
    traits: [
      "Contributors, not employees",
      "Sustainability engine, not revenue",
      "Ecosystem, not platform",
      "Technology as servant",
    ],
    tag: "Our Core Function",
    tagColor: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  },
  {
    number: "03",
    phase: "Stage 3",
    label: "The Passionate Contribution Era",
    sublabel: "Post-Coercive Civilization",
    color: "from-amber-600 to-orange-800",
    accentColor: "text-amber-300",
    accentBg: "bg-amber-300/10",
    accentBorder: "border-amber-300/20",
    dotColor: "bg-amber-300",
    icon: Zap,
    description:
      "Where labor becomes contribution — not because people stopped working, but because automation handles survival tasks, basic needs are structurally supported, and identity detaches from job title. Value shifts to service, creativity, and mentorship.",
    traits: [
      "Status through contribution",
      "Influence through integrity",
      "Recognition through kindness",
      "AI as moral assistant, not authority",
    ],
    tag: "Our Horizon",
    tagColor: "bg-amber-300/15 text-amber-200 border-amber-300/20",
  },
];

const principle = [
  { icon: "⚙️", text: "Structure without compassion becomes oppression." },
  { icon: "🌿", text: "Compassion without structure becomes chaos." },
  { icon: "✨", text: "Technology without ethics becomes extraction." },
];

export default function EvolutionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="evolution"
      className="py-24 lg:py-36 relative overflow-hidden" style={{ background: "#f0f0ef" }}
      ref={ref}
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "rgba(14,165,233,0.04)" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(16,185,129,0.04)" }} />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-200 mb-6"
            style={{ background: "rgba(14,165,233,0.06)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-sky-600 text-xs font-bold tracking-widest uppercase">
              Cultural Architecture
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight max-w-3xl mx-auto mb-4">
            Designing a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500">
              Cultural Evolution
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Not a fantasy jump to utopia. A precise, sequenced reconfiguration
            of the operating system — beginning exactly where we are today.
          </p>
        </motion.div>

        {/* Journey line for desktop */}
        <div className="hidden lg:flex items-center justify-center gap-0 mb-16">
          {stages.map((stage, i) => (
            <div key={i} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
                className={`w-3 h-3 rounded-full ${stage.dotColor} shadow-lg`}
              />
              {i < stages.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  className="w-48 h-px bg-gradient-to-r from-gray-200 to-gray-300 origin-left mx-2"
                />
              )}
            </div>
          ))}
        </div>

        {/* Stage cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.15 + i * 0.15 }}
                className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-all duration-500 group"
              >
                {/* Card header gradient */}
                <div className={`bg-gradient-to-br ${stage.color} p-8`}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-white/10 text-6xl font-black leading-none select-none">
                      {stage.number}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${stage.tagColor}`}>
                      {stage.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-9 h-9 rounded-xl ${stage.accentBg} border ${stage.accentBorder} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stage.accentColor}`} />
                    </div>
                    <span className={`text-xs font-bold tracking-widest uppercase ${stage.accentColor}`}>
                      {stage.phase}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-1 leading-snug">
                    {stage.label}
                  </h3>
                  <p className="text-white/40 text-xs font-semibold tracking-wide">
                    "{stage.sublabel}"
                  </p>
                </div>

                {/* Card body */}
                <div className="p-7">
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {stage.description}
                  </p>
                  <div className="space-y-2.5">
                    {stage.traits.map((trait, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${stage.dotColor}`} />
                        <span className="text-gray-600 text-sm">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connecting arrow (not on last) */}
                {i < stages.length - 1 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden lg:flex">
                    <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center bg-white">
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Anchoring principle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="rounded-3xl bg-white border border-gray-200 p-8 sm:p-12"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <p className="text-center text-gray-400 text-xs font-bold tracking-widest uppercase mb-8">
            The Anchoring Principle
          </p>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {principle.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium italic">
                  "{p.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}