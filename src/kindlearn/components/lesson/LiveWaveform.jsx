import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function LiveWaveform({ isRecording }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const micStreamRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!isRecording) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      return;
    }

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyzer = audioContext.createAnalyser();
        analyzerRef.current = analyzer;
        analyzer.fftSize = 256;

        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyzer);

        const draw = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const canvasCtx = canvas.getContext('2d');
          const bufferLength = analyzer.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyzer.getByteFrequencyData(dataArray);

          canvasCtx.fillStyle = 'rgb(255, 255, 255)';
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = 'rgb(123, 58, 237)'; // primary color
          canvasCtx.beginPath();

          const sliceWidth = (canvas.width * 1.0) / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;

            if (i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          canvasCtx.lineTo(canvas.width, canvas.height / 2);
          canvasCtx.stroke();

          animationIdRef.current = requestAnimationFrame(draw);
        };

        draw();
      } catch (err) {
        console.error('Microphone access denied:', err);
      }
    };

    setupAudio();

    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isRecording]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full mt-4 rounded-lg overflow-hidden border border-primary/30 bg-white"
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={120}
        className="w-full"
        aria-label="Audio waveform visualization"
      />
    </motion.div>
  );
}