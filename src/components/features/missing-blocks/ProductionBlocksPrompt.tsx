'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Copy, Check, Terminal, FileCode } from 'lucide-react';
import { PRODUCTION_5_BLOCKS } from '@/data/submissionData';

export const ProductionBlocksPrompt: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // Compile all blocks into a single copyable markdown prompt
  const getCombinedPrompt = () => {
    let output = `# VOICE AGENT PRODUCTION GUARDRAILS & CORE BLOCKS MODULE\n\n`;
    PRODUCTION_5_BLOCKS.forEach((block, idx) => {
      output += `## MODULE ${idx + 1}: ${block.title.toUpperCase()}\n`;
      output += `Category: ${block.category} | Severity: ${block.severity}\n`;
      output += `Target Impact: ${block.impact}\n\n`;
      output += `### System Prompt Rules:\n`;
      output += `${block.fixPrompt}\n\n`;
      output += `### Spoken Phonetic Recovery Snips:\n`;
      output += `- Failure Scenario:\n  ${block.failureScenario.replace(/\n/g, '\n  ')}\n`;
      output += `- Corrected Output:\n  ${block.recoveredScenario.replace(/\n/g, '\n  ')}\n\n`;
      output += `--------------------------------------------------\n\n`;
    });
    return output.trim();
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(getCombinedPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCode className="h-5 w-5 text-violet-400" />
            Core Production Prompt Exporter
          </h3>
          <p className="text-xs text-zinc-400">
            Export all 5 core system guardrail blocks into a single markdown format ready to feed into LLM system instructions.
          </p>
        </div>
        <Button
          variant={copied ? 'emerald' : 'outline'}
          size="sm"
          className="h-8.5 gap-1.5 min-w-[140px] transition-all"
          onClick={handleCopyAll}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied All Blocks!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy All Blocks</span>
            </>
          )}
        </Button>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="border-b border-zinc-850 px-4 py-2 flex items-center justify-between bg-zinc-900/40 text-[10px] text-zinc-500 font-mono">
          <span>voice_agent_production_guardrails.md</span>
          <Badge variant="emerald" className="text-[9px] uppercase tracking-wider font-bold">5 Modules Included</Badge>
        </div>
        <CardContent className="p-0">
          <pre className="p-4 font-mono text-[11px] text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
            {getCombinedPrompt()}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};
export default ProductionBlocksPrompt;
