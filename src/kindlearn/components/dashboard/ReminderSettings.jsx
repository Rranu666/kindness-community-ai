import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Clock, Mail, Check, ChevronDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { progressApi } from '@/kindlearn/api/progress';

const QUICK_TIMES = ['07:00', '08:00', '09:00', '12:00', '18:00', '20:00', '21:00'];

// Convert local HH:MM to UTC HH:MM string
function toUTC(localTime, tzOffset) {
  const [h, m] = localTime.split(':').map(Number);
  const utcH = ((h - tzOffset) % 24 + 24) % 24;
  return `${String(utcH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Get browser timezone offset in hours
function getTZOffset() {
  return -new Date().getTimezoneOffset() / 60;
}

// Format UTC time back to local for display
function toLocal(utcTime, tzOffset) {
  const [h, m] = utcTime.split(':').map(Number);
  const localH = ((h + tzOffset) % 24 + 24) % 24;
  return `${String(localH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function ReminderSettings({ progress, onUpdate }) {
  const tzOffset = getTZOffset();

  const [enabled, setEnabled] = useState(progress?.reminder_enabled || false);
  // Display in local time; stored as UTC
  const storedUTC = progress?.reminder_time || '09:00';
  const [localTime, setLocalTime] = useState(toLocal(storedUTC, tzOffset));
  const [email, setEmail] = useState(progress?.reminder_email || progress?.created_by || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!progress?.id) return;
    setSaving(true);
    const utcTime = toUTC(localTime, tzOffset);
    const update = {
      reminder_enabled: enabled,
      reminder_time: utcTime,
      reminder_email: email,
      reminder_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    await progressApi.update(progress.id, update);
    onUpdate(update);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-card rounded-2xl border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          {enabled ? (
            <Bell className="w-5 h-5 text-primary" />
          ) : (
            <BellOff className="w-5 h-5 text-muted-foreground" />
          )}
          Daily Reminder
        </h3>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label="Toggle daily reminder"
        />
      </div>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-1">
              {/* Time picker */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2">
                  <Clock className="w-3.5 h-3.5" /> Reminder time (your local time)
                </label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {QUICK_TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setLocalTime(t)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                        localTime === t
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary border-transparent hover:border-primary/30'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="time"
                  value={localTime}
                  onChange={(e) => setLocalTime(e.target.value)}
                  className="border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2">
                  <Mail className="w-3.5 h-3.5" /> Send reminder to
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                📧 We'll send you a daily email reminder at your preferred time. Skip a day and your streak resets!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
          saved
            ? 'bg-emerald-500 text-white'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {saving ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : saved ? (
          <><Check className="w-4 h-4" /> Saved!</>
        ) : (
          'Save Reminder'
        )}
      </button>
    </div>
  );
}