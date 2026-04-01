import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { progressApi } from '@/kindlearn/api/progress';
import { LANGUAGES } from '@/kindlearn/lib/languages';
import Navbar from '../components/landing/Navbar';
import { useUILanguage } from '@/kindlearn/lib/UILanguageContext';
import { useNotifications } from '@/kindlearn/hooks/useNotifications';
import ProgressRing from '../components/dashboard/ProgressRing';
import StreakCard from '../components/dashboard/StreakCard';
import LessonMap from '../components/dashboard/LessonMap';
import StatsRow from '../components/dashboard/StatsRow';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Layers, Brain, Ear, BarChart3, BookOpen } from 'lucide-react';

import Leaderboard from '../components/dashboard/Leaderboard';
import DailyGoal from '../components/dashboard/DailyGoal';
import ReminderSettings from '../components/dashboard/ReminderSettings';
import DailyPath from '../components/dashboard/DailyPath';
import StreakNudge from '../components/dashboard/StreakNudge';
import BadgesSection from '../components/dashboard/BadgesSection';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useUILanguage();
  const { createNotification } = useNotifications();
  const urlParams = new URLSearchParams(window.location.search);
  const langId = urlParams.get('lang') || 'spanish';
  const language = LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [notifiedMilestones, setNotifiedMilestones] = useState([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoadError(null);
      const today = new Date().toISOString().split('T')[0];
      const list = await progressApi.filter({ language: langId, mode: 'adult' });

      if (list.length > 0) {
        let p = list[0];

        // Streak logic on dashboard load:
        // - Same day: no change (lesson may have already updated it)
        // - Yesterday: streak continues, increment
        // - Older / missing: streak broken, reset to 0
        const last = p.last_activity_date;
        if (last !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          const newStreak = last === yesterdayStr ? (p.streak_days || 0) + 1 : 0;
          const newLongest = Math.max(p.longest_streak || 0, newStreak);
          try {
            await progressApi.update(p.id, {
              streak_days: newStreak,
              longest_streak: newLongest,
              last_activity_date: today,
            });
          } catch {
            // streak update failure is non-fatal — show existing data
          }
          p = { ...p, streak_days: newStreak, longest_streak: newLongest, last_activity_date: today };
          checkAndNotifyMilestones(p);
        }

        setProgress(p);
      } else {
        const created = await progressApi.create({
          language: langId,
          mode: 'adult',
          current_day: 1,
          xp_total: 0,
          streak_days: 1,
          longest_streak: 1,
          lessons_completed: [],
          daily_xp: 0,
          words_learned: 0,
          badges: [],
          last_activity_date: today,
        });
        setProgress(created);
      }
    } catch (err) {
      console.error('Failed to load progress:', err);
      setLoadError('Could not load your progress. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkAndNotifyMilestones = async (p) => {
    const milestones = [
      { streak: 7, icon: '🔥', title: 'Week Warrior', msg: "You've maintained a 7-day streak!" },
      { streak: 30, icon: '🏆', title: 'Unstoppable', msg: "You've achieved a 30-day streak!" },
      { day: 10, icon: '🎯', title: 'Tenth Day', msg: "You've completed 10 days of learning!" },
      { day: 30, icon: '👑', title: 'Challenge Master', msg: "You've completed the 30-day challenge!" },
    ];

    for (const m of milestones) {
      const key = m.streak ? `streak_${m.streak}` : `day_${m.day}`;
      if (notifiedMilestones.includes(key)) continue;

      const triggered = (m.streak && p.streak_days === m.streak) || (m.day && p.current_day === m.day);
      if (triggered) {
        await createNotification('milestone', m.title, m.msg, m.icon);
        setNotifiedMilestones(prev => [...prev, key]);
      }
    }
  };

  const handleStartLesson = (day) => {
    navigate(`/kindlearn/lesson?lang=${langId}&day=${day}&pid=${progress?.id}`);
  };

  const handleGoalChange = async (newGoal) => {
    if (!progress?.id) return;
    await progressApi.update(progress.id, { daily_goal_minutes: newGoal });
    setProgress((prev) => ({ ...prev, daily_goal_minutes: newGoal }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-4xl">⚠️</p>
        <p className="text-lg font-semibold text-foreground">{loadError}</p>
        <button
          onClick={() => { setLoading(true); loadProgress(); }}
          className="mt-2 px-6 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const p = progress || {};
  const overallProgress = Math.round(((p.lessons_completed?.length || 0) / 30) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <Button variant="ghost" onClick={() => navigate('/kindlearn/select-language')} className="mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t.select_title}
          </Button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8"
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">{language.flag}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold">{language.name} Challenge</h1>
                <p className="text-muted-foreground">Day {p.current_day || 1} of 30</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <ProgressRing progress={overallProgress} size={80} strokeWidth={6}>
                <span className="text-sm font-bold">{overallProgress}%</span>
              </ProgressRing>
              <div className="flex gap-2 flex-wrap w-full md:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-4 rounded-2xl font-semibold hidden sm:inline-flex"
                  onClick={() => navigate(`/kindlearn/vocabulary?lang=${langId}`)}
                >
                  <BookOpen className="w-4 h-4 mr-1.5" /> Vocabulary
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-4 rounded-2xl font-semibold hidden sm:inline-flex"
                  onClick={() => navigate(`/kindlearn/flashcards?lang=${langId}`)}
                >
                  <Layers className="w-4 h-4 mr-1.5" /> Flashcards
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-4 rounded-2xl font-semibold hidden sm:inline-flex border-accent/40 text-accent hover:bg-accent/10"
                  onClick={() => navigate(`/kindlearn/listen?lang=${langId}`)}
                >
                  <Ear className="w-4 h-4 mr-1.5" /> Listen
                </Button>
                {(p.struggled_words && Object.keys(p.struggled_words).length > 0) && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-4 rounded-2xl font-semibold hidden sm:inline-flex border-rose-300 text-rose-600 hover:bg-rose-50"
                    onClick={() => navigate(`/kindlearn/review?lang=${langId}`)}
                  >
                    <Brain className="w-4 h-4 mr-1.5" /> Review ({Object.keys(p.struggled_words).length})
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-4 rounded-2xl font-semibold hidden sm:inline-flex"
                  onClick={() => navigate(`/kindlearn/insights?lang=${langId}`)}
                >
                  <BarChart3 className="w-4 h-4 mr-1.5" /> Insights
                </Button>
                <Button
                  size="lg"
                  className="h-12 px-6 rounded-2xl font-semibold shadow-lg shadow-primary/20"
                  onClick={() => handleStartLesson(p.current_day || 1)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t.nav_challenge}
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            {(p.streak_days || 0) >= 3 && (
              <StreakNudge
                streak={p.streak_days || 0}
                currentDay={p.current_day || 1}
                language={language.name}
                langId={langId}
              />
            )}

            <DailyPath progress={p} langId={langId} />

            <StatsRow
              xp={p.xp_total}
              wordsLearned={p.words_learned}
              currentDay={p.current_day}
              dailyXp={p.daily_xp}
            />

            <StreakCard streak={p.streak_days || 0} longestStreak={p.longest_streak || 0} />

            <DailyGoal
              goalMinutes={p.daily_goal_minutes || 10}
              practiceMinutes={p.daily_practice_minutes || 0}
              onGoalChange={handleGoalChange}
            />

            <ReminderSettings
              progress={progress}
              onUpdate={(update) => setProgress((prev) => ({ ...prev, ...update }))}
            />

            {/* Badges Section */}
            <BadgesSection
              earnedBadges={p.badges || []}
              wordsLearned={p.words_learned || 0}
              xpTotal={p.xp_total || 0}
              streak={p.streak_days || 0}
            />

            <Leaderboard langId={langId} currentUserId={p.id} />

            <div className="bg-card rounded-2xl border p-5">
              <LessonMap
                currentDay={p.current_day || 1}
                completedLessons={p.lessons_completed}
                onStartLesson={handleStartLesson}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}