import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buildDailyPath, getDailyPathHeadline } from '@/kindlearn/lib/dailyPath';
import { ChevronRight, Zap } from 'lucide-react';

const URGENCY_STYLES = {
  high:   'border-rose-200 bg-rose-50',
  medium: 'border-amber-200 bg-amber-50',
  low:    'border-border bg-card',
};

const URGENCY_DOT = {
  high:   'bg-rose-500',
  medium: 'bg-amber-400',
  low:    'bg-emerald-400',
};

const TYPE_ACCENT = {
  lesson:     'text-primary',
  review:     'text-rose-600',
  flashcards: 'text-amber-600',
  listen:     'text-accent',
};

export default function DailyPath({ progress, langId }) {
  const navigate = useNavigate();
  const srsKey = `kindlearn_srs_${langId}`;
  const srsData = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(srsKey) || '{}'); }
    catch { return {}; }
  }, [srsKey]);

  const items = useMemo(() => buildDailyPath(progress, srsData, langId), [progress, srsData, langId]);
  const headline = useMemo(() => getDailyPathHeadline(progress, srsData, langId), [progress, srsData, langId]);

  if (!items.length) return null;

  return (
    <div className="bg-card rounded-2xl border p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-base leading-tight">Daily Path</h3>
          <p className="text-xs text-muted-foreground">{headline}</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.25 }}
            onClick={() => navigate(item.route)}
            className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all hover:shadow-sm hover:-translate-y-px active:translate-y-0 ${URGENCY_STYLES[item.urgency]}`}
          >
            {/* Urgency dot */}
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${URGENCY_DOT[item.urgency]}`} />

            {/* Emoji */}
            <span className="text-xl flex-shrink-0">{item.emoji}</span>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm ${TYPE_ACCENT[item.type]}`}>{item.title}</span>
                {item.badge && (
                  <span className="text-xs font-bold bg-background/70 border rounded-full px-2 py-0.5 text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{item.reason}</p>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-4 pt-3 border-t">
        {[['high', 'Urgent'], ['medium', 'Recommended'], ['low', 'Optional']].map(([u, label]) => (
          <div key={u} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`w-2 h-2 rounded-full ${URGENCY_DOT[u]}`} />
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}