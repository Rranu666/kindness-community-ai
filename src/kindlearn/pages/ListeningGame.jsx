import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from '@/kindlearn/lib/languages';
import { FLASHCARD_DECK } from '@/kindlearn/lib/flashcards';
import Navbar from '@/kindlearn/components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ear } from 'lucide-react';
import { useSpeech } from '@/kindlearn/hooks/useSpeech';
import ListenQuestion from '@/kindlearn/components/listen/ListenQuestion';
import ListenSummary from '@/kindlearn/components/listen/ListenSummary';

const ROUND_SIZE = 10;

function buildRound(allWords) {
  const shuffled = [...allWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(ROUND_SIZE, shuffled.length));
}

function getOptions(correct, allWords) {
  const others = allWords.filter((w) => w.word !== correct.word);
  const distractors = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...distractors, correct].sort(() => Math.random() - 0.5);
}

export default function ListeningGame() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const langId = urlParams.get('lang') || 'spanish';
  const language = LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];
  const allWords = FLASHCARD_DECK[langId] || FLASHCARD_DECK.spanish;

  const { speak } = useSpeech(langId);

  const [round, setRound] = useState(() => buildRound(allWords));
  const [qIndex, setQIndex] = useState(0);
  const [results, setResults] = useState([]); // { word, correct }
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const currentWord = round[qIndex];
  const options = currentWord ? getOptions(currentWord, allWords) : [];

  // Auto-play audio when question changes
  useEffect(() => {
    if (currentWord && !done) {
      const timer = setTimeout(() => speak(currentWord.word), 400);
      return () => clearTimeout(timer);
    }
  }, [qIndex, done]);

  const handleAnswer = useCallback((chosen) => {
    const correct = chosen.word === currentWord.word;
    const newStreak = correct ? streak + 1 : 0;
    const newBest = Math.max(bestStreak, newStreak);
    setStreak(newStreak);
    setBestStreak(newBest);
    setResults((prev) => [...prev, { card: currentWord, chosen, correct }]);

    const isLast = qIndex + 1 >= round.length;
    if (isLast) {
      setTimeout(() => setDone(true), 900);
    } else {
      setTimeout(() => setQIndex((i) => i + 1), 900);
    }
  }, [currentWord, qIndex, round, streak, bestStreak]);

  const handleReplay = () => speak(currentWord?.word);

  const handleRestart = () => {
    setRound(buildRound(allWords));
    setQIndex(0);
    setResults([]);
    setDone(false);
    setStreak(0);
  };

  const correctCount = results.filter((r) => r.correct).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 kl-page-body pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-xl">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/kindlearn/dashboard?lang=${langId}`)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-3xl">{language.flag}</span>
              <div>
                <h1 className="text-xl font-extrabold flex items-center gap-2">
                  <Ear className="w-5 h-5 text-accent" /> Listening Game
                </h1>
                <p className="text-sm text-muted-foreground">{language.name} · Audio comprehension</p>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          {!done && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Question', value: `${qIndex + 1}/${round.length}`, color: 'text-foreground' },
                { label: 'Correct', value: correctCount, color: 'text-emerald-600' },
                { label: 'Streak 🔥', value: streak, color: 'text-amber-500' },
              ].map((s) => (
                <div key={s.label} className="bg-card rounded-2xl border p-3 text-center">
                  <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Progress bar */}
          {!done && (
            <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full bg-accent rounded-full"
                animate={{ width: `${(qIndex / round.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            {done ? (
              <ListenSummary
                key="summary"
                results={results}
                bestStreak={bestStreak}
                onRestart={handleRestart}
                onDashboard={() => navigate(`/kindlearn/dashboard?lang=${langId}`)}
              />
            ) : currentWord ? (
              <ListenQuestion
                key={`q-${qIndex}`}
                word={currentWord}
                options={options}
                onAnswer={handleAnswer}
                onReplay={handleReplay}
                streak={streak}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}