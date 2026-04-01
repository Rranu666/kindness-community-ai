import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { progressApi } from '@/kindlearn/api/progress';
import { LANGUAGES, DAILY_TOPICS } from '@/kindlearn/lib/languages';
import Navbar from '../components/landing/Navbar';
import LessonSequenceManager from '@/kindlearn/components/lesson/LessonSequenceManager';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Sparkles } from 'lucide-react';

const WORD_PAIRS = {
  spanish: [
    { id: 1, word: 'Hola', meaning: 'Hello', audio: '👋', example: 'I say "Hola" when I greet someone.' },
    { id: 2, word: 'Gracias', meaning: 'Thank you', audio: '🙏', example: 'I say "Gracias" to show appreciation.' },
    { id: 3, word: 'Por favor', meaning: 'Please', audio: '🤲', example: 'Always say "Por favor" when asking nicely.' },
    { id: 4, word: 'Buenos días', meaning: 'Good morning', audio: '🌅', example: '"Buenos días" is said in the morning.' },
  ],
  french: [
    { id: 1, word: 'Bonjour', meaning: 'Hello', audio: '👋', example: '"Bonjour" is the French greeting.' },
    { id: 2, word: 'Merci', meaning: 'Thank you', audio: '🙏', example: 'Say "Merci" to express gratitude.' },
    { id: 3, word: "S'il vous plaît", meaning: 'Please', audio: '🤲', example: '"S\'il vous plaît" shows politeness.' },
    { id: 4, word: 'Bonsoir', meaning: 'Good evening', audio: '🌆', example: '"Bonsoir" is used in the evening.' },
  ],
  default: [
    { id: 1, word: 'Hello', meaning: 'Greeting', audio: '👋', example: 'Hello is a basic greeting word.' },
    { id: 2, word: 'Thank you', meaning: 'Gratitude', audio: '🙏', example: 'Say thank you to show appreciation.' },
    { id: 3, word: 'Please', meaning: 'Request', audio: '🤲', example: 'Always say please when requesting.' },
    { id: 4, word: 'Goodbye', meaning: 'Farewell', audio: '👋', example: 'Goodbye means farewell.' },
  ],
};

export default function AdvancedLesson() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const langId = urlParams.get('lang') || 'spanish';
  const day = parseInt(urlParams.get('day') || '1');
  const pid = urlParams.get('pid');
  
  const language = LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];
  const topic = DAILY_TOPICS[day - 1] || 'Advanced Lesson';
  const baseWords = WORD_PAIRS[langId] || WORD_PAIRS.default;

  const [words, setWords] = useState(baseWords);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleComplete = async (lessonSummary, answers) => {
    setSummary(lessonSummary);
    setIsComplete(true);

    // Update user progress if pid provided
    if (pid) {
      const prog = await progressApi.filter({ language: langId, mode: 'adult' });
      const found = prog.find((r) => r.id === pid) || prog[0];
      if (found) {
        const newXp = (found.xp_total || 0) + lessonSummary.xpEarned;
        const newWords = (found.words_learned || 0) + lessonSummary.wordsLearned;
        
        await progressApi.update(found.id, {
          xp_total: newXp,
          words_learned: newWords,
          daily_xp: (found.daily_xp || 0) + lessonSummary.xpEarned,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate(`/kindlearn/dashboard?lang=${langId}`)}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
          </Button>

          {!isStarted && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <span className="text-6xl block mb-4">{language.flag}</span>
              <h1 className="text-4xl font-extrabold mb-2">Advanced Lesson - Day {day}</h1>
              <p className="text-xl text-primary font-semibold mb-2">{topic}</p>
              <p className="text-muted-foreground mb-2">Multiple question types • Voice pronunciation • Interactive learning</p>
              <p className="text-muted-foreground mb-8">Learn and practice {words.length} words with fill-in-the-blanks, multiple choice, and voice checks</p>
              
              <Button
                size="lg"
                className="rounded-2xl"
                onClick={() => setIsStarted(true)}
              >
                Start Advanced Lesson
              </Button>
            </motion.div>
          )}

          {isStarted && !isComplete && (
            <LessonSequenceManager
              words={words}
              langId={langId}
              onComplete={handleComplete}
              options={{
                includeVoice: true,
                includeListening: true,
                includeFillBlanks: true,
              }}
            />
          )}

          {isComplete && summary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              </motion.div>
              
              <h1 className="text-4xl font-extrabold mb-2">Lesson Complete!</h1>
              <p className="text-muted-foreground mb-8">Day {day} — {topic}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <div className="bg-card rounded-2xl border p-4">
                  <p className="text-2xl md:text-3xl font-extrabold text-primary">{summary.score}%</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Accuracy</p>
                </div>
                <div className="bg-card rounded-2xl border p-4">
                  <p className="text-2xl md:text-3xl font-extrabold text-amber-500">+{summary.xpEarned}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">XP Earned</p>
                </div>
                <div className="bg-card rounded-2xl border p-4">
                  <p className="text-2xl md:text-3xl font-extrabold text-emerald-500">{summary.correctAnswers}/{summary.totalQuestions}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Correct</p>
                </div>
                <div className="bg-card rounded-2xl border p-4">
                  <p className="text-2xl md:text-3xl font-extrabold text-primary">{summary.wordsLearned}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Words</p>
                </div>
              </div>

              <Button
                size="lg"
                className="rounded-2xl"
                onClick={() => navigate(`/kindlearn/dashboard?lang=${langId}`)}
              >
                Back to Dashboard
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}