// TTS hook using the Web Speech API (SpeechSynthesis)
// Maps language IDs to BCP-47 language codes

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

export function useSpeech(langId) {
  const langCode = LANG_CODES[langId] || 'en-US';

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
}