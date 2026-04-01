import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Volume2, Flame } from 'lucide-react';

export default function ReviewCard({ card, options, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utt = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utt);
  };

  const handleSelect = (opt) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    // Short delay so user sees the result before advancing
    setTimeout(() => {
      onAnswer(card, opt);
      setSelected(null);
      setRevealed(false);
    }, 900);
  };

  const missLabel = card.missCount === 1 ? '1 miss' : `${card.missCount} misses`;

  return (
    <div className="bg-card rounded-3xl border shadow-sm p-6">
      {/* Miss badge */}
      <div className="flex justify-between items-start mb-5">
        <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5" /> {missLabel} — needs work
        </span>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">{card.category}</span>
      </div>

      {/* Word */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{card.emoji}</div>
        <h2 className="text-4xl font-extrabold tracking-tight mb-3">{card.word}</h2>
        <button
          onClick={() => speak(card.word)}
          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
        >
          <Volume2 className="w-4 h-4" /> Hear it
        </button>
      </div>

      {/* Question */}
      <p className="text-center text-sm font-semibold text-muted-foreground mb-4">What does this mean?</p>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = opt === card.meaning;
          let style = 'border-border hover:border-primary hover:bg-primary/5';
          if (revealed) {
            if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-700';
            else if (isSelected) style = 'border-rose-500 bg-rose-50 text-rose-700';
            else style = 'border-muted opacity-40';
          }

          return (
            <motion.button
              key={opt}
              whileTap={!revealed ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              className={`relative p-4 rounded-2xl border-2 text-sm font-semibold transition-all text-left ${style}`}
            >
              {opt}
              {revealed && isCorrect && (
                <CheckCircle2 className="w-4 h-4 absolute top-3 right-3 text-emerald-500" />
              )}
              {revealed && isSelected && !isCorrect && (
                <XCircle className="w-4 h-4 absolute top-3 right-3 text-rose-500" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}