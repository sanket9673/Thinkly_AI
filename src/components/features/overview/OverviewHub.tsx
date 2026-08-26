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
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppState } from '@/context/AppStateContext';
import { SYSTEM_MODELS, SYSTEM_METRICS } from '@/data/submissionData';

export const OverviewHub: React.FC = () => {
  const { setActiveTab, selectedModel, setSelectedModel } = useAppState();

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Forward Deployed Engineer Intern Task</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Voice Agent Engineering & Prompt Refactoring Workbench
          </h1>

          <p className="text-base text-zinc-300 leading-relaxed">
            Welcome to <strong>VoiceCraft Studio</strong>. This workbench addresses key challenges in modern conversational voice AI pipelines: turning rigid system prompts into natural humanized dialogue, executing smooth multi-product cross-sell strategies, and implementing critical production fail-safes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="emerald" onClick={() => setActiveTab('templatizer')}>
              Start Prompt Refactoring
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('simulator')}>
              <Headphones className="h-4 w-4 text-emerald-400" />
              Launch Live Call Simulator
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Model Selector & Live Spec Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-violet-500/30 bg-zinc-900/90">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-violet-400" />
              <CardTitle>Active EV Model Configuration</CardTitle>
            </div>
            <CardDescription>
              Select product model context for prompt rendering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {SYSTEM_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.name)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between ${
                    selectedModel === model.name
                      ? 'border-violet-500 bg-violet-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{model.name}</div>
                    <div className="text-xs text-zinc-400">{model.tagline}</div>
                  </div>
                  {selectedModel === model.name && (
                    <Badge variant="violet" className="text-[10px]">Active</Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Model Spec Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Target Vehicle Specs: {selectedModel}</span>
              <Badge variant="emerald">Live Context</Badge>
            </CardTitle>
            <CardDescription>
              This specification matrix is dynamically injected into prompt variables and system messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const current = SYSTEM_MODELS.find((m) => m.name === selectedModel) || SYSTEM_MODELS[1];
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="text-xs text-zinc-500">Price Range</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">{current.specs.price}</div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="text-xs text-zinc-500">IDC Range</div>
                    <div className="text-sm font-bold text-violet-400 mt-1">{current.specs.range}</div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="text-xs text-zinc-500">Battery Capacity</div>
                    <div className="text-sm font-bold text-zinc-200 mt-1">{current.specs.battery}</div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="text-xs text-zinc-500">Charge Time</div>
                    <div className="text-sm font-bold text-amber-400 mt-1">{current.specs.chargeTime}</div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Task Summary Grid (Parts 1, 2, and 3) */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-emerald-400" />
          Task Execution Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-zinc-700 transition-colors">
            <CardHeader>
              <Badge variant="emerald" className="w-max mb-2">Part 1: Fixes & Refactoring</Badge>
              <CardTitle className="text-base">Prompt Humanization & Multi-Product</CardTitle>
              <CardDescription>
                Resolves robotic stiffness, rigid pricing tables, and implements natural Hinglish/Tanglish disfluency switchers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Hinglish/Tanglish Disfluency Engine</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Conversational EV Spec Pivot</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Non-pushy Cross-sell Escalation</div>
            </CardContent>
          </Card>

          <Card className="hover:border-zinc-700 transition-colors">
            <CardHeader>
              <Badge variant="violet" className="w-max mb-2">Part 2: Production Guardrails</Badge>
              <CardTitle className="text-base">4 Missing Production Blocks</CardTitle>
              <CardDescription>
                Identifies crucial architecture gaps missing from standard prompt-only agent pipelines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-violet-400" /> Interruption & Barge-in Handler</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-violet-400" /> Context Drift State Guardrail</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-violet-400" /> Tool Fallback & Latency Fillers</div>
            </CardContent>
          </Card>

          <Card className="hover:border-zinc-700 transition-colors">
            <CardHeader>
              <Badge variant="amber" className="w-max mb-2">Part 3: Evaluation Framework</Badge>
              <CardTitle className="text-base">Voice Benchmark Suite</CardTitle>
              <CardDescription>
                Quantitative metrics and unit test scenarios tailored for voice AI agents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-amber-400" /> Latency & Barge-In Metrics</div>
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-amber-400" /> Code-switching naturalness scale</div>
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-amber-400" /> Cross-sell pivot conversion analysis</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SYSTEM_METRICS.map((metric, idx) => (
          <Card key={idx} className="bg-zinc-900/60">
            <CardContent className="p-4">
              <div className="text-xs text-zinc-400">{metric.label}</div>
              <div className="text-2xl font-black text-white mt-1">{metric.value}</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="text-emerald-400 font-semibold">{metric.change}</span>
                <span className="text-zinc-500 truncate">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
