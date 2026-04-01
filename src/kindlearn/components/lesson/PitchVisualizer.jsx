import React from 'react';

// Renders a small SVG line chart comparing user pitch samples vs a reference band
export default function PitchVisualizer({ userSamples = [], referenceSamples = [] }) {
  if (userSamples.length < 2) return null;

  const W = 260;
  const H = 56;
  const PAD = 6;

  const allSamples = [...userSamples, ...referenceSamples];
  const minHz = Math.min(...allSamples) * 0.9;
  const maxHz = Math.max(...allSamples) * 1.1;

  const toX = (i, total) => PAD + ((i / Math.max(total - 1, 1)) * (W - PAD * 2));
  const toY = (hz) => H - PAD - ((hz - minHz) / (maxHz - minHz)) * (H - PAD * 2);

  const polyline = (samples) =>
    samples.map((hz, i) => `${toX(i, samples.length)},${toY(hz)}`).join(' ');

  return (
    <div className="mt-3">
      <p className="text-xs text-muted-foreground mb-1 font-medium">Pitch contour</p>
      <div className="bg-muted/40 rounded-xl overflow-hidden border border-border/50 p-1">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Reference band (TTS) */}
          {referenceSamples.length >= 2 && (
            <polyline
              points={polyline(referenceSamples)}
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.7"
            />
          )}
          {/* User pitch line */}
          <polyline
            points={polyline(userSamples)}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex items-center gap-4 px-2 pb-1">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="inline-block w-4 h-0.5 bg-primary rounded" /> You
          </span>
          {referenceSamples.length >= 2 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="inline-block w-4 border-t-2 border-dashed border-accent" /> Native
            </span>
          )}
        </div>
      </div>
    </div>
  );
}