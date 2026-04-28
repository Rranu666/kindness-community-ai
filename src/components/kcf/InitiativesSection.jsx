import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PILLARS = [
  {
    id: "kindwave",
    status: "LIVE",
    flagship: true,
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=80",
    title: "KindWave",
    subtitle: "COMMUNITY IMPACT & VOLUNTEERING",
    subtitleColor: "#0ea5e9",
    description:
      "Your entry into the ecosystem. Join community initiatives, volunteer, and create real-world impact.",
    href: "/kindwave",
  },
  {
    id: "kindlearn",
    status: "LIVE",
    flagship: false,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80",
    title: "KindLearn",
    subtitle: "FREE LANGUAGE LEARNING",
    subtitleColor: "#f43f5e",
    description:
      "Learn languages for free with AI-powered lessons, pronunciation practice, flashcards, and progress tracking.",
    href: "/kindlearn",
  },
  {
    id: "kindcalmunity",
    status: "LIVE",
    flagship: false,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=700&q=80",
    title: "KindCalmUnity",
    subtitle: "MENTAL WELLNESS & SUPPORT",
    subtitleColor: "#f43f5e",
    description:
      "Access mental wellness resources, peer support, and a safe space to heal, reflect, and connect.",
    href: "/kindcalmunity",
  },
  {
    id: "servekindness",
    status: "LIVE",
    flagship: false,
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=700&q=80",
    title: "Serve Kindness",
    subtitle: "MICRO-DONATIONS & GIVING",
    subtitleColor: "#10b981",
    description:
      "Give in ways that match your life — micro-donations, monthly giving plans, and conscious shopping cashback.",
    href: "/servekindness",
  },
  {
    id: "personal-growth",
    status: "LIVE",
    flagship: false,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=700&q=80",
    title: "Personal Growth",
    subtitle: "CAREER TOOLS & AI DEVELOPMENT",
    subtitleColor: "#8b5cf6",
    description:
      "AI-powered tools for resume building, career planning, and achieving your personal development goals.",
    href: "/grow",
  },
  {
    id: "kindboard",
    status: "COMING SOON",
    flagship: false,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80",
    title: "KindBoard",
    subtitle: "GOVERNANCE & COMMUNITY LEADERSHIP",
    subtitleColor: "#f59e0b",
    description:
      "Join our board of directors and help shape the future of KCF. Open recruitment for mission-aligned leaders.",
    href: null,
  },
];

export default function InitiativesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="initiatives"
      className="py-24 lg:py-32"
      style={{ background: "#f0f0ef" }}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 mb-5"
            style={{ background: "rgba(244,63,94,0.06)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-500 text-xs font-bold tracking-widest uppercase">
              Core Systems
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight max-w-2xl">
            Pillars of the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
              Ecosystem
            </span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl">
            Six interconnected programs designed to help people grow, connect, and thrive — freely and sustainably.
          </p>
        </motion.div>

        {/* ── Card grid ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300"
              style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
            >
              {/* ── Image area ── */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.style.background = "linear-gradient(135deg,#f0f0ef,#e8e8e7)";
                  }}
                />
                {pillar.flagship && (
                  <span
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-md"
                    style={{ background: "#f43f5e" }}
                  >
                    ANCHOR
                  </span>
                )}
              </div>

              {/* ── Card body ── */}
              <div className="p-5 flex flex-col flex-1">

                {/* Status badge */}
                <div className="mb-3">
                  {pillar.status === "LIVE" ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: "rgba(0,0,0,0.05)", color: "#9ca3af" }}
                    >
                      COMING SOON
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 mb-1 leading-snug">
                  {pillar.title}
                </h3>
                <p
                  className="text-[10px] font-black tracking-widest uppercase mb-3"
                  style={{ color: pillar.subtitleColor }}
                >
                  {pillar.subtitle}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {pillar.description}
                </p>

                {/* CTA */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  {pillar.href ? (
                    <Link
                      to={pillar.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-rose-500 transition-colors group"
                    >
                      Explore
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-400 font-medium">Coming Soon</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
