import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FillInBlanksQuestion({ question, onAnswer, disabled }) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const normalize = (text) => text.toLowerCase().trim();

  const handleSubmit = () => {
    if (input.trim()) {
      setSubmitted(true);
      const isCorrect = normalize(input) === normalize(question.correctAnswer);
      setFeedback(isCorrect);
      onAnswer(isCorrect, input);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !submitted && input.trim()) {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <p className="text-sm text-muted-foreground mb-6 font-medium">Fill in the blank</p>

      <div className="bg-card rounded-3xl border shadow-lg p-8 mb-6">
        <p className="text-lg mb-6 leading-relaxed">
          {question.sentence.split(question.blank).map((part, idx, arr) => (
            <React.Fragment key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={submitted}
                  placeholder="type here"
                  className="inline-block mx-2 px-3 py-1 border-b-2 border-primary bg-transparent font-semibold text-primary min-w-32 focus:outline-none"
                  autoFocus
                />
              )}
            </React.Fragment>
          ))}
        </p>
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="rounded-2xl"
        >
          Check Answer
        </Button>
      )}

      {submitted && feedback !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-4 p-4 rounded-2xl border-2 ${
            feedback
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {feedback ? (
              <>
                <Check className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-600 font-semibold">Perfect! 🎉</p>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-600 font-semibold">Not quite.</p>
                  <p className="text-xs text-red-600">The answer is: <strong>{question.correctAnswer}</strong></p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}