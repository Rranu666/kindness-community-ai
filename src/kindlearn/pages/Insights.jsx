import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { progressApi } from '@/kindlearn/api/progress';
import { LANGUAGES } from '@/kindlearn/lib/languages';
import Navbar from '@/kindlearn/components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, AlertCircle, Clock, Zap, BarChart3 } from 'lucide-react';
import { buildInsights } from '@/kindlearn/lib/insightsEngine';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Insights() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const langId = urlParams.get('lang') || 'spanish';
  const language = LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const list = await progressApi.filter({ language: langId, mode: 'adult' });
      if (list.length > 0) setProgress(list[0]);
      setLoading(false);
    };
    init();
  }, [langId]);

  const srsKey = `kindlearn_srs_${langId}`;
  const srsData = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(srsKey) || '{}'); }
    catch { return {}; }
  }, [srsKey]);

  const insights = useMemo(() => buildInsights(progress, srsData, langId), [progress, srsData, langId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No learning data yet. Start a lesson first!</p>
      </div>
    );
  }

  const { velocity, categoryErrors, optimalTimes, xpTrend } = insights;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/kindlearn/dashboard?lang=${langId}`)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" /> Learning Insights
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{language.name} · Personalized analytics</p>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Learning Velocity */}
            <motion.div variants={item} className="bg-card rounded-2xl border p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Learning Velocity</h2>
                  <p className="text-sm text-muted-foreground">Your learning pace & progress</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  { label: 'Words/Day', value: velocity.velocity, unit: '' },
                  { label: 'Total Words', value: velocity.wordsLearned, unit: '' },
                  { label: 'Days Active', value: velocity.daysActive, unit: '' },
                  { label: 'Trend', value: velocity.trend.charAt(0).toUpperCase() + velocity.trend.slice(1), unit: '' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-secondary rounded-xl p-3 text-center">
                    <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}{stat.unit}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-secondary rounded-xl p-4 text-sm">
                <p className="text-muted-foreground">
                  You're learning at a consistent pace. Keep up this momentum and you'll master the language in no time!
                </p>
              </div>
            </motion.div>

            {/* XP Trend */}
            <motion.div variants={item} className="bg-card rounded-2xl border p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">XP Momentum</h2>
                  <p className="text-sm text-muted-foreground">Your daily & total progress</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Today's XP", value: xpTrend.todayXP },
                  { label: 'Avg Daily', value: xpTrend.avgDailyXP },
                  { label: 'Total XP', value: xpTrend.totalXP },
                ].map((stat) => (
                  <div key={stat.label} className="bg-secondary rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-amber-600">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm font-semibold text-amber-900">{xpTrend.momentum}</p>
                <p className="text-xs text-amber-800 mt-1">
                  {xpTrend.todayXP >= xpTrend.avgDailyXP
                    ? 'Great job today! Keep this energy going.'
                    : 'Try to match your average daily XP tomorrow.'}
                </p>
              </div>
            </motion.div>

            {/* Category Error Rates */}
            <motion.div variants={item} className="bg-card rounded-2xl border p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Category Error Rates</h2>
                  <p className="text-sm text-muted-foreground">Which vocab themes need work</p>
                </div>
              </div>

              {categoryErrors.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet. Complete lessons to see error analysis.</p>
              ) : (
                <div className="space-y-3">
                  {categoryErrors.map((cat) => {
                    const severityColor =
                      cat.severity === 'critical'
                        ? 'bg-rose-50 border-rose-200'
                        : cat.severity === 'high'
                        ? 'bg-amber-50 border-amber-200'
                        : cat.severity === 'medium'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-emerald-50 border-emerald-200';

                    const barColor =
                      cat.severity === 'critical'
                        ? 'bg-rose-500'
                        : cat.severity === 'high'
                        ? 'bg-amber-500'
                        : cat.severity === 'medium'
                        ? 'bg-blue-500'
                        : 'bg-emerald-500';

                    const severityLabel =
                      cat.severity === 'critical'
                        ? '🔴 Critical'
                        : cat.severity === 'high'
                        ? '🟠 High'
                        : cat.severity === 'medium'
                        ? '🟡 Medium'
                        : '🟢 Low';

                    return (
                      <div key={cat.category} className={`rounded-xl border p-3 ${severityColor}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{cat.category}</span>
                          <span className="text-xs font-bold">{severityLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${barColor}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${cat.errorRate}%` }}
                              transition={{ delay: 0.2, duration: 0.6 }}
                            />
                          </div>
                          <span className="text-xs font-bold whitespace-nowrap">{cat.errorRate}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {cat.missCount} misses out of {cat.totalInCat} words
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {categoryErrors.some((c) => c.severity === 'critical' || c.severity === 'high') && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <p className="text-sm font-semibold text-rose-900">Action: Focus on weak categories</p>
                  <p className="text-xs text-rose-800 mt-1">
                    Add extra flashcard sessions for{' '}
                    {categoryErrors
                      .filter((c) => c.severity === 'critical' || c.severity === 'high')
                      .map((c) => c.category)
                      .join(', ')}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Optimal Practice Times */}
            <motion.div variants={item} className="bg-card rounded-2xl border p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Optimal Practice Times</h2>
                  <p className="text-sm text-muted-foreground">When you learn best</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {optimalTimes.bestHours.map((hour) => (
                  <div key={hour} className="bg-secondary rounded-xl p-3 md:p-4 text-center">
                    <p className="text-xl md:text-2xl font-bold text-accent">{hour}:00</p>
                    <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                      {hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                <p className="text-sm text-foreground font-medium">{optimalTimes.recommendation}</p>
              </div>
            </motion.div>

            {/* Summary Stats */}
            <motion.div variants={item} className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10 p-6">
              <h3 className="font-bold text-lg mb-3">Quick Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consistency Score</span>
                  <span className="font-semibold">
                    {Math.min(100, Math.round((progress.streak_days || 0) * 10))}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mastery Progress</span>
                  <span className="font-semibold">
                    {Math.round(((progress.lessons_completed?.length || 0) / 30) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vocab Retention</span>
                  <span className="font-semibold">
                    {Math.round(((progress.words_learned || 0) / 80) * 100)}%
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}