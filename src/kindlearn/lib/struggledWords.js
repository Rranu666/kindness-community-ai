/**
 * Utilities for tracking and surfacing words the learner struggles with.
 *
 * struggled_words is stored on UserProgress as a plain object:
 *   { [wordKey]: missCount }
 *
 * wordKey = the foreign-language word (e.g. "Gato", "Bonjour").
 */

/**
 * Record a missed word — increments its miss count.
 * Returns a new struggled_words object (does not mutate).
 */
export function recordMiss(struggledWords = {}, wordKey) {
  return {
    ...struggledWords,
    [wordKey]: (struggledWords[wordKey] || 0) + 1,
  };
}

/**
 * Record a correct answer — decrements miss count (min 0), removes if reaches 0.
 * Returns a new struggled_words object.
 */
export function recordHit(struggledWords = {}, wordKey) {
  if (!struggledWords[wordKey]) return struggledWords;
  const newCount = struggledWords[wordKey] - 1;
  const updated = { ...struggledWords };
  if (newCount <= 0) {
    delete updated[wordKey];
  } else {
    updated[wordKey] = newCount;
  }
  return updated;
}

/**
 * Given a full word list and the struggled_words map, return a reordered list
 * where the most-struggled words appear first (up to maxReview items),
 * each tagged with { ...word, isReview: true }.
 * The rest of the original list follows (without duplicates).
 */
export function buildWordListWithReviews(allWords, struggledWords = {}, getKey, maxReview = 2) {
  if (!struggledWords || Object.keys(struggledWords).length === 0) return allWords;

  // Sort struggled words by miss count descending
  const sorted = Object.entries(struggledWords)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  const reviewWords = [];
  for (const [wordKey] of sorted) {
    if (reviewWords.length >= maxReview) break;
    const match = allWords.find((w) => getKey(w) === wordKey);
    if (match) reviewWords.push({ ...match, isReview: true });
  }

  // Remove reviews from the main list to avoid showing the same word twice in a row
  const reviewKeys = new Set(reviewWords.map((w) => getKey(w)));
  const rest = allWords.filter((w) => !reviewKeys.has(getKey(w)));

  return [...reviewWords, ...rest];
}