import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Users } from "lucide-react";

const leaders = [
  {
    icon: Lightbulb,
    role: "Founder & Chief Visionary",
    name: "Founder",
    desc: "A mission-driven leader guiding KCF LLC toward global, scalable impact through ethical innovation and community empowerment.",
    gradient: "from-rose-500 to-pink-500",
    glow: "rgba(244,63,94,0.12)",
  },
  {
    icon: Users,
    role: "Advisory & Governance",
    name: "Global Expert Network",
    desc: "A global network of experts ensuring strategic oversight, ethical compliance, responsible growth, and long-term sustainability.",
    gradient: "from-indigo-500 to-violet-500",
    glow: "rgba(99,102,241,0.12)",
  },
];

function AnimBlock({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LeadershipSection() {
  return (
    <section id="leadership" style={{ background: "#f0f0ef" }} className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimBlock className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 mb-6"
            style={{ background: "rgba(244,63,94,0.06)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="text-rose-500 text-xs font-bold tracking-widest uppercase">Leadership</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
            Guided by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
              vision and integrity
            </span>
          </h3>
        </AnimBlock>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {leaders.map((leader, i) => {
            const Icon = leader.icon;
            return (
              <AnimBlock key={i} delay={0.1 + i * 0.12}>
                <div
                  className="rounded-3xl p-8 border border-gray-200 hover:border-rose-200 transition-all duration-500 h-full bg-white"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${leader.gradient} flex items-center justify-center shadow-lg mb-5`}
                    style={{ boxShadow: `0 0 24px ${leader.glow}` }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">{leader.role}</p>
                  <h4 className="text-xl font-black text-gray-900 mb-3">{leader.name}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{leader.desc}</p>
                </div>
              </AnimBlock>
            );
          })}
        </div>
      </div>
    </section>
  );
}
