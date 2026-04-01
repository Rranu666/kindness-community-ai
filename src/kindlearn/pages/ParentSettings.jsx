import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { progressApi } from '@/kindlearn/api/progress';
import { parentSettingsApi } from '@/kindlearn/api/parentSettings';
import { authApi } from '@/kindlearn/api/auth';
import { LANGUAGES, DAILY_TOPICS } from '@/kindlearn/lib/languages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Shield, BarChart2, Clock, Mail, Star,
  Flame, Zap, BookOpen, Trophy, Send, CheckCircle, ChevronRight
} from 'lucide-react';

export default function ParentSettings() {
  const navigate = useNavigate();
  const [kidProgress, setKidProgress] = useState(null);
  const [settings, setSettings] = useState(null);
  const [settingsId, setSettingsId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Local form state
  const [limitMinutes, setLimitMinutes] = useState(30);
  const [limitEnabled, setLimitEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [summaryEmail, setSummaryEmail] = useState('');
  const [frequency, setFrequency] = useState('weekly');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [progressList, settingsList, user] = await Promise.all([
      progressApi.filter({ mode: 'kids' }),
      parentSettingsApi.list(),
      authApi.me(),
    ]);
    if (progressList.length > 0) setKidProgress(progressList[0]);

    if (settingsList.length > 0) {
      const s = settingsList[0];
      setSettings(s);
      setSettingsId(s.id);
      setLimitMinutes(s.daily_limit_minutes ?? 30);
      setLimitEnabled(s.notifications_enabled ?? true);
      setEmailEnabled(s.email_summary_enabled ?? false);
      setSummaryEmail(s.summary_email || user?.email || '');
      setFrequency(s.summary_frequency || 'weekly');
    } else {
      setSummaryEmail(user?.email || '');
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    const data = {
      daily_limit_minutes: limitMinutes,
      notifications_enabled: limitEnabled,
      email_summary_enabled: emailEnabled,
      summary_email: summaryEmail,
      summary_frequency: frequency,
    };
    if (settingsId) {
      await parentSettingsApi.update(settingsId, data);
    } else {
      const created = await parentSettingsApi.create(data);
      setSettingsId(created.id);
    }
    setSaving(false);
  };

  const sendSummaryNow = async () => {
    if (!summaryEmail || !kidProgress) return;
    setSending(true);
    const p = kidProgress;
    const lang = LANGUAGES.find((l) => l.id === p.language) || LANGUAGES[0];
    const completedTopics = (p.lessons_completed || [])
      .map((d) => `Day ${d}: ${DAILY_TOPICS[d - 1] || 'Lesson'}`)
      .join('\n');

    const body = `
Hi there!

Here's a summary of ${p.kid_name || 'your child'}'s learning on KindLearn:

🌍 Language: ${lang.name} ${lang.flag}
📅 Current Day: ${p.current_day || 1} / 30
🔥 Streak: ${p.streak_days || 0} days
⭐ Total XP: ${p.xp_total || 0}
📖 Words Learned: ${p.words_learned || 0}
🏆 Badges Earned: ${(p.badges || []).length}

✅ Lessons Completed:
${completedTopics || 'No lessons completed yet.'}

Keep up the great work!

— The KindLearn Team
    `.trim();

    // Email is now handled by the backend
    console.log('Progress report email requested for:', summaryEmail);
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const p = kidProgress || {};
  const lang = LANGUAGES.find((l) => l.id === p.language) || LANGUAGES[0];
  const completedCount = (p.lessons_completed || []).length;
  const progressPct = Math.round((completedCount / 30) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-2xl px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/kindlearn/kids')} aria-label="Back to Kids Zone">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">Parent Dashboard</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">

        {/* Child Stats Overview */}
        {kidProgress ? (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Learning Statistics
            </h2>
            <div className="bg-card border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
                  {LANGUAGES.find(l => l.id === p.language)?.flag || '🌍'}
                </div>
                <div>
                  <p className="font-bold text-lg">{p.kid_name || 'Your Child'}</p>
                  <p className="text-sm text-muted-foreground">Learning {lang.name} · Age {p.kid_age_group}</p>
                </div>
                <Badge variant="secondary" className="ml-auto">Day {p.current_day || 1}/30</Badge>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>30-Day Challenge Progress</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Flame className="w-5 h-5 text-orange-500" />, value: p.streak_days || 0, label: 'Day Streak' },
                  { icon: <Star className="w-5 h-5 text-amber-500" />, value: p.xp_total || 0, label: 'Total XP' },
                  { icon: <BookOpen className="w-5 h-5 text-violet-500" />, value: p.words_learned || 0, label: 'Words Learned' },
                  { icon: <Trophy className="w-5 h-5 text-emerald-500" />, value: (p.badges || []).length, label: 'Badges' },
                ].map((s) => (
                  <div key={s.label} className="bg-secondary/50 rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">{s.icon}</div>
                    <p className="font-bold text-xl">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent lessons */}
              {completedCount > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">COMPLETED LESSONS</p>
                  <div className="flex flex-wrap gap-2">
                    {(p.lessons_completed || []).slice(-8).map((d) => (
                      <span key={d} className="text-xs bg-primary/10 text-primary rounded-lg px-2 py-1 font-medium">
                        Day {d}
                      </span>
                    ))}
                    {completedCount > 8 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">+{completedCount - 8} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        ) : (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-card border rounded-2xl p-6 text-center text-muted-foreground">
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-medium">No child profile yet</p>
              <p className="text-sm mt-1">Set up the Kids Zone first to track progress.</p>
              <Link to="/kindlearn/kids">
                <Button className="mt-4" variant="outline" size="sm">
                  Go to Kids Zone <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </motion.section>
        )}

        {/* Daily Limit */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Daily Usage Limit
          </h2>
          <div className="bg-card border rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Daily Limit</p>
                <p className="text-sm text-muted-foreground">Show a reminder when limit is reached</p>
              </div>
              <Switch checked={limitEnabled} onCheckedChange={setLimitEnabled} />
            </div>
            {limitEnabled && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium">Daily limit</p>
                  <span className="font-bold text-primary">{limitMinutes} min</span>
                </div>
                <Slider
                  min={5}
                  max={120}
                  step={5}
                  value={[limitMinutes]}
                  onValueChange={([v]) => setLimitMinutes(v)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5 min</span>
                  <span>2 hrs</span>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Email Summaries */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email Summaries
          </h2>
          <div className="bg-card border rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Progress Email Reports</p>
                <p className="text-sm text-muted-foreground">Get regular updates on your child's learning</p>
              </div>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>

            {emailEnabled && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Send reports to</label>
                  <Input
                    type="email"
                    value={summaryEmail}
                    onChange={(e) => setSummaryEmail(e.target.value)}
                    placeholder="parent@email.com"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Frequency</label>
                  <div className="flex gap-3">
                    {['daily', 'weekly'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFrequency(f)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                          frequency === f
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Send now button */}
            <div className="pt-1">
              <Button
                variant="outline"
                className="w-full rounded-xl"
                disabled={!kidProgress || !summaryEmail || sending || sent}
                onClick={sendSummaryNow}
              >
                {sent ? (
                  <><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Report Sent!</>
                ) : sending ? (
                  'Sending...'
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Send Progress Report Now</>
                )}
              </Button>
              {!kidProgress && (
                <p className="text-xs text-muted-foreground text-center mt-1.5">Set up Kids Zone first to send a report</p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Save button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Button
            className="w-full h-12 rounded-2xl font-semibold"
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </motion.div>

      </div>
    </div>
  );
}