'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Copy, Check, Filter, ShieldAlert } from 'lucide-react';
import { PRODUCTION_5_BLOCKS, ProductionBlock } from '@/data/submissionData';

export const BlockMatrixTable: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'Acoustic Timing' | 'Compliance' | 'Latency' | 'Safety'>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'Critical' | 'High'>('ALL');

  const handleCopyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const filteredBlocks = PRODUCTION_5_BLOCKS.filter(b => {
    const categoryMatch = filterCategory === 'ALL' || b.category === filterCategory;
    const severityMatch = filterSeverity === 'ALL' || b.severity === filterSeverity;
    return categoryMatch && severityMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-emerald-400" />
          <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Categorized Summary Matrix</h4>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-1">
            {(['ALL', 'Acoustic Timing', 'Compliance', 'Latency', 'Safety'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-all ${
                  filterCategory === cat
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat === 'Acoustic Timing' ? 'Acoustic' : cat}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-1">
            {(['ALL', 'Critical', 'High'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-all ${
                  filterSeverity === sev
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matrix Table inside Card */}
      <Card className="border-zinc-800 bg-zinc-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="p-4">Block Name</th>
                <th className="p-4">Classification Category</th>
                <th className="p-4">Severity Level</th>
                <th className="p-4 hidden md:table-cell">Target Operational Impact</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredBlocks.map((block) => (
                <tr key={block.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="p-4 font-semibold text-zinc-200">{block.title}</td>
                  <td className="p-4">
                    <Badge variant={
                      block.category === 'Latency' ? 'amber' : block.category === 'Compliance' ? 'emerald' : block.category === 'Safety' ? 'violet' : 'outline'
                    } className="text-[10px] uppercase font-mono tracking-wide">
                      {block.category}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={block.severity === 'Critical' ? 'danger' : 'amber'} className="text-[10px] uppercase font-mono">
                      {block.severity}
                    </Badge>
                  </td>
                  <td className="p-4 text-zinc-400 hidden md:table-cell">{block.impact}</td>
                  <td className="p-4 text-right">
                    <Button
                      variant={copiedId === block.id ? 'emerald' : 'outline'}
                      size="sm"
                      className="h-7 w-7 p-0 ml-auto flex items-center justify-center transition-all"
                      onClick={() => handleCopyText(block.id, block.fixPrompt)}
                      title="Copy Prompt Directive"
                    >
                      {copiedId === block.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredBlocks.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 font-mono">
                    No blocks matched the selected filter query classifications.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
export default BlockMatrixTable;
