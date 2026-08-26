'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { Zap, Sparkles, Activity, Download } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 shadow-lg shadow-emerald-950/50">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">VoiceCraft Studio</span>
              <Badge variant="emerald" className="hidden sm:inline-flex gap-1 text-[10px]">
                <Sparkles className="h-3 w-3" /> YC S24 | Voice Agent Workbench
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 hidden md:block">
              Conversational Voice Engineering & Prompt Compiler
            </p>
          </div>
        </div>

        {/* Center Live Status */}
        <div className="hidden lg:flex items-center gap-3 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isSimulatingCall ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${isSimulatingCall ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            </span>
            <span className="font-medium text-zinc-200">
              {isSimulatingCall ? '🎙️ Live Simulation In-Progress' : '🟢 Pipeline Engine: Active'}
            </span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Activity className="h-3.5 w-3.5 text-violet-400" />
            <span>Avg Latency: <strong className="text-emerald-400 font-mono">320ms</strong></span>
          </div>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <Button variant="emerald" size="sm" onClick={handleExportTrigger}>
            <Download className="h-4 w-4" />
            <span>Export Submission</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
