import { Card } from "@/components/ui/card";

const badgeConfig = {
  first_steps: { emoji: "🌱", label: "First Steps", color: "bg-green-50 border-green-200" },
  champion: { emoji: "⭐", label: "Champion", color: "bg-blue-50 border-blue-200" },
  leader: { emoji: "🏆", label: "Leader", color: "bg-purple-50 border-purple-200" },
  ambassador: { emoji: "🚀", label: "Ambassador", color: "bg-orange-50 border-orange-200" },
  lifetime: { emoji: "👑", label: "Lifetime Legend", color: "bg-amber-50 border-amber-200" },
};

export default function BadgeDisplay({ badges }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {badges.map((badge) => {
        const config = badgeConfig[badge.badge_type];
        return (
          <Card
            key={badge.id}
            className={`p-6 text-center border-2 ${config.color}`}
          >
            <div className="text-5xl mb-3">{config.emoji}</div>
            <h3 className="font-bold text-slate-900 mb-1">{config.label}</h3>
            <p className="text-xs text-slate-600">
              {badge.hours_earned_at} hours
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {new Date(badge.earned_date).toLocaleDateString()}
            </p>
          </Card>
        );
      })}
    </div>
  );
}