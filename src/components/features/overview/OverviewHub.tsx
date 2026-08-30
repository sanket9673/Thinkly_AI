'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  Zap,
  Battery,
  ShieldAlert,
  Target
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppState } from '@/context/AppStateContext';
import { SYSTEM_MODELS, SYSTEM_METRICS } from '@/data/submissionData';

export const OverviewHub: React.FC = () => {
  const { setActiveTab, selectedModel, setSelectedModel } = useAppState();

  const getModelBadge = (id: string) => {
    if (id === 'aveon-e1') return 'Active Hero';
    if (id === 'aveon-urban') return 'Budget Pivot';
    return 'Family Pivot';
  };

  const getModelBadgeVariant = (id: string) => {
    if (id === 'aveon-e1') return 'emerald';
    if (id === 'aveon-urban') return 'amber';
    return 'violet';
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner with ambient gradient glow */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-violet-950/40 p-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Voice Agent Engineering Workbench</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-450">
            Voice AI Engineering Studio — Voice Agent Workbench
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Welcome to <strong>VoiceCraft Studio</strong>. This engineering workbench addresses key challenges in modern conversational voice AI pipelines: turning rigid system prompts into natural humanized dialogue, executing smooth multi-product cross-sell strategies, and implementing critical production fail-safes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="primary" size="sm" onClick={() => setActiveTab('templatizer')}>
              <span>Start Prompt Refactoring</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('simulator')}>
              <Headphones className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Launch Live Call Simulator</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Interactive Active EV Model Selector Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Sliders className="h-4 w-4 text-violet-400" />
          <span className="text-xs uppercase tracking-wider font-bold font-mono">Active EV Model Selector</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SYSTEM_MODELS.map((model) => {
            const isSelected = selectedModel === model.name;
            const badgeVariant = getModelBadgeVariant(model.id);
            const badgeLabel = getModelBadge(model.id);

            return (
              <motion.div
                key={model.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedModel(model.name)}
                className={`cursor-pointer rounded-2xl border p-5 transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-emerald-500/50 bg-emerald-950/15 shadow-lg shadow-emerald-500/5'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700/80'
                }`}
              >
                {isSelected && (
                  <div className="absolute -right-8 -top-8 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-sm text-zinc-100">{model.name}</div>
                  <Badge variant={badgeVariant} className="text-[8px] font-mono tracking-wider font-black">
                    {badgeLabel}
                  </Badge>
                </div>

                <p className="text-[11px] text-zinc-400 mb-4 h-8">{model.tagline}</p>

                {/* Micro spec items in grid pills */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500">
                  <div className="bg-zinc-950/80 px-2.5 py-1 rounded-md border border-zinc-850">
                    Price: <span className="text-zinc-300 font-semibold">{model.specs.price}</span>
                  </div>
                  <div className="bg-zinc-950/80 px-2.5 py-1 rounded-md border border-zinc-850">
                    Range: <span className="text-zinc-300 font-semibold">{model.specs.range}</span>
                  </div>
                  <div className="bg-zinc-950/80 px-2.5 py-1 rounded-md border border-zinc-850">
                    Battery: <span className="text-zinc-300 font-semibold">{model.specs.battery}</span>
                  </div>
                  <div className="bg-zinc-950/80 px-2.5 py-1 rounded-md border border-zinc-850">
                    Charge: <span className="text-zinc-300 font-semibold">{model.specs.chargeTime}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Task Execution Modules Quick Launcher */}
      <div className="space-y-4 pt-4 border-t border-zinc-900">
        <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400 flex items-center gap-2">
          <Zap className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
          Task Execution Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Module 1 */}
          <motion.div whileHover={{ y: -4 }} className="h-full">
            <Card className="hover:border-zinc-700/80 transition-colors h-full flex flex-col justify-between p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald" className="font-mono">Part 1</Badge>
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <Sliders className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Prompt Humanizer & Templatizer</h3>
                  <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                    Resolves robotic scripts and pricing matrices, and compiles Liquid dynamic variable inputs.
                  </p>
                </div>
                <div className="space-y-2 text-[10px] text-zinc-500 font-mono">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Hinglish Oral Filler Marks</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Single-Reframe Rule Bounds</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Dynamic Schema Compiler</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="mt-6 w-full text-xs font-semibold font-mono" onClick={() => setActiveTab('templatizer')}>
                <span>Launch Part 1</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Card>
          </motion.div>

          {/* Module 2 */}
          <motion.div whileHover={{ y: -4 }} className="h-full">
            <Card className="hover:border-zinc-700/80 transition-colors h-full flex flex-col justify-between p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="violet" className="font-mono">Part 2</Badge>
                  <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                    <ShieldAlert className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Production Block Guardrails</h3>
                  <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                    Visualizes critical engineering blocks missing from standard prompt pipelines.
                  </p>
                </div>
                <div className="space-y-2 text-[10px] text-zinc-500 font-mono">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-violet-400" /> VAD Interruption cut-offs</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-violet-400" /> Phonetical Number Normalizer</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-violet-400" /> Timeout Filler audio race</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="mt-6 w-full text-xs font-semibold font-mono" onClick={() => setActiveTab('missing-blocks')}>
                <span>Launch Part 2</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Card>
          </motion.div>

          {/* Module 3 */}
          <motion.div whileHover={{ y: -4 }} className="h-full">
            <Card className="hover:border-zinc-700/80 transition-colors h-full flex flex-col justify-between p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="amber" className="font-mono">Part 3</Badge>
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <Target className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">A/B Testing & Evaluation Suite</h3>
                  <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                    Review statistical performance lift charts and auto-scored LLM-as-a-Judge transcripts.
                  </p>
                </div>
                <div className="space-y-2 text-[10px] text-zinc-500 font-mono">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> A/B Split conversion gauges</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Token Highlight call inspector</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Executive Summary Reader</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="mt-6 w-full text-xs font-semibold font-mono" onClick={() => setActiveTab('evaluation')}>
                <span>Launch Part 3</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Card>
          </motion.div>

        </div>
      </div>

      {/* Quantitative Metric Summary Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-zinc-900">
        {SYSTEM_METRICS.map((metric, idx) => (
          <Card key={idx} className="bg-zinc-900/30">
            <CardContent className="p-4">
              <div className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-500">{metric.label}</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1.5">{metric.value}</div>
              <div className="flex items-center gap-1.5 mt-2 text-[10px]">
                <Badge variant="success" className="text-[8px] font-mono">{metric.change}</Badge>
                <span className="text-zinc-500 truncate font-mono">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  );
};
export default OverviewHub;
