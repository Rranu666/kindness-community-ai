import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { progressApi } from '@/kindlearn/api/progress';
import { Button } from '@/components/ui/button';
import { LANGUAGES, DAILY_TOPICS, KIDS_AVATARS } from '@/kindlearn/lib/languages';
import { Star, ArrowRight, X, Heart, Volume2, RefreshCw } from 'lucide-react';
import { useSpeech } from '@/kindlearn/hooks/useSpeech';
import PronunciationChallenge from '@/kindlearn/components/kids/PronunciationChallenge';
import { buildWordListWithReviews, recordMiss, recordHit } from '@/kindlearn/lib/struggledWords';
import { useUILanguage } from '@/kindlearn/lib/UILanguageContext';

const KIDS_WORDS = {
  spanish: [
    { word: '🐱 Gato', meaning: 'Cat', emoji: '🐱' },
    { word: '🐶 Perro', meaning: 'Dog', emoji: '🐶' },
    { word: '🌈 Arcoíris', meaning: 'Rainbow', emoji: '🌈' },
    { word: '⭐ Estrella', meaning: 'Star', emoji: '⭐' },
    { word: '🌙 Luna', meaning: 'Moon', emoji: '🌙' },
    { word: '☀️ Sol', meaning: 'Sun', emoji: '☀️' },
  ],
  french: [
    { word: '🐱 Chat', meaning: 'Cat', emoji: '🐱' },
    { word: '🐶 Chien', meaning: 'Dog', emoji: '🐶' },
    { word: '🌈 Arc-en-ciel', meaning: 'Rainbow', emoji: '🌈' },
    { word: '⭐ Étoile', meaning: 'Star', emoji: '⭐' },
    { word: '🌙 Lune', meaning: 'Moon', emoji: '🌙' },
    { word: '☀️ Soleil', meaning: 'Sun', emoji: '☀️' },
  ],
  default: [
    { word: '🐱 Cat', meaning: 'Cat', emoji: '🐱' },
    { word: '🐶 Dog', meaning: 'Dog', emoji: '🐶' },
    { word: '🌈 Rainbow', meaning: 'Rainbow', emoji: '🌈' },
    { word: '⭐ Star', meaning: 'Star', emoji: '⭐' },
    { word: '🌙 Moon', meaning: 'Moon', emoji: '🌙' },
    { word: '☀️ Sun', meaning: 'Sun', emoji: '☀️' },
  ],
};

export default function KidsLesson() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const langId = urlParams.get('lang') || 'spanish';
  const day = parseInt(urlParams.get('day') || '1');
  const pid = urlParams.get('pid');
  const topic = DAILY_TOPICS[day - 1] || 'Lesson';

  const baseWords = KIDS_WORDS[langId] || KIDS_WORDS.default;
  const { speak } = useSpeech(langId);

  const { t } = useUILanguage();
  const [words, setWords] = useState(baseWords);
  const [struggledWords, setStruggledWords] = useState({});

  // Load progress record and build word list with reviews on mount
  useEffect(() => {
    if (!pid) return;
    progressApi.filter({ mode: 'kids' }).then((prog) => {
      const found = prog.find((r) => r.id === pid) || prog[0];
      if (found?.struggled_words) {
        setStruggledWords(found.struggled_words);
        const getKey = (w) => cleanWord(w.word);
        setWords(buildWordListWithReviews(baseWords, found.struggled_words, getKey, 2));
      }
    });
  }, []);

  // Steps: 0=intro, 1..N=learn, N+1..N+2=standard quiz, N+3=listening quiz, N+4=complete
  const STANDARD_QUIZ_COUNT = 2;
  const LISTENING_STEP = words.length + STANDARD_QUIZ_COUNT + 1;
  const totalSteps = words.length + STANDARD_QUIZ_COUNT + 2;

  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizQ, setQuizQ] = useState(null);
  const [localStruggled, setLocalStruggled] = useState({});

  const isIntro = step === 0;
  const isWordStep = step >= 1 && step <= words.length;
  const isStandardQuiz = step > words.length && step < LISTENING_STEP;
  const isListeningQuiz = step === LISTENING_STEP;
  const isQuizStep = isStandardQuiz || isListeningQuiz;
  const isComplete = step >= totalSteps;
  const currentWord = isWordStep ? words[step - 1] : null;
  const quizIndex = step - words.length - 1;

  // strip emoji prefix from kids word strings like "🐱 Gato" → "Gato"
  const cleanWord = (w) => w.replace(/^\S+\s/, '');

  useEffect(() => {
    if (isStandardQuiz) {
      const qi = quizIndex % words.length;
      const correct = words[qi];
      const others = words.filter((_, i) => i !== qi);
      const shuffledOthers = others.sort(() => Math.random() - 0.5).slice(0, 2);
      const options = [...shuffledOthers.map((w) => w.meaning), correct.meaning].sort(() => Math.random() - 0.5);
      setQuizQ({ type: 'standard', question: correct.word, correctAnswer: correct.meaning, options, emoji: correct.emoji });
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (isListeningQuiz) {
      const idx = Math.floor(Math.random() * words.length);
      const correct = words[idx];
      const others = words.filter((_, i) => i !== idx);
      const opts = [
        { word: correct, isCorrect: true },
        ...others.sort(() => Math.random() - 0.5).slice(0, 3).map((w) => ({ word: w, isCorrect: false })),
      ].sort(() => Math.random() - 0.5);
      setQuizQ({ type: 'listening', correctWord: correct, options: opts });
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeout(() => speak(cleanWord(correct.word)), 700);
    }
  }, [step]);

  const handleQuizAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = quizQ.type === 'listening'
      ? answer === quizQ.correctWord.meaning
      : answer === quizQ.correctAnswer;

    // Determine the word key for this quiz question
    const wordKey = quizQ.type === 'listening'
      ? cleanWord(quizQ.correctWord.word)
      : cleanWord(quizQ.question);

    if (isCorrect) {
      setScore((s) => s + 1);
      setLocalStruggled((prev) => recordHit(prev, wordKey));
    } else {
      setHearts((h) => Math.max(0, h - 1));
      setLocalStruggled((prev) => recordMiss(prev, wordKey));
    }
    setTimeout(() => setStep((s) => s + 1), 1400);
  };

  const handleComplete = async () => {
    setCompleting(true);
    if (pid) {
      const prog = await progressApi.filter({ mode: 'kids' });
      const found = prog.find((r) => r.id === pid) || prog[0];
      if (found) {
        const p = found;
        const completed = [...new Set([...(p.lessons_completed || []), day])];
        const newXp = (p.xp_total || 0) + score * 15 + 25;
        const newWords = (p.words_learned || 0) + words.length;
        const today = new Date().toISOString().split('T')[0];
        const newStreak = p.last_activity_date !== today ? (p.streak_days || 0) + 1 : p.streak_days || 0;

        const newBadges = [...(p.badges || [])];
        if (!newBadges.includes('first_lesson')) newBadges.push('first_lesson');
        if (newStreak >= 3 && !newBadges.includes('streak_3')) newBadges.push('streak_3');

        // Merge local struggle data with persisted data
        const mergedStruggled = { ...(p.struggled_words || {}) };
        for (const [word, delta] of Object.entries(localStruggled)) {
          mergedStruggled[word] = Math.max(0, (mergedStruggled[word] || 0) + delta);
          if (mergedStruggled[word] === 0) delete mergedStruggled[word];
        }

        await progressApi.update(p.id, {
          lessons_completed: completed,
          xp_total: newXp,
          words_learned: newWords,
          current_day: Math.min(Math.max(p.current_day || 1, day + 1), 30),
          daily_xp: (p.daily_xp || 0) + score * 15 + 25,
          streak_days: newStreak,
          longest_streak: Math.max(p.longest_streak || 0, newStreak),
          last_activity_date: today,
          badges: newBadges,
          struggled_words: mergedStruggled,
        });
      }
    }
    navigate('/kindlearn/kids', { replace: true });
  };

  const progressPct = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-pink-50 to-amber-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/kindlearn/kids')}>
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
          <div className="flex-1 h-4 bg-violet-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
              animate={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${i < hearts ? 'text-rose-500 fill-rose-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {isIntro && (
              <motion.div key="intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-4">
                  🎉
                </motion.div>
                <h1 className="font-fredoka text-3xl font-bold text-violet-700 mb-2">Day {day}!</h1>
                <p className="font-fredoka text-lg text-pink-500 mb-2">{topic}</p>
                <p className="font-fredoka text-muted-foreground mb-8">Let's learn {words.length} fun new words!</p>
                <Button
                  onClick={() => setStep(1)}
                  className="h-14 px-10 rounded-3xl font-fredoka font-bold text-lg bg-gradient-to-r from-violet-500 to-pink-500 shadow-lg"
                >
                  {t.kids_welcome} 🎮
                </Button>
              </motion.div>
            )}

            {isWordStep && currentWord && (
              <motion.div key={`word-${step}`} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }} className="text-center">
                {currentWord.isReview
                  ? <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 rounded-full px-3 py-1 font-fredoka font-semibold text-xs mb-2"><RefreshCw className="w-3 h-3" /> Reviewing this word!</div>
                  : <p className="font-fredoka text-sm text-muted-foreground mb-2">🆕 New Word!</p>
                }
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-4 border-2 border-violet-100">
                  <span className="text-7xl block mb-4">{currentWord.emoji}</span>
                  <h2 className="font-fredoka text-3xl font-bold text-violet-700 mb-2">{currentWord.word}</h2>
                  <p className="font-fredoka text-xl text-pink-500 mb-4">{currentWord.meaning}</p>
                  <button
                    onClick={() => speak(cleanWord(currentWord.word))}
                    className="inline-flex items-center gap-2 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-full px-5 py-2 font-fredoka font-semibold text-sm transition-all"
                    aria-label="Hear pronunciation"
                  >
                    <Volume2 className="w-4 h-4" /> Hear it! 🔊
                  </button>

                  <PronunciationChallenge
                    word={cleanWord(currentWord.word)}
                    langId={langId}
                    onSpeak={() => speak(cleanWord(currentWord.word))}
                    onDone={() => setStep((s) => s + 1)}
                  />
                </div>
              </motion.div>
            )}

            {isStandardQuiz && quizQ && (
              <motion.div key={`quiz-${step}`} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }} className="text-center">
                <p className="font-fredoka text-sm text-muted-foreground mb-2">🧠 Quiz Time!</p>
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border-2 border-pink-100">
                  <span className="text-5xl block mb-3">{quizQ.emoji}</span>
                  <p className="font-fredoka text-sm text-muted-foreground mb-2">What does this mean?</p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <h2 className="font-fredoka text-2xl font-bold text-violet-700">{quizQ.question}</h2>
                    <button
                      onClick={() => speak(cleanWord(quizQ.question))}
                      className="p-2 rounded-full bg-violet-100 hover:bg-violet-200 text-violet-600 transition-all"
                      aria-label="Hear pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {quizQ.options.map((opt) => {
                      const isCorrect = opt === quizQ.correctAnswer;
                      const isSelected = selectedAnswer === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => !showResult && handleQuizAnswer(opt)}
                          disabled={showResult}
                          className={`w-full py-4 rounded-2xl font-fredoka font-bold text-base transition-all border-2 ${
                            showResult
                              ? isCorrect
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : isSelected
                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                : 'border-gray-200 opacity-50'
                              : 'border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400 hover:bg-violet-100'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {isListeningQuiz && quizQ && (
              <motion.div key="listening-quiz" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }} className="text-center">
                <p className="font-fredoka text-sm font-bold text-pink-500 mb-2">👂 Listen & Pick!</p>
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border-2 border-amber-100">
                  <p className="font-fredoka text-sm text-muted-foreground mb-5">Listen carefully — what did you hear?</p>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => speak(cleanWord(quizQ.correctWord.word))}
                    className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-xl mb-5"
                    aria-label="Play word audio"
                  >
                    <Volume2 className="w-12 h-12 text-white" />
                  </motion.button>
                  <p className="font-fredoka text-xs text-muted-foreground mb-6">Tap to hear again 🔊</p>
                  <div className="grid grid-cols-2 gap-3">
                    {quizQ.options.map(({ word, isCorrect: optCorrect }) => {
                      const isSelected = selectedAnswer === word.meaning;
                      return (
                        <button
                          key={word.meaning}
                          onClick={() => !showResult && handleQuizAnswer(word.meaning)}
                          disabled={showResult}
                          className={`p-4 rounded-2xl border-2 font-fredoka font-bold text-sm transition-all flex flex-col items-center gap-1 ${
                            showResult
                              ? optCorrect
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : isSelected
                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                : 'border-gray-200 opacity-50'
                              : 'border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400 hover:bg-violet-100'
                          }`}
                        >
                          <span className="text-3xl">{word.emoji}</span>
                          <span>{word.meaning}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {isComplete && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: 3 }}
                  className="text-7xl mb-4 inline-block"
                >
                  🏆
                </motion.div>
                <h1 className="font-fredoka text-3xl font-bold text-violet-700 mb-2">{t.kids_amazing}</h1>
                <p className="font-fredoka text-muted-foreground mb-6">You completed Day {day}!</p>
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border-2 border-amber-100 inline-block">
                  <div className="flex gap-6">
                    <div>
                      <div className="flex justify-center gap-0.5 mb-1">
                        {[1, 2, 3].map((s) => (
                          <Star key={s} className={`w-5 h-5 ${s <= score ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="font-fredoka text-xs text-muted-foreground">Score</p>
                    </div>
                    <div>
                      <p className="font-fredoka text-2xl font-bold text-amber-500">+{score * 15 + 25}</p>
                      <p className="font-fredoka text-xs text-muted-foreground">Stars</p>
                    </div>
                    <div>
                      <p className="font-fredoka text-2xl font-bold text-violet-500">{words.length}</p>
                      <p className="font-fredoka text-xs text-muted-foreground">Words</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    onClick={handleComplete}
                    disabled={completing}
                    className="h-14 px-10 rounded-3xl font-fredoka font-bold text-lg bg-gradient-to-r from-violet-500 to-pink-500 shadow-lg"
                  >
                    {completing ? t.lesson_saving : `${t.lesson_continue}! 🚀`}
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