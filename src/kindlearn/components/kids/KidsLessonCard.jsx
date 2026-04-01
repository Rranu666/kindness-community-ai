import React from 'react';
import { motion } from 'framer-motion';
import { Star, Lock, Play } from 'lucide-react';

const gradients = [
  'from-violet-400 to-purple-500',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-green-500',
  'from-blue-400 to-cyan-500',
  'from-red-400 to-pink-500',
];

export default function KidsLessonCard({ day, title, isCompleted, isCurrent, isLocked, onStart, index }) {
  const gradient = gradients[index % gradients.length];

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.05, y: -4 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={() => !isLocked && onStart(day)}
      disabled={isLocked}
      className={`relative w-full rounded-3xl p-5 text-left transition-all ${
        isLocked ? 'opacity-40 cursor-not-allowed bg-gray-100' : 'cursor-pointer shadow-lg hover:shadow-xl'
      }`}
    >
      <div className={`${isLocked ? '' : `bg-gradient-to-br ${gradient}`} rounded-3xl p-5 ${isLocked ? 'bg-gray-200' : 'text-white'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-fredoka text-sm font-medium opacity-80">Day {day}</span>
          {isCompleted && (
            <div className="flex gap-0.5">
              {[1, 2, 3].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-300 text-amber-300" />
              ))}
            </div>
          )}
          {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
          {isCurrent && (
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Play className="w-6 h-6" />
            </motion.div>
          )}
        </div>
        <h3 className="font-fredoka font-bold text-lg">{title}</h3>
      </div>
    </motion.button>
  );
}