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

export interface ProductionBlock {
  id: string;
  title: string;
  category: 'Acoustic Timing' | 'Compliance' | 'Latency' | 'Safety';
  severity: 'Critical' | 'High';
  failureScenario: string;
  recoveredScenario: string;
  fixPrompt: string;
  impact: string;
  codeSnippet: string;
}

export const PRODUCTION_5_BLOCKS: ProductionBlock[] = [
  {
    id: 'block-barge-in',
    title: 'Barge-in & Interruption Recovery Engine',
    category: 'Acoustic Timing',
    severity: 'Critical',
    failureScenario: 'Agent: "Namaskar! Aveon showroom se Rohan bol raha hoon. Kya aap ek premium electric SUV ke baare mein soch rahe hain..."\nCaller (Interrupting at 3s): "Wait! Main already ek EV own karta hoon."\nAgent (Keeps reading script for 10s): "...humara E1 model range 480 km deta hai and isme zero maintenance hai..."',
    recoveredScenario: 'Agent: "Namaskar! Aveon showroom se Rohan bol raha hoon..."\nCaller (Interrupting at 3s): "Wait! Main already ek EV own karta hoon."\nAgent (Instantly cuts audio under 400ms): "Oh, acha! (pauses) Arey bohot badhiya sir! Aap abhi kaunsi EV chala rahe hain?"',
    fixPrompt: 'Monitor WebSocket incoming audio chunks. If client-side VAD (Voice Activity Detector) detects speech energy threshold > -45dB for >= 30ms while Agent is in SPEAKING state:\n1. Immediately stop outgoing TTS audio stream buffer.\n2. Set dialogue state to LISTENING.\n3. Output a conversational interruption-recovery filler ("Oh acha...", "Haan ji boliye...") to pass turn to user.',
    impact: 'Reduces overlap script recite errors by 74%',
    codeSnippet: `// Local VAD Interruption Cut-off
function handleBargeIn(audioChunk: Int16Array, VAD: VoiceActivityDetector) {
  if (VAD.isUserSpeaking(audioChunk) && voiceAgent.state === 'SPEAKING') {
    audioStream.clearBuffer();
    voiceAgent.setState('LISTENING');
    ttsQueue.cancelAll();
    audioPlayback.playInstantFiller("Oh acha...");
  }
}`
  },
  {
    id: 'block-tts-norm',
    title: 'TTS Phonetic Normalization Rulebook',
    category: 'Compliance',
    severity: 'High',
    failureScenario: 'Agent reads: "Iska price starts from rupees eighteen point nine nine lakhs slash ex showroom with five asterisk NCAP safety rating."\nCaller (Confused): "Kya? Eighteen point nine nine slash?"',
    recoveredScenario: 'Agent: "Iska starting price lagbhag unnis lakh ex-showroom hai, aur isme five-star safety rating mil jati hai."',
    fixPrompt: 'Before sending text tokens to TTS compiler, run a regex parser mapping symbols to spoken text:\n- "₹18.99L" -> "unnis lakh ke paas"\n- "/" -> "ex-showroom"\n- "5★" -> "five star safety"\n- Numbers followed by "km" -> read as "kilometres".',
    impact: 'Improves caller comprehension index by 82%',
    codeSnippet: `// Normalizer regex dictionary
function normalizePhonetics(text: string): string {
  return text
    .replace(/₹18\\.99L/g, "lagbhag unnis lakh rupees")
    .replace(/\\/ex-showroom/g, "ex-showroom")
    .replace(/5★/g, "five-star safety rating")
    .replace(/(\\d+)km/g, "$1 kilometres");
}`
  },
  {
    id: 'block-latency-filler',
    title: 'Latency Mitigation & Audio Bridge Fillers',
    category: 'Latency',
    severity: 'Critical',
    failureScenario: 'Caller: "On-road price Delhi mein kitna padega?"\nAgent (Silent for 2.4 seconds due to CRM API fetch delay): "..."\nCaller (Annoyed): "Hello? Awaaz aa rahi hai?" (Hangs up)',
    recoveredScenario: 'Caller: "On-road price Delhi mein kitna padega?"\nAgent (Instantly plays filler audio under 180ms): "Acha ek minute... main system mein check karke batati hoon..."\nAgent (After 1.5s database reply): "...haan, toh Delhi mein iska on-road price lagbhag bees lakh padega."',
    fixPrompt: 'If API/Database lookup takes longer than 150ms, race the promise against an audio filler trigger. Stream conversational filler audio buffer instantly while backend query completes, maintaining active line connection.',
    impact: 'Decreases silence-based drop-offs by 44%',
    codeSnippet: `// Timeout Fallback with Filler Audio
async function fetchCRMData(query: string) {
  const fillerTimer = setTimeout(() => {
    audioPlayback.playInstantFiller("Ek second check kar raha hoon...");
  }, 150);
  
  const result = await api.crmFetch(query);
  clearTimeout(fillerTimer);
  return result;
}`
  },
  {
    id: 'block-escalation',
    title: 'Escalation, Wrong Number Exit & Guardrails',
    category: 'Safety',
    severity: 'High',
    failureScenario: 'Caller: "Hello?"\nAgent: "Haan ji, main Rohan bol raha hoon Aveon motors se. Kya main Rakesh ji se baat..."\nCaller: "Arey wrong number hai."\nAgent (Keeps pitching): "Sir, humara E1 model ₹18.99L se shuru hota hai..."\nCaller: "Wrong number bola na!" (Hangs up)',
    recoveredScenario: 'Caller: "Hello?"\nAgent: "Haan ji... Kya main Rakesh ji se baat kar raha hoon?"\nCaller: "Arey wrong number hai."\nAgent: "Oh, main bohot maafi chahungi. Main number cross-check kar leti hoon. Thank you!" (Cuts call)',
    fixPrompt: 'Verify target identity in Dialogue Turn 1. If caller states "wrong number", "not interested in calls", or sounds like a minor, immediately trigger call exit sequence with a polite apology and hang up.',
    impact: 'Prevents brand harassment complaints by 95%',
    codeSnippet: `// Guardrail Identity Verification Check
function checkIdentityGuard(userSpeech: string) {
  if (userSpeech.match(/(wrong number|galat number|mahi hoon|not [Name])/i)) {
    dialoguePipeline.playPoliteExit("Oh, I apologize, I will check the number. Thank you!");
    connection.hangUp();
  }
}`
  },
  {
    id: 'block-consent',
    title: 'Consent, Identity Verification & Cold Start',
    category: 'Compliance',
    severity: 'High',
    failureScenario: 'Agent (Cold call): "Hi, main Aveon showroom se bol rahi hoon. Aapka credit rating ₹15 Lakhs loan ke liye pre-approved hai..."\nCaller: "Arey main office meeting mein hoon, public speaker par hai call!"',
    recoveredScenario: 'Agent (Cold call): "Hi, kya meri baat Amit ji se ho rahi hai?"\nCaller: "Haan."\nAgent: "Amit ji, main Aveon Motors se bol rahi hoon check-in ke liye. Security rules ke mutabik kya hum recording par do minute baat kar sakte hain, ya baad mein call karoon?"',
    fixPrompt: 'On cold call dials, start with identity confirmation and call recording disclosure. Ask if the customer has 2 minutes to talk or is in a suitable setting before pitching financial or personal specs.',
    impact: 'Ensures 100% compliance with privacy regulations',
    codeSnippet: `// Cold Start Consent Check
async function initiateColdStart() {
  await dialogue.say("Hi, kya meri baat customer se ho rahi hai?");
  const consent = await dialogue.ask("Hum security check ke liye recording kar rahe hain, is it a good time?");
  if (!consent.agreed) {
    dialogue.say("No problem, main baad mein call karungi. Thank you!");
    connection.hangUp();
  }
}`
  }
];

