'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Bot, FileText } from 'lucide-react';
import { ABSplitDashboard } from './ABSplitDashboard';
import { LLMJudgeMatrix } from './LLMJudgeMatrix';
import { Part3SubmissionReader } from './Part3SubmissionReader';

type SubTab = 'ab-test' | 'llm-judge' | 'part3-written';

export function EvaluationStudio() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('ab-test');

  return (
    <div className="space-y-6">
      {/* Sub Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
        <button
          onClick={() => setActiveSubTab('ab-test')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'ab-test'
              ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          📊 A/B Split Dashboard
        </button>

        <button
          onClick={() => setActiveSubTab('llm-judge')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'llm-judge'
              ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          🤖 LLM-as-a-Judge Matrix
        </button>

        <button
          onClick={() => setActiveSubTab('part3-written')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'part3-written'
              ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          📝 Part 3 Executive Answer
        </button>
      </div>

      {/* Dynamic View rendering */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeSubTab === 'ab-test' && <ABSplitDashboard />}
        {activeSubTab === 'llm-judge' && <LLMJudgeMatrix />}
        {activeSubTab === 'part3-written' && <Part3SubmissionReader />}
      </motion.div>
    </div>
  );
}
export default EvaluationStudio;
