'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Play, Shield, GitCommit, ArrowRight, User, HelpCircle, Check, AlertCircle, Info } from 'lucide-react';

interface DecisionTreeVisualizerProps {
  activeState: 'idle' | 'reframe' | 'pivot' | 'hold';
  objectionType: 'budget' | 'size' | 'feature' | null;
  reframeCount: number;
}

export const DecisionTreeVisualizer: React.FC<DecisionTreeVisualizerProps> = ({
  activeState,
  objectionType,
  reframeCount,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-violet-400 rotate-90" />
            Interactive Objection Routing Flowchart
          </h3>
          <p className="text-xs text-zinc-400">
            Visualizing the decision engine path in real-time as user queries are classified and processed.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40 inline-block" />
            <span className="text-rose-400 font-mono text-[10px]">Reframe Block</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 inline-block" />
            <span className="text-emerald-400 font-mono text-[10px]">Cross-Sell Pivot</span>
          </span>
        </div>
      </div>

      <div className="relative rounded-xl border border-zinc-800 bg-zinc-950/40 p-6 overflow-visible min-h-[500px] flex flex-col justify-center items-center">
        {/* Animated background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center gap-8">
          
          {/* Node 1: Customer Speaks */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ 
                scale: activeState !== 'idle' ? 1.03 : 1,
                borderColor: activeState !== 'idle' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(39, 39, 42, 0.8)'
              }}
              className="rounded-lg border bg-zinc-900 px-4 py-2 text-center shadow-md flex items-center gap-2"
            >
              <User className="h-4 w-4 text-emerald-400" />
              <div className="text-xs font-semibold text-zinc-100">Node 1: Customer Utterance</div>
              {objectionType && (
                <Badge variant="emerald" className="text-[9px] uppercase font-mono py-0 px-1 border-emerald-500/20 bg-emerald-500/5">
                  {objectionType}
                </Badge>
              )}
            </motion.div>
            {/* SVG Connecting arrow downwards */}
            <div className="h-8 w-0.5 bg-gradient-to-b from-zinc-700 to-zinc-800 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 border-b-2 border-r-2 border-zinc-800 rotate-45" />
            </div>
          </div>

          {/* Node 2: Classifier */}
          <div className="flex flex-col items-center w-full">
            <motion.div
              animate={{ 
                scale: activeState !== 'idle' ? 1.03 : 1,
                borderColor: activeState !== 'idle' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(39, 39, 42, 0.8)'
              }}
              className="rounded-lg border bg-zinc-900 px-5 py-2.5 text-center shadow-md max-w-sm"
            >
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">Node 2: Objection Classifier</div>
              <p className="text-[11px] text-zinc-300">
                Identify if customer displays budget objection, size objection, or mild hesitation queries.
              </p>
            </motion.div>

            {/* Branching SVG Paths */}
            <div className="w-full max-w-md h-12 relative mt-1">
              <svg className="w-full h-full" viewBox="0 0 400 48" fill="none">
                {/* Path A (Left): Hard Objections */}
                <path 
                  d="M200,0 Q200,24 80,24 L80,48" 
                  stroke={activeState === 'reframe' || activeState === 'pivot' ? '#8b5cf6' : '#27272a'} 
                  strokeWidth="2" 
                  strokeDasharray={(activeState === 'reframe' || activeState === 'pivot') ? '4 4' : '0'}
                  className={(activeState === 'reframe' || activeState === 'pivot') ? 'animate-[dash_2s_linear_infinite]' : ''}
                />
                {/* Path B (Right): Hold Position */}
                <path 
                  d="M200,0 Q200,24 320,24 L320,48" 
                  stroke={activeState === 'hold' ? '#f59e0b' : '#27272a'} 
                  strokeWidth="2"
                  strokeDasharray={activeState === 'hold' ? '4 4' : '0'}
                  className={activeState === 'hold' ? 'animate-[dash_2s_linear_infinite]' : ''}
                />
              </svg>
            </div>
          </div>

          {/* Bottom Nodes: Left (Objection evaluation) and Right (Hold node) */}
          <div className="grid grid-cols-2 gap-8 w-full max-w-2xl relative">
            
            {/* Left Column: Objection Routing */}
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                animate={{ 
                  borderColor: (activeState === 'reframe' || activeState === 'pivot') ? 'rgba(139, 92, 246, 0.4)' : 'rgba(39, 39, 42, 0.8)',
                  boxShadow: (activeState === 'reframe' || activeState === 'pivot') ? '0 0 15px rgba(139, 92, 246, 0.1)' : 'none'
                }}
                className="rounded-lg border bg-zinc-900 p-4 text-left w-full space-y-2 relative"
              >
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex justify-between items-center">
                  <span>Node 3: Reframe Check</span>
                  <Badge variant="outline" className="text-[9px] font-mono border-zinc-800 text-zinc-400 bg-zinc-950/60">
                    Reframes: {reframeCount}x
                  </Badge>
                </div>
                <div className="text-xs font-semibold text-zinc-200">Single-Validate constraint</div>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Has the agent reframed E1 value 1x already?
                </p>

                {/* Micro branches inside Node 3 */}
                <div className="pt-2 border-t border-zinc-800 flex justify-between gap-2 text-[10px]">
                  <span className={`px-2 py-0.5 rounded border transition-colors ${
                    activeState === 'reframe' 
                      ? 'border-rose-500/40 bg-rose-500/10 text-rose-400' 
                      : 'border-zinc-800 bg-zinc-950/50 text-zinc-500'
                  }`}>
                    No (Block Pivot)
                  </span>
                  <span className={`px-2 py-0.5 rounded border transition-colors ${
                    activeState === 'pivot' 
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' 
                      : 'border-zinc-800 bg-zinc-950/50 text-zinc-500'
                  }`}>
                    Yes (Trigger Pivot)
                  </span>
                </div>
              </motion.div>

              {/* Dynamic script outputs based on decision state */}
              {activeState === 'reframe' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-[11px] leading-relaxed text-zinc-300 w-full"
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Outcome: REFRAME_PRIMARY</span>
                  </div>
                  "Arey sir, iska chalne ka cost dekhiye... matlab petrol car se bohot kam hai, bas ₹1.20 per km padta hai. Aap runs check kijiye..."
                </motion.div>
              )}

              {activeState === 'pivot' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] leading-relaxed text-zinc-300 w-full"
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    <Check className="h-3.5 w-3.5" />
                    <span>Outcome: PIVOT_CROSS_SELL</span>
                  </div>
                  {objectionType === 'size' ? (
                    `"Sahi baat hai, iski badhiya size hai par agar aapko compact size chahiye na, toh basically hamara Aveon Urban compact model best rahega..."`
                  ) : (
                    `"Acha dekhiye, agar ₹19L budget se zyada hai, toh hum dynamic pricing mein humara compact hatch Aveon Urban dekh sakte hain, ₹11.49L range..."`
                  )}
                </motion.div>
              )}
            </div>

            {/* Right Column: Hold Position */}
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                animate={{ 
                  borderColor: activeState === 'hold' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(39, 39, 42, 0.8)',
                  boxShadow: activeState === 'hold' ? '0 0 15px rgba(245, 158, 11, 0.1)' : 'none'
                }}
                className="rounded-lg border bg-zinc-900 p-4 text-left w-full space-y-2"
              >
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Node 4: Hold Position
                </div>
                <div className="text-xs font-semibold text-zinc-200">Mild Hesitation / Feature Query</div>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  User asks about features, ranges, or battery warranty without budget objections. Answer spec directly and stay focused on Aveon E1.
                </p>
                <Badge variant="amber" className="text-[9px] uppercase font-mono">
                  HOLD & EDUCATE
                </Badge>
              </motion.div>

              {activeState === 'hold' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] leading-relaxed text-zinc-300 w-full"
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <Info className="h-3.5 w-3.5" />
                    <span>Outcome: HOLD_AND_EDUCATE</span>
                  </div>
                  "Iska charging time dekhiye... 5-Amp home socket se lagbhag 6 ghante lagta hai full charging ke liye, and fast charger se 45 min."
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default DecisionTreeVisualizer;
