// Speech-to-text hook using the Web Speech API (SpeechRecognition)
// Returns recording state, transcript, and feedback for pronunciation practice

const LANG_CODES = {
  spanish: 'es-ES',
  french: 'fr-FR',
  german: 'de-DE',
  japanese: 'ja-JP',
  korean: 'ko-KR',
  italian: 'it-IT',
  portuguese: 'pt-BR',
  mandarin: 'zh-CN',
};

// Normalize text for loose comparison
// Keeps CJK, Hangul, Hiragana, Katakana intact; strips accents from Latin
function normalize(str) {
  // For non-Latin scripts (Japanese, Korean, Chinese), keep original characters
  // For Latin scripts, strip diacritics and punctuation
  const hasCJK = /[\u3000-\u9fff\uac00-\ud7af\uf900-\ufaff]/.test(str);
  if (hasCJK) {
    return str.trim().toLowerCase();
  }
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

// Score how similar two strings are (simple character overlap ratio)
function similarityScore(a, b) {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  if (!na || !nb) return 0;

  // Check if the target appears inside the spoken text or vice versa
  if (na.includes(nb) || nb.includes(na)) return 0.9;

  // Count matching chars
  let matches = 0;
  const shorter = na.length < nb.length ? na : nb;
  const longer = na.length < nb.length ? nb : na;
  for (const ch of shorter) {
    if (longer.includes(ch)) matches++;
  }
  return matches / longer.length;
}

export function useSpeechRecognition(langId) {
  const langCode = LANG_CODES[langId] || 'en-US';
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Store active recognition instance so it can be cancelled
  let activeRec = null;

  const stopListening = () => {
    if (activeRec) {
      try { activeRec.stop(); } catch (_) {}
      activeRec = null;
    }
  };

  const listen = (targetWord) => {
    return new Promise((resolve) => {
      if (!isSupported) {
        resolve({ success: false, transcript: '', feedback: 'not_supported' });
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      activeRec = rec;
      rec.lang = langCode;
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      rec.continuous = false;

      rec.onresult = (e) => {
        activeRec = null;
        const alternatives = Array.from(e.results[0]);
        const transcripts = alternatives.map((alt) => alt.transcript.trim());
        const bestTranscript = transcripts[0] || '';

        // Score all alternatives, pick best match
        const scores = transcripts.map((t) => similarityScore(t, targetWord));
        const bestScore = Math.max(...scores);

        let feedback;
        if (bestScore >= 0.85) feedback = 'great';
        else if (bestScore >= 0.55) feedback = 'close';
        else feedback = 'try_again';

        resolve({ success: bestScore >= 0.55, transcript: bestTranscript, feedback, score: bestScore });
      };

      rec.onerror = (e) => {
        activeRec = null;
        if (e.error === 'no-speech') {
          resolve({ success: false, transcript: '', feedback: 'no_speech' });
        } else if (e.error === 'aborted') {
          resolve({ success: false, transcript: '', feedback: 'cancelled' });
        } else {
          resolve({ success: false, transcript: '', feedback: 'error' });
        }
      };

      rec.onend = () => {
        activeRec = null;
      };

      rec.start();

      // Safety timeout after 6s
      setTimeout(() => {
        try { if (activeRec) { activeRec.stop(); activeRec = null; } } catch (_) {}
      }, 6000);
    });
  };

  return { listen, stopListening, isSupported };
}
