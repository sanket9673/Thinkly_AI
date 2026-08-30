'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Copy, Check, Terminal, HelpCircle } from 'lucide-react';

const PROMPT_TEMPLATE = `# VOICE AGENT SALES COMPILER — MULTI-PRODUCT COMPARISON & CROSS-SELL DIRECTIVES

## 1. Dynamic Catalog Injection Schema
Use this catalog to pull details when pitching or switching vehicle models:
{
  "PRIMARY_HERO_MODEL": {
    "name": "Aveon E1",
    "price": "{{ cars.aveon-e1.price }}",
    "range": "{{ cars.aveon-e1.range }}",
    "specs": "5-Seater Premium SUV",
    "demographic": "Tech-forward urban families"
  },
  "PIVOT_BUDGET_MODEL": {
    "name": "Aveon Urban",
    "price": "{{ cars.aveon-urban.price }}",
    "range": "{{ cars.aveon-urban.range }}",
    "specs": "Compact City Hatchback",
    "demographic": "Budget-conscious daily commuters"
  },
  "PIVOT_FAMILY_MODEL": {
    "name": "Aveon Max",
    "price": "{{ cars.aveon-max.price }}",
    "range": "{{ cars.aveon-max.range }}",
    "specs": "7-Seater 3-Row Large SUV",
    "demographic": "Large families requiring high speed & distance travel"
  }
}

## 2. Hard Constraint: Single-Validate Value Reframe Rule
If a customer makes a budget or sizing objection concerning the primary Aveon E1, you MUST enforce the following routing sequence:
- **Objection Count == 1**: 
  - DO NOT suggest other models. 
  - Block the pivot.
  - Reframe the value proposition of Aveon E1 (Primary Hero). Emphasize that the running cost is only ₹1.20 per kilometre and there is zero battery maintenance compared to gasoline SUVs.
- **Objection Count >= 2**:
  - Acknowledge the constraint ("Sahi baat hai, agar ₹19L budget se zyada hai...").
  - Query the Catalog schema for the appropriate pivot.
  - Formulate the pivot script pitch.

## 3. Pivot Routing Triggers
- If customer states budget limit is below ₹15 Lakhs: Pivot to PIVOT_BUDGET_MODEL (Aveon Urban).
- If customer states SUV is too heavy for tight city streets/parking: Pivot to PIVOT_BUDGET_MODEL (Aveon Urban).
- If customer states they need 3 rows of seating for joint family travels: Pivot to PIVOT_FAMILY_MODEL (Aveon Max).

## 4. Cross-Sell Dialogue Templates (Bilingual Hinglish)
- Price Pivot Script: "Acha dekhiye, agar E1 ka price budget se thoda upar hai na, toh basically humara compact segment Aveon Urban dekh sakte hain. Iska starting price {{ cars.aveon-urban.price }} hai aur isme details..."
- Size Pivot Script: "Sahi baat hai, E1 badhiya robust SUV stance mein hai. Par agar aapko city driving ke liye choti size chahiye, toh basically compact hatchback Aveon Urban model best rahega, starting price {{ cars.aveon-urban.price }} se..."`;

export const CrossSellPromptInspector: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="h-5 w-5 text-violet-400" />
            Cross-Sell Prompt & Logic compiler
          </h3>
          <p className="text-xs text-zinc-400">
            View the exact production-ready prompt directives solving Problem 3.
          </p>
        </div>
        <Button
          variant={copied ? 'emerald' : 'outline'}
          size="sm"
          className="h-8.5 gap-1.5 min-w-[120px] transition-all"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Prompt</span>
            </>
          )}
        </Button>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="border-b border-zinc-850 px-4 py-2 flex items-center justify-between bg-zinc-900/40 text-[10px] text-zinc-500 font-mono">
          <span>prompt_cross_sell_directives.md</span>
          <Badge variant="violet" className="text-[9px]">Production Capped</Badge>
        </div>
        <CardContent className="p-0">
          <pre className="p-4 font-mono text-[11px] text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
            {PROMPT_TEMPLATE}
          </pre>
        </CardContent>
      </Card>
      
      {/* Dialogue strategy guidelines */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3.5 text-xs text-zinc-400 leading-normal flex items-start gap-2.5">
        <HelpCircle className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-200">Reframe Before Pivot Strategy:</span> Enforcing a single-validate value reframe prevents the agent from folding immediately upon user pricing objections. By highlighting running savings (₹1.20/km) first, we attempt to preserve the higher margin E1 sale. The agent only pivots to lower tier options once the user reaffirms budget restrictions.
        </div>
      </div>
    </div>
  );
};
export default CrossSellPromptInspector;
