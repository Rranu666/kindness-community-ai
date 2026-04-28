import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Users, Briefcase, ShieldCheck, TrendingUp, ArrowUpRight } from "lucide-react";

const purposes = [
  { icon: Users, title: "Connect People", desc: "Building bridges between communities and opportunities", color: "from-rose-500 to-pink-600", glow: "rgba(244,63,94,0.12)" },
  { icon: Briefcase, title: "Enable Livelihoods", desc: "Creating pathways to sustainable employment", color: "from-violet-500 to-purple-600", glow: "rgba(139,92,246,0.12)" },
  { icon: ShieldCheck, title: "Build Digital Trust", desc: "Fostering trust in digital ecosystems", color: "from-cyan-500 to-blue-600", glow: "rgba(6,182,212,0.12)" },
  { icon: TrendingUp, title: "Fund Impact", desc: "Driving social change through ethical enterprise", color: "from-emerald-500 to-teal-600", glow: "rgba(16,185,129,0.12)" },
];

function PurposeCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-3xl p-8 cursor-default border border-gray-200 bg-white hover:border-gray-300 transition-all duration-300"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${item.glow} 0%, transparent 70%)` }} />

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${item.glow.replace('0.12', '0.5')}, transparent)` }} />

      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110`}
        style={{ boxShadow: `0 8px 24px ${item.glow}` }}>
        <item.icon className="w-7 h-7 text-white" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{item.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>

      <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
        Learn more <ArrowUpRight className="w-3 h-3" />
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="about" className="relative py-28 lg:py-36 overflow-hidden" ref={ref}
      style={{ background: "#ffffff" }}>

      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)",
        backgroundSize: "100px 100px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)"
      }} />

      {/* Parallax bg element */}
      <motion.div
        style={{ y }}
        className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
      >
        <div className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(244,63,94,0.04) 0%, transparent 70%)" }} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-rose-200 mb-6"
            style={{ background: "rgba(244,63,94,0.06)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="text-rose-500 text-xs font-bold tracking-[0.15em] uppercase">About Us</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight">
              Kindness must be{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400">
                structured, sustainable,
              </span>{" "}
              and scalable
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 text-base leading-relaxed">
                Kindness Community operates on one principle: that kindness, when given structure, becomes the most powerful engine for lasting change.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                We don't rely solely on donations. We build sustainable infrastructure that generates revenue, creates opportunity, and scales impact across communities worldwide.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {purposes.map((item, i) => (
            <PurposeCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* Bottom feature strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 rounded-3xl p-8 md:p-10 border border-gray-200 relative overflow-hidden bg-white"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 80% at 10% 50%, rgba(244,63,94,0.03) 0%, transparent 60%)" }} />

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {[
              { num: "2026", label: "Founded", sub: "California, USA" },
              { num: "6", label: "Pillars", sub: "Strategic Initiatives" },
              { num: "∞", label: "Potential", sub: "Limitless Impact Scale" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-pink-400 flex-shrink-0"
                  style={{ fontVariantNumeric: "tabular-nums" }}>
                  {item.num}
                </div>
                <div>
                  <div className="text-gray-900 font-bold">{item.label}</div>
                  <div className="text-gray-400 text-sm">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
