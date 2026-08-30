'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Play, ShieldCheck, Terminal } from 'lucide-react';
import { CallFailureSimulator } from './CallFailureSimulator';
import { BlockInspectorCard } from './BlockInspectorCard';
import { BlockMatrixTable } from './BlockMatrixTable';
import { ProductionBlocksPrompt } from './ProductionBlocksPrompt';

export const MissingBlocksStudio: React.FC = () => {
  const [subTab, setSubTab] = useState<'simulator' | 'inspector' | 'prompt'>('simulator');

  return (
    <div className="space-y-8">
      {/* Sub Tabs Navigation Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-400" />
            Production Guardrails & Missing Blocks Inspector
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Part 2: Reviewing the 5 critical missing block categories required for production-ready voice calls.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => setSubTab('simulator')}
            className={`relative rounded-md px-3.5 py-2 text-xs font-semibold transition-all ${
              subTab === 'simulator' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {subTab === 'simulator' && (
              <motion.div
                layoutId="blocksSubTabPill"
                className="absolute inset-0 rounded-md bg-zinc-800 shadow border border-zinc-700/50"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <Play className="h-3.5 w-3.5 fill-current text-emerald-400" />
              🎙️ Call Simulator
            </span>
          </button>
          
          <button
            onClick={() => setSubTab('inspector')}
            className={`relative rounded-md px-3.5 py-2 text-xs font-semibold transition-all ${
              subTab === 'inspector' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {subTab === 'inspector' && (
              <motion.div
                layoutId="blocksSubTabPill"
                className="absolute inset-0 rounded-md bg-zinc-800 shadow border border-zinc-700/50"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
              🛡️ Block Inspector
            </span>
          </button>

          <button
            onClick={() => setSubTab('prompt')}
            className={`relative rounded-md px-3.5 py-2 text-xs font-semibold transition-all ${
              subTab === 'prompt' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {subTab === 'prompt' && (
              <motion.div
                layoutId="blocksSubTabPill"
                className="absolute inset-0 rounded-md bg-zinc-800 shadow border border-zinc-700/50"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <Terminal className="h-3.5 w-3.5 text-amber-400" />
              📜 Prompt Exporter
            </span>
          </button>
        </div>
      </div>

      {/* Rendering tab contents */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {subTab === 'simulator' ? (
            <motion.div
              key="simulator-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
            >
              <CallFailureSimulator />
            </motion.div>
          ) : subTab === 'inspector' ? (
            <motion.div
              key="inspector-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
              className="space-y-10"
            >
              {/* Expandable Card Deck Accordion */}
              <BlockInspectorCard />
              
              {/* Summarized Matrix Table */}
              <div className="border-t border-zinc-900 pt-8">
                <BlockMatrixTable />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="prompt-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
            >
              <ProductionBlocksPrompt />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default MissingBlocksStudio;
