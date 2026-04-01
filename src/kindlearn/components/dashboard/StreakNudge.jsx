import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StreakNudge({ streak, currentDay, language, langId }) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-dismiss after 8 seconds
    const timer = setTimeout(() => setDismissed(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || dismissed || streak === 0) return null;

  const messages = {
    3: "You're on fire! 3-day streak 🔥",
    7: "Week warrior! Keep the momentum 💪",
    14: "Two weeks strong! Amazing dedication 🚀",
    30: "One month legend! You're unstoppable 👑",
  };

  const getMessage = () => {
    if (streak >= 30) return messages[30];
    if (streak >= 14) return messages[14];
    if (streak >= 7) return messages[7];
    if (streak >= 3) return messages[3];
    return `${streak}-day streak! Don't break it today 🔥`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden">
          {/* Animated flame background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-20 h-20 bg-amber-400 rounded-full blur-2xl animate-pulse" />
          </div>

          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative flex-shrink-0"
          >
            <Flame className="w-6 h-6 text-amber-600" />
          </motion.div>

          <div className="flex-1 relative">
            <p className="font-bold text-amber-900">{getMessage()}</p>
            <p className="text-xs text-amber-700 mt-0.5">
              You're on Day {currentDay} of your {language} challenge — one lesson keeps it going!
            </p>
          </div>

          <Link
            to={`/lesson?lang=${langId}`}
            className="relative flex-shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1"
          >
            Start <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="relative flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-all"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-amber-700" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}