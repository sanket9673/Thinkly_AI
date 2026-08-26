'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAppState } from '@/context/AppStateContext';
import { OverviewHub } from '@/components/features/overview/OverviewHub';
import { PromptTemplatizer } from '@/components/features/templatizer/PromptTemplatizer';
import { CrossSellStudio } from '@/components/features/cross-sell/CrossSellStudio';
import { MissingBlocksStudio } from '@/components/features/missing-blocks/MissingBlocksStudio';
import { EvaluationStudio } from '@/components/features/evaluation/EvaluationStudio';

export default function HomePage() {
  const { activeTab } = useAppState();

  return (
    <AppShell>
      {activeTab === 'overview' && <OverviewHub />}
      {activeTab === 'templatizer' && <PromptTemplatizer />}
      {activeTab === 'cross-sell' && <CrossSellStudio />}
      {activeTab === 'missing-blocks' && <MissingBlocksStudio />}
      {activeTab === 'evaluation' && <EvaluationStudio />}
      {activeTab !== 'overview' && activeTab !== 'templatizer' && activeTab !== 'cross-sell' && activeTab !== 'missing-blocks' && activeTab !== 'evaluation' && (
        <div className="min-h-[500px] flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-2xl p-8 text-center bg-zinc-900/30">
          <div className="text-zinc-400 mb-2 font-mono text-sm">Active Tab: {activeTab}</div>
          <h2 className="text-2xl font-bold text-white mb-2">Module Loaded into Shell</h2>
          <p className="text-sm text-zinc-400 max-w-md">
            Phase 1 setup complete! Prompt Templatizer, Multi-Product Cross-Sell, Missing Blocks, Evaluation, Live Call Simulator, and PDF Exporter modules are ready for Phase 2 expansion.
          </p>
        </div>
      )}
    </AppShell>
  );
}



