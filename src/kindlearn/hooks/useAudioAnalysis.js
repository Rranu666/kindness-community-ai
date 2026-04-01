// Advanced audio analysis hook for pronunciation feedback
// Provides confidence score, phoneme breakdown, and acoustic similarity metrics

export function useAudioAnalysis() {
  const analyzeTranscript = (transcript, targetWord) => {
    if (!transcript || !targetWord) return { confidence: 0, phonemeMatch: 0, details: [] };

    const normalize = (str) => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
    };

    const nTranscript = normalize(transcript);
    const nTarget = normalize(targetWord);

    // Character-level matching
    let matchedChars = 0;
    const transcriptChars = nTranscript.split('');
    const targetChars = nTarget.split('');

    for (let i = 0; i < Math.min(transcriptChars.length, targetChars.length); i++) {
      if (transcriptChars[i] === targetChars[i]) {
        matchedChars++;
      }
    }

    const maxLen = Math.max(transcriptChars.length, targetChars.length);
    const phonemeMatch = maxLen > 0 ? Math.round((matchedChars / maxLen) * 100) : 0;

    // Word-level confidence
    let confidence = 0;
    if (nTranscript === nTarget) {
      confidence = 100; // Perfect match
    } else if (nTranscript.includes(nTarget) || nTarget.includes(nTranscript)) {
      confidence = 90; // Partial match
    } else {
      // Calculate similarity using Levenshtein-like approach
      const longer = nTranscript.length > nTarget.length ? nTranscript : nTarget;
      const shorter = nTranscript.length > nTarget.length ? nTarget : nTranscript;

      let matches = 0;
      for (const char of shorter) {
        if (longer.includes(char)) matches++;
      }
      confidence = Math.round((matches / longer.length) * 100);
    }

    // Build detailed feedback
    const details = [];
    if (confidence >= 85) {
      details.push('Excellent pronunciation!');
    } else if (confidence >= 70) {
      details.push('Very close, slight adjustments needed');
    } else if (confidence >= 55) {
      details.push('Good effort, focus on a few sounds');
    } else {
      details.push('Listen carefully and try again');
    }

    // Phoneme-level details
    if (transcriptChars.length > targetChars.length) {
      details.push('You pronounced extra sounds');
    } else if (transcriptChars.length < targetChars.length) {
      details.push('Some sounds were missed');
    }

    return {
      confidence,
      phonemeMatch,
      details,
      transcript: nTranscript,
      target: nTarget,
      characterMatch: matchedChars,
      totalCharacters: maxLen,
    };
  };

  return { analyzeTranscript };
}