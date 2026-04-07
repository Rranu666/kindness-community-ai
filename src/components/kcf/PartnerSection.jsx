import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Map, Home, Laptop, Heart, Globe, ArrowRight, CheckCircle } from "lucide-react";

const opportunities = [
  { icon: BookOpen, label: "Language Teaching", detail: "Help learners grow through KindLearn" },
  { icon: Map, label: "Community Outreach", detail: "Support KindWave events and kindness mapping" },
  { icon: Home, label: "Circle Coordination", detail: "Facilitate KindCalmUnity family circles" },
  { icon: Laptop, label: "Tech & Digital", detail: "Web, app, and content support" },
  { icon: Heart, label: "Wellbeing Programs", detail: "Run wellness and mindfulness workshops" },
  { icon: Globe, label: "International Programs", detail: "Join cross-border volunteer initiatives" },
];

const steps = [
  { number: "01", title: "Register", detail: "Fill the volunteer form below" },
  { number: "02", title: "Get Matched", detail: "We reach out within 3–5 days" },
  { number: "03", title: "Make an Impact", detail: "Earn badges as you grow" },
];

export default function PartnerSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const scrollToForm = () => {
    const el = document.querySelector("#engagement") || document.querySelector("section[class*='engagement']");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <section id="volunteer" className="py-24 lg:py-32" style={{ background: "#050810" }} ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Top: heading + description + CTA */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/20 mb-6" style={{ background: "rgba(244,63,94,0.06)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span className="text-rose-400 text-xs font-bold tracking-widest uppercase">Volunteer With Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              Join a movement{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
                built on trust
              </span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-8">
              We welcome volunteers who share our commitment to ethical impact, sustainable growth,
              and community-first values.
            </p>
            <button
              onClick={scrollToForm}
              className="group inline-flex items-center gap-3 px-8 py-4 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg"
              style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
            >
              Register as Volunteer
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Opportunity cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {opportunities.map((op, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                className="flex items-start gap-4 p-4 rounded-2xl border border-white/[0.05] hover:border-rose-500/20 transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-rose-900/30">
                  <op.icon className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
                </div>
                <div>
                  <p className="text-white/80 font-semibold text-sm">{op.label}</p>
                  <p className="text-white/35 text-xs mt-0.5 leading-snug">{op.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* How it works strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border border-white/[0.06] rounded-2xl p-8"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <p className="text-rose-400 text-xs font-bold tracking-widest uppercase text-center mb-8">How It Works</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-3xl font-black text-rose-500/20 leading-none select-none">{step.number}</span>
                <div>
                  <p className="text-white font-bold mb-1">{step.title}</p>
                  <p className="text-white/35 text-sm leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
