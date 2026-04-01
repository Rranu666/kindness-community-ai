import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Check, X, Flame } from 'lucide-react';

export default function ListenQuestion({ word, options, onAnswer, onReplay, streak }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (opt) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    setTimeout(() => {
      onAnswer(opt);
      setSelected(null);
      setRevealed(false);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.22 }}
    >
      {/* Streak badge */}
      {streak >= 3 && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="flex justify-center mb-3"
        >
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
            <Flame className="w-3.5 h-3.5" /> {streak} streak!
          </span>
        </motion.div>
      )}

      {/* Audio prompt card */}
      <div className="bg-card rounded-3xl border shadow-sm p-8 text-center mb-5">
        <p className="text-sm text-muted-foreground font-medium mb-6">
          Listen to the audio and pick the correct meaning
        </p>

        {/* Big play button — word is hidden */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.05 }}
          onClick={onReplay}
          className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-xl shadow-accent/30 mb-4"
          aria-label="Play audio"
        >
          <Volume2 className="w-12 h-12 text-white" />
        </motion.button>

        <p className="text-xs text-muted-foreground">Tap to hear again</p>
      </div>

      {/* 2×2 option grid — emoji + meaning, NO word text shown */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const isCorrect = opt.word === word.word;
          const isSelected = selected?.word === opt.word;

          let style = 'border-border hover:border-accent hover:bg-accent/5 cursor-pointer';
          if (revealed) {
            if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-700';
            else if (isSelected) style = 'border-rose-500 bg-rose-50 text-rose-600';
            else style = 'border-muted opacity-40';
          }

          return (
            <motion.button
              key={opt.word}
              whileTap={!revealed ? { scale: 0.96 } : {}}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all ${style}`}
            >
              <span className="text-4xl">{opt.emoji}</span>
              <span className="text-sm font-semibold text-center leading-tight">{opt.meaning}</span>

              {/* Result icon */}
              {revealed && isCorrect && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                </motion.div>
              )}
              {revealed && isSelected && !isCorrect && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
                  <X className="w-4 h-4 text-rose-500" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}