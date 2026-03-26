import { motion } from "framer-motion";

// Impact score: 0–1000 based on total donated, causes diversity, recurring plans, goals
export function computeImpactScore({ donations, subscriptions, goals }) {
  const totalDonated = donations.reduce((s, d) => s + d.amount, 0);
  const uniqueCauses = new Set(donations.map(d => d.cause)).size;
  const activeSubs = subscriptions.filter(s => s.status === "active").length;
  const completedGoals = goals.filter(g => g.is_completed).length;

  const donationScore = Math.min(totalDonated / 5, 400);         // up to 400 pts
  const diversityScore = uniqueCauses * 40;                       // up to 240 pts (6 causes)
  const recurringScore = Math.min(activeSubs * 60, 240);          // up to 240 pts
  const goalsScore = Math.min(completedGoals * 30, 120);          // up to 120 pts

  return Math.min(Math.round(donationScore + diversityScore + recurringScore + goalsScore), 1000);
}

function getTier(score) {
  if (score >= 800) return { label: "Changemaker", color: "#D4A84B", bg: "#FEF9EC", emoji: "🏆" };
  if (score >= 600) return { label: "Champion", color: "#3D6B50", bg: "#EAF4EF", emoji: "🌟" };
  if (score >= 400) return { label: "Advocate", color: "#4a90b8", bg: "#EAF4FB", emoji: "💙" };
  if (score >= 200) return { label: "Supporter", color: "#9b59b6", bg: "#F5EDF9", emoji: "💜" };
  return { label: "Seedling", color: "#657066", bg: "#EAF0EC", emoji: "🌱" };
}

export default function ImpactScore({ donations, subscriptions, goals }) {
  const score = computeImpactScore({ donations, subscriptions, goals });
  const tier = getTier(score);
  const pct = (score / 1000) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl p-7 border border-[#d4e0d8] bg-white"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#657066] uppercase mb-1">Your Impact Score</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-[#1B2B22]" style={{ fontFamily: "'Georgia', serif" }}>{score}</span>
            <span className="text-xl text-[#657066] mb-1">/1000</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl">{tier.emoji}</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color: tier.color, background: tier.bg }}>
            {tier.label}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#EAF0EC] rounded-full h-3 mb-3 overflow-hidden">
        <motion.div
          className="h-3 rounded-full"
          style={{ background: `linear-gradient(90deg, ${tier.color}, #D4A84B)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        {[
          { label: "Total Donated", value: `$${donations.reduce((s, d) => s + d.amount, 0).toFixed(0)}` },
          { label: "Causes Supported", value: new Set(donations.map(d => d.cause)).size },
          { label: "Active Plans", value: subscriptions.filter(s => s.status === "active").length },
          { label: "Goals Completed", value: goals.filter(g => g.is_completed).length },
        ].map(item => (
          <div key={item.label} className="bg-[#FDFAF5] rounded-xl p-3">
            <div className="text-lg font-bold text-[#1B2B22]" style={{ fontFamily: "'Georgia', serif" }}>{item.value}</div>
            <div className="text-xs text-[#657066]">{item.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}