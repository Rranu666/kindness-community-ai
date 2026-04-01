import React from 'react';
import { Zap, BookOpen, Trophy, Target } from 'lucide-react';

export default function StatsRow({ xp, wordsLearned, currentDay, dailyXp }) {
  const stats = [
    { icon: Zap, label: 'Total XP', value: xp || 0, color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: BookOpen, label: 'Words Learned', value: wordsLearned || 0, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Target, label: 'Day', value: `${currentDay || 1}/30`, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Trophy, label: 'Daily XP', value: `${dailyXp || 0}/50`, color: 'text-violet-500', bg: 'bg-violet-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-card rounded-2xl border p-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold">{s.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}