import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, LayoutDashboard, CheckCircle2, XCircle, Flame } from 'lucide-react';

export default function ListenSummary({ results, bestStreak, onRestart, onDashboard }) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);

  const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '💪' : '📖';
  const message =
    pct === 100 ? 'Perfect listening!' :
    pct >= 70 ? 'Great comprehension!' :
    pct >= 40 ? 'Keep listening!' :
    'More practice needed!';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 0.7, repeat: 1 }}
        className="text-6xl mb-3"
      >
        {emoji}
      </motion.div>

      <h2 className="text-2xl font-extrabold mb-1">{message}</h2>
      <p className="text-muted-foreground mb-2">{correct}/{total} correct ({pct}%)</p>

      {bestStreak >= 3 && (
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          <Flame className="w-3.5 h-3.5" /> Best streak: {bestStreak}!
        </div>
      )}

      {/* Score bar */}
      <div className="h-3 bg-secondary rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>

      {/* Per-word results */}
      <div className="bg-card rounded-2xl border p-4 mb-6 text-left space-y-2 max-h-56 overflow-y-auto">
        {results.map((r, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="text-xl">{r.card.emoji}</span>
            <div className="flex-1">
              <span className="font-semibold">{r.card.word}</span>
              <span className="text-muted-foreground ml-1.5 text-xs">= {r.card.meaning}</span>
            </div>
            {r.correct
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              : <div className="flex items-center gap-1">
                  <span className="text-xs text-rose-500">picked: {r.chosen.meaning}</span>
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                </div>
            }
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="outline" onClick={onRestart} className="rounded-2xl gap-2">
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
        <Button onClick={onDashboard} className="rounded-2xl gap-2">
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Button>
      </div>
    </motion.div>
  );
}