'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, MessageSquareQuote, ShieldCheck, Sliders, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { HumanizationEngine } from './HumanizationEngine';
import { TradeoffInspector } from './TradeoffInspector';
import { DynamicSchemaEditor } from './DynamicSchemaEditor';
import { BoundaryDecisionMatrix } from './BoundaryDecisionMatrix';

export const PromptTemplatizer: React.FC = () => {
  const [subTab, setSubTab] = useState<'humanizer' | 'schema'>('humanizer');

  return (
    <div className="space-y-8">
      {/* Sub Tabs Navigation Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-emerald-400" />
            Universal Prompt Compiler & Humanization Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Part 1: Solving Problem 1 (Robotic Dialogue Refactoring) & Problem 2 (Liquid Schema Templatizer).
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => setSubTab('humanizer')}
            className={`relative rounded-md px-4 py-2 text-xs font-semibold transition-all ${
              subTab === 'humanizer'
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {subTab === 'humanizer' && (
              <motion.div
                layoutId="subTabPill"
                className="absolute inset-0 rounded-md bg-zinc-800 shadow border border-zinc-700/50"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              🗣️ Humanization Engine
            </span>
          </button>
          <button
            onClick={() => setSubTab('schema')}
            className={`relative rounded-md px-4 py-2 text-xs font-semibold transition-all ${
              subTab === 'schema'
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {subTab === 'schema' && (
              <motion.div
                layoutId="subTabPill"
                className="absolute inset-0 rounded-md bg-zinc-800 shadow border border-zinc-700/50"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              🧩 Dynamic Schema
            </span>
          </button>
        </div>
      </div>

      {/* Rendering tab contents with AnimatePresence */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {subTab === 'humanizer' ? (
            <motion.div
              key="humanizer-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
              className="space-y-10"
            >
              {/* Problem 1 Section */}
              <div>
                <div className="mb-4">
                  <Badge variant="emerald" className="mb-1 text-[10px] uppercase font-mono font-bold tracking-wider">Problem 1 Showcase</Badge>
                  <h3 className="text-lg font-bold text-white">Interactive Speech Cadence & Disfluency Showcase</h3>
                  <p className="text-xs text-zinc-400">Refactoring static script formats into speech-optimized structures blending local dialects naturally.</p>
                </div>
                <HumanizationEngine />
              </div>

              {/* Trade-offs Section */}
              <div className="border-t border-zinc-900 pt-8">
                <TradeoffInspector />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="schema-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
              className="space-y-10"
            >
              {/* Problem 2 Section */}
              <div>
                <div className="mb-4">
                  <Badge variant="violet" className="mb-1 text-[10px] uppercase font-mono font-bold tracking-wider">Problem 2 Showcase</Badge>
                  <h3 className="text-lg font-bold text-white">Dynamic Liquid Variables Prompt Templatizer</h3>
                  <p className="text-xs text-zinc-400">Split-screen JSON variable injector with hot prompt compiler rendering and custom visual highlights.</p>
                </div>
                <DynamicSchemaEditor />
              </div>

              {/* Boundaries Section */}
              <div className="border-t border-zinc-900 pt-8">
                <BoundaryDecisionMatrix />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default PromptTemplatizer;
