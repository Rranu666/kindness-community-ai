import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { progressApi } from '@/kindlearn/api/progress';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LANGUAGES } from '@/kindlearn/lib/languages';
import Navbar from '../components/landing/Navbar';
import { ArrowRight, CheckCircle2, Zap, Target } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "How do you say 'Hello' in the language you're learning?",
    type: 'vocabulary',
    difficulty: 'beginner',
    options: [
      { text: 'I can recognize greetings', value: 1, correct: true },
      { text: 'I need to learn this', value: 0, correct: false },
    ],
  },
  {
    id: 2,
    question: 'Can you count from 1 to 10?',
    type: 'vocabulary',
    difficulty: 'beginner',
    options: [
      { text: 'Yes, easily', value: 1, correct: true },
      { text: 'I can count some', value: 0.5, correct: false },
      { text: 'No, I need to learn', value: 0, correct: false },
    ],
  },
  {
    id: 3,
    question: 'Can you introduce yourself with basic information (name, age)?',
    type: 'speaking',
    difficulty: 'beginner',
    options: [
      { text: 'Yes, confidently', value: 1, correct: true },
      { text: 'With some difficulty', value: 0.5, correct: false },
      { text: 'No, not at all', value: 0, correct: false },
    ],
  },
  {
    id: 4,
    question: 'Can you understand simple sentences about daily activities?',
    type: 'listening',
    difficulty: 'intermediate',
    options: [
      { text: 'Yes, usually', value: 2, correct: true },
      { text: 'Sometimes', value: 1, correct: false },
      { text: 'Rarely', value: 0, correct: false },
    ],
  },
  {
    id: 5,
    question: 'Can you order food or ask for directions in conversation?',
    type: 'conversation',
    difficulty: 'intermediate',
    options: [
      { text: 'Yes, naturally', value: 2, correct: true },
      { text: 'With preparation', value: 1, correct: false },
      { text: 'No, not yet', value: 0, correct: false },
    ],
  },
  {
    id: 6,
    question: 'Can you understand past and future tenses in reading?',
    type: 'grammar',
    difficulty: 'intermediate',
    options: [
      { text: 'Yes, mostly', value: 2, correct: true },
      { text: 'Partially', value: 1, correct: false },
      { text: 'No', value: 0, correct: false },
    ],
  },
  {
    id: 7,
    question: 'Can you write a paragraph about yourself?',
    type: 'writing',
    difficulty: 'advanced',
    options: [
      { text: 'Yes, with proper grammar', value: 3, correct: true },
      { text: 'Yes, but with errors', value: 1.5, correct: false },
      { text: 'No', value: 0, correct: false },
    ],
  },
  {
    id: 8,
    question: 'Can you understand and discuss complex topics?',
    type: 'conversation',
    difficulty: 'advanced',
    options: [
      { text: 'Yes, fluently', value: 3, correct: true },
      { text: 'With some difficulty', value: 1, correct: false },
      { text: 'No', value: 0, correct: false },
    ],
  },
];

export default function DiagnosticQuiz() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const langId = urlParams.get('lang') || 'spanish';
  const language = LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAnswer = (value, idx) => {
    setSelectedIdx(idx);
    const newScore = score + value;
    setScore(newScore);
    setAnswers([...answers, value]);
    setShowResult(true);
    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowResult(false);
        setSelectedIdx(null);
      } else {
        setShowResult('final');
      }
    }, 1200);
  };

  const getRecommendation = () => {
    // Score ranges: 0-5 = Beginner, 5-12 = Intermediate, 12+ = Advanced
    if (score < 5) return { level: 'beginner', startDay: 1, message: 'Perfect for starting fresh!' };
    if (score < 12) return { level: 'intermediate', startDay: 8, message: 'You have foundational skills!' };
    return { level: 'advanced', startDay: 15, message: 'You can tackle advanced topics!' };
  };

  const handleContinue = async () => {
    setSaving(true);
    const rec = getRecommendation();
    const today = new Date().toISOString().split('T')[0];

    try {
      const existing = await progressApi.filter({ language: langId, mode: 'adult' });
      if (existing.length > 0) {
        // Update existing record
        await progressApi.update(existing[0].id, {
          current_day: rec.startDay,
          diagnostic_level: rec.level,
          last_activity_date: today,
        });
      } else {
        // Create new record
        await progressApi.create({
          language: langId,
          mode: 'adult',
          current_day: rec.startDay,
          diagnostic_level: rec.level,
          xp_total: 0,
          streak_days: 0,
          longest_streak: 0,
          lessons_completed: [],
          daily_xp: 0,
          words_learned: 0,
          badges: [],
          last_activity_date: today,
        });
      }
    } catch {
      // API unavailable (guest mode) — proceed to dashboard anyway
    }

    navigate(`/kindlearn/dashboard?lang=${langId}`);
  };

  const rec = getRecommendation();
  const progress = Math.round(((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 kl-page-body pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-2xl">
          {showResult !== 'final' ? (
            <>
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Language Level Assessment
                  </h1>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2.5" />
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card rounded-2xl border shadow-lg p-8 mb-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                      {QUIZ_QUESTIONS[currentQuestion].difficulty.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-6">
                    {QUIZ_QUESTIONS[currentQuestion].question}
                  </h2>

                  <div className="space-y-2">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => !showResult && handleAnswer(option.value, idx)}
                        disabled={showResult}
                        whileHover={{ scale: showResult ? 1 : 1.02 }}
                        className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${
                          showResult
                            ? idx === selectedIdx
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border opacity-40'
                            : 'border-border hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.text}</span>
                          {showResult && idx === selectedIdx && (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Score indicator */}
              <div className="text-center text-sm text-muted-foreground">
                Current assessment score: <span className="font-bold text-primary">{Math.round(score)}</span>
              </div>
            </>
          ) : (
            /* Results Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mb-6"
              >
                <span className="text-6xl block mb-4">🎯</span>
              </motion.div>

              <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
              <p className="text-muted-foreground mb-8">Based on your responses, here's what we found:</p>

              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-8 mb-8">
                <div className="inline-block bg-primary/20 text-primary text-lg font-bold px-4 py-2 rounded-full mb-4">
                  {rec.level.charAt(0).toUpperCase() + rec.level.slice(1)} Level
                </div>
                <h2 className="text-2xl font-bold mb-2">{rec.message}</h2>
                <p className="text-muted-foreground mb-4">
                  We recommend starting at Day {rec.startDay} with lessons tailored to your level.
                </p>

                <div className="bg-white/50 rounded-lg p-4 text-left space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Your Score:</span> {Math.round(score)} points
                  </p>
                  <p>
                    <span className="font-semibold">Recommended Path:</span> Days {rec.startDay}-30
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    You can always adjust your starting point or repeat lessons anytime.
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                className="h-14 px-10 rounded-2xl font-semibold text-base"
                onClick={handleContinue}
                disabled={saving}
              >
                {saving ? 'Setting up...' : <>Start Learning <ArrowRight className="w-5 h-5 ml-2" /></>}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}