import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from "date-fns";

const CAUSE_ICONS = {
  "Hunger & Food Security": "🍽️",
  "Climate & Reforestation": "🌳",
  "Clean Water Access": "💧",
  "Education & Children": "👧",
  "Health & Medical Aid": "🏥",
  "Ocean Conservation": "🌊",
};

const STATUS_COLORS = {
  active: "bg-[#3D6B50]",
  paused: "bg-[#D4A84B]",
  cancelled: "bg-red-400",
};

export default function SubscriptionCalendar({ subscriptions }) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart); // 0=Sun

  // Build map: day-of-month -> subscriptions due
  const dueDays = useMemo(() => {
    const map = {};
    subscriptions.forEach(sub => {
      if (sub.status === "cancelled") return;
      const day = Math.min(sub.billing_day, days.length);
      if (!map[day]) map[day] = [];
      map[day].push(sub);
    });
    return map;
  }, [subscriptions, days.length]);

  // Upcoming list (next 3 months)
  const upcoming = useMemo(() => {
    const items = [];
    const active = subscriptions.filter(s => s.status === "active");
    for (let m = 0; m < 3; m++) {
      const d = new Date(today.getFullYear(), today.getMonth() + m, 1);
      active.forEach(sub => {
        const day = Math.min(sub.billing_day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
        const date = new Date(d.getFullYear(), d.getMonth(), day);
        if (date >= today) items.push({ ...sub, date });
      });
    }
    return items.sort((a, b) => a.date - b.date).slice(0, 8);
  }, [subscriptions]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-[#1B2B22]" style={{ fontFamily: "'Georgia', serif" }}>
            {format(today, "MMMM yyyy")}
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3D6B50] inline-block" /> Active</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D4A84B] inline-block" /> Paused</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map(d => (
            <div key={d} className="text-center text-xs font-bold text-[#657066] py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
          {days.map(day => {
            const d = day.getDate();
            const subs = dueDays[d] || [];
            const hasActive = subs.some(s => s.status === "active");
            const hasPaused = subs.some(s => s.status === "paused");
            const isTod = isToday(day);
            return (
              <div
                key={d}
                className={`relative rounded-xl p-1.5 min-h-[48px] flex flex-col items-center transition-all
                  ${isTod ? "bg-[#1B2B22]" : subs.length ? "bg-[#EAF0EC] hover:bg-[#d4e8da]" : "hover:bg-[#f4ede1]/40"}
                `}
              >
                <span className={`text-xs font-bold ${isTod ? "text-white" : "text-[#333D35]"}`}>{d}</span>
                {subs.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 justify-center mt-0.5">
                    {subs.slice(0, 3).map((s, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[s.status]}`} title={`${CAUSE_ICONS[s.cause]} $${s.amount}`} />
                    ))}
                  </div>
                )}
                {subs.length > 0 && (
                  <span className="text-[9px] font-bold text-[#3D6B50] mt-0.5">
                    ${subs.filter(s => s.status === "active").reduce((a, s) => a + s.amount, 0) || ""}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming list */}
      <div>
        <h3 className="font-bold text-base text-[#1B2B22] mb-4" style={{ fontFamily: "'Georgia', serif" }}>Upcoming Charges</h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-[#657066]">No upcoming active subscriptions.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {upcoming.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#EAF0EC]/60 rounded-xl px-4 py-3">
                <div className="text-center flex-shrink-0 w-10">
                  <div className="text-xs font-bold text-[#657066]">{format(item.date, "MMM")}</div>
                  <div className="text-lg font-bold text-[#1B2B22] leading-none">{format(item.date, "d")}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#1B2B22] truncate">{CAUSE_ICONS[item.cause]} {item.charity_name || item.cause}</div>
                  <div className="text-xs text-[#657066]">${item.amount}/mo</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}