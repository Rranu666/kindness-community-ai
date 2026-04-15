import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { progressApi } from '@/kindlearn/api/progress';
import { LANGUAGES } from '@/kindlearn/lib/languages';
import { FLASHCARD_DECK, sm2, getDueCards } from '@/kindlearn/lib/flashcards';
import FlashcardView from '@/kindlearn/components/flashcards/FlashcardView';
import Navbar from '@/kindlearn/components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Layers, CheckCircle2, RefreshCw, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Greetings', 'Basics', 'Numbers', 'Family', 'Food', 'Animals', 'Colors'];

export default function Flashcards() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const langId = urlParams.get('lang') || 'spanish';
  const language = LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];

  const [progress, setProgress] = useState(null);
  const [srsData, setSrsData] = useState({}); // { word -> { interval, repetitions, easeFactor, nextReview } }
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [filter, setFilter] = useState('All');
  const [mode, setMode] = useState('due'); // 'due' | 'all'
  const [loading, setLoading] = useState(true);

  // SRS data is stored on the UserProgress entity as a JSON string in a new field
  // We store it in localStorage keyed by langId for fast access
  const srsKey = `kindlearn_srs_${langId}`;

  useEffect(() => {
    const init = async () => {
      const storedSRS = JSON.parse(localStorage.getItem(srsKey) || '{}');
      setSrsData(storedSRS);

      const list = await progressApi.filter({ language: langId, mode: 'adult' });
      if (list.length > 0) setProgress(list[0]);

      setLoading(false);
    };
    init();
  }, [langId]);

  useEffect(() => {
    if (loading) return;
    buildDeck();
  }, [loading, filter, mode, srsData]);

  const buildDeck = useCallback(() => {
    const fullDeck = FLASHCARD_DECK[langId] || [];
    const filtered = filter === 'All' ? fullDeck : fullDeck.filter((c) => c.category === filter);
    const cards = mode === 'due' ? getDueCards(filtered, srsData) : filtered;
    setDeck(cards);
    setCurrentIndex(0);
    setSessionDone(cards.length === 0);
    setReviewed(0);
  }, [langId, filter, mode, srsData]);

  const handleRate = (card, quality) => {
    const key = card.word;
    const existing = srsData[key] || { interval: 0, repetitions: 0, easeFactor: 2.5 };
    const result = sm2(quality, existing.repetitions, existing.interval, existing.easeFactor);

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + result.interval);
    const nextReview = nextReviewDate.toISOString().split('T')[0];

    const newSRS = {
      ...srsData,
      [key]: { ...result, nextReview, lastQuality: quality },
    };
    setSrsData(newSRS);
    localStorage.setItem(srsKey, JSON.stringify(newSRS));
    setReviewed((r) => r + 1);

    if (currentIndex + 1 >= deck.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSessionDone(false);
    setReviewed(0);
    buildDeck();
  };

  const totalWords = (FLASHCARD_DECK[langId] || []).length;
  const masteredCount = Object.values(srsData).filter((d) => d.repetitions >= 3).length;
  const dueCount = getDueCards(FLASHCARD_DECK[langId] || [], srsData).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 kl-page-body pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/kindlearn/dashboard?lang=${langId}`)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-3xl">{language.flag}</span>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> Flashcard Deck
                </h1>
                <p className="text-sm text-muted-foreground">{language.name} · Spaced Repetition</p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total Cards', value: totalWords, color: 'text-foreground' },
              { label: 'Due Today', value: dueCount, color: 'text-amber-600' },
              { label: 'Mastered', value: masteredCount, color: 'text-emerald-600' },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-2xl border p-3 text-center">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Mode + Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex rounded-xl border overflow-hidden">
              {['due', 'all'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-2 text-sm font-semibold transition-all ${
                    mode === m ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m === 'due' ? `Due (${dueCount})` : `All (${totalWords})`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filter === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Card area */}
          <AnimatePresence mode="wait">
            {sessionDone ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 py-16 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: 2 }}
                  className="text-6xl"
                >
                  🎉
                </motion.div>
                <div>
                  <h2 className="text-2xl font-extrabold mb-1">
                    {deck.length === 0 ? 'All caught up!' : 'Session complete!'}
                  </h2>
                  <p className="text-muted-foreground">
                    {deck.length === 0
                      ? 'No cards are due right now. Come back later!'
                      : `You reviewed ${reviewed} card${reviewed !== 1 ? 's' : ''} this session.`}
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap justify-center">
                  <Button onClick={restart} variant="outline" className="rounded-2xl gap-2">
                    <RefreshCw className="w-4 h-4" /> Review Again
                  </Button>
                  <Button onClick={() => { setMode('all'); setFilter('All'); }} className="rounded-2xl gap-2">
                    <Layers className="w-4 h-4" /> Practice All
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-2xl px-5 py-3 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold text-sm">{masteredCount} words mastered so far!</span>
                </div>
              </motion.div>
            ) : deck.length > 0 ? (
              <motion.div
                key={`card-${currentIndex}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                {/* Progress indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground font-medium">
                    {currentIndex + 1} / {deck.length}
                  </span>
                  <div className="flex-1 mx-4 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      animate={{ width: `${((currentIndex) / deck.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{reviewed} reviewed</span>
                </div>

                <FlashcardView
                  key={deck[currentIndex].word}
                  card={deck[currentIndex]}
                  langId={langId}
                  onRate={handleRate}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}