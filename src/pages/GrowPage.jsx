import { usePageMeta } from "@/hooks/usePageMeta";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/kcf/Header";
import Footer from "@/components/kcf/Footer";
import {
  Sparkles, BookOpen, Heart, Star, Sun, Leaf,
  Target, MessageCircle, Users, ArrowRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const framework = [
  {
    icon: Heart,
    color: "#f43f5e",
    title: "Give Freely",
    desc: "Acts of kindness rewire your brain for positivity and resilience. Every time you give, you grow.",
  },
  {
    icon: BookOpen,
    color: "#8b5cf6",
    title: "Reflect Daily",
    desc: "Journaling your experiences anchors growth. Write what you gave, what you felt, and what shifted.",
  },
  {
    icon: Star,
    color: "#f59e0b",
    title: "Set Intentions",
    desc: "Visualise the person you are becoming. A clear vision pulls you forward even on hard days.",
  },
  {
    icon: Users,
    color: "#10b981",
    title: "Find Community",
    desc: "We rise together. Surround yourself with people who share your values and lift you higher.",
  },
  {
    icon: Leaf,
    color: "#06b6d4",
    title: "Embrace Growth",
    desc: "Discomfort is the signal you are stretching. Lean into challenges — they are your teachers.",
  },
  {
    icon: Sun,
    color: "#f97316",
    title: "Celebrate Progress",
    desc: "Every badge earned, every hour volunteered, every kind word — it all counts. Honour your journey.",
  },
];

const journalPrompts = [
  "Who did I help today, and how did it make me feel?",
  "What is one quality I admire in others that I want to cultivate in myself?",
  "Describe the version of you that lives your values fully. What does a day look like?",
  "What fear is holding me back from being more generous with my time or energy?",
  "Write a letter of gratitude to someone who believed in you.",
  "What would I do differently if kindness was my first instinct — always?",
  "What community need do I feel called to address this month?",
];

export default function GrowPage() {
  usePageMeta(
    "Personal Growth & Kindness | Grow with KCF",
    "Discover how helping others helps you grow. Explore KCF's personal growth framework, daily journaling prompts, and vision board tools to build a life of purpose and impact."
  );

  return (
    <div
      style={{ minHeight: "100vh", background: "#030712", color: "#f0f4ff", fontFamily: "Inter, sans-serif" }}
    >
      <Header />

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          paddingTop: "130px",
          paddingBottom: "100px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Soft glow backgrounds */}
        <div style={{
          position: "absolute", top: "-120px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "700px",
          background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "80px", left: "10%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(244,63,94,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: "760px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 16px", borderRadius: "999px", marginBottom: "24px",
              background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)",
              fontSize: "13px", fontWeight: 600, color: "#c4b5fd",
            }}
          >
            <Sparkles size={14} />
            Personal Growth
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "20px",
              fontFamily: "Syne, Inter, sans-serif",
            }}
          >
            Helping Others Is How<br />
            <span style={{
              background: "linear-gradient(135deg, #a78bfa, #f43f5e, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              You Grow
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            style={{ fontSize: "1.15rem", color: "rgba(240,244,255,0.65)", lineHeight: 1.7, marginBottom: "40px" }}
          >
            Science confirms it: acts of kindness reduce stress, build resilience, and create lasting
            happiness. At KCF, personal growth and community impact are the same journey.
            When you serve others, you discover yourself.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              to="/volunteer"
              style={{
                padding: "13px 28px", borderRadius: "999px",
                background: "linear-gradient(135deg, #8b5cf6, #f43f5e)",
                color: "#fff", fontWeight: 700, fontSize: "15px",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px",
                boxShadow: "0 8px 30px rgba(139,92,246,0.35)",
              }}
            >
              Start Volunteering <ArrowRight size={16} />
            </Link>
            <Link
              to="/servekindness"
              style={{
                padding: "13px 28px", borderRadius: "999px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(240,244,255,0.8)", fontWeight: 600, fontSize: "15px",
                textDecoration: "none",
              }}
            >
              Give & Donate
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Philosophy strip ── */}
      <section style={{
        padding: "48px 24px",
        background: "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(244,63,94,0.05))",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        textAlign: "center",
      }}>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{
            maxWidth: "680px", margin: "0 auto",
            fontSize: "1.25rem", fontStyle: "italic",
            color: "rgba(240,244,255,0.7)", lineHeight: 1.75,
          }}
        >
          "No one has ever become poor by giving. Every act of kindness grows the giver."
          <span style={{ display: "block", marginTop: "12px", fontSize: "0.9rem", color: "rgba(240,244,255,0.4)", fontStyle: "normal" }}>
            — A principle woven into the KCF Kindness Constitution
          </span>
        </motion.p>
      </section>

      {/* ── Growth Framework ── */}
      <section style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <p style={{
            fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#8b5cf6", marginBottom: "12px",
          }}>
            The KCF Growth Framework
          </p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2 }}>
            Six Practices for a Life of Purpose
          </h2>
          <p style={{ marginTop: "12px", color: "rgba(240,244,255,0.55)", fontSize: "1rem", maxWidth: "560px", margin: "12px auto 0" }}>
            Growth is not accidental. These six practices — embedded in everything KCF does — help you become
            the person your community needs.
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {framework.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5}
              style={{
                padding: "32px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "transform 0.2s, border-color 0.2s",
              }}
              whileHover={{ scale: 1.02, borderColor: `${item.color}44` }}
            >
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: `${item.color}1a`, border: `1px solid ${item.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "18px",
              }}>
                <item.icon size={22} color={item.color} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>{item.title}</h3>
              <p style={{ fontSize: "0.92rem", color: "rgba(240,244,255,0.55)", lineHeight: 1.65 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Vision Board Callout ── */}
      <section style={{
        margin: "0 auto 100px",
        maxWidth: "900px",
        padding: "60px 48px",
        borderRadius: "28px",
        background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(244,63,94,0.08))",
        border: "1px solid rgba(139,92,246,0.2)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "240px", height: "240px",
          background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent)",
          pointerEvents: "none",
        }} />
        <Target size={40} color="#a78bfa" style={{ marginBottom: "20px" }} />
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>
          Build Your Vision
        </h2>
        <p style={{ color: "rgba(240,244,255,0.6)", lineHeight: 1.7, maxWidth: "580px", margin: "0 auto 28px", fontSize: "1rem" }}>
          Your future self is shaped by today's choices. Define who you want to become —
          the communities you'll impact, the lives you'll touch, the person you'll grow into.
          Start by taking one small action today.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px",
          marginBottom: "36px",
          maxWidth: "680px",
          margin: "0 auto 36px",
        }}>
          {[
            { emoji: "🌍", label: "Global Impact" },
            { emoji: "💪", label: "Personal Strength" },
            { emoji: "🤝", label: "Community Bonds" },
            { emoji: "📚", label: "Lifelong Learning" },
          ].map(v => (
            <div key={v.label} style={{
              padding: "18px", borderRadius: "16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{v.emoji}</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(240,244,255,0.7)" }}>{v.label}</div>
            </div>
          ))}
        </div>
        <Link
          to="/volunteer"
          style={{
            padding: "13px 30px", borderRadius: "999px",
            background: "linear-gradient(135deg, #8b5cf6, #f43f5e)",
            color: "#fff", fontWeight: 700, fontSize: "15px",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px",
            boxShadow: "0 8px 30px rgba(139,92,246,0.3)",
          }}
        >
          Begin Your Journey <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── Journal Prompts ── */}
      <section style={{ padding: "0 24px 100px", maxWidth: "800px", margin: "0 auto" }}>
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "50px" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "999px", marginBottom: "16px",
            background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
            fontSize: "13px", fontWeight: 600, color: "#fbbf24",
          }}>
            <MessageCircle size={14} />
            Daily Journaling
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, lineHeight: 1.2 }}>
            Prompts to Spark Reflection
          </h2>
          <p style={{ marginTop: "12px", color: "rgba(240,244,255,0.5)", fontSize: "1rem" }}>
            Five minutes a day, honest and unfiltered. These questions will surprise you.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {journalPrompts.map((prompt, i) => (
            <motion.div
              key={i}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.3}
              style={{
                display: "flex", alignItems: "flex-start", gap: "16px",
                padding: "22px 24px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{
                minWidth: "30px", height: "30px", borderRadius: "50%",
                background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700, color: "#fbbf24",
              }}>
                {i + 1}
              </span>
              <p style={{ fontSize: "0.97rem", color: "rgba(240,244,255,0.7)", lineHeight: 1.65, margin: 0 }}>
                {prompt}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        padding: "100px 24px",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "linear-gradient(180deg, transparent, rgba(139,92,246,0.05))",
      }}>
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "16px" }}>
            Ready to Grow?
          </h2>
          <p style={{ color: "rgba(240,244,255,0.55)", fontSize: "1.05rem", maxWidth: "500px", margin: "0 auto 36px", lineHeight: 1.7 }}>
            Join thousands of volunteers, givers, and community builders who are growing every day
            through the power of kindness.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/volunteer"
              style={{
                padding: "14px 32px", borderRadius: "999px",
                background: "linear-gradient(135deg, #8b5cf6, #f43f5e)",
                color: "#fff", fontWeight: 700, fontSize: "16px",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px",
                boxShadow: "0 8px 32px rgba(139,92,246,0.35)",
              }}
            >
              Volunteer Now <ArrowRight size={16} />
            </Link>
            <Link
              to="/kindwave"
              style={{
                padding: "14px 32px", borderRadius: "999px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(240,244,255,0.8)", fontWeight: 600, fontSize: "16px",
                textDecoration: "none",
              }}
            >
              Explore KindWave
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
