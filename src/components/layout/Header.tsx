'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { Zap, Sparkles, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppState } from '@/context/AppStateContext';

export const Header: React.FC = () => {
  const { isSimulatingCall, setActiveTab } = useAppState();

  const handleExportTrigger = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#8b5cf6', '#3b82f6', '#f59e0b'],
    });
    setActiveTab('pdf-exporter');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between no-print print:hidden">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg glow-emerald shadow-emerald-500/20">
          <Zap className="h-5 w-5 text-zinc-950 fill-zinc-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white font-sans">VoiceCraft AI</span>
            <Badge variant="success" className="hidden sm:inline-flex text-[9px] font-mono tracking-wider font-extrabold">
              Thinkly AI
            </Badge>
          </div>
          <p className="text-[10px] text-zinc-500 hidden md:block">
            Voice Agent Engineering Workbench
          </p>
        </div>
      </div>

      {/* Center Live Status Pill */}
      <div className="hidden lg:flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isSimulatingCall ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${isSimulatingCall ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          </span>
          <span className="font-semibold text-zinc-300">
            {isSimulatingCall ? '🎙️ Live Simulating' : '🟢 Engine: Active'}
          </span>
        </div>
        <span className="text-zinc-800">|</span>
        <span className="text-zinc-400 font-mono text-[11px]">
          TTFB: <strong className="text-emerald-400">320ms</strong>
        </span>
        <span className="text-zinc-800">|</span>
        <span className="text-zinc-400 font-mono text-[11px]">
          Hinglish v2.4
        </span>
      </div>

      {/* Right Action */}
      <div className="flex items-center gap-3">
        <Button variant="primary" size="sm" onClick={handleExportTrigger} className="gap-1.5">
          <Sparkles className="h-4 w-4" />
          <span>Export Submission</span>
        </Button>
      </div>
    </header>
  );
};
export default Header;
