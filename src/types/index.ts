export type TabType = 
  | 'overview' 
  | 'templatizer' 
  | 'cross-sell' 
  | 'missing-blocks' 
  | 'evaluation' 
  | 'simulator' 
  | 'pdf-exporter';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  realRange: string;
  chargingTime: string;
  seating: string;
  valueProps: string[];
  idealBuyer: string;
}

export interface LocaleConfig {
  localeCode: string;
  primaryLang: string;
  secondaryLang: string;
  codeSwitchMode: 'fluid' | 'strict' | 'fallback';
  disfluencyMarkers: {
    opening: string[];
    pauses: string[];
    agreements: string[];
  };
}

export interface MissingBlock {
  id: string;
  title: string;
  category: 'Safety' | 'Latency' | 'State' | 'Tooling' | 'Edge Case';
  targetProblem: string;
  failureScenario: string;
  codeSnippet: string;
  tradeOffs: string[];
}

export interface MetricItem {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
}

export interface SystemModel {
  id: string;
  name: string;
  tagline: string;
  targetAudience: string;
  specs: {
    price: string;
    range: string;
    battery: string;
    chargeTime: string;
  };
}
