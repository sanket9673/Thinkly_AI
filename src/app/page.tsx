'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { useAppState } from '@/context/AppStateContext';
import { OverviewHub } from '@/components/features/overview/OverviewHub';
import { PromptTemplatizer } from '@/components/features/templatizer/PromptTemplatizer';
import { CrossSellStudio } from '@/components/features/cross-sell/CrossSellStudio';
import { MissingBlocksStudio } from '@/components/features/missing-blocks/MissingBlocksStudio';
import { EvaluationStudio } from '@/components/features/evaluation/EvaluationStudio';
import { LiveCallStudio } from '@/components/features/simulator/LiveCallStudio';
import { SubmissionDocHub } from '@/components/features/submission/SubmissionDocHub';

export default function HomePage() {
  const { activeTab } = useAppState();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewHub />;
      case 'templatizer':
        return <PromptTemplatizer />;
      case 'cross-sell':
        return <CrossSellStudio />;
      case 'missing-blocks':
        return <MissingBlocksStudio />;
      case 'evaluation':
        return <EvaluationStudio />;
      case 'simulator':
        return <LiveCallStudio />;
      case 'pdf-exporter':
        return <SubmissionDocHub />;
      default:
        return (
          <div className="min-h-[500px] flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-2xl p-8 text-center bg-zinc-900/30">
            <div className="text-zinc-400 mb-2 font-mono text-sm">Active Tab: {activeTab}</div>
            <h2 className="text-2xl font-bold text-white mb-2">Module Loaded into Shell</h2>
            <p className="text-sm text-zinc-400 max-w-md">
              Phase 1 setup complete! Prompt Templatizer, Multi-Product Cross-Sell, Missing Blocks, Evaluation, Live Call Simulator, and PDF Exporter modules are ready for Phase 2 expansion.
            </p>
          </div>
        );
    }
  };

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}



