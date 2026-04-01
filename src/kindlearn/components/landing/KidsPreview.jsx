import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Heart, Sparkles, Volume2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const CHARACTERS = [
  { emoji: '🦊', name: 'Zorro', meaning: 'Fox in Spanish', color: 'from-orange-400 to-amber-500', bg: 'bg-orange-50' },
  { emoji: '🐼', name: 'Panda', meaning: 'Panda in Japanese', color: 'from-gray-400 to-slate-500', bg: 'bg-gray-50' },
  { emoji: '🦄', name: 'Licorne', meaning: 'Unicorn in French', color: 'from-pink-400 to-violet-500', bg: 'bg-pink-50' },
  { emoji: '🐉', name: 'Drago', meaning: 'Dragon in Italian', color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50' },
];

const FEATURES = [
  { icon: '🎮', text: 'Play-based learning with stories & games' },
  { icon: '🎯', text: 'Age-appropriate content (4-6, 7-9, 10-12)' },
  { icon: '📊', text: 'Progress tracking for parents' },
  { icon: '🚫', text: 'No ads, no distractions — just learning' },
];

export default function KidsPreview() {
  const [activeChar, setActiveChar] = useState(0);
  const [burst, setBurst] = useState(false);

  const char = CHARACTERS[activeChar];

  const handleCharClick = (i) => {
    setActiveChar(i);
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-200/20 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* === 3D VISUAL SIDE === */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Outer glow card */}
            <div className="relative">
              {/* 3D shadow layers */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-violet-300/40 rounded-[2.5rem] blur-sm" />
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-pink-300/30 rounded-[2.5rem]" />

              {/* Main card */}
              <div className="relative bg-gradient-to-br from-violet-100 via-pink-50 to-amber-50 rounded-[2.5rem] p-8 border border-white/80 shadow-2xl backdrop-blur-sm overflow-hidden">

                {/* Decorative floating stars */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-amber-400 text-lg pointer-events-none"
                    style={{ top: `${10 + i * 18}%`, right: `${4 + (i % 3) * 8}%` }}
                    animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5], rotate: [0, 20, 0] }}
                    transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                  >
                    ✦
                  </motion.div>
                ))}

                {/* Character selector tabs */}
                <div className="flex justify-center gap-3 mb-6">
                  {CHARACTERS.map((c, i) => (
                    <motion.button
                      key={c.emoji}
                      onClick={() => handleCharClick(i)}
                      whileTap={{ scale: 0.85 }}
                      animate={i === activeChar ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className={`w-14 h-14 rounded-2xl shadow-lg text-2xl flex items-center justify-center transition-all border-2 ${
                        i === activeChar
                          ? `bg-gradient-to-br ${c.color} border-white shadow-xl`
                          : 'bg-white border-transparent hover:border-violet-200'
                      }`}
                    >
                      {c.emoji}
                    </motion.button>
                  ))}
                </div>

                {/* Word card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChar}
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative"
                  >
                    {/* 3D card effect */}
                    <div className={`absolute inset-0 translate-y-1.5 translate-x-1.5 bg-gradient-to-br ${char.color} opacity-30 rounded-2xl`} />
                    <div className="relative bg-white rounded-2xl p-7 shadow-xl text-center border border-white/60">
                      {/* Sound button */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-500"
                      >
                        <Volume2 className="w-4 h-4" />
                      </motion.button>

                      <p className="font-fredoka text-sm text-muted-foreground mb-3">What does the fox say?</p>

                      {/* Burst effect */}
                      {burst && (
                        <motion.div
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 3, opacity: 0 }}
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${char.color} opacity-20`}
                        />
                      )}

                      <motion.p
                        className={`font-fredoka text-5xl font-bold bg-gradient-to-r ${char.color} bg-clip-text text-transparent mb-1`}
                      >
                        {char.emoji} {char.name}
                      </motion.p>
                      <p className="font-fredoka text-muted-foreground text-sm">= {char.meaning}</p>

                      {/* XP earned tag */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-1 mt-3 bg-amber-100 text-amber-600 rounded-full px-3 py-1 text-xs font-bold"
                      >
                        <Zap className="w-3 h-3" /> +10 XP
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Stars row */}
                <div className="flex gap-2 justify-center mt-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.div
                      key={s}
                      animate={{ scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ delay: s * 0.15, duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Floating heart */}
                <motion.div
                  className="absolute bottom-5 left-5"
                  animate={{ scale: [1, 1.3, 1], y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-rose-400 fill-rose-300" />
                </motion.div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 -right-2 md:-right-4 bg-white rounded-2xl shadow-xl p-2 md:p-3 border border-violet-100 flex items-center gap-2"
            >
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-xs font-bold text-violet-600">Streak!</p>
                <p className="text-xs text-muted-foreground">7 days 🔥</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
              className="absolute -top-4 -left-2 md:-left-4 bg-white rounded-2xl shadow-xl p-2 md:p-3 border border-pink-100 flex items-center gap-2"
            >
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-xs font-bold text-pink-600">Daily Goal</p>
                <p className="text-xs text-muted-foreground">Complete! ✅</p>
              </div>
            </motion.div>
          </motion.div>

          {/* === TEXT SIDE === */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-violet-100 text-pink-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-5 border border-pink-200"
            >
              <Sparkles className="w-4 h-4" />
              For Kids Ages 4-12
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Turn Screen Time Into{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                  Learning Time
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
              Our Kids Zone replaces mindless scrolling with magical language adventures.
              Interactive stories, playful games, and lovable characters make learning
              so fun, kids won't want to stop.
            </p>

            <ul className="mt-8 space-y-3">
              {FEATURES.map((item, i) => (
                <motion.li
                  key={item.text}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-violet-100 border border-pink-200 flex items-center justify-center text-lg flex-shrink-0 shadow-sm"
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-foreground font-medium group-hover:text-violet-600 transition-colors">{item.text}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex items-center gap-4 flex-wrap"
            >
              <Link to="/kindlearn/kids">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-14 px-8 text-base font-semibold rounded-2xl bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg shadow-pink-300/40 text-white flex items-center gap-2 transition-all"
                >
                  Enter Kids Zone
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <p className="text-sm text-muted-foreground">
                🔒 Safe & ad-free
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}