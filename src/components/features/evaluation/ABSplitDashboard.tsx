'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Sliders, 
  Users, 
  Target, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  controlVal: string;
  variantVal: string;
  liftText: string;
  isPositiveLift: boolean;
  unit?: string;
  icon: React.ReactNode;
}

function MetricCard({ title, controlVal, variantVal, liftText, isPositiveLift, icon }: MetricCardProps) {
  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
            {icon}
          </div>
          <span className="text-sm font-medium text-zinc-300">{title}</span>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
            isPositiveLift
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {isPositiveLift ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {liftText}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-800/80">
        <div>
          <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1 font-mono">Control (Draft)</span>
          <span className="text-lg font-bold text-zinc-400 font-mono">{controlVal}</span>
        </div>
        <div>
          <span className="text-xs text-emerald-400/80 uppercase tracking-wider block mb-1 font-mono">Variant (v2.4 Engine)</span>
          <span className="text-xl font-extrabold text-emerald-400 font-mono">{variantVal}</span>
        </div>
      </div>
    </div>
  );
}

export function ABSplitDashboard() {
  const [trafficSplit, setTrafficSplit] = useState<number>(50); // % allocated to Variant
  const totalMonthlyCalls = 10000;

  // Dynamic calculations based on split
  const projectedMetrics = useMemo(() => {
    const variantRatio = trafficSplit / 100;
    const controlRatio = 1 - variantRatio;

    const controlRate = 0.124;
    const variantRate = 0.188;
    const blendedRate = controlRatio * controlRate + variantRatio * variantRate;

    const projectedBookings = Math.round(totalMonthlyCalls * blendedRate);
    const baselineBookings = Math.round(totalMonthlyCalls * controlRate);
    const maxVariantBookings = Math.round(totalMonthlyCalls * variantRate);
    const incrementalBookings = projectedBookings - baselineBookings;

    return {
      projectedBookings,
      baselineBookings,
      maxVariantBookings,
      incrementalBookings,
      blendedRate: (blendedRate * 100).toFixed(1),
    };
  }, [trafficSplit]);

  const funnelStages = [
    { stage: 'Intro & Greet Retention', control: 88.2, variant: 96.5, lift: '+9.4%' },
    { stage: 'Product Needs Discovery', control: 62.4, variant: 81.0, lift: '+29.8%' },
    { stage: 'Objection Handling & Defense', control: 34.1, variant: 58.7, lift: '+72.1%' },
    { stage: 'Test Drive Booking Close', control: 12.4, variant: 18.8, lift: '+51.6%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/40 p-6 rounded-xl border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              A/B Validation active
            </span>
            <span className="text-xs text-zinc-500 font-mono">Sample N = 10,000 calls</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            A/B Split Performance Dashboard
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time metric visualizer comparing Baseline Draft Prompt (Control) vs VoiceCraft v2.4 Prompt Engine (Variant).
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/80">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <div className="text-xs text-zinc-400">Statistical Significance</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">p &lt; 0.001 (99.9% Confidence)</div>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Test Drive Booking Rate"
          controlVal="12.4%"
          variantVal="18.8%"
          liftText="+51.6% Lift"
          isPositiveLift={true}
          icon={<Target className="w-5 h-5 text-emerald-400" />}
        />
        <MetricCard
          title="Early Drop-off (<15s)"
          controlVal="34.2%"
          variantVal="16.1%"
          liftText="-52.9% Drop-off"
          isPositiveLift={true}
          icon={<TrendingDown className="w-5 h-5 text-emerald-400" />}
        />
        <MetricCard
          title="Cross-Sell Rescue Rate"
          controlVal="0.0%"
          variantVal="22.4%"
          liftText="+22.4% Recovery"
          isPositiveLift={true}
          icon={<ShieldCheck className="w-5 h-5 text-blue-400" />}
        />
        <MetricCard
          title="Mean Turn Latency (TTFB)"
          controlVal="1,120 ms"
          variantVal="740 ms"
          liftText="-380 ms Speedup"
          isPositiveLift={true}
          icon={<Zap className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* Interactive Traffic Split Slider Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Dynamic Traffic Split Simulator
            </h3>
            <p className="text-xs text-zinc-400">
              Adjust traffic routing ratio to estimate projected monthly conversions across 10,000 customer calls.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-950 px-4 py-2 rounded-lg border border-zinc-800 font-mono text-sm">
            <span className="text-zinc-400">Control: <strong className="text-zinc-200">{100 - trafficSplit}%</strong></span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400">Variant: <strong className="text-emerald-300">{trafficSplit}%</strong></span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={trafficSplit}
            onChange={(e) => setTrafficSplit(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs font-mono text-zinc-500">
            <span>0% (100% Control Baseline)</span>
            <span>50% Split (Canary Rollout)</span>
            <span>100% (Full Production Variant)</span>
          </div>
        </div>

        {/* Dynamic Forecast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/80">
            <span className="text-xs text-zinc-400 block mb-1">Blended Booking Rate</span>
            <span className="text-2xl font-bold font-mono text-white">{projectedMetrics.blendedRate}%</span>
            <span className="text-[11px] text-zinc-500 block mt-1">Weighted across active split</span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/80">
            <span className="text-xs text-zinc-400 block mb-1">Projected Monthly Bookings</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{projectedMetrics.projectedBookings.toLocaleString()}</span>
            <span className="text-[11px] text-zinc-500 block mt-1">Out of 10,000 monthly leads</span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-lg border border-emerald-500/30 bg-emerald-950/10">
            <span className="text-xs text-emerald-400 block mb-1">Net Additional Conversions</span>
            <span className="text-2xl font-bold font-mono text-emerald-300">
              +{projectedMetrics.incrementalBookings.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-400/80 block mt-1">
              vs. original draft baseline (+{((projectedMetrics.incrementalBookings / projectedMetrics.baselineBookings) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Funnel Stage Progression */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          Funnel Stage Progression & Retention
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          Step-by-step retention rates comparing baseline prompt behavior vs VoiceCraft v2.4 structured block prompts.
        </p>

        <div className="space-y-6">
          {funnelStages.map((stage, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-zinc-200">{stage.stage}</span>
                <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {stage.lift} Relative Lift
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Control Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span>Control Baseline</span>
                    <span>{stage.control}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-zinc-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.control}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                {/* Variant Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-emerald-400">
                    <span>Variant (v2.4 Prompt)</span>
                    <span>{stage.variant}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.variant}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ABSplitDashboard;
