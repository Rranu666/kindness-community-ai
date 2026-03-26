import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Monitor, Store, Eye, Maximize2, Zap, ArrowRight } from "lucide-react";

const points = [
  { icon: Monitor, text: "AI-powered digital platforms that create real opportunity", tag: "Technology" },
  { icon: Store, text: "Ethical retail models that generate operational funding", tag: "Commerce" },
  { icon: Eye, text: "Transparent governance and financial oversight", tag: "Governance" },
  { icon: Maximize2, text: "Scalable, replicable frameworks for expansion", tag: "Scale" },
];

export default function WhyDifferent() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden" ref={ref}
      style={{ background: "#050810" }}>

      {/* Moving gradient background */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse 60% 60% at 20% 50%, rgba(244,63,94,0.06) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 60% at 80% 50%, rgba(244,63,94,0.06) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 60% at 20% 50%, rgba(244,63,94,0.06) 0%, transparent 60%)",
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Diagonal line decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute w-px bg-white"
            style={{
              height: "200%",
              left: `${i * 14}%`,
              top: "-50%",
              transform: "rotate(20deg)",
              transformOrigin: "top left"
            }} />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/8 mb-8"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-white/40 text-xs font-bold tracking-[0.15em] uppercase">Why We're Different</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.08] tracking-tight mb-6">
              Revenue-backed{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                social impact
              </span>
            </h2>

            <p className="text-white/35 text-lg leading-relaxed mb-8">
              Most social initiatives depend on donations. We build revenue-backed systems that sustain themselves indefinitely.
            </p>

            {/* Pull quote */}
            <div className="relative pl-6 py-2 border-l-2 border-rose-500/50">
              <div className="absolute -left-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-500 to-pink-500" />
              <p className="text-rose-300/80 font-semibold text-lg italic leading-relaxed">
                "Sustainable impact requires sustainable economics."
              </p>
            </div>

            <motion.button
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors duration-200 group"
              whileHover={{ x: 4 }}
            >
              Learn about our model
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* RIGHT — staggered cards */}
          <div className="space-y-3">
            {points.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className="group relative flex items-center gap-5 p-5 rounded-2xl border border-white/[0.05] cursor-default overflow-hidden"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: "linear-gradient(90deg, rgba(244,63,94,0.04) 0%, transparent 60%)" }} />

                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg, rgba(244,63,94,0.2), rgba(236,72,153,0.15))", border: "1px solid rgba(244,63,94,0.2)" }}>
                  <item.icon className="w-5 h-5 text-rose-300" />
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <span className="text-white/65 font-medium text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-200">
                    {item.text}
                  </span>
                </div>

                <span className="text-[10px] font-bold text-white/15 tracking-widest uppercase flex-shrink-0 relative z-10 group-hover:text-rose-400/50 transition-colors duration-200">
                  {item.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}