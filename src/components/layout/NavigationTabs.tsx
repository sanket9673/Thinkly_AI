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
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'templatizer', label: 'Templatizer', icon: Cpu, badge: 'Part 1' },
  { id: 'cross-sell', label: 'Cross-Sell', icon: GitCompare, badge: 'Part 1' },
  { id: 'missing-blocks', label: 'Production Blocks', icon: ShieldAlert, badge: 'Part 2' },
  { id: 'evaluation', label: 'Evaluation & Metrics', icon: BarChart3, badge: 'Part 3' },
  { id: 'simulator', label: 'Live Simulator', icon: Mic, badge: 'Live' },
  { id: 'pdf-exporter', label: 'Submission Hub', icon: FileCheck2, badge: 'Doc' },
];

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useAppState();

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md sticky top-16 z-40 no-print print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <nav className="bg-zinc-900/90 border border-zinc-800/80 p-1.5 rounded-xl flex items-center space-x-1 overflow-x-auto no-scrollbar" aria-label="Tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 rounded-lg bg-zinc-800 border border-zinc-700/60 shadow-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.2 text-[8px] font-extrabold uppercase border ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-zinc-950 text-zinc-500 border-zinc-850'
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
export default NavigationTabs;
