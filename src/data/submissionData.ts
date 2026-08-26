import { ProductItem, LocaleConfig, MissingBlock, MetricItem, SystemModel } from '@/types';

export const SYSTEM_MODELS: SystemModel[] = [
  {
    id: 'aveon-e1',
    name: 'Aveon E1',
    tagline: 'Entry Level Daily Commuter',
    targetAudience: 'Budget-conscious urban riders & college students',
    specs: {
      price: '₹79,999 - ₹89,999',
      range: '85 km (IDC)',
      battery: '2.2 kWh Swappable LFP',
      chargeTime: '3.5 Hours (0-80%)',
    },
  },
  {
    id: 'aveon-urban',
    name: 'Aveon Urban',
    tagline: 'Mid-Tier High Efficiency City Cruiser',
    targetAudience: 'Working professionals seeking performance & smart features',
    specs: {
      price: '₹1,15,000 - ₹1,28,000',
      range: '135 km (IDC)',
      battery: '3.4 kWh NMC Fixed',
      chargeTime: '4.0 Hours (0-100%)',
    },
  },
  {
    id: 'aveon-max',
    name: 'Aveon Max',
    tagline: 'Flagship Long-Range Performance Scooter',
    targetAudience: 'Tech enthusiasts & long-distance commuters',
    specs: {
      price: '₹1,55,000 - ₹1,72,000',
      range: '190 km (IDC)',
      battery: '4.8 kWh Dual-Pack NMC',
      chargeTime: '1.5 Hours Fast Charge',
    },
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Aveon E1',
    category: 'Budget Commuter',
    priceRange: '₹79k - ₹89k',
    realRange: '85 km',
    chargingTime: '3.5 hrs',
    seating: '2 Person Compact',
    valueProps: ['Lowest entry cost', 'Swappable battery', 'Lightweight agile chassis'],
    idealBuyer: 'Daily short-distance commuters looking for maximum savings',
  },
  {
    id: 'prod-2',
    name: 'Aveon Urban',
    category: 'Premium City',
    priceRange: '₹1.15L - ₹1.28L',
    realRange: '135 km',
    chargingTime: '4.0 hrs',
    seating: '2 Person Ergonomic',
    valueProps: ['Navigation display', 'Regenerative braking', 'Hill assist mode'],
    idealBuyer: 'Office commuters wanting balance of technology and reliable range',
  },
  {
    id: 'prod-3',
    name: 'Aveon Max',
    category: 'Performance Flagship',
    priceRange: '₹1.55L - ₹1.72L',
    realRange: '190 km',
    chargingTime: '1.5 hrs (Fast)',
    seating: '2 Person Premium Cushion',
    valueProps: ['Hyper Charge enabled', '0-40 in 2.9s', 'ABS braking + Cruise control'],
    idealBuyer: 'Tech-savvy riders requiring fast charging and high acceleration',
  },
];

export const LOCALE_CONFIGS: Record<string, LocaleConfig> = {
  'hi-IN-Hinglish': {
    localeCode: 'hi-IN-Hinglish',
    primaryLang: 'Hindi',
    secondaryLang: 'English',
    codeSwitchMode: 'fluid',
    disfluencyMarkers: {
      opening: ['Acha dekhiye,', 'Dekho basically,', 'Haan toh,'],
      pauses: ['matlab...', 'woh kya hai na...', 'aap samajhiye...'],
      agreements: ['Sahi baat hai,', 'Arey bilkul!', 'Haan zaroor,'],
    },
  },
  'ta-IN-Tanglish': {
    localeCode: 'ta-IN-Tanglish',
    primaryLang: 'Tamil',
    secondaryLang: 'English',
    codeSwitchMode: 'fluid',
    disfluencyMarkers: {
      opening: ['Ippo paathenga na,', 'Aama, basically,', 'Enna na,'],
      pauses: ['vandhu...', 'apram...', 'yen na...'],
      agreements: ['Kandippa sir,', 'Seri puriyudhu,', 'Aama aama!'],
    },
  },
  'en-IN': {
    localeCode: 'en-IN',
    primaryLang: 'Indian English',
    secondaryLang: 'Hindi',
    codeSwitchMode: 'fallback',
    disfluencyMarkers: {
      opening: ['So basically,', 'Well actually,', 'Right then,'],
      pauses: ['you see...', 'like...', 'let me check...'],
      agreements: ['Absolutely,', 'Got it,', 'Fair enough,'],
    },
  },
};

export const MISSING_BLOCKS: MissingBlock[] = [
  {
    id: 'block-1',
    title: 'Interruption & Barge-In Handler',
    category: 'Latency',
    targetProblem: 'User talks while agent is speaking, leading to overlapping speech audio',
    failureScenario: 'Agent continues reciting pricing table for 15 seconds while user screams stop',
    codeSnippet: `// Interruption Stream Detector
const handleAudioChunk = (chunk: Int16Array, VAD: VoiceActivityDetector) => {
  if (VAD.isSpeechDetected(chunk) && agentState.status === 'SPEAKING') {
    audioPipeline.stopOutputBuffer();
    agentState.setStatus('LISTENING');
    telemetry.logEvent('BARGE_IN_TRIGGERED');
  }
};`,
    tradeOffs: [
      'Sub-50ms local VAD processing required',
      'Potential false positives on background coughs/claps',
    ],
  },
  {
    id: 'block-2',
    title: 'Context Drift & State Guardrail',
    category: 'State',
    targetProblem: 'LLM loses user intent across long multi-turn conversations',
    failureScenario: 'Agent switches from financing discussion back to basic welcome greeting',
    codeSnippet: `// Sliding Window State Guardrail
interface MemoryState {
  currentProduct: string;
  confirmedBudget: number;
  lastIntent: string;
}

function rebindContext(history: Message[], state: MemoryState): SystemMessage {
  return {
    role: 'system',
    content: \`[CRITICAL STATE] User interested in: \${state.currentProduct}. Budget limit: \${state.confirmedBudget}.\`
  };
}`,
    tradeOffs: [
      'Adds 120-150 tokens overhead per turn',
      'Requires deterministic JSON parsing on context updates',
    ],
  },
  {
    id: 'block-3',
    title: 'Fallback Function Tool Fallback & Timeout',
    category: 'Tooling',
    targetProblem: 'CRM or inventory API slow response stalling voice pipeline',
    failureScenario: 'User asks for stock availability, audio freezes for 6 seconds without response',
    codeSnippet: `// Tool Call Timeout with Conversational Filler
async function fetchStockWithFiller(modelId: string): Promise<StockResult> {
  const fillerPromise = playAudioFiller("Aap rukiye, main stock live system me check kar raha hoon...");
  const dataPromise = api.checkInventory(modelId);
  
  return Promise.race([
    dataPromise,
    timeoutFallback(1800, () => ({ status: 'PENDING_OFFLINE', estimate: 'Available in 2 days' }))
  ]);
}`,
    tradeOffs: [
      'Increases API layer complexity',
      'Requires natural sounding filler audio buffer management',
    ],
  },
  {
    id: 'block-4',
    title: 'Sub-300ms Speech Synthesis Buffer',
    category: 'Latency',
    targetProblem: 'First Byte TTS Latency causing uncomfortable awkward silences',
    failureScenario: 'Agent takes 2.4s to start saying "Yes"',
    codeSnippet: `// Chunked Streaming Audio Pipeline
async function streamTTSToSpeaker(textStream: ReadableStream) {
  for await (const chunk of textStream) {
    if (chunk.isSentenceEnd || chunk.length > 20) {
      const audioBuffer = await ttsEngine.synthesizeChunk(chunk);
      audioOutput.queue(audioBuffer);
    }
  }
}`,
    tradeOffs: [
      'Slightly higher pitch variance across chunk boundaries',
      'Requires websockets streaming connection',
    ],
  },
];

export const SYSTEM_METRICS: MetricItem[] = [
  {
    label: 'End-to-End Latency',
    value: '310 ms',
    change: '-140ms',
    trend: 'up',
    description: 'Target benchmark sub-400ms achieved using chunked streaming',
  },
  {
    label: 'Barge-in Latency',
    value: '45 ms',
    change: '-12ms',
    trend: 'up',
    description: 'Local VAD socket interrupts TTS instantly upon voice detection',
  },
  {
    label: 'Naturalness Index',
    value: '94.2%',
    change: '+8.5%',
    trend: 'up',
    description: 'Evaluated on Hindi-English disfluency marker integration',
  },
  {
    label: 'Cross-Sell Conversion',
    value: '38.4%',
    change: '+12.1%',
    trend: 'up',
    description: 'Successful pivot from budget to mid/high model suggestions',
  },
];
