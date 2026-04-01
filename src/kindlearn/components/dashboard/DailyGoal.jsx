import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Pencil, Check, X, PartyPopper } from 'lucide-react';

const PRESET_GOALS = [5, 10, 15, 20, 30];

export default function DailyGoal({ goalMinutes = 10, practiceMinutes = 0, onGoalChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goalMinutes);
  const [celebrated, setCelebrated] = useState(false);
  const prevMinutes = useRef(practiceMinutes);

  const pct = Math.min(100, Math.round((practiceMinutes / Math.max(goalMinutes, 1)) * 100));
  const goalReached = practiceMinutes >= goalMinutes;

  // Trigger celebration exactly once when goal is first crossed
  useEffect(() => {
    if (!celebrated && goalReached && prevMinutes.current < goalMinutes) {
      setCelebrated(true);
      // Auto-dismiss after 4s
      setTimeout(() => setCelebrated(false), 4000);
    }
    prevMinutes.current = practiceMinutes;
  }, [practiceMinutes, goalReached, goalMinutes, celebrated]);

  const handleSave = () => {
    if (draft >= 1) {
      onGoalChange(draft);
      setCelebrated(false); // reset so it can fire again
    }
    setEditing(false);
  };

  const barColor = goalReached
    ? 'from-emerald-400 to-emerald-500'
    : pct >= 60
    ? 'from-amber-400 to-amber-500'
    : 'from-primary to-accent';

  return (
    <div className={`relative bg-card rounded-2xl border p-5 overflow-hidden transition-all duration-300 ${goalReached ? 'border-emerald-300 shadow-emerald-100 shadow-md' : ''}`}>

      {/* Goal-reached celebration banner */}
      <AnimatePresence>
        {celebrated && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute inset-x-0 top-0 z-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <PartyPopper className="w-5 h-5" />
              <span className="font-bold text-sm">Daily goal reached! Great job! 🎉</span>
            </div>
            <button onClick={() => setCelebrated(false)} className="opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Target className={`w-5 h-5 ${goalReached ? 'text-emerald-500' : 'text-primary'}`} />
          Daily Goal
        </h3>

        {!editing ? (
          <button
            onClick={() => { setDraft(goalMinutes); setEditing(true); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-secondary px-3 py-1.5 rounded-lg"
          >
            <Pencil className="w-3 h-3" /> {goalMinutes} min
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={120}
              value={draft}
              onChange={(e) => setDraft(Number(e.target.value))}
              className="w-16 text-center text-sm font-bold border rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground">min</span>
            <button onClick={handleSave} className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={() => setEditing(false)} className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* Preset quick-pick (shown while editing) */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <p className="text-xs text-muted-foreground mb-2">Quick pick:</p>
            <div className="flex gap-2 flex-wrap">
              {PRESET_GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setDraft(g)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                    draft === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-transparent hover:border-primary/30'
                  }`}
                >
                  {g} min
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress info */}
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">
          {practiceMinutes} / {goalMinutes} min practiced today
        </span>
        <span className={`font-bold ${goalReached ? 'text-emerald-600' : 'text-foreground'}`}>
          {goalReached ? '✅ Done!' : `${pct}%`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Sub-label */}
      <p className="text-xs text-muted-foreground mt-2">
        {goalReached
          ? 'You crushed it today! 🚀 Come back tomorrow.'
          : `${Math.max(0, goalMinutes - practiceMinutes)} min left to hit your goal`}
      </p>
    </div>
  );
}