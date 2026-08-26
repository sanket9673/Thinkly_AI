'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp, Copy, Check, ShieldAlert, Sparkles, TrendingUp, AlertOctagon } from 'lucide-react';
import { PRODUCTION_5_BLOCKS, ProductionBlock } from '@/data/submissionData';

export const BlockInspectorCard: React.FC = () => {
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>('block-barge-in');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedBlockId(expandedBlockId === id ? null : id);
  };

  const handleCopyPrompt = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-violet-400" />
        <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Production Guardrails Card Deck</h4>
      </div>

      <div className="space-y-3">
        {PRODUCTION_5_BLOCKS.map((block) => {
          const isExpanded = expandedBlockId === block.id;

          return (
            <Card
              key={block.id}
              className={`border-zinc-800 bg-zinc-900/10 overflow-hidden transition-all duration-200 ${
                isExpanded ? 'border-zinc-700 bg-zinc-900/30' : 'hover:border-zinc-800'
              }`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => handleToggleExpand(block.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${
                    block.severity === 'Critical' ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
                  }`} />
                  <div>
                    <span className="text-sm font-semibold text-zinc-100">{block.title}</span>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-500 font-mono">
                      <span>Category: <strong className="text-zinc-400">{block.category}</strong></span>
                      <span>•</span>
                      <span>Severity: <strong className={block.severity === 'Critical' ? 'text-rose-400' : 'text-amber-400'}>{block.severity}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {block.impact}
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="h-4.5 w-4.5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-4.5 w-4.5 text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Accordion Body */}
              {isExpanded && (
                <CardContent className="px-4 pb-4 pt-0 border-t border-zinc-850/60 divide-y divide-zinc-850/60">
                  {/* Step 1: Failure Moment Scenario */}
                  <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-rose-400 font-mono tracking-wider flex items-center gap-1">
                        <AlertOctagon className="h-3.5 w-3.5" />
                        <span>The Failure Call Moment</span>
                      </div>
                      <pre className="p-3 rounded-lg border border-rose-500/10 bg-rose-950/5 text-[11px] font-sans text-zinc-400 whitespace-pre-wrap leading-relaxed">
                        {block.failureScenario}
                      </pre>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>The Corrected Voice Output</span>
                      </div>
                      <pre className="p-3 rounded-lg border border-emerald-500/10 bg-emerald-950/5 text-[11px] font-sans text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {block.recoveredScenario}
                      </pre>
                    </div>
                  </div>

                  {/* Step 2: System Prompt Fix Code Block */}
                  <div className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">
                        Production System Instruction Guardrail (Prompt Directives)
                      </div>
                      <Button
                        variant={copiedId === block.id ? 'emerald' : 'outline'}
                        size="sm"
                        className="h-7 text-[10px] font-mono gap-1 transition-all"
                        onClick={() => handleCopyPrompt(block.id, block.fixPrompt)}
                      >
                        {copiedId === block.id ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Directive</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/50 text-[11px] font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-[150px] overflow-y-auto">
                      {block.fixPrompt}
                    </pre>
                  </div>

                  {/* Step 3: Operational Impact Callout */}
                  <div className="pt-3 pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200">System Performance Metric:</span>
                      <span className="text-emerald-400 font-mono">{block.impact}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 font-sans">
                      Verified under automated voice pipeline benchmarking.
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default BlockInspectorCard;
