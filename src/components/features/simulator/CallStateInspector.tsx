'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Play, Activity, Cpu, Layers, HardDrive } from 'lucide-react';

export type CallState = 
  | 'DISCONNECTED'
  | 'GREETING'
  | 'VALUE_PROPOSITION'
  | 'OBJECTION_REFRAME'
  | 'CROSS_SELL_PIVOT'
  | 'BOOKING_CONFIRMATION';

interface CallStateInspectorProps {
  currentState: CallState;
  turnCount: number;
  modelInjected: string;
  alternateInjected: string;
  disfluencyRate: string;
}

const STATES_SEQUENCE: Array<{ key: CallState; label: string; desc: string }> = [
  { key: 'GREETING', label: '1. Initial Greeting', desc: 'Identify targets & confirm target identity' },
  { key: 'VALUE_PROPOSITION', label: '2. Value Proposition', desc: 'Detail primary SUV Aveon E1 characteristics' },
  { key: 'OBJECTION_REFRAME', label: '3. Objection Reframe', desc: 'Block pivot & calculate ₹1.20/km run costs' },
  { key: 'CROSS_SELL_PIVOT', label: '4. Cross-Sell Pivot', desc: 'Verify specs & suggest Aveon Urban budget compact' },
  { key: 'BOOKING_CONFIRMATION', label: '5. Booking Confirmation', desc: 'Secure showroom test drive slot' },
];

export const CallStateInspector: React.FC<CallStateInspectorProps> = ({
  currentState,
  turnCount,
  modelInjected,
  alternateInjected,
  disfluencyRate,
}) => {
  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-6">
      {/* Module Title */}
      <div className="flex items-center gap-2 pb-3 border-b border-zinc-850">
        <Cpu className="w-4 h-4 text-violet-400" />
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Prompt Memory Inspector</h4>
      </div>

      {/* Dynamic Context Variables */}
      <div className="space-y-3">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono block">Context Parameters</span>
        <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-850 space-y-2.5 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-zinc-500">Dialog Turns:</span>
            <span className="text-zinc-300">{turnCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Primary EV Model:</span>
            <span className="text-emerald-400 font-bold">{modelInjected}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Cross-Sell Alternate:</span>
            <span className="text-blue-400 font-bold">{alternateInjected}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Disfluency Insertion:</span>
            <span className="text-amber-400">{disfluencyRate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">VAD Barge-In Guard:</span>
            <span className="text-emerald-500 font-semibold">ACTIVE (&lt;400ms)</span>
          </div>
        </div>
      </div>

      {/* State Diagram List */}
      <div className="space-y-3">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono block">Dialogue State Machine</span>
        
        <div className="space-y-2">
          {STATES_SEQUENCE.map((state) => {
            const isActive = currentState === state.key;
            return (
              <div
                key={state.key}
                className={`p-3 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-emerald-950/10 border-emerald-500/40 shadow-sm'
                    : 'bg-zinc-950/30 border-zinc-850 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs font-semibold ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    {state.label}
                  </span>
                  {isActive && (
                    <Badge variant="emerald" className="text-[8px] px-1.5 py-0 font-mono tracking-wider animate-pulse">
                      ACTIVE
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 font-sans mt-0.5">{state.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CallStateInspector;
