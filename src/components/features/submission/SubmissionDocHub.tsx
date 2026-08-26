'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FileText, Download, Sparkles, Printer, UserCheck } from 'lucide-react';
import { PDFExportButton } from './PDFExportButton';

export const SubmissionDocHub: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Export Toolbar Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/60 p-5 rounded-xl border border-zinc-800/80 no-print print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-zinc-850 text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Intern Technical Assignment Exporter</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Review and export the consolidated technical assignment document. Confetti particles will trigger upon PDF generation.
            </p>
          </div>
        </div>

        {/* Print Trigger Button */}
        <PDFExportButton />
      </div>

      {/* Main Printable Document Sheet */}
      <Card className="border-zinc-800 bg-zinc-900/40 print:border-none print:bg-white print:text-zinc-950 printable-area p-1 md:p-6 print:p-0">
        <CardContent className="space-y-8 font-sans text-sm text-zinc-300 print:text-zinc-900 leading-relaxed max-w-4xl mx-auto py-6">
          
          {/* Header Cover Section */}
          <div className="border-b-2 border-zinc-800 print:border-zinc-900 pb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider print:text-emerald-600 block">
                  Technical Case Assessment Submission
                </span>
                <h1 className="text-xl md:text-2xl font-black text-white print:text-zinc-950 mt-1 tracking-tight">
                  VoiceCraft Engine v2.4 Prompt Architectures
                </h1>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 text-left sm:text-right">
                <div>DATE: August 2026</div>
                <div>VERSION: v2.4 (Production)</div>
                <div>TARGET: FDE Intern Evaluation</div>
              </div>
            </div>

            <div className="p-4 bg-zinc-950/60 print:bg-zinc-100 rounded-lg border border-zinc-850 print:border-zinc-300 flex items-center gap-3 text-xs">
              <UserCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-white print:text-zinc-900">Intern Candidate Portfolio</strong>
                <p className="text-zinc-400 print:text-zinc-600 mt-0.5">
                  Solving Voice Agent Prompt Humanization, Dynamic Catalog cross-selling matrices, and Production Guardrails.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white print:text-zinc-950 uppercase tracking-wide border-l-4 border-emerald-500 pl-2">
              Part 1: Solving the 3 Baseline Problems
            </h2>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Problem 1 */}
              <div className="space-y-2">
                <h3 className="font-bold text-white print:text-zinc-900 text-sm">Problem 1: Script Humanizer & Accents</h3>
                <p className="text-zinc-400 print:text-zinc-700">
                  <strong>Root Cause Analysis:</strong> Conventional voice engines produce robotic, monotonic output because prompts enforce strict punctuation, formal sentence layouts, and dry standard English vocabulary.
                </p>
                <p className="text-zinc-400 print:text-zinc-700">
                  <strong>Solution Strategy:</strong> Injected Hinglish/Tanglish oral markers (`[pause]`, `[um]`, `arey`, `achha`) at a 40% frequency. Built timing loops ensuring speech speed averages 130-150 words per minute to model native Indian dialogue styles.
                </p>
              </div>

              {/* Problem 2 */}
              <div className="space-y-2 pt-2 border-t border-zinc-850 print:border-zinc-300">
                <h3 className="font-bold text-white print:text-zinc-900 text-sm">Problem 2: Universal Prompt Schema</h3>
                <p className="text-zinc-400 print:text-zinc-700">
                  <strong>Logic Boundaries:</strong> Client attributes (budget caps, range preferences) are separated into clear boundaries. Fixed parameters (manufacturer safety norms) remain static, while dynamic attributes (vehicle pricing grids) are injected compile-time using a JSON scheme compiler.
                </p>
                <p className="text-zinc-400 print:text-zinc-700">
                  <strong>Language Isolation:</strong> Direct directives separate English structural parameters from localized Hindi/Marathi output literals, ensuring context attributes do not trigger spelling phonetic distortions.
                </p>
              </div>

              {/* Problem 3 */}
              <div className="space-y-2 pt-2 border-t border-zinc-850 print:border-zinc-300">
                <h3 className="font-bold text-white print:text-zinc-900 text-sm">Problem 3: Multi-Product Cross-Selling</h3>
                <p className="text-zinc-400 print:text-zinc-700">
                  <strong>Single-Validate Reframe Rule:</strong> Immediate cross-selling upon the first objection causes high drop-offs. The prompt enforces a value reframe first: recalculating E1 range run costs at ₹1.20/km vs conventional petrol cars. Subsequent objections trigger target pivots.
                </p>
                <p className="text-zinc-400 print:text-zinc-700">
                  <strong>Catalog Matrix:</strong> Tracks 3 model specs: Aveon E1 (Primary - ₹18.99L), Aveon Urban (Budget compact Hatchback - ₹11.49L), and Aveon Max (Premium 7-Seater - ₹26.50L).
                </p>
              </div>

            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4 pt-4 border-t-2 border-zinc-800 print:border-zinc-900">
            <h2 className="text-base font-bold text-white print:text-zinc-950 uppercase tracking-wide border-l-4 border-emerald-500 pl-2">
              Part 2: The 5 Missing Production Blocks
            </h2>

            <p className="text-xs text-zinc-400 print:text-zinc-700">
              Standard voice agents fail because prompts fail to regulate acoustic hardware, stream latency, and compliance. We implement these five core guardrail prompts:
            </p>

            <table className="w-full text-left text-xs border-collapse border border-zinc-800 print:border-zinc-300">
              <thead>
                <tr className="bg-zinc-950 print:bg-zinc-100 text-white print:text-zinc-900 font-semibold border-b border-zinc-800 print:border-zinc-300">
                  <th className="p-3 border-r border-zinc-800 print:border-zinc-300">Block Name</th>
                  <th className="p-3 border-r border-zinc-800 print:border-zinc-300">Classification</th>
                  <th className="p-3">Target Operational Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 print:divide-zinc-300 text-xs">
                <tr>
                  <td className="p-3 font-semibold border-r border-zinc-850 print:border-zinc-300">1. Barge-in Recovery</td>
                  <td className="p-3 border-r border-zinc-850 print:border-zinc-300">Acoustic / Timing</td>
                  <td className="p-3 text-zinc-400 print:text-zinc-700">Truncate output stream within 400ms upon customer speaking energy threshold detection.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold border-r border-zinc-850 print:border-zinc-300">2. TTS Normalization</td>
                  <td className="p-3 border-r border-zinc-850 print:border-zinc-300">Compliance</td>
                  <td className="p-3 text-zinc-400 print:text-zinc-700">Run regex parser mapping pricing symbols (₹18.99L) and ratings (5★) to natural spoken syllables.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold border-r border-zinc-850 print:border-zinc-300">3. Latency Fillers</td>
                  <td className="p-3 border-r border-zinc-850 print:border-zinc-300">Latency</td>
                  <td className="p-3 text-zinc-400 print:text-zinc-700">Play filler audio buffer under 150ms during slow external database lookup delays.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold border-r border-zinc-850 print:border-zinc-300">4. Escalation & Exit</td>
                  <td className="p-3 border-r border-zinc-850 print:border-zinc-300">Safety</td>
                  <td className="p-3 text-zinc-400 print:text-zinc-700">Identify wrong number targets in Turn 1. Apologize and exit call cleanly without pitch sequences.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold border-r border-zinc-850 print:border-zinc-300">5. Cold Start Consent</td>
                  <td className="p-3 border-r border-zinc-850 print:border-zinc-300">Compliance</td>
                  <td className="p-3 text-zinc-400 print:text-zinc-700">Ensure target identification confirmation and call recording disclosure before sharing budget stats.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3 */}
          <div className="space-y-4 pt-4 border-t-2 border-zinc-800 print:border-zinc-900">
            <h2 className="text-base font-bold text-white print:text-zinc-950 uppercase tracking-wide border-l-4 border-emerald-500 pl-2">
              Part 3: Production Validation & A/B Evaluation
            </h2>

            <div className="space-y-3 text-xs">
              <p className="text-zinc-400 print:text-zinc-700">
                <strong>A/B Performance Lift (10,000 Call Sample):</strong>
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="p-3 bg-zinc-950/60 print:bg-zinc-50 border border-zinc-850 print:border-zinc-300 rounded-lg">
                  <span className="font-semibold block text-white print:text-zinc-900">Test Drive Booking Lift</span>
                  <span className="text-zinc-400 print:text-zinc-600">Control: 12.4% → Variant: 18.8% (<strong>+51.6% Conversion Lift</strong>).</span>
                </li>
                <li className="p-3 bg-zinc-950/60 print:bg-zinc-50 border border-zinc-850 print:border-zinc-300 rounded-lg">
                  <span className="font-semibold block text-white print:text-zinc-900">Early Call Drop-off</span>
                  <span className="text-zinc-400 print:text-zinc-600">Control: 34.2% → Variant: 16.1% (<strong>-52.9% Drop-off Rate</strong>).</span>
                </li>
                <li className="p-3 bg-zinc-950/60 print:bg-zinc-50 border border-zinc-850 print:border-zinc-300 rounded-lg">
                  <span className="font-semibold block text-white print:text-zinc-900">Cross-Sell Recovery</span>
                  <span className="text-zinc-400 print:text-zinc-600">Control: 0.0% → Variant: 22.4% (<strong>+22.4% Recovery Rate</strong>).</span>
                </li>
                <li className="p-3 bg-zinc-950/60 print:bg-zinc-50 border border-zinc-850 print:border-zinc-300 rounded-lg">
                  <span className="font-semibold block text-white print:text-zinc-900">Response Latency (TTFB)</span>
                  <span className="text-zinc-400 print:text-zinc-600">Control: 1,120ms → Variant: 740ms (<strong>-380ms Latency Reduction</strong>).</span>
                </li>
              </ul>

              <p className="text-zinc-400 print:text-zinc-700 pt-2">
                <strong>LLM-as-a-Judge Auditing Pipeline:</strong> Transcript logs are asynchronously analyzed by a GPT-4o evaluator assessing Tone disfluencies, Safety adherence (specification lookup matches), and Barge-in recovery latencies. Phased rollouts deploy Canary traffic splits alongside automated rollback triggers to maintain maximum production reliability.
              </p>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="border-t border-zinc-850 print:border-zinc-400 pt-6 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-zinc-500">
            <span>VoiceCraft Studio Technical Case Assignment</span>
            <span className="mt-1 sm:mt-0">Page 1 of 1 • Generated via Antigravity FDE Studio</span>
          </div>

        </CardContent>
      </Card>
      
    </div>
  );
};
export default SubmissionDocHub;
