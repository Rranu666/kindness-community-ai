// Vocabulary tracking and spaced repetition for learned words
import { DAILY_TOPICS } from './languages';

const SRS_INTERVALS = [1, 3, 7, 14, 30]; // Days between reviews

export function buildVocabularyFromLessons(langId) {
  // Build vocabulary from the known lesson words for each language
  const LESSON_WORDS = {
    spanish: [
      { word: 'Hola', meaning: 'Hello', lesson: 1 },
      { word: 'Gracias', meaning: 'Thank you', lesson: 1 },
      { word: 'Por favor', meaning: 'Please', lesson: 1 },
      { word: 'Buenos días', meaning: 'Good morning', lesson: 1 },
      { word: 'Adiós', meaning: 'Goodbye', lesson: 2 },
      { word: 'Sí', meaning: 'Yes', lesson: 2 },
      { word: 'No', meaning: 'No', lesson: 2 },
      { word: 'Amigo', meaning: 'Friend', lesson: 2 },
    ],
    french: [
      { word: 'Bonjour', meaning: 'Hello', lesson: 1 },
      { word: 'Merci', meaning: 'Thank you', lesson: 1 },
      { word: "S'il vous plaît", meaning: 'Please', lesson: 1 },
      { word: 'Bonsoir', meaning: 'Good evening', lesson: 1 },
      { word: 'Au revoir', meaning: 'Goodbye', lesson: 2 },
      { word: 'Oui', meaning: 'Yes', lesson: 2 },
      { word: 'Non', meaning: 'No', lesson: 2 },
      { word: 'Ami', meaning: 'Friend', lesson: 2 },
    ],
  };

  return LESSON_WORDS[langId] || LESSON_WORDS.spanish;
}

export function initializeVocabularySRS(words) {
  // Initialize SRS data structure for vocabulary words
  return words.reduce((acc, word) => {
    acc[word.word] = {
      ...word,
      interval: 0, // Current interval in days
      nextReview: new Date().toISOString().split('T')[0], // Next review date
      reviewCount: 0,
      correctCount: 0,
      isMastered: false,
      lastReviewDate: null,
    };
    return acc;
  }, {});
}

export function calculateNextReview(correctCount) {
  // Calculate next review date based on correct answer streak
  const intervalIndex = Math.min(correctCount, SRS_INTERVALS.length - 1);
  const days = SRS_INTERVALS[intervalIndex];
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().split('T')[0];
}

export function getVocabularyDueForReview(vocabularySRS, today = null) {
  // Get all vocabulary items due for review
  const reviewDate = today || new Date().toISOString().split('T')[0];
  return Object.entries(vocabularySRS)
    .filter(([_, item]) => !item.isMastered && item.nextReview <= reviewDate)
    .map(([key, item]) => ({ ...item, id: key }));
}

export function updateVocabularyProgress(vocabularySRS, wordKey, isCorrect) {
  // Update SRS data after a review attempt
  const item = vocabularySRS[wordKey];
  if (!item) return vocabularySRS;

  const updated = { ...item, reviewCount: item.reviewCount + 1 };

  if (isCorrect) {
    updated.correctCount = updated.correctCount + 1;
    updated.interval = calculateNextReview(updated.correctCount);
    updated.nextReview = calculateNextReview(updated.correctCount);
  } else {
    updated.correctCount = 0;
    updated.nextReview = new Date().toISOString().split('T')[0]; // Review again today
  }

  updated.lastReviewDate = new Date().toISOString().split('T')[0];

  // Mark as mastered after 3 correct answers
  if (updated.correctCount >= 3) {
    updated.isMastered = true;
  }

  return {
    ...vocabularySRS,
    [wordKey]: updated,
  };
}

export function getVocabularyStats(vocabularySRS) {
  // Calculate statistics for vocabulary progress
  const items = Object.values(vocabularySRS);
  const totalWords = items.length;
  const masteredWords = items.filter((w) => w.isMastered).length;
  const reviewedWords = items.filter((w) => w.reviewCount > 0).length;
  const dueForReview = items.filter((w) => !w.isMastered && w.nextReview <= new Date().toISOString().split('T')[0]).length;

  return {
    totalWords,
    masteredWords,
    reviewedWords,
    dueForReview,
    masteryPercentage: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0,
  };
}