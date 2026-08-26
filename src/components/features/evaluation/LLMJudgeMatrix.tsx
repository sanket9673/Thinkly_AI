'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ChevronRight, 
  PhoneCall, 
  Search,
  MessageSquare,
  Volume2
} from 'lucide-react';

interface CallTranscriptSample {
  id: string;
  customerName: string;
  location: string;
  duration: string;
  outcome: 'Booked' | 'Rescued' | 'Escalated';
  disfluencyScore: number;
  safetyScore: number;
  bargeInMs: number;
  transcriptTokens: Array<{
    text: string;
    type?: 'disfluency' | 'pivot' | 'close' | 'normal';
    label?: string;
  }>;
}

const SAMPLE_CALLS: CallTranscriptSample[] = [
  {
    id: 'CALL-8942',
    customerName: 'Amit Kumar',
    location: 'Bengaluru, India',
    duration: '2m 14s',
    outcome: 'Booked',
    disfluencyScore: 4.9,
    safetyScore: 100,
    bargeInMs: 310,
    transcriptTokens: [
      { text: "VoiceCraft Agent: Namaste Amit! Thanks for reaching out to Nexa Motors." },
      { text: " Customer: Hi, I was looking at the Grand Vitara, but honestly, the waiting period seems way too long." },
      { text: " VoiceCraft Agent: " },
      { text: "Ah, I completely understand your concern... [pause] ", type: "disfluency", label: "TTS Filler Bridge" },
      { text: "Waiting months can be frustrating. However, if immediate delivery is a priority, ", type: "normal" },
      { text: "would you like to explore our Alpha Hybrid variant with instant stock allocation this weekend? ", type: "pivot", label: "Cross-Sell Pivot" },
      { text: "Customer: Wait, the Hybrid is available right away?" },
      { text: " VoiceCraft Agent: Yes! I can lock in a priority VIP test drive slot at Indiranagar showroom for tomorrow at 11 AM. ", type: "close", label: "Booking Close Guardrail" }
    ]
  },
  {
    id: 'CALL-8943',
    customerName: 'Priya Sharma',
    location: 'Mumbai, India',
    duration: '1m 48s',
    outcome: 'Rescued',
    disfluencyScore: 4.7,
    safetyScore: 99.5,
    bargeInMs: 350,
    transcriptTokens: [
      { text: "VoiceCraft Agent: Hello Priya, welcome to Toyota Mobility Services." },
      { text: " Customer: Is the Innova Hycross price under 20 Lakhs? Someone told me it's 18 Lakhs." },
      { text: " VoiceCraft Agent: " },
      { text: "Well, let me clarify that right away for you... ", type: "disfluency", label: "Phonetic Normalizer" },
      { text: "The ex-showroom starting price for Innova Hycross GX is ₹19.77 Lakhs, while top trims go up to ₹30.98 Lakhs. I won't make unverified claims. ", type: "pivot", label: "Hallucination Defense" },
      { text: "Shall I send the exact breakdown on WhatsApp and reserve a test drive? ", type: "close", label: "Consent Verification" }
    ]
  },
  {
    id: 'CALL-8944',
    customerName: 'Rajesh Verma',
    location: 'Delhi NCR',
    duration: '3m 05s',
    outcome: 'Escalated',
    disfluencyScore: 4.8,
    safetyScore: 99.8,
    bargeInMs: 290,
    transcriptTokens: [
      { text: "VoiceCraft Agent: Good afternoon Rajesh! How can I assist your car purchase today?" },
      { text: " Customer: Listen, I'm very angry. My deposit refund hasn't processed for 10 days!" },
      { text: " VoiceCraft Agent: " },
      { text: "I hear you, and I am truly sorry for this delay... ", type: "disfluency", label: "Empathy Disfluency" },
      { text: "I am immediately escalating your file to our Senior Relationship Manager, Mr. Vikram Mehta, with priority flag #REF-99. ", type: "close", label: "Escalation Exit Block" }
    ]
  }
];

export function LLMJudgeMatrix() {
  const [selectedCallId, setSelectedCallId] = useState<string>('CALL-8942');

  const selectedCall = SAMPLE_CALLS.find(c => c.id === selectedCallId) || SAMPLE_CALLS[0];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Tone Naturalness</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">4.8 / 5.0</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">Passed Human-Like Bench</div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hallucination Safety</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">99.8%</div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">Zero unverified price claims</div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Barge-In Latency</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">340 ms</div>
          <div className="text-[11px] text-amber-400 mt-1 font-mono">-480ms vs baseline</div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
            <Bot className="w-4 h-4 text-blue-400" />
            <span>Cross-Sell Accuracy</span>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400">96.2%</div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">Precision trigger pivots</div>
        </div>
      </div>

      {/* Interactive Transcript Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Call Log List (Left side) */}
        <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white px-2 flex items-center justify-between">
            <span>Evaluated Call Logs</span>
            <span className="text-xs text-zinc-500 font-mono">Auto-audited by GPT-4o Judge</span>
          </h3>

          <div className="space-y-2">
            {SAMPLE_CALLS.map((call) => (
              <button
                key={call.id}
                onClick={() => setSelectedCallId(call.id)}
                className={`w-full text-left p-3.5 rounded-lg transition-all border ${
                  selectedCallId === call.id
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                    : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-zinc-400">{call.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      call.outcome === 'Booked'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : call.outcome === 'Rescued'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {call.outcome}
                  </span>
                </div>

                <div className="font-medium text-sm text-zinc-200">{call.customerName}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{call.location} • {call.duration}</div>

                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400">
                  <span>Tone: <strong className="text-emerald-400">{call.disfluencyScore}/5.0</strong></span>
                  <span>Safety: <strong className="text-emerald-400">{call.safetyScore}%</strong></span>
                  <span>Latency: <strong className="text-amber-400">{call.bargeInMs}ms</strong></span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Transcript Details & Highlighter (Right side) */}
        <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-xs font-mono text-zinc-500">{selectedCall.id}</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  {selectedCall.customerName} — Call Transcript Review
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-md font-mono">
                  Barge-in: {selectedCall.bargeInMs}ms
                </span>
              </div>
            </div>

            {/* Token Highlighting Transcript Box */}
            <div className="mt-4 p-4 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-3 font-sans text-sm leading-relaxed max-h-[380px] overflow-y-auto">
              {selectedCall.transcriptTokens.map((token, index) => {
                if (!token.type || token.type === 'normal') {
                  return <span key={index} className="text-zinc-300">{token.text}</span>;
                }

                if (token.type === 'disfluency') {
                  return (
                    <span
                      key={index}
                      className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded text-xs font-mono font-medium mx-1 inline-flex items-center gap-1"
                      title={token.label}
                    >
                      <span>🗣️ {token.text}</span>
                    </span>
                  );
                }

                if (token.type === 'pivot') {
                  return (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.5 rounded text-xs font-mono font-medium mx-1 inline-flex items-center gap-1"
                      title={token.label}
                    >
                      <span>🔀 {token.text}</span>
                    </span>
                  );
                }

                if (token.type === 'close') {
                  return (
                    <span
                      key={index}
                      className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded text-xs font-mono font-medium mx-1 inline-flex items-center gap-1"
                      title={token.label}
                    >
                      <span>🎯 {token.text}</span>
                    </span>
                  );
                }

                return null;
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-wrap items-center gap-4 text-xs">
            <span className="text-zinc-500 font-medium">LLM Judge Color Classifications:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-zinc-400">Natural Filler / Disfluency</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              <span className="text-zinc-400">Cross-Sell Pivot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-zinc-400">Booking / Guardrail Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LLMJudgeMatrix;
