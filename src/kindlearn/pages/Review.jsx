import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { progressApi } from '@/kindlearn/api/progress';
import { LANGUAGES } from '@/kindlearn/lib/languages';
import { FLASHCARD_DECK } from '@/kindlearn/lib/flashcards';
import Navbar from '@/kindlearn/components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, RotateCcw, CheckCircle2, XCircle, Flame, ChevronRight } from 'lucide-react';
import ReviewCard from '@/kindlearn/components/review/ReviewCard';
import ReviewSummary from '@/kindlearn/components/review/ReviewSummary';
import ReviewEmpty from '@/kindlearn/components/review/ReviewEmpty';

// Build a prioritized deck from struggled_words (highest misses first) + SRS interval logic
function buildReviewDeck(langId, struggledWords = {}) {
  const allWords = FLASHCARD_DECK[langId] || [];

  // Only include words the user has struggled with
  const struggledEntries = Object.entries(struggledWords)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]); // highest miss count first

  const deck = struggledEntries
    .map(([word, missCount]) => {
      const meta = allWords.find((w) => w.word === word);
      if (!meta) return null;
      return { ...meta, missCount };
    })
    .filter(Boolean);

  return deck;
}

// Generate 4-choice quiz options for a card
function generateOptions(card, allWords) {
  const distractors = allWords
    .filter((w) => w.word !== card.word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((w) => w.meaning);
  const options = [...distractors, card.meaning].sort(() => Math.random() - 0.5);
  return options;
}

export default function Review() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const langId = urlParams.get('lang') || 'spanish';
  const language = LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];

  const [progress, setProgress] = useState(null);
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]); // { word, correct }
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const list = await progressApi.filter({ language: langId, mode: 'adult' });
      if (list.length > 0) {
        const p = list[0];
        setProgress(p);
        const built = buildReviewDeck(langId, p.struggled_words || {});
        setDeck(built);
        setDone(built.length === 0);
      }
      setLoading(false);
    };
    init();
  }, [langId]);

  const allWords = FLASHCARD_DECK[langId] || [];

  const handleAnswer = async (card, selectedMeaning) => {
    const correct = selectedMeaning === card.meaning;
    setSessionResults((prev) => [...prev, { word: card.word, correct, card }]);

    // Update struggled_words: decrement on correct, leave on wrong (lesson logic increments)
    if (correct && progress?.id) {
      const updated = { ...(progress.struggled_words || {}) };
      updated[card.word] = Math.max(0, (updated[card.word] || 1) - 1);
      if (updated[card.word] === 0) delete updated[card.word];

      await progressApi.update(progress.id, { struggled_words: updated });
      setProgress((prev) => ({ ...prev, struggled_words: updated }));
    }

    const isLast = currentIndex + 1 >= deck.length;
    if (isLast) {
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRestart = () => {
    // Rebuild deck with latest struggled_words (after corrections)
    const rebuilt = buildReviewDeck(langId, progress?.struggled_words || {});
    setDeck(rebuilt);
    setCurrentIndex(0);
    setSessionResults([]);
    setDone(rebuilt.length === 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const currentCard = deck[currentIndex];
  const options = currentCard ? generateOptions(currentCard, allWords) : [];
  const correctCount = sessionResults.filter((r) => r.correct).length;
  const struggledCount = Object.values(progress?.struggled_words || {}).filter((v) => v > 0).length;

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
                  <Brain className="w-5 h-5 text-primary" /> Word Review
                </h1>
                <p className="text-sm text-muted-foreground">{language.name} · Struggled words</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Need Review', value: struggledCount, color: 'text-rose-500' },
              { label: 'This Session', value: deck.length, color: 'text-primary' },
              { label: 'Correct', value: correctCount, color: 'text-emerald-600' },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-2xl border p-3 text-center">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {deck.length === 0 ? (
              <ReviewEmpty key="empty" langId={langId} onNavigate={navigate} />
            ) : done ? (
              <ReviewSummary
                key="summary"
                results={sessionResults}
                onRestart={handleRestart}
                onDashboard={() => navigate(`/kindlearn/dashboard?lang=${langId}`)}
              />
            ) : (
              <motion.div
                key={`card-${currentIndex}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.22 }}
              >
                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                    {currentIndex + 1} / {deck.length}
                  </span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      animate={{ width: `${(currentIndex / deck.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <ReviewCard
                  card={currentCard}
                  options={options}
                  onAnswer={handleAnswer}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}