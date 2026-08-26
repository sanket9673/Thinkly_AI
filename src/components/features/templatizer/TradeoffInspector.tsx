'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Hourglass, ShieldAlert, Cpu, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

interface TradeOffCard {
  title: string;
  badgeText: string;
  badgeVariant: 'danger' | 'amber' | 'emerald';
  icon: React.ComponentType<{ className?: string }>;
  costMetric: string;
  description: string;
  mitigationText: string;
}

const TRADEOFFS: TradeOffCard[] = [
  {
    title: 'TTS Latency Penalty',
    badgeText: 'High Latency Risk',
    badgeVariant: 'danger',
    icon: Hourglass,
    costMetric: '+50ms to +100ms per turn',
    description: 'Generating filler words (e.g., "acha dekhiye", "matlab") creates additional tokens, lengthening first-byte text-to-speech rendering, which could push overall response times beyond the 400ms target.',
    mitigationText: 'Utilize low-latency websockets streaming pipelines (e.g., Cartesia Sonic or ElevenLabs Turbo v2.5) that synthesize audio chunks dynamically, rather than waiting for whole sentence structures.'
  },
  {
    title: 'TTS Pronunciation Glitches',
    badgeText: 'Speech Artifacts',
    badgeVariant: 'amber',
    icon: ShieldAlert,
    costMetric: 'High error rate on lower-tier models',
    description: 'Standard English-only or strict bilingual TTS voices struggle to blend local hybrid slang. Fillers like "aama" or "mhanje" get spoken with unnatural accents, destroying the illusion of human conversations.',
    mitigationText: 'Deploy custom phoneme mappings (IPA) or native multilingual models trained explicitly on colloquial datasets to override standard TTS pronunciation dictionary fallbacks.'
  },
  {
    title: 'Context Drift & Token Overhead',
    badgeText: 'Context Costs',
    badgeVariant: 'amber',
    icon: Cpu,
    costMetric: '+150 tokens per dialogue turn',
    description: 'Injecting disfluency instructions and code-switching libraries into system prompts inflates context sizes, accelerating API costs and increasing probability of context drift over 10+ turns.',
    mitigationText: 'Implement sliding window context guardrails and deterministic JSON schema extraction. Clear out disfluency templates from prompt system memories dynamically after each turn.'
  }
];

export const TradeoffInspector: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Voice Pipeline Costs & Trade-Offs
          </h3>
          <p className="text-xs text-zinc-400">
            Analyzing engineering penalties for natural humanized audio versus raw text synthesis.
          </p>
        </div>
        <Badge variant="outline" className="border-zinc-800 text-zinc-400 bg-zinc-950/40">
          Latency Threshold Target: &lt;400ms
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TRADEOFFS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="flex flex-col justify-between border-zinc-800/80 bg-zinc-900/20 hover:border-zinc-700 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-zinc-950/60 p-2 border border-zinc-800/60">
                    <Icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <Badge variant={item.badgeVariant} className="text-[10px]">{item.badgeText}</Badge>
                </div>
                <CardTitle className="text-base mt-3">{item.title}</CardTitle>
                <div className="text-xs font-semibold text-rose-400 font-mono mt-1">
                  Cost: {item.costMetric}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-zinc-400 leading-relaxed flex-1 flex flex-col justify-between">
                <p>{item.description}</p>
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 mt-auto">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Mitigation Strategy</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-sans leading-normal">
                    {item.mitigationText}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recommended Architecture Banner */}
      <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-zinc-950/50 to-zinc-950 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-emerald-500/10 p-1.5">
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Engineering recommendation for Phase 2</div>
            <div className="text-[11px] text-zinc-400">Implement dynamic disfluency capping (e.g. limit fillers to 1 per 2 turns) to prevent speech clutter.</div>
          </div>
        </div>
        <Badge variant="emerald" className="self-start sm:self-auto">Capped Filler Rule Active</Badge>
      </div>
    </div>
  );
};
