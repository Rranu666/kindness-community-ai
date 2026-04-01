import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, ArrowRight, BookOpen, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LANGUAGES = [
  { flag: '🇪🇸', name: 'Spanish', word: '¡Hola!', meaning: 'Hello', color: 'from-red-500 to-yellow-500' },
  { flag: '🇫🇷', name: 'French', word: 'Bonjour', meaning: 'Hello', color: 'from-blue-500 to-red-500' },
  { flag: '🇩🇪', name: 'German', word: 'Guten Tag', meaning: 'Good Day', color: 'from-gray-900 to-yellow-500' },
  { flag: '🇯🇵', name: 'Japanese', word: 'こんにちは', meaning: 'Hello', color: 'from-red-500 to-rose-400' },
  { flag: '🇰🇷', name: 'Korean', word: '안녕하세요', meaning: 'Hello', color: 'from-blue-600 to-red-500' },
  { flag: '🇮🇹', name: 'Italian', word: 'Ciao!', meaning: 'Hello', color: 'from-green-600 to-red-500' },
  { flag: '🇧🇷', name: 'Portuguese', word: 'Olá!', meaning: 'Hello', color: 'from-green-600 to-yellow-400' },
  { flag: '🇨🇳', name: 'Mandarin', word: '你好', meaning: 'Hello', color: 'from-red-600 to-yellow-500' },
];

export default function Hero() {
  const [activeLang, setActiveLang] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLang((prev) => (prev + 1) % LANGUAGES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const current = LANGUAGES[activeLang];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-4 md:pt-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              100% Free · AI-Powered · 30-Day Challenge
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              Learn{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeLang}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                >
                  {current.name}
                </motion.span>
              </AnimatePresence>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="inline-flex items-center gap-2 mt-3 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 backdrop-blur-xl text-transparent bg-clip-text font-extrabold"
              >
                <span className="text-foreground">Online</span>
                <span className="text-primary">•</span>
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">100% Free</span>
              </motion.span>
            </h1>

            <p className="mt-4 md:mt-6 text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed">
              The best free language learning app for beginners, kids, and families. Master <strong className="text-foreground font-semibold">Spanish, French, German, Japanese, Korean, Italian, Portuguese,</strong> and <strong className="text-foreground font-semibold">Mandarin</strong> with AI-guided daily lessons — no subscription needed.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-8 md:mt-10">
              <Link to="/kindlearn/select-language">
                <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                  <Play className="w-5 h-5 mr-2" />
                  Start Free Today
                </Button>
              </Link>
              <Link to="/kindlearn/kids">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-semibold rounded-2xl border-2 hover:bg-primary/5">
                  Kids Zone
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-6 md:gap-8 mt-8 md:mt-12">
              {[
                { icon: Users, num: '2M+', label: 'Active Learners' },
                { icon: BookOpen, num: '8', label: 'Languages' },
                { icon: Zap, num: 'FREE', label: 'Forever' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex flex-col items-start"
                >
                  <p className="text-xl md:text-3xl font-bold text-foreground">{s.num}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Interactive language card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex flex-col items-center gap-6"
          >
            {/* Main animated word card */}
            <motion.div
              className="w-80 bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-primary/20 p-8 text-center hover:shadow-primary/20 hover:border-primary/40 transition-all duration-500 group"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              whileHover={{ scale: 1.02, y: -15 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <img src="/kindlearn-logo.png" alt="KindLearn free language learning app" className="w-9 h-9 rounded-xl" width="36" height="36" loading="lazy" />
                <span className="font-bold text-sm">KindLearn</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLang}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-5xl mb-3">{current.flag}</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Learn {current.name} Free</p>
                  <div className="bg-secondary rounded-2xl py-5 px-4 mb-4">
                    <p className="text-3xl font-extrabold">{current.word}</p>
                    <p className="text-muted-foreground text-sm mt-1">{current.meaning}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2">
                <motion.div
                  className="flex-1 bg-primary/10 rounded-xl py-2 text-center text-xs font-semibold text-primary"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(123, 58, 237, 0.2)' }}
                >
                  🔥 Day 3
                </motion.div>
                <motion.div
                  className="flex-1 bg-accent/10 rounded-xl py-2 text-center text-xs font-semibold text-accent"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(172, 96, 48, 0.2)' }}
                >
                  ⭐ 250 XP
                </motion.div>
              </div>
            </motion.div>

            {/* Language pills */}
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {LANGUAGES.map((lang, i) => (
                <motion.button
                  key={lang.name}
                  onClick={() => setActiveLang(i)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    activeLang === i
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                      : 'bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground hover:shadow-md'
                  }`}
                  aria-label={`Preview ${lang.name}`}
                >
                  {lang.flag} {lang.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Language strip — visible on all screens below hero */}
      <div className="relative z-10 mt-10 md:mt-16 border-t bg-secondary/40 backdrop-blur-sm py-4 overflow-hidden">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-4">
          Start learning any of these languages today — completely free
        </p>
        {/* Desktop: full list */}
        <div className="hidden md:flex justify-center flex-wrap gap-x-8 gap-y-2 px-6">
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.name}
              to="/kindlearn/select-language"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Learn ${lang.name} online free`}
            >
              <span>{lang.flag}</span>
              <span>Learn {lang.name}</span>
            </Link>
          ))}
        </div>
        {/* Mobile: flags only */}
        <div className="flex md:hidden justify-center gap-3 px-4">
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.name}
              to="/kindlearn/select-language"
              className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Learn ${lang.name}`}
            >
              <span className="text-2xl">{lang.flag}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}