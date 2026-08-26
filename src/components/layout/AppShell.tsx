'use client';

import React from 'react';
import { Header } from './Header';
import { NavigationTabs } from './NavigationTabs';
import { useAppState } from '@/context/AppStateContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedModel } = useAppState();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header />
      <NavigationTabs />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-4 text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>VoiceCraft Studio v2.4</span> • <span className="text-zinc-400">Forward Deployed AI Engineering Assessment</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Model Config: <strong className="text-violet-400">{selectedModel}</strong></span>
            <span>Locale: <strong className="text-emerald-400">Hinglish / Tanglish</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};
