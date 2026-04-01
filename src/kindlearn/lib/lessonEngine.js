// Lesson engine that manages different question types and lesson flow

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  FILL_IN_BLANKS: 'fill_in_blanks',
  VOICE_CHECK: 'voice_check',
  LISTENING: 'listening',
};

// Generate multiple choice question
export const generateMultipleChoice = (word, allWords) => {
  const correctAnswer = word.meaning;
  const distractors = allWords
    .filter(w => w.id !== word.id && w.meaning !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => w.meaning);

  const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

  return {
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    question: word.word,
    options,
    correctAnswer,
    word,
  };
};

// Generate fill-in-the-blanks question
export const generateFillInBlanks = (word) => {
  const sentence = word.example || `The word "${word.word}" means ___.`;
  const blank = '___';
  
  return {
    type: QUESTION_TYPES.FILL_IN_BLANKS,
    sentence,
    blank,
    correctAnswer: word.meaning.toLowerCase(),
    word,
  };
};

// Generate voice check (pronunciation)
export const generateVoiceCheck = (word) => {
  return {
    type: QUESTION_TYPES.VOICE_CHECK,
    word: word.word,
    meaning: word.meaning,
    correctWord: word.word,
    word: word,
  };
};

// Generate listening quiz
export const generateListeningQuiz = (word, allWords) => {
  const correctAnswer = word.meaning;
  const distractors = allWords
    .filter(w => w.id !== word.id && w.meaning !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => ({ word: w.word, meaning: w.meaning, isCorrect: false }));

  const options = [
    { word: word.word, meaning: correctAnswer, isCorrect: true },
    ...distractors,
  ].sort(() => Math.random() - 0.5);

  return {
    type: QUESTION_TYPES.LISTENING,
    correctWord: word.word,
    options,
    word,
  };
};

// Build lesson sequence from words
export const buildLessonSequence = (words, options = {}) => {
  const { includeVoice = true, includeListening = true, includeFillBlanks = true } = options;
  const sequence = [];

  words.forEach((word, idx) => {
    // Word introduction
    sequence.push({
      type: 'intro',
      word,
    });

    // Voice pronunciation check (optional)
    if (includeVoice) {
      sequence.push(generateVoiceCheck(word));
    }

    // Multiple choice question
    sequence.push(generateMultipleChoice(word, words));

    // Fill-in-the-blanks (optional)
    if (includeFillBlanks && word.example) {
      sequence.push(generateFillInBlanks(word));
    }

    // Listening quiz (optional)
    if (includeListening) {
      sequence.push(generateListeningQuiz(word, words));
    }
  });

  return sequence;
};

// Calculate score from answers
export const calculateScore = (answers) => {
  if (answers.length === 0) return 0;
  const correct = answers.filter(a => a.isCorrect).length;
  return Math.round((correct / answers.length) * 100);
};

// Generate lesson summary
export const generateLessonSummary = (words, answers, score) => {
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const xpEarned = Math.round(score / 10) + 20;
  
  return {
    score,
    xpEarned,
    correctAnswers,
    totalQuestions: answers.length,
    wordsLearned: words.length,
    timeSpent: 0, // will be calculated in component
  };
};