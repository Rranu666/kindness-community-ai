import React from 'react';
import { motion } from 'framer-motion';
import { KIDS_AVATARS } from '@/kindlearn/lib/languages';

export default function AvatarPicker({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {KIDS_AVATARS.map((avatar) => (
        <motion.button
          key={avatar.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(avatar.id)}
          className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
            selected === avatar.id
              ? 'bg-violet-100 ring-4 ring-violet-300 shadow-lg'
              : 'bg-white hover:bg-violet-50'
          }`}
        >
          <span className="text-4xl">{avatar.emoji}</span>
          <span className="font-fredoka text-xs font-medium text-violet-700">{avatar.name}</span>
        </motion.button>
      ))}
    </div>
  );
}