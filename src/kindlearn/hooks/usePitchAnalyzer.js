// Captures dominant pitch (fundamental frequency) from mic using Web Audio API + AnalyserNode
// Returns an array of Hz samples taken while the user is speaking

const FFT_SIZE = 2048;

function getPitch(analyser, sampleRate) {
  const buffer = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buffer);

  // Autocorrelation to find fundamental frequency
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.01) return null; // too quiet / silence

  let r1 = 0, r2 = buffer.length - 1;
  const threshold = 0.2;
  for (let i = 0; i < buffer.length / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) { r1 = i; break; }
  }
  for (let i = 1; i < buffer.length / 2; i++) {
    if (Math.abs(buffer[buffer.length - i]) < threshold) { r2 = buffer.length - i; break; }
  }

  const trimmed = buffer.slice(r1, r2 + 1);
  const c = new Array(trimmed.length).fill(0);
  for (let i = 0; i < trimmed.length; i++) {
    for (let j = 0; j < trimmed.length - i; j++) {
      c[i] += trimmed[j] * trimmed[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxVal = -1, maxPos = -1;
  for (let i = d; i < trimmed.length; i++) {
    if (c[i] > maxVal) { maxVal = c[i]; maxPos = i; }
  }
  if (maxPos < 1) return null;

  // Parabolic interpolation
  const x1 = c[maxPos - 1], x2 = c[maxPos], x3 = maxPos + 1 < c.length ? c[maxPos + 1] : 0;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  const refined = a !== 0 ? maxPos - b / (2 * a) : maxPos;

  return sampleRate / refined;
}

export function usePitchAnalyzer() {
  const isSupported =
    typeof window !== 'undefined' &&
    !!window.AudioContext &&
    !!navigator.mediaDevices?.getUserMedia;

  // Record mic audio and sample pitch continuously for `durationMs`
  const recordPitch = async (durationMs = 3500) => {
    if (!isSupported) return [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    source.connect(analyser);

    const samples = [];
    const interval = setInterval(() => {
      const hz = getPitch(analyser, ctx.sampleRate);
      if (hz && hz > 50 && hz < 1200) samples.push(hz);
    }, 60);

    await new Promise((res) => setTimeout(res, durationMs));
    clearInterval(interval);

    stream.getTracks().forEach((t) => t.stop());
    await ctx.close();
    return samples;
  };

  return { recordPitch, isSupported };
}