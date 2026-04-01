import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, LayoutDashboard, CheckCircle2, XCircle } from 'lucide-react';

export default function ReviewSummary({ results, onRestart, onDashboard }) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);

  const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '💪' : '📖';
  const message =
    pct === 100 ? 'Perfect! All cleared!' :
    pct >= 70 ? 'Great work — keep it up!' :
    pct >= 40 ? 'Good effort — practice more!' :
    'Keep reviewing — you\'ll get there!';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 0.7, repeat: 1 }}
        className="text-6xl mb-4 block"
      >
        {emoji}
      </motion.div>
      <h2 className="text-2xl font-extrabold mb-1">{message}</h2>
      <p className="text-muted-foreground mb-6">{correct}/{total} correct ({pct}%)</p>

      {/* Score bar */}
      <div className="h-3 bg-secondary rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>

      {/* Per-word breakdown */}
      <div className="bg-card rounded-2xl border p-4 mb-6 text-left space-y-2 max-h-60 overflow-y-auto">
        {results.map((r, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="font-semibold">{r.card.emoji} {r.card.word}</span>
            <span className="text-muted-foreground text-xs mr-2">{r.card.meaning}</span>
            {r.correct
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              : <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />}
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="outline" onClick={onRestart} className="rounded-2xl gap-2">
          <RotateCcw className="w-4 h-4" /> Review Again
        </Button>
        <Button onClick={onDashboard} className="rounded-2xl gap-2">
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Button>
      </div>
    </motion.div>
  );
}