import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, X, Volume2, Shuffle, ArrowRight } from 'lucide-react';
import { useSpeech } from '@/kindlearn/hooks/useSpeech';
import { updateVocabularyProgress } from '@/kindlearn/lib/vocabularyEngine';

export default function VocabularyReview({ dueWords, vocabularySRS, onComplete, langId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(dueWords.sort(() => Math.random() - 0.5));
  const { speak } = useSpeech(langId);
  const [completed, setCompleted] = useState(false);
  const [correct, setCorrect] = useState(0);

  const current = shuffled[currentIndex];
  const progress = Math.round(((currentIndex + (completed ? 1 : 0)) / shuffled.length) * 100);

  const handleCorrect = () => {
    const updated = updateVocabularyProgress(vocabularySRS, current.word, true);
    setCorrect((c) => c + 1);
    moveToNext(updated);
  };

  const handleIncorrect = () => {
    const updated = updateVocabularyProgress(vocabularySRS, current.word, false);
    moveToNext(updated);
  };

  const moveToNext = (updatedSRS) => {
    if (currentIndex < shuffled.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
      onComplete(updatedSRS);
    }
  };

  if (!current) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {!completed ? (
        <>
          {/* Progress */}
          <div className="w-full max-w-md">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-muted-foreground">
                {currentIndex + 1} of {shuffled.length}
              </span>
              <span className="text-sm font-semibold text-foreground">{correct} correct</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Flashcard */}
          <motion.div
            key={`card-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-full max-w-md"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative h-48 cursor-pointer"
              style={{ perspective: '1000px' }}
            >
              <div
                className={`absolute w-full h-full rounded-3xl border-2 border-primary/30 shadow-lg flex items-center justify-center p-6 transition-colors ${
                  isFlipped ? 'bg-primary/5' : 'bg-accent/5'
                }`}
              >
                <div className="text-center">
                  {isFlipped ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Translation</p>
                      <p className="text-3xl font-bold text-foreground">{current.meaning}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Word</p>
                      <p className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {current.word}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">Click to flip</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Audio button */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => speak(current.word)}
            className="gap-2 rounded-full"
          >
            <Volume2 className="w-5 h-5" />
            Hear Pronunciation
          </Button>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleIncorrect}
              className="flex-1 gap-2 border-rose-300 text-rose-600 hover:bg-rose-50"
            >
              <X className="w-5 h-5" />
              Not Yet
            </Button>
            <Button
              size="lg"
              onClick={handleCorrect}
              className="flex-1 gap-2 shadow-lg shadow-emerald-500/30"
              style={{ backgroundColor: '#10b981' }}
            >
              <Check className="w-5 h-5" />
              Got It!
            </Button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="text-5xl font-extrabold text-emerald-600">🎉</div>
          <h2 className="text-3xl font-extrabold">Review Complete!</h2>
          <p className="text-lg text-muted-foreground">
            You got <span className="font-bold text-emerald-600">{correct}</span> out of{' '}
            <span className="font-bold">{shuffled.length}</span> correct
          </p>
          <div className="text-4xl font-bold text-primary mt-4">
            {Math.round((correct / shuffled.length) * 100)}%
          </div>
        </motion.div>
      )}
    </div>
  );
}