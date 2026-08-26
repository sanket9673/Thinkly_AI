'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Sliders, Info, Zap, HelpCircle } from 'lucide-react';

interface MatrixRow {
  component: string;
  type: 'fixed' | 'dynamic';
  location: string;
  rationale: string;
  example: string;
}

const MATRIX_DATA: MatrixRow[] = [
  {
    component: 'Dialogue Turn-Taking State Machine',
    type: 'fixed',
    location: 'System Core Engine',
    rationale: 'Turn-taking patterns (Listening, Interrupting, Responding, Ending) are fundamental speech mechanics that do not alter based on the client vehicle model or region.',
    example: 'Wait 350ms after user silence before finalizing turn transition; clear output buffers if barge-in detected.'
  },
  {
    component: 'Disfluency Injection & Filler Policy',
    type: 'fixed',
    location: 'System Prompt Wrapper',
    rationale: 'Maintains consistent natural dialogue density (max 1 marker per 2 turns) across all configurations. Only filler words themselves are client-configurable.',
    example: 'Limit filler words to conversation sentence boundaries or speech transitions.'
  },
  {
    component: 'Inventory & Specification Tables',
    type: 'dynamic',
    location: 'Client JSON Config',
    rationale: 'Prices, charging times, battery capacities, and physical specifications change continuously with product launches and updates.',
    example: 'Aveon Urban range is 135 km; Aveon Max is 190 km.'
  },
  {
    component: 'Dealership & Branding Metadata',
    type: 'dynamic',
    location: 'Client JSON Config',
    rationale: 'Branding details, dealership locations, agent names, and phone numbers are completely unique to each client account.',
    example: 'Dealership: "Northline Motors", Location: "Delhi", Agent: "Aanya".'
  },
  {
    component: 'Barge-In VAD Detection Thresholds',
    type: 'fixed',
    location: 'Local Web Assembly Client',
    rationale: 'Threshold calculations (e.g. dB scale trigger, voice energy ratio) are hardware/pipeline properties, not business variables.',
    example: '-45dB sound threshold trigger over continuous 30ms window.'
  },
  {
    component: 'Locale-Specific Fillers',
    type: 'dynamic',
    location: 'Client JSON Config',
    rationale: 'Hinglish, Marathlish, and Tanglish fillers are specific to the regional demographic the client is targeting.',
    example: 'Use "dekhiye, matlab..." for Hindi; "aama, basically..." for Tamil.'
  }
];

export const BoundaryDecisionMatrix: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'fixed' | 'dynamic'>('all');
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const filteredData = MATRIX_DATA.filter(row => {
    if (filter === 'all') return true;
    return row.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-violet-400" />
            Logic Boundary Decision Matrix
          </h3>
          <p className="text-xs text-zinc-400">
            Evaluating which operational rules belong in fixed prompt firmware vs dynamic schema configurations.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-1 self-start sm:self-auto">
          {(['all', 'fixed', 'dynamic'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilter(type);
                setActiveRow(null);
              }}
              className={`rounded-md px-3 py-1 text-xs font-medium uppercase tracking-wider transition-all ${
                filter === type
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <Card className="border-zinc-800 bg-zinc-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="p-4">Logic Component</th>
                <th className="p-4">Classification</th>
                <th className="p-4">Deployment Scope</th>
                <th className="p-4 hidden md:table-cell">Engineering Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredData.map((row, idx) => (
                <React.Fragment key={idx}>
                  <tr
                    onClick={() => setActiveRow(activeRow === idx ? null : idx)}
                    className={`cursor-pointer transition-colors hover:bg-zinc-900/40 ${
                      activeRow === idx ? 'bg-zinc-900/60' : ''
                    }`}
                  >
                    <td className="p-4 font-semibold text-zinc-200">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          row.type === 'fixed' ? 'bg-violet-400' : 'bg-emerald-400'
                        }`} />
                        {row.component}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={row.type === 'fixed' ? 'violet' : 'emerald'} className="uppercase font-mono text-[9px] tracking-wide">
                        {row.type}
                      </Badge>
                    </td>
                    <td className="p-4 text-zinc-400">{row.location}</td>
                    <td className="p-4 text-zinc-400 hidden md:table-cell max-w-sm truncate">
                      {row.rationale}
                    </td>
                  </tr>
                  {/* Expanded detail row */}
                  {activeRow === idx && (
                    <tr className="bg-zinc-900/30">
                      <td colSpan={4} className="p-4 border-t border-zinc-850">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5 mb-1.5">
                              <Info className="h-3 w-3" /> Description & Rationale
                            </div>
                            <p className="text-zinc-300 leading-relaxed pr-4">
                              {row.rationale}
                            </p>
                          </div>
                          <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3">
                            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5 mb-1.5">
                              <Zap className="h-3 w-3 text-amber-400 fill-amber-400" /> Compiled Example Code/Prompt
                            </div>
                            <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                              {row.example}
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Rationale Footer Summary */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3.5 text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
        <HelpCircle className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-200">Zero Code-Edits Architecture: </span>
          By separating <strong className="text-violet-400">Fixed Core Logic</strong> (turn management, state tracking) from <strong className="text-emerald-400">Client Dynamic Variables</strong> (FAQ inventory lists, region filters, naming parameters), VoiceCraft Studio allows engineers to deploy the same compiled prompt engine to production while onboarding new client dealerships via dynamic API parameters.
        </div>
      </div>
    </div>
  );
};
