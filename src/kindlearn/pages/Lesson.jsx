import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { progressApi } from '@/kindlearn/api/progress';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Check, X, Volume2, Sparkles, Ear, RefreshCw } from 'lucide-react';
import SpeakingPractice from '@/kindlearn/components/lesson/SpeakingPractice';
import { LANGUAGES, DAILY_TOPICS } from '@/kindlearn/lib/languages';
import { useSpeech } from '@/kindlearn/hooks/useSpeech';
import { buildWordListWithReviews, recordMiss, recordHit } from '@/kindlearn/lib/struggledWords';
import { useUILanguage } from '@/kindlearn/lib/UILanguageContext';

const WORD_PAIRS = {
  spanish: [
    { word: 'Hola', meaning: 'Hello', audio: '👋' },
    { word: 'Gracias', meaning: 'Thank you', audio: '🙏' },
    { word: 'Por favor', meaning: 'Please', audio: '🤲' },
    { word: 'Buenos días', meaning: 'Good morning', audio: '🌅' },
    { word: 'Adiós', meaning: 'Goodbye', audio: '👋' },
    { word: 'Sí', meaning: 'Yes', audio: '✅' },
    { word: 'No', meaning: 'No', audio: '❌' },
    { word: 'Amigo', meaning: 'Friend', audio: '🤝' },
  ],
  french: [
    { word: 'Bonjour', meaning: 'Hello', audio: '👋' },
    { word: 'Merci', meaning: 'Thank you', audio: '🙏' },
    { word: "S'il vous plaît", meaning: 'Please', audio: '🤲' },
    { word: 'Bonsoir', meaning: 'Good evening', audio: '🌆' },
    { word: 'Au revoir', meaning: 'Goodbye', audio: '👋' },
    { word: 'Oui', meaning: 'Yes', audio: '✅' },
    { word: 'Non', meaning: 'No', audio: '❌' },
    { word: 'Ami', meaning: 'Friend', audio: '🤝' },
  ],
  german: [
    { word: 'Hallo', meaning: 'Hello', audio: '👋' },
    { word: 'Danke', meaning: 'Thank you', audio: '🙏' },
    { word: 'Bitte', meaning: 'Please', audio: '🤲' },
    { word: 'Guten Morgen', meaning: 'Good morning', audio: '🌅' },
    { word: 'Tschüss', meaning: 'Goodbye', audio: '👋' },
    { word: 'Ja', meaning: 'Yes', audio: '✅' },
    { word: 'Nein', meaning: 'No', audio: '❌' },
    { word: 'Freund', meaning: 'Friend', audio: '🤝' },
  ],
  japanese: [
    { word: 'こんにちは', meaning: 'Hello', audio: '👋' },
    { word: 'ありがとう', meaning: 'Thank you', audio: '🙏' },
    { word: 'おねがいします', meaning: 'Please', audio: '🤲' },
    { word: 'おはようございます', meaning: 'Good morning', audio: '🌅' },
    { word: 'さようなら', meaning: 'Goodbye', audio: '👋' },
    { word: 'はい', meaning: 'Yes', audio: '✅' },
    { word: 'いいえ', meaning: 'No', audio: '❌' },
    { word: 'ともだち', meaning: 'Friend', audio: '🤝' },
  ],
  korean: [
    { word: '안녕하세요', meaning: 'Hello', audio: '👋' },
    { word: '감사합니다', meaning: 'Thank you', audio: '🙏' },
    { word: '부탁드립니다', meaning: 'Please', audio: '🤲' },
    { word: '좋은 아침', meaning: 'Good morning', audio: '🌅' },
    { word: '안녕히 가세요', meaning: 'Goodbye', audio: '👋' },
    { word: '네', meaning: 'Yes', audio: '✅' },
    { word: '아니요', meaning: 'No', audio: '❌' },
    { word: '친구', meaning: 'Friend', audio: '🤝' },
  ],
  italian: [
    { word: 'Ciao', meaning: 'Hello', audio: '👋' },
    { word: 'Grazie', meaning: 'Thank you', audio: '🙏' },
    { word: 'Per favore', meaning: 'Please', audio: '🤲' },
    { word: 'Buongiorno', meaning: 'Good morning', audio: '🌅' },
    { word: 'Arrivederci', meaning: 'Goodbye', audio: '👋' },
    { word: 'Sì', meaning: 'Yes', audio: '✅' },
    { word: 'No', meaning: 'No', audio: '❌' },
    { word: 'Amico', meaning: 'Friend', audio: '🤝' },
  ],
  portuguese: [
    { word: 'Olá', meaning: 'Hello', audio: '👋' },
    { word: 'Obrigado', meaning: 'Thank you', audio: '🙏' },
    { word: 'Por favor', meaning: 'Please', audio: '🤲' },
    { word: 'Bom dia', meaning: 'Good morning', audio: '🌅' },
    { word: 'Tchau', meaning: 'Goodbye', audio: '👋' },
    { word: 'Sim', meaning: 'Yes', audio: '✅' },
    { word: 'Não', meaning: 'No', audio: '❌' },
    { word: 'Amigo', meaning: 'Friend', audio: '🤝' },
  ],
  mandarin: [
    { word: '你好', meaning: 'Hello', audio: '👋' },
    { word: '谢谢', meaning: 'Thank you', audio: '🙏' },
    { word: '请', meaning: 'Please', audio: '🤲' },
    { word: '早上好', meaning: 'Good morning', audio: '🌅' },
    { word: '再见', meaning: 'Goodbye', audio: '👋' },
    { word: '是', meaning: 'Yes', audio: '✅' },
    { word: '不', meaning: 'No', audio: '❌' },
    { word: '朋友', meaning: 'Friend', audio: '🤝' },
  ],
  default: [
    { word: 'Hello', meaning: 'Greeting', audio: '👋' },
    { word: 'Thank you', meaning: 'Gratitude', audio: '🙏' },
    { word: 'Please', meaning: 'Request', audio: '🤲' },
    { word: 'Good morning', meaning: 'Morning greeting', audio: '🌅' },
    { word: 'Goodbye', meaning: 'Farewell', audio: '👋' },
    { word: 'Yes', meaning: 'Affirmative', audio: '✅' },
    { word: 'No', meaning: 'Negative', audio: '❌' },
    { word: 'Friend', meaning: 'Companion', audio: '🤝' },
  ],
};

export default function Lesson() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const langId = urlParams.get('lang') || 'spanish';
  const day = parseInt(urlParams.get('day') || '1');
  const pid = urlParams.get('pid');
  const language = LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];
  const topic = DAILY_TOPICS[day - 1] || 'Lesson';

  const baseWords = WORD_PAIRS[langId] || WORD_PAIRS.default;
  const { speak } = useSpeech(langId);
  const { t } = useUILanguage();

  const [words, setWords] = useState(baseWords);
  const [localStruggled, setLocalStruggled] = useState({});

  // Load struggled words from progress and reorder word list on mount
  useEffect(() => {
    if (!pid) return;
    progressApi.filter({ language: langId, mode: 'adult' }).then((prog) => {
      const found = prog.find((r) => r.id === pid) || prog[0];
      if (found?.struggled_words) {
        const getKey = (w) => w.word;
        setWords(buildWordListWithReviews(baseWords, found.struggled_words, getKey, 2));
      }
    });
  }, []);

  // Steps: 0=intro, 1..N=learn words, N+1..N+3=standard quiz, N+4=listening quiz, N+5=complete
  const STANDARD_QUIZ_COUNT = 3;
  const LISTENING_QUIZ_STEP_OFFSET = words.length + STANDARD_QUIZ_COUNT + 1;
  const totalSteps = words.length + STANDARD_QUIZ_COUNT + 2;

  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [quizQ, setQuizQ] = useState(null);

  const progress = Math.round((step / totalSteps) * 100);

  const isIntro = step === 0;
  const isWordStep = step >= 1 && step <= words.length;
  const isStandardQuiz = step > words.length && step < LISTENING_QUIZ_STEP_OFFSET;
  const isListeningQuiz = step === LISTENING_QUIZ_STEP_OFFSET;
  const isQuizStep = isStandardQuiz || isListeningQuiz;
  const isComplete = step >= totalSteps;

  const currentWord = isWordStep ? words[step - 1] : null;
  const quizIndex = step - words.length - 1;

  const getStandardQuiz = (qi) => {
    const idx = qi % words.length;
    const correct = words[idx];
    const others = words.filter((_, i) => i !== idx);
    const shuffledOthers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffledOthers.map((w) => w.meaning), correct.meaning].sort(() => Math.random() - 0.5);
    return { type: 'standard', question: correct.word, correctAnswer: correct.meaning, options };
  };

  const getListeningQuiz = () => {
    const idx = Math.floor(Math.random() * words.length);
    const correct = words[idx];
    const others = words.filter((_, i) => i !== idx);
    const shuffledOthers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [
      { word: correct, isCorrect: true },
      ...shuffledOthers.map((w) => ({ word: w, isCorrect: false })),
    ].sort(() => Math.random() - 0.5);
    return { type: 'listening', correctWord: correct, options };
  };

  useEffect(() => {
    if (isStandardQuiz) {
      setQuizQ(getStandardQuiz(quizIndex));
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (isListeningQuiz) {
      const q = getListeningQuiz();
      setQuizQ(q);
      setSelectedAnswer(null);
      setShowResult(false);
      // Auto-speak after a short delay
      setTimeout(() => speak(q.correctWord.word), 600);
    }
  }, [step]);

  const handleQuizAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = quizQ.type === 'listening'
      ? answer === quizQ.correctWord.meaning
      : answer === quizQ.correctAnswer;

    const wordKey = quizQ.type === 'listening'
      ? quizQ.correctWord.word
      : quizQ.question;

    if (isCorrect) {
      setScore((s) => s + 1);
      setLocalStruggled((prev) => recordHit(prev, wordKey));
    } else {
      setLocalStruggled((prev) => recordMiss(prev, wordKey));
    }
    setTimeout(() => setStep((s) => s + 1), 1400);
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const effectivePid = pid && pid !== 'undefined' ? pid : null;
      if (effectivePid) {
        const prog = await progressApi.filter({ language: langId, mode: 'adult' });
        const found = prog.find((r) => r.id === effectivePid) || prog[0];
        if (found) {
          const p = found;
          const completed = [...new Set([...(p.lessons_completed || []), day])];
          const newXp = (p.xp_total || 0) + score * 10 + 20;
          const newWords = (p.words_learned || 0) + words.length;
          const newDay = Math.max(p.current_day || 1, day + 1);
          const today = new Date().toISOString().split('T')[0];
          const newStreak = p.last_activity_date !== today ? (p.streak_days || 0) + 1 : p.streak_days || 0;

          const newBadges = [...(p.badges || [])];
          if (!newBadges.includes('first_lesson')) newBadges.push('first_lesson');
          if (newStreak >= 3 && !newBadges.includes('streak_3')) newBadges.push('streak_3');
          if (newStreak >= 7 && !newBadges.includes('streak_7')) newBadges.push('streak_7');
          if (newStreak >= 14 && !newBadges.includes('streak_14')) newBadges.push('streak_14');
          if (newStreak >= 30 && !newBadges.includes('streak_30')) newBadges.push('streak_30');
          if (newWords >= 50 && !newBadges.includes('words_50')) newBadges.push('words_50');
          if (newWords >= 100 && !newBadges.includes('words_100')) newBadges.push('words_100');
          if (newXp >= 500 && !newBadges.includes('xp_500')) newBadges.push('xp_500');
          if (newXp >= 1000 && !newBadges.includes('xp_1000')) newBadges.push('xp_1000');
          const quizTotal = totalSteps - words.length - 1;
          if (score === quizTotal && !newBadges.includes('perfect_quiz')) newBadges.push('perfect_quiz');

          // Merge local struggle deltas with persisted data
          const mergedStruggled = { ...(p.struggled_words || {}) };
          for (const [word, delta] of Object.entries(localStruggled)) {
            mergedStruggled[word] = Math.max(0, (mergedStruggled[word] || 0) + delta);
            if (mergedStruggled[word] === 0) delete mergedStruggled[word];
          }

          // Estimate lesson duration: ~2 min per word + quiz time
          const lessonMinutes = Math.max(5, Math.round(words.length * 1.5 + 3));
          // Reset daily practice if it's a new day
          const prevPractice = p.last_activity_date === today ? (p.daily_practice_minutes || 0) : 0;

          await progressApi.update(p.id, {
            lessons_completed: completed,
            xp_total: newXp,
            words_learned: newWords,
            current_day: Math.min(newDay, 30),
            daily_xp: (p.daily_xp || 0) + score * 10 + 20,
            streak_days: newStreak,
            longest_streak: Math.max(p.longest_streak || 0, newStreak),
            last_activity_date: today,
            badges: newBadges,
            struggled_words: mergedStruggled,
            daily_practice_minutes: prevPractice + lessonMinutes,
          });
        }
      }
    } catch (err) {
      // Progress save failed — still navigate back; data will sync on next session
      console.error('Failed to save lesson progress:', err);
    } finally {
      // Always navigate back to dashboard, even if the save failed
      navigate(`/kindlearn/dashboard?lang=${langId}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-2xl px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/kindlearn/dashboard?lang=${langId}`)} aria-label="Exit lesson">
            <X className="w-5 h-5" />
          </Button>
          <Progress value={progress} className="flex-1 h-3 rounded-full" />
          <span className="text-sm font-semibold text-muted-foreground">{Math.min(step, totalSteps)}/{totalSteps}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {isIntro && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <span className="text-6xl block mb-4">{language.flag}</span>
                <h1 className="text-3xl font-extrabold mb-2">Day {day}</h1>
                <p className="text-xl text-primary font-semibold mb-2">{topic}</p>
                <p className="text-muted-foreground mb-8">You'll learn {words.length} new words and test your knowledge!</p>
                <Button
                  size="lg"
                  className="h-14 px-10 rounded-2xl font-semibold text-base"
                  onClick={() => setStep(1)}
                >
                  Let's Go! <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* WORD LEARNING */}
            {isWordStep && currentWord && (
              <motion.div
                key={`word-${step}`}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="text-center"
              >
                {currentWord.isReview
                  ? <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-xs font-semibold mb-2"><RefreshCw className="w-3 h-3" /> Reviewing this word</div>
                  : <p className="text-sm text-muted-foreground mb-2 font-medium">{t.lesson_new_word}</p>
                }
                <div className="bg-card rounded-3xl border shadow-lg p-10 mb-6">
                  <span className="text-5xl block mb-4">{currentWord.audio}</span>
                  <h2 className="text-4xl font-extrabold mb-2">{currentWord.word}</h2>
                  <p className="text-xl text-muted-foreground mb-4">{currentWord.meaning}</p>
                  <button
                    onClick={() => speak(currentWord.word)}
                    className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-5 py-2 text-sm font-semibold transition-all"
                    aria-label={`Hear pronunciation of ${currentWord.word}`}
                  >
                    <Volume2 className="w-4 h-4" /> {t.lesson_hear}
                  </button>
                </div>
                <SpeakingPractice
                  word={currentWord.word}
                  langId={langId}
                  onSpeak={() => speak(currentWord.word)}
                  onNext={() => setStep((s) => s + 1)}
                />
              </motion.div>
            )}

            {/* STANDARD QUIZ */}
            {isStandardQuiz && quizQ && (
              <motion.div
                key={`quiz-${step}`}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="text-center"
              >
                <p className="text-sm text-muted-foreground mb-2 font-medium">{t.lesson_quiz_time}</p>
                <div className="bg-card rounded-3xl border shadow-lg p-8 mb-6">
                  <p className="text-sm text-muted-foreground mb-4">{t.lesson_what_means}</p>
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <h2 className="text-3xl font-extrabold">{quizQ.question}</h2>
                    <button
                      onClick={() => speak(quizQ.question)}
                      className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all"
                      aria-label="Hear pronunciation"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {quizQ.options.map((opt) => {
                      const isCorrect = opt === quizQ.correctAnswer;
                      const isSelected = selectedAnswer === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => !showResult && handleQuizAnswer(opt)}
                          disabled={showResult}
                          className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all ${
                            showResult
                              ? isCorrect
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : isSelected
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-muted opacity-50'
                              : 'border-border hover:border-primary hover:bg-primary/5'
                          }`}
                        >
                          {opt}
                          {showResult && isCorrect && <Check className="w-4 h-4 inline ml-1" />}
                          {showResult && isSelected && !isCorrect && <X className="w-4 h-4 inline ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* LISTENING QUIZ */}
            {isListeningQuiz && quizQ && (
              <motion.div
                key="listening-quiz"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                  <Ear className="w-4 h-4" /> Active Listening
                </div>
                <div className="bg-card rounded-3xl border shadow-lg p-8 mb-6">
                  <p className="text-sm text-muted-foreground mb-5">Listen and pick the correct meaning</p>
                  <button
                    onClick={() => speak(quizQ.correctWord.word)}
                    className="w-24 h-24 mx-auto rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform mb-6"
                    aria-label="Play word audio"
                  >
                    <Volume2 className="w-10 h-10 text-white" />
                  </button>
                  <p className="text-xs text-muted-foreground mb-6">Tap to hear again</p>
                  <div className="grid grid-cols-2 gap-3">
                    {quizQ.options.map(({ word, isCorrect: optCorrect }) => {
                      const isSelected = selectedAnswer === word.meaning;
                      return (
                        <button
                          key={word.meaning}
                          onClick={() => !showResult && handleQuizAnswer(word.meaning)}
                          disabled={showResult}
                          className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                            showResult
                              ? optCorrect
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : isSelected
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-muted opacity-50'
                              : 'border-border hover:border-primary hover:bg-primary/5'
                          }`}
                        >
                          <span className="text-3xl">{word.audio}</span>
                          <span>{word.meaning}</span>
                          {showResult && optCorrect && <Check className="w-4 h-4" />}
                          {showResult && isSelected && !optCorrect && <X className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* COMPLETE */}
            {isComplete && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                </motion.div>
                <h1 className="text-3xl font-extrabold mb-2">{t.lesson_complete}</h1>
                <p className="text-muted-foreground mb-6">Day {day} — {topic}</p>

                <div className="bg-card rounded-3xl border p-4 md:p-6 mb-8 inline-block">
                  <div className="flex gap-4 md:gap-8">
                    <div>
                      <p className="text-2xl md:text-3xl font-extrabold text-primary">{score}/{STANDARD_QUIZ_COUNT + 1}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{t.lesson_quiz_score}</p>
                    </div>
                    <div>
                      <p className="text-2xl md:text-3xl font-extrabold text-amber-500">+{score * 10 + 20}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{t.lesson_xp}</p>
                    </div>
                    <div>
                      <p className="text-2xl md:text-3xl font-extrabold text-emerald-500">{words.length}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{t.lesson_words}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    size="lg"
                    className="h-14 px-10 rounded-2xl font-semibold text-base"
                    onClick={handleComplete}
                    disabled={completing}
                  >
                    {completing ? t.lesson_saving : <>{t.lesson_continue} <ArrowRight className="w-5 h-5 ml-2" /></>}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}