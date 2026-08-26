'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DynamicWaveformProps {
  speakerState: 'user' | 'agent' | 'idle' | 'calling';
}

export const DynamicWaveform: React.FC<DynamicWaveformProps> = ({ speakerState }) => {
  const [bars, setBars] = useState<number[]>(Array.from({ length: 24 }, () => 6));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (speakerState === 'idle') {
      setBars(Array.from({ length: 24 }, () => 4));
    } else if (speakerState === 'calling') {
      // Gentle breathing wave
      let step = 0;
      interval = setInterval(() => {
        setBars(
          Array.from({ length: 24 }, (_, i) => {
            const cycle = Math.sin(step + i * 0.4) * 8 + 12;
            return Math.max(6, cycle);
          })
        );
        step += 0.2;
      }, 100);
    } else {
      // Speaking state - rapid oscillations
      const maxVal = speakerState === 'user' ? 32 : 24;
      interval = setInterval(() => {
        setBars(
          Array.from({ length: 24 }, () =>
            Math.max(6, Math.floor(Math.random() * maxVal) + 4)
          )
        );
      }, 70);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [speakerState]);

  const getColorClass = () => {
    switch (speakerState) {
      case 'user':
        return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
      case 'agent':
        return 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]';
      case 'calling':
        return 'bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      default:
        return 'bg-zinc-700';
    }
  };

  return (
    <div className="h-16 flex items-center justify-center gap-1 bg-zinc-950/60 rounded-xl border border-zinc-800/80 px-6 py-2">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className={`w-[3px] rounded-full transition-colors duration-200 ${getColorClass()}`}
          animate={{ height }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        />
      ))}
    </div>
  );
};
export default DynamicWaveform;
