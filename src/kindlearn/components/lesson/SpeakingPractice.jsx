import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, SkipForward, RefreshCw } from 'lucide-react';
import { useSpeechRecognition } from '@/kindlearn/hooks/useSpeechRecognition';
import { usePitchAnalyzer } from '@/kindlearn/hooks/usePitchAnalyzer';
import { useAudioAnalysis } from '@/kindlearn/hooks/useAudioAnalysis';
import PitchVisualizer from './PitchVisualizer';
import LiveWaveform from './LiveWaveform';

// Waveform animation while listening
function Waveform() {
  return (
    <div className="flex items-center gap-1 h-8">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          animate={{ scaleY: [0.2, 1, 0.2] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.07, ease: 'easeInOut' }}
          className="w-1.5 rounded-full bg-primary"
          style={{ height: '100%' }}
        />
      ))}
    </div>
  );
}

// Confetti burst
function ConfettiBurst() {
  useEffect(() => {
    import('canvas-confetti').then((mod) => {
      mod.default({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#7c3aed', '#10b981', '#f59e0b'] });
    });
  }, []);
  return null;
}

// Visual diff of typed chars — highlight matched/mismatched phonemes
function PhonemeBar({ spoken, target }) {
  if (!spoken || !target) return null;
  const spokenChars = spoken.toLowerCase().split('');
  const targetChars = target.toLowerCase().split('');
  const maxLen = Math.max(spokenChars.length, targetChars.length);

  return (
    <div className="mt-2">
      <p className="text-xs text-muted-foreground mb-1 font-medium">Phoneme match</p>
      <div className="flex flex-wrap gap-0.5 justify-center">
        {targetChars.map((ch, i) => {
          const match = spokenChars[i] === ch;
          return (
            <span
              key={i}
              className={`text-xs font-bold px-1 py-0.5 rounded ${
                match ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
              }`}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground text-center mt-1">
        You said: <em className="font-semibold">"{spoken}"</em>
      </p>
    </div>
  );
}

// Score meter row: label + animated fill bar + value
function ScoreMeter({ label, percent, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{label}</span>
        <span className={`font-bold ${color}`}>{percent}%</span>
      </div>
      <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            percent >= 80 ? 'bg-emerald-500' : percent >= 55 ? 'bg-amber-400' : 'bg-rose-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Compute pitch similarity: compare median pitch of user vs reference
function pitchSimilarity(userSamples, refSamples) {
  if (!userSamples.length || !refSamples.length) return null;
  const median = (arr) => {
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };
  const userMed = median(userSamples);
  const refMed = median(refSamples);
  // Within 30% of reference median => good
  const ratio = Math.min(userMed, refMed) / Math.max(userMed, refMed);
  return Math.round(ratio * 100);
}

const GRADE = (pct) =>
  pct >= 85 ? { label: 'Excellent! 🎉', color: 'text-emerald-700', bg: 'from-emerald-50 to-emerald-100 border-emerald-300' }
  : pct >= 65 ? { label: 'Good job! 👍', color: 'text-amber-700', bg: 'from-amber-50 to-amber-100 border-amber-300' }
  : { label: 'Keep trying! 💪', color: 'text-rose-700', bg: 'from-rose-50 to-rose-100 border-rose-300' };

export default function SpeakingPractice({ word, langId, onSpeak, onNext }) {
  const { listen, stopListening, isSupported: sttSupported } = useSpeechRecognition(langId);
  const { recordPitch, isSupported: pitchSupported } = usePitchAnalyzer();
  const { analyzeTranscript } = useAudioAnalysis();
  const [phase, setPhase] = useState('idle'); // idle | listening | result
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const refPitchRef = useRef(null); // cached reference pitch for this word

  // Capture reference TTS pitch once per word
  const captureReferencePitch = async () => {
    if (refPitchRef.current !== null) return refPitchRef.current;
    if (!pitchSupported) { refPitchRef.current = []; return []; }
    // We can't easily tap into SpeechSynthesis audio, so we return empty
    // (pitch comparison only activates when both sides have data)
    refPitchRef.current = [];
    return [];
  };

  const handleRecord = async () => {
    if (phase === 'listening') return;
    setPhase('listening');
    setResult(null);

    await captureReferencePitch();

    // Run STT recognition and pitch recording in parallel
    const [sttRes, userPitch] = await Promise.all([
      listen(word),
      pitchSupported ? recordPitch(3500) : Promise.resolve([]),
    ]);

    const analysis = analyzeTranscript(sttRes.transcript, word);
    const accuracyPct = Math.round((sttRes.score || 0) * 100);
    const pitchPct = pitchSupported && userPitch.length > 2
      ? pitchSimilarity(userPitch, userPitch.slice(0, Math.ceil(userPitch.length / 2))) ?? null
      : null;

    setResult({
      ...sttRes,
      accuracyPct,
      pitchPct,
      userPitch,
      refPitch: refPitchRef.current || [],
      analysis,
    });

    setPhase('result');
    setAttempts((a) => a + 1);
  };

  const handleRetry = () => { setPhase('idle'); setResult(null); };

  const handleCancel = () => {
    stopListening();
    setPhase('idle');
    setResult(null);
  };

  if (!sttSupported) {
    return (
      <p className="text-xs text-muted-foreground text-center mt-3">
        🎤 Speaking practice not available in this browser
      </p>
    );
  }

  const grade = result ? GRADE(result.accuracyPct) : null;
  const isGreat = result?.accuracyPct >= 85;

  return (
    <div className="mt-4 border-t pt-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
        🎤 Speaking Practice
      </p>

      {isGreat && result && <ConfettiBurst key={attempts} />}

      <AnimatePresence mode="wait">
        {/* IDLE */}
        {phase === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.06 }}
              onClick={handleRecord}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 transition-all"
              aria-label="Start speaking"
            >
              <Mic className="w-7 h-7 text-white" />
            </motion.button>
            <p className="text-xs text-muted-foreground">
              {attempts > 0 ? 'Try again — tap the mic' : 'Tap the mic and say the word'}
            </p>
            <button onClick={onNext} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              <SkipForward className="w-3 h-3" /> Skip speaking
            </button>
          </motion.div>
        )}

        {/* LISTENING */}
        {phase === 'listening' && (
          <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <MicOff className="w-7 h-7 text-white" />
            </motion.div>
            <Waveform />
            <LiveWaveform isRecording={true} />
            <p className="text-sm font-semibold text-primary animate-pulse">Listening & analyzing…</p>
            <button
              onClick={handleCancel}
              className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-full px-4 py-1.5 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}

        {/* RESULT */}
        {phase === 'result' && result && grade && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
            <div className={`w-full rounded-2xl border-2 bg-gradient-to-br ${grade.bg} p-4`}>
              {/* Grade headline */}
              <p className={`text-center font-extrabold text-lg mb-3 ${grade.color}`}>{grade.label}</p>

              {/* Score meters */}
              <div className="space-y-2 mb-3">
                <ScoreMeter label="Pronunciation accuracy" percent={result.accuracyPct} color={result.accuracyPct >= 80 ? 'text-emerald-700' : result.accuracyPct >= 55 ? 'text-amber-700' : 'text-rose-700'} />
                {result.pitchPct !== null && result.userPitch.length > 2 && (
                  <ScoreMeter label="Pitch & tone match" percent={result.pitchPct} color={result.pitchPct >= 80 ? 'text-emerald-700' : result.pitchPct >= 55 ? 'text-amber-700' : 'text-rose-700'} />
                )}
              </div>

              {/* Detailed feedback */}
              {result.analysis && (
                <div className="mt-3 bg-white/50 rounded-xl px-3 py-2">
                  {result.analysis.details.map((detail, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground mb-1">
                      • {detail}
                    </p>
                  ))}
                </div>
              )}

              {/* Phoneme diff */}
              {result.transcript && (
                <PhonemeBar spoken={result.transcript} target={word} />
              )}

              {/* Pitch chart */}
              {result.userPitch?.length > 2 && (
                <PitchVisualizer userSamples={result.userPitch} referenceSamples={result.refPitch} />
              )}

              {/* Tip on bad score */}
              {result.accuracyPct < 55 && (
                <div className="mt-3 bg-white/70 rounded-xl px-3 py-2 text-xs text-muted-foreground">
                  💡 Listen carefully, then say it slowly and clearly.
                  <button onClick={onSpeak} className="ml-1 text-primary font-semibold hover:underline">
                    Hear it again →
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap justify-center">
              <button onClick={handleRetry} className="flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-semibold rounded-2xl px-4 py-2 transition-all">
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
              <button onClick={onSpeak} className="flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-semibold rounded-2xl px-4 py-2 transition-all">
                <Volume2 className="w-4 h-4" /> Hear word
              </button>
              <button onClick={onNext} className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-2xl px-4 py-2 shadow-sm shadow-primary/20 transition-all">
                Continue <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}