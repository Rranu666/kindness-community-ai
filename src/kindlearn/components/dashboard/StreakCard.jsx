import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Zap, Star, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MILESTONES = [
  { days: 3,  icon: '🔥', message: "You're on fire! 3 days strong!", color: 'from-orange-400 to-amber-500' },
  { days: 7,  icon: '⚡', message: "One full week — incredible focus!", color: 'from-yellow-400 to-orange-500' },
  { days: 14, icon: '💪', message: "Two weeks! You're unstoppable!", color: 'from-amber-500 to-red-500' },
  { days: 21, icon: '🏆', message: "21 days — habit officially formed!", color: 'from-rose-500 to-pink-500' },
  { days: 30, icon: '👑', message: "30 days! Absolute legend status!", color: 'from-violet-500 to-purple-600' },
];

function getMilestone(streak) {
  return [...MILESTONES].reverse().find((m) => streak >= m.days) || null;
}

function getNextMilestone(streak) {
  return MILESTONES.find((m) => streak < m.days) || null;
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function StreakCard({ streak, longestStreak }) {
  const [showMilestone, setShowMilestone] = useState(false);
  const milestone = getMilestone(streak);
  const nextMilestone = getNextMilestone(streak);
  const daysToNext = nextMilestone ? nextMilestone.days - streak : 0;

  // Show milestone celebration briefly on mount if they hit one exactly
  useEffect(() => {
    if (MILESTONES.some((m) => m.days === streak)) {
      setShowMilestone(true);
      const t = setTimeout(() => setShowMilestone(false), 4000);
      return () => clearTimeout(t);
    }
  }, [streak]);

  // Week dots: last 7 days — filled up to streak % 7 (or all 7 if streak is multiple of 7)
  const filledDots = streak === 0 ? 0 : (streak % 7 === 0 ? 7 : streak % 7);

  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border border-orange-100 rounded-3xl p-6 overflow-hidden">
      {/* Background flame decoration */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl pointer-events-none" />

      {/* Milestone celebration banner */}
      <AnimatePresence>
        {showMilestone && milestone && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-x-4 top-4 z-20 bg-white rounded-2xl shadow-xl border border-amber-200 px-4 py-3 flex items-center gap-3"
          >
            <span className="text-2xl">{milestone.icon}</span>
            <div>
              <p className="font-bold text-sm text-foreground">{milestone.message}</p>
              <p className="text-xs text-muted-foreground">Milestone reached!</p>
            </div>
            <button
              onClick={() => setShowMilestone(false)}
              className="ml-auto text-muted-foreground hover:text-foreground text-lg leading-none"
            >×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-orange-700/70 uppercase tracking-wider mb-1">Daily Streak</p>

          <div className="flex items-end gap-2">
            <motion.p
              key={streak}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-extrabold text-orange-600 leading-none"
            >
              {streak}
            </motion.p>
            <span className="text-lg font-bold text-orange-400 mb-1">days</span>
          </div>

          {/* Milestone badge */}
           {milestone && (
             <div className="mt-2 inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 rounded-full px-2 md:px-3 py-1 text-xs font-semibold max-w-full truncate">
               <span className="flex-shrink-0">{milestone.icon}</span>
               <span className="truncate hidden sm:inline">{milestone.message}</span>
             </div>
           )}

          {/* Next milestone progress */}
          {nextMilestone && (
            <p className="text-xs text-muted-foreground mt-2">
              🎯 <span className="font-medium">{daysToNext} more day{daysToNext !== 1 ? 's' : ''}</span> to reach {nextMilestone.days}-day milestone
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-500" />
            Best streak: <span className="font-semibold ml-0.5">{longestStreak} days</span>
          </p>
        </div>

        {/* Animated flame */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${milestone?.color || 'from-orange-400 to-amber-500'} flex items-center justify-center shadow-lg shadow-orange-200`}>
            <Flame className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      </div>

      {/* Weekly dots with day labels */}
      <div className="mt-5">
        <p className="text-xs text-muted-foreground font-medium mb-2">This week</p>
        <div className="flex gap-1.5">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={false}
                animate={{ scale: i < filledDots ? [1, 1.3, 1] : 1 }}
                transition={{ delay: i * 0.05 }}
                className={`w-full h-3 rounded-full transition-colors duration-300 ${
                  i < filledDots
                    ? 'bg-gradient-to-r from-orange-400 to-amber-400'
                    : 'bg-orange-100'
                }`}
              />
              <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational footer */}
      {streak === 0 && (
        <p className="text-xs text-center text-muted-foreground mt-4 font-medium">
          Complete today's lesson to start your streak! 🚀
        </p>
      )}
      {streak > 0 && streak < 3 && (
        <p className="text-xs text-center text-orange-600/80 mt-4 font-medium">
          Keep going — just {3 - streak} more day{3 - streak !== 1 ? 's' : ''} to your first milestone! 🔥
        </p>
      )}
    </div>
  );
}