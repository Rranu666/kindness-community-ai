import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock, ChevronDown } from 'lucide-react';
import { BADGES } from '@/kindlearn/lib/languages';

export default function BadgesSection({ earnedBadges = [], wordsLearned = 0, xpTotal = 0, streak = 0 }) {
  const [expanded, setExpanded] = useState(false);

  // Determine which badges user is close to unlocking
  const upcomingBadges = BADGES.filter(badge => {
    if (earnedBadges.includes(badge.id)) return false;
    
    if (badge.id === 'words_50' && wordsLearned >= 40) return true;
    if (badge.id === 'words_100' && wordsLearned >= 80) return true;
    if (badge.id === 'xp_500' && xpTotal >= 400) return true;
    if (badge.id === 'xp_1000' && xpTotal >= 800) return true;
    if (badge.id === 'streak_3' && streak >= 2) return true;
    if (badge.id === 'streak_7' && streak >= 5) return true;
    if (badge.id === 'streak_14' && streak >= 12) return true;
    if (badge.id === 'streak_30' && streak >= 25) return true;
    
    return false;
  }).slice(0, 3);

  const earnedCount = earnedBadges.length;
  const totalBadges = BADGES.length;

  return (
    <div className="bg-card rounded-2xl border p-5">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between hover:opacity-70 transition-opacity"
      >
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Badges & Achievements
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">
            {earnedCount}/{totalBadges}
          </span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-4"
          >
            {/* Earned badges */}
            {earnedCount > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  🎉 Unlocked ({earnedCount})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BADGES.filter(b => earnedBadges.includes(b.id)).map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-3 text-center"
                    >
                      <div className="text-3xl mb-1">{badge.emoji}</div>
                      <p className="text-xs font-bold text-emerald-900">{badge.name}</p>
                      <p className="text-xs text-emerald-700 mt-0.5">{badge.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming badges (close to unlocking) */}
            {upcomingBadges.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  🎯 Almost There
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {upcomingBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-3 text-center"
                    >
                      <div className="text-3xl mb-1 opacity-75">{badge.emoji}</div>
                      <p className="text-xs font-bold text-amber-900">{badge.name}</p>
                      <p className="text-xs text-amber-700 mt-0.5">{badge.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked badges */}
            {earnedCount < totalBadges && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  🔒 Locked ({totalBadges - earnedCount})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BADGES.filter(b => !earnedBadges.includes(b.id) && !upcomingBadges.find(ub => ub.id === b.id)).map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-secondary/40 border border-border rounded-xl p-3 text-center opacity-60"
                    >
                      <div className="text-3xl mb-1 flex items-center justify-center relative">
                        <span>{badge.emoji}</span>
                        <Lock className="w-4 h-4 absolute bottom-0 right-0 bg-muted rounded-full p-0.5 text-muted-foreground" />
                      </div>
                      <p className="text-xs font-bold text-muted-foreground">{badge.name}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span className="font-semibold">Overall Progress</span>
                <span>{Math.round((earnedCount / totalBadges) * 100)}%</span>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(earnedCount / totalBadges) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}