import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Scale, BarChart3, Cpu, Users, XCircle, CheckCircle2, Calendar, FileSearch, AlertCircle } from "lucide-react";

const idealProfiles = [
  {
    icon: Scale,
    title: "Nonprofit Governance Professional",
    desc: "501(c)(3) compliance experience, fiduciary knowledge, and nonprofit board expertise.",
  },
  {
    icon: BarChart3,
    title: "Financial Oversight / CPA",
    desc: "Budgeting, audit readiness, financial controls, and fund segregation oversight.",
  },
  {
    icon: Cpu,
    title: "Technology Ethics Specialist",
    desc: "Data privacy, algorithmic transparency, and responsible AI governance background.",
  },
  {
    icon: Users,
    title: "Community Leader",
    desc: "Local credibility, grassroots network, and authentic community accountability.",
  },
];

const avoid = [
  "Crypto evangelists or speculative finance advocates",
  "Ideological disruptors seeking structural overhaul",
  "People seeking influence, status, or self-promotion",
];

const commitments = [
  { icon: Calendar, text: "Quarterly board meetings — mandatory attendance" },
  { icon: FileSearch, text: "Annual strategy review and financial sign-off" },
  { icon: AlertCircle, text: "Fiduciary responsibility training completed" },
  { icon: CheckCircle2, text: "Conflict-of-interest disclosure on record" },
];

export default function BoardRecruitmentSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="board" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: "#ffffff" }} ref={ref}>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(244,63,94,0.04)" }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 mb-6"
            style={{ background: "rgba(244,63,94,0.06)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="text-rose-500 text-xs font-bold tracking-widest uppercase">Board Recruitment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            We recruit{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
              stabilizers
            </span>
            , not dreamers.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Governance-first. Every board seat is anchored in fiduciary responsibility, structural discipline, and community accountability.
          </p>
        </motion.div>

        {/* Ideal profiles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {idealProfiles.map((profile, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.1 }}
              className="p-6 rounded-2xl border border-gray-200 hover:border-rose-200 transition-all duration-300 bg-white"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 shadow-md shadow-rose-100">
                <profile.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{profile.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{profile.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Avoid + Commitments */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Avoid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-7 rounded-2xl bg-red-50 border border-red-100"
          >
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-5">Avoid These Profiles</p>
            <div className="space-y-3">
              {avoid.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Commitments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="p-7 rounded-2xl border border-gray-200 bg-white"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-5">Board Commitment Expectations</p>
            <div className="space-y-3">
              {commitments.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(244,63,94,0.10)" }}>
                    <item.icon className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-gray-600 text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-400 text-sm mb-4 italic">"This is governance-first. We build trust before we build scale."</p>
          <a
            href="mailto:contact@kindnesscommunityfoundation.com?subject=Board Membership Inquiry"
            className="inline-flex items-center gap-2 px-7 py-3 text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
            style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
          >
            Inquire About Board Membership
          </a>
        </motion.div>
      </div>
    </section>
  );
}
