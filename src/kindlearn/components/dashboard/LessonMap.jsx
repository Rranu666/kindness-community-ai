import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Play, Star } from 'lucide-react';
import { DAILY_TOPICS } from '@/kindlearn/lib/languages';

export default function LessonMap({ currentDay, completedLessons, onStartLesson }) {
  const completed = completedLessons || [];

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg mb-4">30-Day Journey</h3>
      <div className="grid grid-cols-5 md:grid-cols-6 gap-3">
        {DAILY_TOPICS.map((topic, i) => {
          const day = i + 1;
          const isCompleted = completed.includes(day);
          const isCurrent = day === currentDay;
          const isLocked = day > currentDay;

          return (
            <motion.button
              key={day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => !isLocked && onStartLesson(day)}
              disabled={isLocked}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center text-center p-1 transition-all ${
                isCompleted
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : isCurrent
                  ? 'bg-primary/10 border-2 border-primary text-primary ring-4 ring-primary/10'
                  : isLocked
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  : 'bg-card border hover:bg-secondary cursor-pointer'
              }`}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : isCurrent ? (
                <Play className="w-5 h-5" />
              ) : isLocked ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Star className="w-4 h-4" />
              )}
              <span className="text-[9px] md:text-[10px] font-bold mt-0.5">{day}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}