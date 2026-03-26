import { Card } from "@/components/ui/card";

export default function HoursTimeline({ hours }) {
  if (hours.length === 0) {
    return (
      <Card className="p-8 bg-slate-50 text-center border border-slate-200">
        <p className="text-slate-600">No hours logged yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {hours.map((entry, idx) => (
        <div key={entry.id} className="relative">
          {/* Timeline line */}
          {idx !== hours.length - 1 && (
            <div className="absolute left-[11px] top-12 w-0.5 h-8 bg-slate-200" />
          )}

          {/* Timeline item */}
          <Card className="p-4 bg-white border border-slate-200">
            <div className="flex gap-3">
              {/* Timeline dot */}
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-600">
                  {entry.hours}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 text-sm">
                  {entry.initiative_name}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {new Date(entry.activity_date).toLocaleDateString()}
                </p>
                {entry.description && (
                  <p className="text-xs text-slate-700 mt-2 line-clamp-2">
                    {entry.description}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}