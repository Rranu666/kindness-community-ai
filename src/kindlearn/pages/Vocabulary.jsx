import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, BarChart3, Zap, BookOpen } from 'lucide-react';
import { buildVocabularyFromLessons, initializeVocabularySRS, getVocabularyDueForReview, updateVocabularyProgress, getVocabularyStats } from '@/kindlearn/lib/vocabularyEngine';
import { useUILanguage } from '@/kindlearn/lib/UILanguageContext';
import VocabularyBrowser from '@/kindlearn/components/vocabulary/VocabularyBrowser';
import VocabularyReview from '@/kindlearn/components/vocabulary/VocabularyReview';
import VocabularyStats from '@/kindlearn/components/vocabulary/VocabularyStats';

export default function Vocabulary() {
  const navigate = useNavigate();
  const { t } = useUILanguage();
  const urlParams = new URLSearchParams(window.location.search);
  const langId = urlParams.get('lang') || 'spanish';

  const [view, setView] = useState('browse'); // browse | review | stats
  const [vocabulary, setVocabulary] = useState([]);
  const [vocabularySRS, setVocabularySRS] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadVocabulary();
  }, [langId]);

  const loadVocabulary = async () => {
    const words = buildVocabularyFromLessons(langId);
    setVocabulary(words);

    // Initialize SRS if not in localStorage
    const cacheKey = `vocab-srs-${langId}`;
    const cached = localStorage.getItem(cacheKey);
    let srs = cached ? JSON.parse(cached) : initializeVocabularySRS(words);
    
    setVocabularySRS(srs);
    setStats(getVocabularyStats(srs));
    setLoading(false);
  };

  const handleReviewComplete = (updatedSRS) => {
    setVocabularySRS(updatedSRS);
    const cacheKey = `vocab-srs-${langId}`;
    localStorage.setItem(cacheKey, JSON.stringify(updatedSRS));
    setStats(getVocabularyStats(updatedSRS));
    setView('browse');
  };

  const handleMasterToggle = (wordKey) => {
    const item = vocabularySRS[wordKey];
    const updated = {
      ...vocabularySRS,
      [wordKey]: { ...item, isMastered: !item.isMastered },
    };
    setVocabularySRS(updated);
    const cacheKey = `vocab-srs-${langId}`;
    localStorage.setItem(cacheKey, JSON.stringify(updated));
    setStats(getVocabularyStats(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const dueForReview = getVocabularyDueForReview(vocabularySRS);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/kindlearn/dashboard?lang=${langId}`)} aria-label="Back to dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-extrabold">Vocabulary</h1>
              <p className="text-xs text-muted-foreground">Master your learned words</p>
            </div>
          </div>

          {/* View toggles */}
          <div className="flex gap-2">
            <Button
              variant={view === 'browse' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('browse')}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" /> Browse
            </Button>
            {dueForReview.length > 0 && (
              <Button
                variant={view === 'review' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('review')}
                className="gap-2"
              >
                <Play className="w-4 h-4" /> Review ({dueForReview.length})
              </Button>
            )}
            <Button
              variant={view === 'stats' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('stats')}
              className="gap-2"
            >
              <BarChart3 className="w-4 h-4" /> Stats
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            {view === 'browse' && (
              <motion.div key="browse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <VocabularyBrowser
                  vocabulary={vocabulary}
                  vocabularySRS={vocabularySRS}
                  onMasterToggle={handleMasterToggle}
                  langId={langId}
                />
              </motion.div>
            )}

            {view === 'review' && dueForReview.length > 0 && (
              <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <VocabularyReview
                  dueWords={dueForReview}
                  vocabularySRS={vocabularySRS}
                  onComplete={handleReviewComplete}
                  langId={langId}
                />
              </motion.div>
            )}

            {view === 'stats' && (
              <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <VocabularyStats stats={stats} vocabularySRS={vocabularySRS} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}