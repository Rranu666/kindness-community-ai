/**
 * Insights analytics engine.
 *
 * Computes:
 * - Learning velocity (words/day, XP trend)
 * - Category error rates (which vocab themes are hardest)
 * - Activity patterns (best times to practice)
 */

import { FLASHCARD_DECK } from '@/kindlearn/lib/flashcards';

const TODAY = new Date().toISOString().split('T')[0];

/**
 * Compute learning velocity: words learned per day since start
 */
export function getLearningVelocity(progress) {
  if (!progress) return { velocity: 0, trend: 'stable', daysActive: 0 };
  
  const currentDay = progress.current_day || 1;
  const wordsLearned = progress.words_learned || 0;
  const daysActive = Math.max(1, currentDay - 1);
  const velocity = daysActive > 0 ? (wordsLearned / daysActive).toFixed(1) : 0;
  
  // Simplified trend: if velocity >= 3, accelerating; >= 2, stable; else decelerating
  let trend = 'accelerating';
  if (velocity < 2) trend = 'decelerating';
  else if (velocity < 3) trend = 'stable';
  
  return { velocity: parseFloat(velocity), trend, daysActive, wordsLearned };
}

/**
 * Compute error rates by category using struggled_words data + SRS
 * Returns array of { category, errorRate (0-100), missCount, totalInCat, severity }
 */
export function getCategoryErrorRates(progress, srsData, langId) {
  const struggled = progress?.struggled_words || {};
  const fullDeck = FLASHCARD_DECK[langId] || [];
  
  // Group words by category
  const catStats = {}; // category -> { total, missed, errors }
  fullDeck.forEach((card) => {
    const cat = card.category;
    if (!catStats[cat]) catStats[cat] = { total: 0, missed: 0, lowQuality: 0 };
    catStats[cat].total++;
    
    // Count as "missed" if in struggled_words
    if (struggled[card.word]) {
      catStats[cat].missed++;
    }
    
    // Count as "low quality" if SRS quality <= 2 or never seen
    const d = srsData[card.word];
    if (!d || d.lastQuality <= 2) {
      catStats[cat].lowQuality++;
    }
  });
  
  // Calculate error rates: combo of missed + low quality
  const results = Object.entries(catStats)
    .map(([category, stats]) => {
      const errorRate = Math.round(((stats.missed + stats.lowQuality) / (stats.total * 2)) * 100);
      const severity = errorRate >= 60 ? 'critical' : errorRate >= 40 ? 'high' : errorRate >= 20 ? 'medium' : 'low';
      return { category, errorRate: Math.min(100, errorRate), missCount: stats.missed, totalInCat: stats.total, severity };
    })
    .sort((a, b) => b.errorRate - a.errorRate);
  
  return results;
}

/**
 * Infer optimal practice times from lesson completion patterns.
 * Returns { bestHours: [h1, h2, h3], recommendation: string }
 */
export function getOptimalPracticeTimes(progress) {
  // Simplified heuristic: based on current time patterns
  // In a real app, track hourly activity logs
  const streak = progress?.streak_days || 0;
  const currentHour = new Date().getHours();
  
  // General recommendations based on time of day and current hour
  let bestHours = [];
  let recommendation = '';
  
  if (currentHour >= 6 && currentHour < 9) {
    // Morning person
    bestHours = [7, 8, 9];
    recommendation = "You're active in the morning — practice right after breakfast for best retention.";
  } else if (currentHour >= 12 && currentHour < 14) {
    // Midday
    bestHours = [12, 13, 14];
    recommendation = "Lunch break is your sweet spot — quick 10-min sessions work well here.";
  } else if (currentHour >= 18 && currentHour < 21) {
    // Evening
    bestHours = [19, 20, 21];
    recommendation = "Your evening rhythm is strong — leverage this for deeper review sessions.";
  } else {
    // Default: distribute across day
    bestHours = [9, 14, 19];
    recommendation = "Mix morning, afternoon, and evening sessions to reinforce learning.";
  }
  
  if (streak >= 7) {
    recommendation += ' Your streak shows consistency—maintain this momentum!';
  }
  
  return { bestHours, recommendation };
}

/**
 * Generate XP velocity sparkline: trend of daily XP over last 7 days
 * (Note: we only have daily_xp from today; in a real app track per-day history)
 */
export function getXPTrend(progress) {
  const dailyXp = progress?.daily_xp || 0;
  const xpTotal = progress?.xp_total || 0;
  const daysActive = Math.max(1, progress?.current_day || 1);
  const avgDaily = Math.round(xpTotal / daysActive);
  
  return {
    todayXP: dailyXp,
    avgDailyXP: avgDaily,
    totalXP: xpTotal,
    momentum: dailyXp >= avgDaily ? '📈 trending up' : '📉 needs boost',
  };
}

/**
 * Compile all insights into a single object
 */
export function buildInsights(progress, srsData, langId) {
  return {
    velocity: getLearningVelocity(progress),
    categoryErrors: getCategoryErrorRates(progress, srsData, langId),
    optimalTimes: getOptimalPracticeTimes(progress),
    xpTrend: getXPTrend(progress),
  };
}