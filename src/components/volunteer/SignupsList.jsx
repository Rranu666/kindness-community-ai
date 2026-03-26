import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const initiativeEmojis = {
  education: "🎓",
  economic: "💼",
  health: "🏥",
  development: "🏘️",
  environment: "🌱",
  culture: "🎭",
};

export default function SignupsList({ signups, onLogHours }) {
  if (signups.length === 0) {
    return (
      <Card className="p-8 bg-slate-50 text-center border border-slate-200">
        <p className="text-slate-600">No signups yet. Join an initiative to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {signups.map((signup) => (
        <Card key={signup.id} className="p-5 bg-white border border-slate-200 hover:border-slate-300 transition">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">
                {initiativeEmojis[signup.initiative_id] || "✨"}
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{signup.initiative_name}</h3>
                <p className="text-xs text-slate-500">
                  Started {new Date(signup.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              signup.status === "active"
                ? "bg-green-100 text-green-700"
                : signup.status === "completed"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-700"
            }`}>
              {signup.status}
            </span>
          </div>

          <Button
            onClick={() => onLogHours(signup)}
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
          >
            <Clock className="w-3 h-3" />
            Log Hours
          </Button>
        </Card>
      ))}
    </div>
  );
}