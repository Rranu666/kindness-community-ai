import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw } from 'lucide-react';

export default function FlashcardView({ card, langId, onRate }) {
  const [flipped, setFlipped] = useState(false);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const langMap = {
      spanish: 'es-ES', french: 'fr-FR', german: 'de-DE',
      japanese: 'ja-JP', korean: 'ko-KR', italian: 'it-IT',
      portuguese: 'pt-BR', mandarin: 'zh-CN',
    };
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = langMap[langId] || 'en-US';
    utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
  };

  const handleFlip = () => setFlipped((f) => !f);

  const handleRate = (quality) => {
    setFlipped(false);
    setTimeout(() => onRate(card, quality), 150);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      {/* Card */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
        role="button"
        aria-label={flipped ? 'Flip to front' : 'Flip to see meaning'}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: 300 }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-card rounded-3xl border-2 border-border shadow-xl flex flex-col items-center justify-center p-8 gap-2 overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-4xl md:text-5xl">{card.emoji}</span>
             <p className="text-3xl md:text-4xl font-extrabold text-center leading-tight">{card.word}</p>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground bg-secondary rounded-full px-3 py-1">
              {card.category}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); speak(card.word); }}
              className="mt-2 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-4 py-2 text-sm font-semibold transition-all"
              aria-label="Hear pronunciation"
            >
              <Volume2 className="w-4 h-4" /> Listen
            </button>
            <p className="text-xs text-muted-foreground mt-1">Tap to reveal meaning</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border-2 border-primary/30 shadow-xl flex flex-col items-center justify-center p-8 gap-2 overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-4xl md:text-5xl">{card.emoji}</span>
             <p className="text-lg md:text-2xl font-bold text-muted-foreground">{card.word}</p>
             <p className="text-3xl md:text-4xl font-extrabold text-center text-foreground">{card.meaning}</p>
            <button
              onClick={(e) => { e.stopPropagation(); speak(card.word); }}
              className="mt-1 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-4 py-2 text-sm font-semibold transition-all"
              aria-label="Hear pronunciation"
            >
              <Volume2 className="w-4 h-4" /> Listen again
            </button>
          </div>
        </motion.div>
      </div>

      {/* Rating buttons — only show when flipped */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="w-full grid grid-cols-3 gap-3"
          >
            {[
              { label: 'Hard', sub: 'Again soon', quality: 1, color: 'border-rose-400 bg-rose-50 text-rose-700 hover:bg-rose-100' },
              { label: 'Good', sub: 'Got it!', quality: 3, color: 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100' },
              { label: 'Easy', sub: 'Nailed it!', quality: 5, color: 'border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleRate(btn.quality)}
                className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 py-3 px-2 font-semibold text-sm transition-all ${btn.color}`}
              >
                <span className="font-bold">{btn.label}</span>
                <span className="text-xs opacity-70">{btn.sub}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!flipped && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Tap the card to flip
        </p>
      )}
    </div>
  );
}