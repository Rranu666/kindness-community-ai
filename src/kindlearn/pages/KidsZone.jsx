import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { progressApi } from '@/kindlearn/api/progress';
import { LANGUAGES, DAILY_TOPICS, KIDS_AVATARS } from '@/kindlearn/lib/languages';
import KidsNav from '../components/kids/KidsNav';
import AvatarPicker from '../components/kids/AvatarPicker';
import KidsLessonCard from '../components/kids/KidsLessonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Flame, Star, Zap, Sparkles } from 'lucide-react';

export default function KidsZone() {
  const navigate = useNavigate();
  const [setup, setSetup] = useState(true);
  const [kidName, setKidName] = useState('');
  const [avatar, setAvatar] = useState('fox');
  const [ageGroup, setAgeGroup] = useState('7-9');
  const [selectedLang, setSelectedLang] = useState('spanish');
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkExisting();
  }, []);

  const checkExisting = async () => {
    try {
      const list = await progressApi.filter({ mode: 'kids' });
      if (list.length > 0) {
        setProgress(list[0]);
        setSetup(false);
      }
    } catch {
      // API unavailable or guest user — stay on setup screen
    }
    setChecking(false);
  };

  const handleStart = async () => {
    if (!kidName.trim()) return;
    setLoading(true);
    try {
      const created = await progressApi.create({
        language: selectedLang,
        mode: 'kids',
        kid_name: kidName,
        kid_avatar: avatar,
        kid_age_group: ageGroup,
        current_day: 1,
        xp_total: 0,
        streak_days: 0,
        longest_streak: 0,
        lessons_completed: [],
        daily_xp: 0,
        words_learned: 0,
        badges: [],
        last_activity_date: new Date().toISOString().split('T')[0],
      });
      setProgress(created);
      setSetup(false);
    } catch {
      // API unavailable — run in guest mode with local state only
      setProgress({ language: selectedLang, current_day: 1, lessons_completed: [], xp_total: 0, streak_days: 0, words_learned: 0, badges: [] });
      setSetup(false);
    }
    setLoading(false);
  };

  const handleStartLesson = (day) => {
    const lang = progress?.language || selectedLang;
    const pid = progress?.id || null;
    navigate(`/kindlearn/kids-lesson?lang=${lang}&day=${day}${pid ? `&pid=${pid}` : ''}`);
  };

  const selectedAvatar = KIDS_AVATARS.find((a) => a.id === (progress?.kid_avatar || avatar));
  const p = progress || {};

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-pink-50 to-amber-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (setup) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-pink-50 to-amber-50">
        <KidsNav />
        <div className="px-4 py-12 max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-6">
              🌟
            </motion.div>
            <h1 className="font-fredoka text-3xl font-bold bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent mb-2">
              Welcome, Little Explorer!
            </h1>
            <p className="text-muted-foreground mb-8 font-fredoka">Let's set up your learning adventure!</p>

            <div className="space-y-6 text-left">
              <div>
                <label className="font-fredoka font-semibold text-sm text-violet-700 mb-2 block">What's your name?</label>
                <Input
                  value={kidName}
                  onChange={(e) => setKidName(e.target.value)}
                  placeholder="Type your name..."
                  className="rounded-2xl h-12 text-lg font-fredoka border-violet-200 focus:ring-violet-400"
                />
              </div>

              <div>
                <label className="font-fredoka font-semibold text-sm text-violet-700 mb-2 block">Pick your buddy!</label>
                <AvatarPicker selected={avatar} onSelect={setAvatar} />
              </div>

              <div>
                <label className="font-fredoka font-semibold text-sm text-violet-700 mb-2 block">How old are you?</label>
                <div className="grid grid-cols-3 gap-3">
                  {['4-6', '7-9', '10-12'].map((ag) => (
                    <button
                      key={ag}
                      onClick={() => setAgeGroup(ag)}
                      className={`py-3 rounded-2xl font-fredoka font-bold text-sm transition-all ${
                        ageGroup === ag
                          ? 'bg-violet-500 text-white shadow-lg shadow-violet-200'
                          : 'bg-white border border-violet-200 text-violet-700 hover:bg-violet-50'
                      }`}
                    >
                      {ag} years
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-fredoka font-semibold text-sm text-violet-700 mb-2 block">Which language?</label>
                <div className="grid grid-cols-4 gap-2">
                  {LANGUAGES.slice(0, 8).map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLang(l.id)}
                      className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                        selectedLang === l.id
                          ? 'bg-violet-500 text-white shadow-md'
                          : 'bg-white border hover:bg-violet-50'
                      }`}
                    >
                      <span className="text-2xl">{l.flag}</span>
                      <span className="text-[10px] font-fredoka font-medium mt-1">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleStart}
                disabled={loading || !kidName.trim()}
                className="w-full h-14 rounded-2xl font-fredoka font-bold text-lg bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 hover:from-violet-600 hover:via-pink-600 hover:to-amber-500 shadow-lg"
              >
                {loading ? 'Getting Ready...' : "Let's Go! 🚀"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const lang = LANGUAGES.find((l) => l.id === p.language) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-pink-50 to-amber-50">
      <KidsNav />
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl inline-block"
          >
            {selectedAvatar?.emoji || '🦊'}
          </motion.span>
          <h1 className="font-fredoka text-2xl font-bold mt-2">
            Hi, <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">{p.kid_name || 'Explorer'}</span>!
          </h1>
          <p className="text-muted-foreground font-fredoka text-sm">
            Learning {lang.name} {lang.flag}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-amber-100">
            <Flame className="w-6 h-6 text-orange-500 mx-auto" />
            <p className="font-fredoka font-bold text-lg text-orange-600">{p.streak_days || 0}</p>
            <p className="font-fredoka text-[10px] text-muted-foreground">Streak</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-amber-100">
            <Star className="w-6 h-6 text-amber-500 mx-auto" />
            <p className="font-fredoka font-bold text-lg text-amber-600">{p.xp_total || 0}</p>
            <p className="font-fredoka text-[10px] text-muted-foreground">Stars</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-violet-100">
            <Zap className="w-6 h-6 text-violet-500 mx-auto" />
            <p className="font-fredoka font-bold text-lg text-violet-600">{p.words_learned || 0}</p>
            <p className="font-fredoka text-[10px] text-muted-foreground">Words</p>
          </div>
        </div>

        {/* Today's Lesson CTA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStartLesson(p.current_day || 1)}
          className="bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 rounded-3xl p-6 text-white text-center mb-8 cursor-pointer shadow-xl"
        >
          <Sparkles className="w-8 h-8 mx-auto mb-2" />
          <h2 className="font-fredoka text-xl font-bold">Today's Adventure</h2>
          <p className="font-fredoka text-sm opacity-90 mb-3">Day {p.current_day || 1}: {DAILY_TOPICS[(p.current_day || 1) - 1]}</p>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-2 font-fredoka font-bold">
            Play Now! 🎮
          </div>
        </motion.div>

        {/* Lesson cards */}
        <h3 className="font-fredoka font-bold text-lg mb-4 flex items-center gap-2">
          <span>🗺️</span> Your Journey
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {DAILY_TOPICS.slice(0, 12).map((topic, i) => {
            const day = i + 1;
            const isCompleted = (p.lessons_completed || []).includes(day);
            const isCurrent = day === (p.current_day || 1);
            const isLocked = day > (p.current_day || 1);
            return (
              <KidsLessonCard
                key={day}
                day={day}
                title={topic}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                isLocked={isLocked}
                onStart={handleStartLesson}
                index={i}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}