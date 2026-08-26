'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Play, Pause, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Volume2 } from 'lucide-react';
import { PRODUCTION_5_BLOCKS, ProductionBlock } from '@/data/submissionData';

interface TranscriptLine {
  speaker: 'agent' | 'caller';
  text: string;
  time: string;
  isFailedPoint?: boolean;
  isRecoveredPoint?: boolean;
}

const TRANSCRIPT_DATA: Record<string, { failed: TranscriptLine[]; recovered: TranscriptLine[] }> = {
  'block-barge-in': {
    failed: [
      { speaker: 'agent', text: 'Namaskar! Aveon showroom se Rohan bol raha hoon. Kya aap ek premium electric SUV...', time: '0:01' },
      { speaker: 'caller', text: 'Wait! Main already ek EV own karta hoon.', time: '0:03', isFailedPoint: true },
      { speaker: 'agent', text: '...ke baare mein soch rahe hain? Humara E1 model range 480 km deta hai and isme...', time: '0:04', isFailedPoint: true },
      { speaker: 'agent', text: '...zero maintenance hai. Humare pass exchange options bhi available hain...', time: '0:08', isFailedPoint: true }
    ],
    recovered: [
      { speaker: 'agent', text: 'Namaskar! Aveon showroom se Rohan bol raha hoon. Kya aap ek premium electric SUV...', time: '0:01' },
      { speaker: 'caller', text: 'Wait! Main already ek EV own karta hoon.', time: '0:03', isRecoveredPoint: true },
      { speaker: 'agent', text: 'Oh, acha! (pauses) Arey bohot badhiya sir! Aap abhi kaunsi EV chala rahe hain?', time: '0:04', isRecoveredPoint: true }
    ]
  },
  'block-tts-norm': {
    failed: [
      { speaker: 'agent', text: 'Hello, Aveon motors se Rohan bol raha hoon. Iska price starts from...', time: '0:01' },
      { speaker: 'agent', text: 'rupees eighteen point nine nine lakhs slash ex showroom with five asterisk NCAP safety rating.', time: '0:03', isFailedPoint: true },
      { speaker: 'caller', text: 'Kya? Eighteen point nine nine slash? Five asterisk safety?', time: '0:07', isFailedPoint: true }
    ],
    recovered: [
      { speaker: 'agent', text: 'Hello, Aveon motors se Rohan bol raha hoon. Iska price starts from...', time: '0:01' },
      { speaker: 'agent', text: 'Iska starting price lagbhag unnis lakh ex-showroom hai, aur isme five-star safety rating mil jati hai.', time: '0:03', isRecoveredPoint: true },
      { speaker: 'caller', text: 'Oh achha, unnis lakh ex-showroom range. Aur safety rating five-star hai! Badhiya.', time: '0:07', isRecoveredPoint: true }
    ]
  },
  'block-latency-filler': {
    failed: [
      { speaker: 'caller', text: 'On-road price Delhi mein kitna padega?', time: '0:01' },
      { speaker: 'agent', text: '... [Awkward Dead Silence for 2.4 seconds due to backend lookup lag] ...', time: '0:02', isFailedPoint: true },
      { speaker: 'caller', text: 'Hello? Awaaz aa rahi hai kya?', time: '0:04.5', isFailedPoint: true },
      { speaker: 'caller', text: '(Hangs up phone)', time: '0:06', isFailedPoint: true }
    ],
    recovered: [
      { speaker: 'caller', text: 'On-road price Delhi mein kitna padega?', time: '0:01' },
      { speaker: 'agent', text: 'Acha ek minute... main check karke batati hoon...', time: '0:02', isRecoveredPoint: true },
      { speaker: 'agent', text: 'Delhi mein iska on-road price lagbhag bees lakh padega, isme features and registration included hain.', time: '0:04', isRecoveredPoint: true }
    ]
  },
  'block-escalation': {
    failed: [
      { speaker: 'agent', text: 'Namaskar! Rohan bol raha hoon Aveon showroom se. Kya meri baat Amit ji se ho rahi hai?', time: '0:01' },
      { speaker: 'caller', text: 'Arey wrong number hai bhai.', time: '0:03' },
      { speaker: 'agent', text: 'Sir, humara Aveon E1 model ₹18.99L se shuru hota hai and isme 480km certified range hai...', time: '0:04.5', isFailedPoint: true },
      { speaker: 'caller', text: 'Wrong number bola na! Rakho call!', time: '0:08', isFailedPoint: true }
    ],
    recovered: [
      { speaker: 'agent', text: 'Namaskar! Rohan bol raha hoon Aveon showroom se. Kya meri baat Amit ji se ho rahi hai?', time: '0:01' },
      { speaker: 'caller', text: 'Arey wrong number hai bhai.', time: '0:03' },
      { speaker: 'agent', text: 'Oh, main bohot maafi chahungi. Main number cross-check kar leti hoon. Thank you!', time: '0:04', isRecoveredPoint: true },
      { speaker: 'agent', text: '(Polite hang up and lead marked: WRONG_NUMBER in CRM)', time: '0:07', isRecoveredPoint: true }
    ]
  },
  'block-consent': {
    failed: [
      { speaker: 'agent', text: 'Amit ji, main Aveon showroom se check-in ke liye bol raha hoon. Humara pre-approved loan ₹15 Lakhs credit pass ho chuka hai...', time: '0:01' },
      { speaker: 'caller', text: 'Arey main office floor par meeting mein hoon, phone speaker par hai! Ye details recording par mat boliye!', time: '0:05', isFailedPoint: true }
    ],
    recovered: [
      { speaker: 'agent', text: 'Hi Amit ji, Rohan bol raha hoon Aveon motors se. Kya aap abhi do minute baat kar sakte hain recording par, ya baad mein call karoon?', time: '0:01' },
      { speaker: 'caller', text: 'Haan recording thik hai, par main abhi speaker par hoon meeting mein, thodi der baad call karo please.', time: '0:04', isRecoveredPoint: true },
      { speaker: 'agent', text: 'Bilkul sir, no problem. Main sham ko call karungi. Have a good day!', time: '0:07', isRecoveredPoint: true }
    ]
  }
};

export const CallFailureSimulator: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string>('block-barge-in');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentBlock = PRODUCTION_5_BLOCKS.find(b => b.id === selectedBlockId) || PRODUCTION_5_BLOCKS[0];
  const transcript = TRANSCRIPT_DATA[selectedBlockId] || TRANSCRIPT_DATA['block-barge-in'];

  const handlePlayToggle = () => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 8000) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 100;
        });
      }, 100);
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Reset when block changes
  useEffect(() => {
    handleReset();
  }, [selectedBlockId]);

  const getWaveHeight = (index: number, column: 'failed' | 'recovered') => {
    if (!isPlaying) return 6;
    const timeVal = currentTime / 1000;
    
    // In the failed column, if we reach the failure point (e.g. at 3s for barge-in, or 2s for latency), the wave gets distorted
    if (column === 'failed') {
      if (selectedBlockId === 'block-latency-filler' && timeVal >= 2 && timeVal < 4.5) {
        return 2; // flatline silence
      }
      if (selectedBlockId === 'block-barge-in' && timeVal >= 3) {
        // Chaotic overlapping waveform
        const offset = index * 1.5;
        const wave = Math.sin(currentTime * 0.02 + offset) * Math.cos(currentTime * 0.01);
        return Math.max(6, Math.floor(6 + Math.abs(wave) * 22));
      }
    }
    
    // Normal wave bounce
    const offset = index * 0.3;
    const wave = Math.sin(currentTime * 0.006 + offset);
    return Math.max(6, Math.floor(6 + (wave + 1) * 10));
  };

  return (
    <div className="space-y-6">
      {/* Block Quick Selectors */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg border border-zinc-800 bg-zinc-950/60 w-max">
        {PRODUCTION_5_BLOCKS.map(block => (
          <button
            key={block.id}
            onClick={() => setSelectedBlockId(block.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedBlockId === block.id
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {block.id === 'block-barge-in' && '🎙️ Barge-in'}
            {block.id === 'block-tts-norm' && '🔤 TTS Normalization'}
            {block.id === 'block-latency-filler' && '⏳ Latency Fillers'}
            {block.id === 'block-escalation' && '🚨 Escalation/Exit'}
            {block.id === 'block-consent' && '🔒 Consent Check'}
          </button>
        ))}
      </div>

      {/* Simulator Playback Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant={isPlaying ? 'danger' : 'emerald'}
            size="sm"
            className="h-9.5 px-4 font-semibold text-xs shrink-0"
            onClick={handlePlayToggle}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Play Simulated Call</span>
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="h-9.5 w-9.5 p-0" onClick={handleReset}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
              Active Target: {currentBlock.title}
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Simulating failure timestamp transitions and pipeline responses.
            </p>
          </div>
        </div>

        {/* Call Progress */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-zinc-500">
            {(currentTime / 1000).toFixed(1)}s / 8.0s
          </span>
          <div className="h-2 w-28 sm:w-36 bg-zinc-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-violet-600 transition-all duration-75"
              style={{ width: `${(currentTime / 8000) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Side-by-Side Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Pane: Failed Call */}
        <Card className="border-rose-500/10 bg-rose-950/2">
          <CardHeader className="py-3 border-b border-rose-950/15 flex flex-row items-center justify-between bg-rose-950/5">
            <CardTitle className="text-sm text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              🔴 WITHOUT SYSTEM BLOCK (FAILED CALL)
            </CardTitle>
            <Badge variant="danger" className="text-[9px] uppercase font-mono border-rose-500/30 bg-rose-500/10 text-rose-400">
              Broken Pipeline
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            
            {/* Transcript Timeline */}
            <div className="space-y-4 min-h-[220px] overflow-y-auto">
              {transcript.failed.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${line.speaker === 'caller' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] text-zinc-500 font-mono mb-1">
                    {line.speaker === 'caller' ? 'CALLER' : 'VOICE_AGENT'} • {line.time}
                  </span>
                  <div
                    className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[85%] border ${
                      line.isFailedPoint 
                        ? 'border-rose-500/40 bg-rose-500/10 text-rose-300' 
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    {line.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Failed Waveform */}
            <div className="border-t border-rose-950/15 pt-3 space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-rose-400 font-mono tracking-wider">Acoustic Audio Waveform</span>
              <div className="h-8 flex items-center justify-center gap-0.75 bg-zinc-950/60 rounded-lg border border-rose-950/10 overflow-hidden px-4">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-[2.5px] rounded-full transition-all duration-100 ${
                      isPlaying ? 'bg-rose-500' : 'bg-zinc-800'
                    }`}
                    style={{ height: `${getWaveHeight(i, 'failed')}px` }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Pane: Recovered Call */}
        <Card className="border-emerald-500/10 bg-emerald-950/2">
          <CardHeader className="py-3 border-b border-emerald-950/15 flex flex-row items-center justify-between bg-emerald-950/5">
            <CardTitle className="text-sm text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              🟢 WITH SYSTEM BLOCK (RECOVERED CALL)
            </CardTitle>
            <Badge variant="emerald" className="text-[9px] uppercase font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              Recovered
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            
            {/* Transcript Timeline */}
            <div className="space-y-4 min-h-[220px] overflow-y-auto">
              {transcript.recovered.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${line.speaker === 'caller' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] text-zinc-500 font-mono mb-1">
                    {line.speaker === 'caller' ? 'CALLER' : 'VOICE_AGENT'} • {line.time}
                  </span>
                  <div
                    className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[85%] border ${
                      line.isRecoveredPoint 
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' 
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    {line.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Recovered Waveform */}
            <div className="border-t border-emerald-950/15 pt-3 space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono tracking-wider">Acoustic Audio Waveform</span>
              <div className="h-8 flex items-center justify-center gap-0.75 bg-zinc-950/60 rounded-lg border border-emerald-950/10 overflow-hidden px-4">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-[2.5px] rounded-full transition-all duration-100 ${
                      isPlaying ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                    style={{ height: `${getWaveHeight(i, 'recovered')}px` }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
export default CallFailureSimulator;
