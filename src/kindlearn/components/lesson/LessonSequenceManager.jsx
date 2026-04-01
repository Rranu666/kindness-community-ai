import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildLessonSequence, generateLessonSummary, QUESTION_TYPES } from '@/kindlearn/lib/lessonEngine';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import FillInBlanksQuestion from './FillInBlanksQuestion';
import SpeakingPractice from './SpeakingPractice';
import ListenQuestion from '@/kindlearn/components/listen/ListenQuestion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function LessonSequenceManager({
  words,
  langId,
  onComplete,
  options = {},
}) {
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const lessonSeq = buildLessonSequence(words, options);
    setSequence(lessonSeq);
  }, [words, options]);

  const handleAnswer = (isCorrect, answer) => {
    const question = sequence[currentIndex];
    setAnswers(prev => [...prev, { question, isCorrect, answer }]);
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentIndex < sequence.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        handleComplete();
      }
    }, 1500);
  };

  const handleSkip = () => {
    if (currentIndex < sequence.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    const summary = generateLessonSummary(words, answers, calculateScore());
    if (onComplete) {
      onComplete(summary, answers);
    }
  };

  const calculateScore = () => {
    if (answers.length === 0) return 0;
    const correct = answers.filter(a => a.isCorrect).length;
    return Math.round((correct / answers.length) * 100);
  };

  if (sequence.length === 0) {
    return <div className="flex items-center justify-center h-64">Loading lesson...</div>;
  }

  if (isComplete) {
    return null; // Parent handles completion UI
  }

  const progress = ((currentIndex + 1) / sequence.length) * 100;
  const currentQuestion = sequence[currentIndex];

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {currentIndex + 1} of {sequence.length}
        </p>
      </div>

      {/* Question content */}
      <AnimatePresence mode="wait">
        {currentQuestion.type === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <span className="text-6xl block mb-4">{currentQuestion.word.audio}</span>
            <h2 className="text-4xl font-extrabold mb-2">{currentQuestion.word.word}</h2>
            <p className="text-xl text-muted-foreground mb-8">{currentQuestion.word.meaning}</p>
            <Button
              onClick={handleSkip}
              className="rounded-2xl"
              size="lg"
            >
              Continue →
            </Button>
          </motion.div>
        )}

        {currentQuestion.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
          <MultipleChoiceQuestion
            key={`mc-${currentIndex}`}
            question={currentQuestion}
            onAnswer={handleAnswer}
            langId={langId}
          />
        )}

        {currentQuestion.type === QUESTION_TYPES.FILL_IN_BLANKS && (
          <FillInBlanksQuestion
            key={`fitb-${currentIndex}`}
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        )}

        {currentQuestion.type === QUESTION_TYPES.VOICE_CHECK && (
          <SpeakingPractice
            key={`voice-${currentIndex}`}
            word={currentQuestion.word}
            langId={langId}
            onSpeak={() => {}}
            onNext={() => handleSkip()}
          />
        )}

        {currentQuestion.type === QUESTION_TYPES.LISTENING && (
          <div key={`listen-${currentIndex}`} className="text-center">
            <ListenQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              langId={langId}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      {currentQuestion.type !== 'intro' && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip this question
          </button>
        </div>
      )}
    </div>
  );
}