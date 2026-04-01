import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MultipleChoiceQuestion({ question, onAnswer, disabled, langId }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (option) => {
    if (!disabled && !submitted) {
      setSelected(option);
    }
  };

  const handleSubmit = () => {
    if (selected) {
      setSubmitted(true);
      const isCorrect = selected === question.correctAnswer;
      onAnswer(isCorrect, selected);
    }
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const langMap = {
      spanish: 'es-ES', french: 'fr-FR', german: 'de-DE',
      japanese: 'ja-JP', korean: 'ko-KR', italian: 'it-IT',
      portuguese: 'pt-BR', mandarin: 'zh-CN',
    };
    const utt = new SpeechSynthesisUtterance(question.word);
    utt.lang = langMap[langId] || 'en-US';
    utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <p className="text-sm text-muted-foreground mb-4 font-medium">What does this word mean?</p>
      
      <div className="bg-card rounded-3xl border shadow-lg p-8 mb-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h2 className="text-3xl font-extrabold">{question.word}</h2>
          <button
            onClick={() => speak(question.word)}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all"
            aria-label="Hear pronunciation"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option) => {
            const isCorrect = option === question.correctAnswer;
            const isSelected = selected === option;

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={submitted}
                className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : isSelected
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-muted opacity-50'
                    : isSelected
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border hover:border-primary hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{option}</span>
                  {submitted && isCorrect && <Check className="w-4 h-4" />}
                  {submitted && isSelected && !isCorrect && <X className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!selected}
          className="rounded-2xl"
        >
          Check Answer
        </Button>
      )}

      {submitted && (
        <div className="mt-4">
          {selected === question.correctAnswer ? (
            <p className="text-emerald-600 font-semibold">Correct! 🎉</p>
          ) : (
            <div>
              <p className="text-red-600 font-semibold mb-2">Not quite right.</p>
              <p className="text-sm text-muted-foreground">The correct answer is: <strong>{question.correctAnswer}</strong></p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}