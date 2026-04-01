import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Layers } from 'lucide-react';

export default function ReviewEmpty({ langId, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="text-6xl mb-4">🧠✨</div>
      <h2 className="text-2xl font-extrabold mb-2">Nothing to review!</h2>
      <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
        You haven't struggled with any words yet — or you've mastered them all. Complete some lessons and come back!
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Button onClick={() => onNavigate(`/dashboard?lang=${langId}`)} className="rounded-2xl gap-2">
          <Play className="w-4 h-4" /> Go to Lessons
        </Button>
        <Button variant="outline" onClick={() => onNavigate(`/flashcards?lang=${langId}`)} className="rounded-2xl gap-2">
          <Layers className="w-4 h-4" /> Try Flashcards
        </Button>
      </div>
    </motion.div>
  );
}