'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Play, Sparkles, AlertCircle, FileJson, Cpu } from 'lucide-react';

const PRESETS = {
  northline: {
    agent_name: "Aanya",
    dealership_name: "Northline Motors (Delhi)",
    language_config: {
      primaryLang: "Hindi",
      secondaryLang: "English",
      disfluencyMarkers: {
        opening: ["Acha dekhiye", "Dekho basically", "Haan toh"],
        pauses: ["matlab", "woh kya hai na"],
        agreements: ["Sahi baat hai", "Arey bilkul"]
      }
    },
    primary_product: "Aveon Urban",
    catalog: [
      {
        name: "Aveon E1",
        category: "Budget Commuter",
        priceRange: "₹79,999 - ₹89,999",
        realRange: "85 km",
        seating: "2 Person",
        valueProps: ["Lowest entry cost", "Swappable battery"]
      },
      {
        name: "Aveon Urban",
        category: "Premium City",
        priceRange: "₹1,15,000 - ₹1,28,000",
        realRange: "135 km",
        seating: "2 Person",
        valueProps: ["Navigation display", "Regenerative braking"]
      }
    ],
    faqs: [
      {
        question: "Is home charging possible?",
        answer: "Yes, standard 5A sockets will charge the swappable packs at your home easily."
      },
      {
        question: "What is the warranty period?",
        answer: "3 Years or 40,000 kilometres warranty covers both the motor and the battery pack."
      }
    ]
  },
  western: {
    agent_name: "Rohan",
    dealership_name: "Western Auto (Mumbai)",
    language_config: {
      primaryLang: "Marathi",
      secondaryLang: "English",
      disfluencyMarkers: {
        opening: ["Asha aahe ki", "Basically", "He bagha"],
        pauses: ["mhanje", "te kay ahe na"],
        agreements: ["Kharach", "Agdi barobar"]
      }
    },
    primary_product: "Aveon Urban",
    catalog: [
      {
        name: "Aveon Urban",
        category: "Premium City",
        priceRange: "₹1,15,000 - ₹1,28,000",
        realRange: "135 km",
        seating: "2 Person",
        valueProps: ["Hill assist", "Marathi voice interface ready"]
      },
      {
        name: "Aveon Max",
        category: "Performance Flagship",
        priceRange: "₹1,55,000 - ₹1,72,000",
        realRange: "190 km",
        seating: "2 Person",
        valueProps: ["ABS braking", "0-40 in 2.9s"]
      }
    ],
    faqs: [
      {
        question: "Finance options available?",
        answer: "We have tied up with HDFC and IDFC banks offering low EMI options starting from ₹2,999."
      }
    ]
  },
  southern: {
    agent_name: "Karthik",
    dealership_name: "Southern EV (Chennai)",
    language_config: {
      primaryLang: "Tamil",
      secondaryLang: "English",
      disfluencyMarkers: {
        opening: ["Ippo paathenga na", "Basically", "Yen na"],
        pauses: ["vandhu", "apram"],
        agreements: ["Kandippa sir", "Seri puriyudhu"]
      }
    },
    primary_product: "Aveon Max",
    catalog: [
      {
        name: "Aveon E1",
        category: "Budget Commuter",
        priceRange: "₹79,999 - ₹89,999",
        realRange: "85 km",
        seating: "2 Person",
        valueProps: ["Swappable LFP cell", "Agile chassis"]
      },
      {
        name: "Aveon Max",
        category: "Performance Flagship",
        priceRange: "₹1,55,000 - ₹1,72,000",
        realRange: "190 km",
        seating: "2 Person",
        valueProps: ["Fast charging 1.5 hrs", "Cruise control"]
      }
    ],
    faqs: [
      {
        question: "Can I test ride tomorrow?",
        answer: "Sure, Southern EV provides test rides directly at your doorsteps in Chennai."
      }
    ]
  }
};

const SYSTEM_PROMPT_TEMPLATE = `You are {{ agent_name }}, an intelligent and polite voice assistant representing the brand {{ dealership_name }}. Your goal is to guide prospective EV buyers to schedule a test ride or choose a financing plan.

## Regional Language Instructions
- Primary Language: {{ language_config.primaryLang }}
- Secondary/English Blend: {{ language_config.secondaryLang }}
- Approved Conversational Fillers to inject naturally:
  * Openings: {{ language_config.disfluencyMarkers.opening }}
  * Pauses: {{ language_config.disfluencyMarkers.pauses }}
  * Agreements: {{ language_config.disfluencyMarkers.agreements }}

## Dynamic Product Catalog
Pitch items from the inventory based on customer interest:
{% for item in catalog %}
- {{ item.name }} ({{ item.category }}):
  * Price: {{ item.priceRange }}
  * Real-World Range: {{ item.realRange }}
  * Seating Capacity: {{ item.seating }}
  * Key selling points: {{ item.valueProps }}
{% endfor %}

## Regional Customer FAQs
Reference these questions when addressed by callers:
{% for faq in faqs %}
Q: {{ faq.question }}
A: {{ faq.answer }}
{% endfor %}

## Call Strategy rules
1. Do not recite entire spec tables in one turn; suggest one detail at a time.
2. If customer matches a budget commuter profile, pitch the entry models.
3. Always transition towards scheduling a showroom demo or offering a doorstep test ride.`;

export const DynamicSchemaEditor: React.FC = () => {
  const [jsonText, setJsonText] = useState(JSON.stringify(PRESETS.northline, null, 2));
  const [parsedData, setParsedData] = useState<any>(PRESETS.northline);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Parse text whenever it changes
  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonText);
      setParsedData(parsed);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  }, [jsonText]);

  // Load Presets
  const loadPreset = (key: keyof typeof PRESETS) => {
    setJsonText(JSON.stringify(PRESETS[key], null, 2));
  };

  // Compile function returning JSX array
  const compilePromptToJsx = (template: string, data: any): React.ReactNode[] => {
    if (!data) return [template];
    let output = template;

    // 1. Simple replacements
    output = output.replace(/\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/g, (match, key) => {
      const parts = key.split('.');
      let val = data;
      for (const part of parts) {
        if (val && typeof val === 'object' && part in val) {
          val = val[part];
        } else {
          val = undefined;
          break;
        }
      }
      const valStr = Array.isArray(val) ? val.join(', ') : val !== undefined ? String(val) : '';
      return `__VAR__${key}__${valStr}__`;
    });

    // 2. Loop replacements for catalog
    output = output.replace(/\{%\s*for\s+(\w+)\s+in\s+catalog\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, (match, itemVar, body) => {
      if (!Array.isArray(data.catalog)) return '';
      return data.catalog.map((item: any) => {
        let compiledBody = body;
        compiledBody = compiledBody.replace(/\{\{\s*item\.(\w+)\s*\}\}/g, (m: string, key: string) => {
          let val = item[key];
          const valStr = Array.isArray(val) ? val.join(', ') : val !== undefined ? String(val) : '';
          return `__VAR__catalog_${key}__${valStr}__`;
        });
        return compiledBody;
      }).join('\n');
    });

    // 3. Loop replacements for faqs
    output = output.replace(/\{%\s*for\s+(\w+)\s+in\s+faqs\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, (match, faqVar, body) => {
      if (!Array.isArray(data.faqs)) return '';
      return data.faqs.map((faq: any) => {
        let compiledBody = body;
        compiledBody = compiledBody.replace(/\{\{\s*faq\.(\w+)\s*\}\}/g, (m: string, key: string) => {
          let val = faq[key];
          const valStr = val !== undefined ? String(val) : '';
          return `__VAR__faq_${key}__${valStr}__`;
        });
        return compiledBody;
      }).join('\n');
    });

    // 4. Split by markers and convert to styled react badges
    const tokenRegex = /(__VAR__[a-zA-Z0-9_\.]+__.*?__)/g;
    const parts = output.split(tokenRegex);

    return parts.map((part, index) => {
      if (part.startsWith('__VAR__')) {
        const match = part.match(/__VAR__([a-zA-Z0-9_\.]+)__(.*)__/);
        if (match) {
          const [_, key, val] = match;
          const isLoop = key.startsWith('catalog_') || key.startsWith('faq_');
          return (
            <span
              key={index}
              className={`inline-flex items-center rounded px-1.5 py-0.25 text-[11px] font-mono font-bold mx-0.5 border select-none ${
                isLoop
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
              }`}
              title={`Variable: ${key}`}
            >
              {val || '""'}
            </span>
          );
        }
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileJson className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-semibold text-zinc-300">Quick Config Presets:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => loadPreset('northline')}>
              Delhi (Aanya)
            </Button>
            <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => loadPreset('western')}>
              Mumbai (Rohan - Marathi)
            </Button>
            <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => loadPreset('southern')}>
              Chennai (Karthik - Tamil)
            </Button>
          </div>
        </div>
        <Badge variant={jsonError ? 'danger' : 'emerald'} className="text-[10px] uppercase font-mono">
          {jsonError ? 'JSON Error' : 'JSON Valid'}
        </Badge>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* JSON Editor Pane */}
        <Card className="border-zinc-800 bg-zinc-900/30 flex flex-col h-[580px] overflow-hidden">
          <CardHeader className="py-3.5 border-b border-zinc-850">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <span>Client Variables Editor</span>
              <Badge variant="outline" className="text-[9px] text-zinc-500 border-zinc-800">schema.json</Badge>
            </CardTitle>
            <CardDescription className="text-[11px]">
              Directly edit client variable mappings below. Live compiler updates in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative flex flex-col">
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full flex-1 p-4 bg-zinc-950 font-mono text-xs text-zinc-300 focus:outline-none focus:ring-0 resize-none overflow-y-auto"
              spellCheck={false}
            />
            {jsonError && (
              <div className="absolute bottom-0 left-0 right-0 bg-rose-500/10 border-t border-rose-500/25 p-3 flex items-start gap-2 text-xs text-rose-400">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span className="font-mono">{jsonError}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Rendered Prompt Pane */}
        <Card className="border-zinc-800 bg-zinc-900/30 flex flex-col h-[580px] overflow-hidden">
          <CardHeader className="py-3.5 border-b border-zinc-850">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-violet-400" />
                Live System Prompt Engine
              </span>
              <Badge variant="violet" className="text-[9px] py-0 px-1 border-violet-500/20 bg-violet-500/5">Jinja Compiled</Badge>
            </CardTitle>
            <CardDescription className="text-[11px]">
              Visualizing how inputs compile dynamically. Badges correspond to injected properties.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex-1 bg-zinc-950/60 overflow-y-auto text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap">
            {compilePromptToJsx(SYSTEM_PROMPT_TEMPLATE, parsedData)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
