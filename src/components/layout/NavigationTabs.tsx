'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Cpu,
  GitCompare,
  ShieldAlert,
  BarChart3,
  Mic,
  FileCheck2,
} from 'lucide-react';
import { TabType } from '@/types';
import { useAppState } from '@/context/AppStateContext';

interface TabItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const TABS: TabItem[] = [
  { id: 'overview', label: 'Overview & Task Context', icon: LayoutDashboard },
  { id: 'templatizer', label: 'Prompt Templatizer (Prob 1 & 2)', icon: Cpu },
  { id: 'cross-sell', label: 'Multi-Product Cross-Sell (Prob 3)', icon: GitCompare },
  { id: 'missing-blocks', label: 'Production Blocks (Part 2)', icon: ShieldAlert, badge: '4 Core' },
  { id: 'evaluation', label: 'Evaluation & Metrics (Part 3)', icon: BarChart3 },
  { id: 'simulator', label: 'Live Call Simulator', icon: Mic, badge: 'Interactive' },
  { id: 'pdf-exporter', label: 'Submission Document Hub', icon: FileCheck2 },
];

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useAppState();

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-2 overflow-x-auto py-2.5 no-scrollbar" aria-label="Tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-lg bg-zinc-800/90 shadow-sm border border-zinc-700/60"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  {tab.label}
                  {tab.badge && (
                    <span
                      className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
