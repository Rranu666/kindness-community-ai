import { motion } from "framer-motion";

const IMPACT_RATES = {
  "Hunger & Food Security":    { icon: "🍽️", label: "Meals Funded",           rate: 10,   unit: "meals",   color: "#D4A84B" },
  "Climate & Reforestation":   { icon: "🌳", label: "Trees Planted",           rate: 1,    unit: "trees",   color: "#5C9470" },
  "Clean Water Access":        { icon: "💧", label: "Days of Clean Water",      rate: 5,    unit: "days",    color: "#4a90b8" },
  "Education & Children":      { icon: "👧", label: "School Days Funded",       rate: 3,    unit: "days",    color: "#9b59b6" },
  "Health & Medical Aid":      { icon: "🏥", label: "Medical Treatments Aided", rate: 0.5,  unit: "treatments", color: "#e74c3c" },
  "Ocean Conservation":        { icon: "🌊", label: "kg Ocean Plastic Removed", rate: 2,    unit: "kg",      color: "#1abc9c" },
};

export default function ImpactMetrics({ donations }) {
  const impactByCause = {};

  donations.forEach(d => {
    const config = IMPACT_RATES[d.cause];
    if (!config) return;
    if (!impactByCause[d.cause]) impactByCause[d.cause] = { ...config, total: 0, donated: 0 };
    impactByCause[d.cause].total += Math.floor(d.amount * config.rate);
    impactByCause[d.cause].donated += d.amount;
  });

  const metrics = Object.entries(impactByCause);

  if (!metrics.length) {
    return (
      <div className="text-center py-12 text-[#657066]">
        <div className="text-4xl mb-3">🌱</div>
        <p className="text-sm">Your impact metrics will appear here once you make your first donation.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map(([cause, m], i) => (
        <motion.div
          key={cause}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-white rounded-2xl p-5 border border-[#d4e0d8] hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-3xl">{m.icon}</span>
            <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: m.color }}>
              ${m.donated.toFixed(0)} given
            </span>
          </div>
          <div className="text-3xl font-bold text-[#1B2B22] mb-1" style={{ fontFamily: "'Georgia', serif" }}>
            {m.total.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-[#333D35]">{m.label}</div>
          <div className="text-xs text-[#657066] mt-1">{cause}</div>
        </motion.div>
      ))}
    </div>
  );
}