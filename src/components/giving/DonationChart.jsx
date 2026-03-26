import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export default function DonationChart({ donations }) {
  const data = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const total = donations
        .filter(d => {
          const dd = new Date(d.donation_date);
          return dd >= start && dd <= end;
        })
        .reduce((s, d) => s + d.amount, 0);
      return { month: format(date, "MMM"), total: parseFloat(total.toFixed(2)) };
    });
    return months;
  }, [donations]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#1B2B22] text-white px-4 py-2.5 rounded-xl text-sm shadow-xl">
        <div className="font-bold">{label}</div>
        <div className="text-[#D4A84B]">${payload[0].value.toFixed(2)}</div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="donGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3D6B50" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3D6B50" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAF0EC" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#657066" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#657066" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="total" stroke="#3D6B50" strokeWidth={2.5} fill="url(#donGrad)" dot={{ fill: "#3D6B50", r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}