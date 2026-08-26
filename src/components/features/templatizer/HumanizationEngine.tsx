'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Volume2, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Phrase {
  text: string;
  type: 'normal' | 'pause' | 'filler';
  start: number;
  end: number;
}

const HINGLISH_PHRASES: Phrase[] = [
  { text: "Iska", type: "normal", start: 0, end: 400 },
  { text: "ARAI", type: "normal", start: 400, end: 900 },
  { text: "certified", type: "normal", start: 900, end: 1500 },
  { text: "range...", type: "pause", start: 1500, end: 2200 },
  { text: "dekhiye", type: "filler", start: 2200, end: 2800 },
  { text: "480 km", type: "normal", start: 2800, end: 3500 },
  { text: "hai,", type: "normal", start: 3500, end: 3950 },
  { text: "par", type: "normal", start: 3950, end: 4250 },
  { text: "real-world", type: "normal", start: 4250, end: 4950 },
  { text: "driving", type: "normal", start: 4950, end: 5450 },
  { text: "mein...", type: "pause", start: 5450, end: 6150 },
  { text: "matlab", type: "filler", start: 6150, end: 6750 },
  { text: "390 se 420 km", type: "normal", start: 6750, end: 7850 },
  { text: "tak", type: "normal", start: 7850, end: 8150 },
  { text: "aaram se", type: "normal", start: 8150, end: 8750 },
  { text: "mil jata hai.", type: "normal", start: 8750, end: 9600 }
];

const MARATHLISH_PHRASES: Phrase[] = [
  { text: "Asha aahe ki", type: "normal", start: 0, end: 600 },
  { text: "ARAI", type: "normal", start: 600, end: 1100 },
  { text: "certified", type: "normal", start: 1100, end: 1700 },
  { text: "range...", type: "pause", start: 1700, end: 2400 },
  { text: "basically", type: "filler", start: 2400, end: 3000 },
  { text: "480 km", type: "normal", start: 3000, end: 3700 },
  { text: "aahe,", type: "normal", start: 3700, end: 4100 },
  { text: "pan", type: "normal", start: 4100, end: 4400 },
  { text: "real-world", type: "normal", start: 4400, end: 5100 },
  { text: "range...", type: "pause", start: 5100, end: 5800 },
  { text: "mhanje", type: "filler", start: 5800, end: 6400 },
  { text: "390 te 420 km", type: "normal", start: 6400, end: 7500 },
  { text: "paryant", type: "normal", start: 7500, end: 8000 },
  { text: "aaramat", type: "normal", start: 8000, end: 8600 },
  { text: "bhetun jaate.", type: "normal", start: 8600, end: 9500 }
];

const TANGLISH_PHRASES: Phrase[] = [
  { text: "ARAI", type: "normal", start: 0, end: 500 },
  { text: "certified", type: "normal", start: 500, end: 1100 },
  { text: "range...", type: "pause", start: 1100, end: 1800 },
  { text: "vandhu", type: "filler", start: 1800, end: 2400 },
  { text: "480 km,", type: "normal", start: 2400, end: 3100 },
  { text: "aana", type: "normal", start: 3100, end: 3600 },
  { text: "real-world", type: "normal", start: 3600, end: 4300 },
  { text: "range...", type: "pause", start: 4300, end: 5000 },
  { text: "ippo paathenga na", type: "filler", start: 5000, end: 6100 },
  { text: "390 to 420 km", type: "normal", start: 6100, end: 7200 },
  { text: "aaramat", type: "normal", start: 7200, end: 7800 },
  { text: "kedaikuradhu.", type: "normal", start: 7800, end: 8600 }
];

export const HumanizationEngine: React.FC = () => {
  const [locale, setLocale] = useState<'hinglish' | 'marathlish' | 'tanglish'>('hinglish');
  const [disfluencyRate, setDisfluencyRate] = useState<'off' | 'natural' | 'heavy'>('natural');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Configure original robotic string
  const ROBOTIC_TEXT = "The ARAI certified range is 480 kilometres, whereas the real-world range is 390 to 420 kilometres depending on driving style.";

  // Get active raw phrases
  const getRawPhrases = (): Phrase[] => {
    switch (locale) {
      case 'marathlish':
        return MARATHLISH_PHRASES;
      case 'tanglish':
        return TANGLISH_PHRASES;
      default:
        return HINGLISH_PHRASES;
    }
  };

  // Dynamically modify phrases based on disfluency rate slider
  const getProcessedPhrases = (): Phrase[] => {
    const raw = getRawPhrases();
    if (disfluencyRate === 'off') {
      // Remove all pauses and fillers, and adjust timings to keep them sequential
      let elapsed = 0;
      return raw
        .filter(p => p.type === 'normal')
        .map(p => {
          const duration = p.end - p.start;
          const newStart = elapsed;
          const newEnd = elapsed + duration;
          elapsed = newEnd;
          return { ...p, start: newStart, end: newEnd };
        });
    }

    if (disfluencyRate === 'heavy') {
      // Add extra pauses/markers
      const heavyPhrases: Phrase[] = [];
      let elapsed = 0;

      raw.forEach((p, idx) => {
        const duration = p.end - p.start;
        // Inject an extra pause or filler before some normal words
        if (p.type === 'normal' && idx > 0 && idx % 3 === 0) {
          const extraFillerText = locale === 'hinglish' ? 'woh...' : locale === 'marathlish' ? 'tar...' : 'yen na...';
          heavyPhrases.push({
            text: extraFillerText,
            type: 'filler',
            start: elapsed,
            end: elapsed + 600
          });
          elapsed += 600;
        }

        heavyPhrases.push({
          ...p,
          start: elapsed,
          end: elapsed + duration
        });
        elapsed += duration;
      });

      return heavyPhrases;
    }

    return raw;
  };

  const processedPhrases = getProcessedPhrases();
  const totalDuration = processedPhrases.length > 0 ? processedPhrases[processedPhrases.length - 1].end : 10000;

  // Animation frame loop
  const tick = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp - pausedTimeRef.current;
    }
    const elapsed = timestamp - startTimeRef.current;

    if (elapsed >= totalDuration) {
      setCurrentTime(totalDuration);
      setIsPlaying(false);
      startTimeRef.current = 0;
      pausedTimeRef.current = 0;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    } else {
      setCurrentTime(elapsed);
      animationRef.current = requestAnimationFrame(tick);
    }
  };

  // Toggle playback
  const handlePlayToggle = () => {
    if (isPlaying) {
      // Pause
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      pausedTimeRef.current = currentTime;
      setIsPlaying(false);
    } else {
      // Play
      startTimeRef.current = 0; // Will be set in tick
      setIsPlaying(true);
      animationRef.current = requestAnimationFrame(tick);
    }
  };

  // Reset playback
  const handleReset = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsPlaying(false);
    setCurrentTime(0);
    pausedTimeRef.current = 0;
    startTimeRef.current = 0;
  };

  // Clear animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Sync state if sliders/locales change during play
  useEffect(() => {
    handleReset();
  }, [locale, disfluencyRate]);

  // Audio wave rendering helper
  const getWaveHeight = (index: number) => {
    if (!isPlaying) return 6;
    // Bouncing calculation based on currentTime
    const speed = 0.005;
    const offset = index * 0.4;
    const wave = Math.sin(currentTime * speed + offset);
    return Math.max(6, Math.floor(6 + (wave + 1) * 11)); // returns 6 to 28
  };

  // Helper to determine if a word is currently active
  const isWordActive = (phrase: Phrase) => {
    return currentTime >= phrase.start && currentTime < phrase.end;
  };

  const isWordSpoken = (phrase: Phrase) => {
    return currentTime >= phrase.end;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <Card className="lg:col-span-1 border-zinc-800 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-base text-zinc-100 flex items-center gap-2">
              <Volume2 className="h-4.5 w-4.5 text-emerald-400" />
              Humanization Controls
            </CardTitle>
            <CardDescription>
              Tweak disfluencies, pauses, and accent switches in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Locale Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">Code-Switch Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {(['hinglish', 'marathlish', 'tanglish'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setLocale(mode)}
                    className={`rounded-lg py-2 text-xs font-medium border capitalize transition-all ${
                      locale === mode
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-950/20'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Disfluency rate slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400">Disfluency Rate</label>
                <Badge variant={disfluencyRate === 'off' ? 'zinc' : disfluencyRate === 'natural' ? 'emerald' : 'amber'} className="text-[10px] uppercase font-mono">
                  {disfluencyRate === 'off' ? '0% (Off)' : disfluencyRate === 'natural' ? '40% (Natural)' : '70% (Heavy)'}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {(['off', 'natural', 'heavy'] as const).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setDisfluencyRate(rate)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium border capitalize transition-all ${
                      disfluencyRate === rate
                        ? 'bg-zinc-200 border-zinc-300 text-zinc-950'
                        : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal pt-1">
                Natural injection inserts colloquial fillers and dynamic micro-pauses mimicking real human breathing patterns.
              </p>
            </div>

            {/* Technical Spec Summary */}
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">First-Byte Latency</span>
                <span className="text-emerald-400 font-semibold font-mono">~310ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Estimated Audio Pitch</span>
                <span className="text-zinc-300 font-mono">Adaptive 162Hz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Filler Audio Overhead</span>
                <span className="text-violet-400 font-mono">
                  {disfluencyRate === 'off' ? '+0ms' : disfluencyRate === 'natural' ? '+180ms' : '+450ms'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualizer Panel */}
        <Card className="lg:col-span-2 border-zinc-800 bg-zinc-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base text-zinc-100">Speech Flow Script Visualizer</CardTitle>
              <CardDescription>Compare dynamic audio rendering with the static raw prompt output.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isPlaying ? 'danger' : 'emerald'}
                size="sm"
                className="h-8.5 text-xs font-semibold"
                onClick={handlePlayToggle}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause Sim</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Play Speech</span>
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="h-8.5 w-8.5 p-0" onClick={handleReset}>
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Draft output (Robotic) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider font-mono">Robotic Draft Prompt (Robotic Output)</span>
                <Badge variant="danger" className="text-[9px] py-0 px-1 border-rose-500/20 bg-rose-500/5">Stiff & Recited</Badge>
              </div>
              <div className="rounded-lg border border-rose-500/10 bg-rose-950/5 p-3.5 text-xs text-zinc-400 italic leading-relaxed">
                "{ROBOTIC_TEXT}"
              </div>
            </div>

            {/* Processed output (Humanized Karaoke) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono">Humanized Speech Pipeline (Dynamic Output)</span>
                <Badge variant="emerald" className="text-[9px] py-0 px-1 border-emerald-500/20 bg-emerald-500/5">Speech-Optimized</Badge>
              </div>
              <div className="rounded-lg border border-emerald-500/10 bg-emerald-950/5 p-4 text-sm leading-relaxed min-h-[90px] flex flex-wrap gap-x-1.5 gap-y-2 items-center">
                {processedPhrases.map((phrase, idx) => {
                  const active = isWordActive(phrase);
                  const spoken = isWordSpoken(phrase);

                  let wordClass = "text-zinc-500 transition-all duration-150";
                  if (active) {
                    wordClass = "text-white font-bold scale-[1.03] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]";
                  } else if (spoken) {
                    wordClass = "text-zinc-300";
                  }

                  let badge = null;
                  if (phrase.type === 'pause') {
                    badge = (
                      <span className={`text-[10px] font-mono px-1 rounded border transition-colors ${
                        active 
                          ? 'border-violet-500/50 bg-violet-500/20 text-violet-300' 
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
                      }`}>
                        [pause]
                      </span>
                    );
                  } else if (phrase.type === 'filler') {
                    badge = (
                      <span className={`text-[10px] font-mono px-1 rounded border transition-colors ${
                        active 
                          ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300' 
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
                      }`}>
                        {phrase.text}
                      </span>
                    );
                  }

                  return (
                    <span key={idx} className="flex items-center gap-1">
                      {phrase.type === 'normal' ? (
                        <span className={wordClass}>{phrase.text}</span>
                      ) : (
                        badge
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Playback Progress Timeline & Waveform */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-zinc-400">Playhead Progress:</span>
                  <span className="font-mono text-zinc-300">{(currentTime / 1000).toFixed(2)}s</span>
                  <span className="text-zinc-600">/</span>
                  <span className="font-mono">{(totalDuration / 1000).toFixed(2)}s</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  <span>Jitter Buffer: 12ms</span>
                </div>
              </div>

              {/* Progress Bar slider */}
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-violet-600 transition-all duration-75"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>

              {/* Animated Waveform Visualization */}
              <div className="h-10 flex items-center justify-center gap-0.75 bg-zinc-950/40 rounded-lg border border-zinc-800/80 overflow-hidden px-4">
                {Array.from({ length: 48 }).map((_, i) => {
                  const h = getWaveHeight(i);
                  const isSpokenBar = (i / 48) * totalDuration < currentTime;

                  return (
                    <div
                      key={i}
                      className={`w-[3px] rounded-full transition-all duration-100 ${
                        isSpokenBar 
                          ? 'bg-gradient-to-t from-emerald-500 to-violet-400' 
                          : 'bg-zinc-800'
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
