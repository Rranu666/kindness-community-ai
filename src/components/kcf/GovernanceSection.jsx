import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Building, Settings, Heart, Scale, BarChart3, Megaphone, Shield, ChevronDown
} from "lucide-react";

const governanceAreas = [
  {
    title: "Governance Framework",
    icon: Building,
    items: [
      "Board of Directors: Strategic oversight, mission alignment, funding approvals",
      "Executive Leadership: Strategy, partnerships, ecosystem development",
      "Advisory Committees: Expert guidance and risk assessment",
      "Accountability & Reporting: Quarterly/annual public reports, audits",
    ],
  },
  {
    title: "Operational Terms",
    icon: Settings,
    items: [
      "Initiative planning, risk assessment, KPIs",
      "Segregated accounts & audited finances",
      "Partnership evaluation & legal agreements",
      "Secure data & privacy-compliant technology",
    ],
  },
  {
    title: "Ethics & Conduct",
    icon: Heart,
    items: [
      "Core principles: Integrity, Transparency, Accountability, Equity & Inclusion, Sustainability",
      "Code of Conduct: Staff, volunteers, and partners adhere to ethical standards",
      "Community responsibility: Prioritize community benefit, feedback mechanisms",
    ],
  },
  {
    title: "Compliance & Legal",
    icon: Scale,
    items: [
      "Statutory compliance (India, USA, etc.)",
      "Labor, tax, corporate, NGO regulations",
      "Intellectual property and data confidentiality",
    ],
  },
  {
    title: "Monitoring & Evaluation",
    icon: BarChart3,
    items: [
      "Track financial sustainability, social impact, engagement",
      "Independent audits & internal review panels",
      "Continuous improvement based on lessons learned",
    ],
  },
  {
    title: "Reporting & Communication",
    icon: Megaphone,
    items: [
      "Annual public reports & dashboards",
      "Stakeholder newsletters & updates",
      "Complaint and grievance mechanisms",
    ],
  },
];

function AccordionItem({ area, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      className="rounded-2xl overflow-hidden border transition-all duration-300"
      style={{
        borderColor: open ? "rgba(244,63,94,0.25)" : "rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.025)",
        boxShadow: open ? "0 0 0 1px rgba(244,63,94,0.1), 0 8px 32px rgba(244,63,94,0.06)" : "none",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left hover:bg-white/3 transition-colors"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: open
              ? "linear-gradient(135deg, #f43f5e, #ec4899)"
              : "rgba(255,255,255,0.06)",
            boxShadow: open ? "0 4px 16px rgba(244,63,94,0.3)" : "none",
          }}
        >
          {(() => {
            const IconComponent = area.icon;
            return <IconComponent className={`w-5 h-5 transition-colors duration-300 ${open ? "text-white" : "text-white/35"}`} />;
          })()}
        </div>
        <span className={`flex-1 font-bold transition-colors duration-300 ${open ? "text-white" : "text-white/55"}`}>{area.title}</span>
        <ChevronDown className={`w-5 h-5 text-white/25 transition-transform duration-300 ${open ? "rotate-180 text-rose-400" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="px-5 sm:px-6 pb-6 pl-20 border-t border-white/[0.04]">
          <ul className="space-y-2 pt-4">
            {area.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/45">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400/60 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default function GovernanceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="governance" className="py-24 lg:py-32" style={{ background: "#040810" }} ref={ref}>
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/20 mb-6" style={{ background: "rgba(244,63,94,0.06)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span className="text-rose-400 text-xs font-bold tracking-widest uppercase">Governance & Ethics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 max-w-2xl mx-auto">
            Transparent.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
              Accountable.
            </span>{" "}
            Ethical.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-3"
        >
          {governanceAreas.map((area, i) => (
            <AccordionItem key={i} area={area} index={i} />
          ))}
        </motion.div>

        {/* Commitment Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 p-8 rounded-3xl bg-[#0d1b2a] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
          <div className="relative">
            <Shield className="w-10 h-10 text-rose-400 mx-auto mb-4" />
            <p className="text-white/70 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto italic">
              "Kindness Community is committed to a trustworthy, transparent, and sustainable
              ecosystem. All initiatives, partnerships, and operations are guided by ethical governance,
              legal compliance, and measurable community impact."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}