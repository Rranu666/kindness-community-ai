import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  FileText, Target, AlertTriangle, Activity, Shield, DollarSign,
  Lock, Cpu, BarChart3, Eye, Compass, CheckCircle2, ChevronDown
} from "lucide-react";

const sections = [
  {
    number: "01",
    icon: FileText,
    title: "Executive Summary",
    body: "Kindness Community (KCF) is a California nonprofit public benefit corporation formed to promote community stabilization, ethical participation, and technology-assisted coordination of volunteer and contribution networks. KCF operates within existing legal frameworks and seeks to enhance trust, transparency, and sustainable civic participation.",
  },
  {
    number: "02",
    icon: Target,
    title: "Organizational Purpose",
    bullets: [
      "Coordinate structured volunteer initiatives",
      "Develop transparent contribution tracking systems",
      "Support community members seeking stabilization",
      "Promote ethical integration of technology in civic engagement",
    ],
    note: "No speculative financial instruments. No unregulated securities activities.",
  },
  {
    number: "03",
    icon: AlertTriangle,
    title: "Problem Context",
    body: "Modern digital systems incentivize attention extraction, burnout productivity, fragmented communities, and erosion of institutional trust.",
    bullets: [
      "Algorithmic labor replacing meaningful work",
      "Data mining replacing community reciprocity",
      "Gig economy precarity and burnout culture",
      "Corporate-controlled platforms serving profit first",
    ],
    note: "KCF's response is structural — not ideological.",
  },
  {
    number: "04",
    icon: Activity,
    title: "Core Activities (Initial Phase)",
    body: "Year 1–2 focus areas:",
    bullets: [
      "Volunteer network coordination",
      "Contribution recognition framework (non-financial)",
      "Public transparency dashboard",
      "Ethical AI advisory pilot tools",
    ],
  },
  {
    number: "05",
    icon: Shield,
    title: "Governance Structure",
    bullets: [
      "Board of Directors (3–5 members): strategic oversight",
      "Executive Director (if appointed): operational leadership",
      "Advisory Council (non-voting): expert guidance",
      "Technology Ethics Oversight: AI advisory role only",
    ],
    note: "AI tools remain advisory only. All decisions require human oversight.",
  },
  {
    number: "06",
    icon: DollarSign,
    title: "Financial Model",
    body: "Revenue sources (Nonprofit):",
    bullets: [
      "Donations and charitable contributions",
      "Grants and institutional funding",
      "Sponsorships and partnerships",
      "Educational programming fees",
    ],
    note: "If a separate sustainability engine is formed: legally distinct entity, arm's-length transactions, documented service agreements. No commingling of funds.",
  },
  {
    number: "07",
    icon: Lock,
    title: "Compliance & Risk Mitigation",
    bullets: [
      "Conflict-of-interest policy enforced",
      "Annual reporting and public disclosure",
      "Independent audit readiness maintained",
      "Legal review required before any tokenization or blockchain use",
    ],
  },
  {
    number: "08",
    icon: Cpu,
    title: "Technology Policy",
    bullets: [
      "Data privacy prioritized above engagement metrics",
      "Transparent algorithmic logic — no black-box systems",
      "No behavioral manipulation or dark patterns",
      "Human oversight required at all decision points",
    ],
  },
  {
    number: "09",
    icon: BarChart3,
    title: "Measurement of Impact",
    bullets: [
      "Volunteer hours coordinated and verified",
      "Community stabilization outcomes tracked",
      "Retention and participation rates reported",
      "Transparency reporting engagement measured",
    ],
  },
  {
    number: "10",
    icon: Eye,
    title: "Public Transparency Commitments",
    bullets: [
      "Annual impact report published publicly",
      "Board member disclosures maintained",
      "Public governance summary accessible",
      "Ethical technology statement updated regularly",
    ],
  },
  {
    number: "11",
    icon: Compass,
    title: "Long-Term Direction",
    body: "KCF believes technological advancement can enable increased voluntary contribution and civic participation over time. This is directional philosophy — not immediate restructuring of labor markets.",
    note: "Stage 3 remains our horizon. Stage 2 is our foundation.",
  },
  {
    number: "12",
    icon: CheckCircle2,
    title: "Conclusion",
    body: "KCF seeks to responsibly integrate structure, transparency, and ethical technology to strengthen communities.",
    note: "Not revolution. Stability. That is the foundation of lasting impact.",
  },
];

function ProspectusItem({ section, index }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = section.icon;

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${open ? "border-rose-300 shadow-sm" : "border-gray-200 hover:border-gray-300"} bg-white`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-200 font-black text-xl w-8 flex-shrink-0 select-none">{section.number}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${open ? "bg-rose-100" : "bg-gray-100"}`}>
          <Icon className={`w-4 h-4 transition-colors duration-300 ${open ? "text-rose-500" : "text-gray-400"}`} />
        </div>
        <span className={`flex-1 font-bold text-sm transition-colors duration-300 ${open ? "text-gray-900" : "text-gray-600"}`}>{section.title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 pl-[4.75rem] space-y-3">
          {section.body && (
            <p className="text-gray-500 text-sm leading-relaxed">{section.body}</p>
          )}
          {section.bullets && (
            <ul className="space-y-2">
              {section.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {section.note && (
            <p className="text-xs text-rose-500 italic border-l-2 border-rose-300 pl-3">{section.note}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ProspectusSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="prospectus" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: "#ffffff" }} ref={ref}>
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "rgba(244,63,94,0.03)" }} />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 mb-6"
            style={{ background: "rgba(244,63,94,0.06)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="text-rose-500 text-xs font-bold tracking-widest uppercase">Strategic Prospectus</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Structured Community{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
              Infrastructure
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            A 12-section document grounding KCF's mission in legal clarity, operational structure, and community accountability.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-2"
        >
          {sections.map((section, i) => (
            <ProspectusItem key={i} section={section} index={i} />
          ))}
        </motion.div>

        {/* Download CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 p-6 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center gap-4 justify-between"
        >
          <div>
            <p className="text-gray-900 font-bold text-sm">Need the full prospectus document?</p>
            <p className="text-gray-500 text-xs mt-0.5">Contact us for the attorney-reviewed version for board and legal review.</p>
          </div>
          <a
            href="mailto:contact@kindnesscommunityfoundation.com?subject=Strategic Prospectus Request"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-sm font-semibold transition-colors"
          >
            Request Document
          </a>
        </motion.div>
      </div>
    </section>
  );
}