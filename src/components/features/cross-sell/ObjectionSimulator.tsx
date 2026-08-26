'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MessageCircle, Mic, RefreshCw, Send, Volume2 } from 'lucide-react';
import { CarModel } from './MultiProductCatalogMatrix';

interface Message {
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  state?: string;
}

interface ObjectionSimulatorProps {
  cars: CarModel[];
  onStateUpdate: (state: 'idle' | 'reframe' | 'pivot' | 'hold', type: 'budget' | 'size' | 'feature' | null, count: number) => void;
}

export const ObjectionSimulator: React.FC<ObjectionSimulatorProps> = ({
  cars,
  onStateUpdate,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: 'Haan ji namaskar! Main Aveon showroom se Rohan bol raha hoon. Aapko humari flagship SUV, Aveon E1 ke baare mein kuch jankari chahiye thi?',
      timestamp: '18:00:00'
    }
  ]);
  const [objectionCount, setObjectionCount] = useState(0);
  const [reframeCount, setReframeCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Helper to extract dynamic details of the cars
  const getCarSpec = (id: string) => {
    return cars.find(c => c.id === id) || { price: '', range: '', name: '' };
  };

  // Scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSpeaking]);

  const handleReset = () => {
    setMessages([
      {
        sender: 'agent',
        text: 'Haan ji namaskar! Main Aveon showroom se Rohan bol raha hoon. Aapko humari flagship SUV, Aveon E1 ke baare mein kuch jankari chahiye thi?',
        timestamp: '18:00:00'
      }
    ]);
    setObjectionCount(0);
    setReframeCount(0);
    setIsSpeaking(false);
    onStateUpdate('idle', null, 0);
  };

  const getAgentReply = (userObjection: string, type: 'budget' | 'size' | 'feature') => {
    const e1 = getCarSpec('aveon-e1');
    const urban = getCarSpec('aveon-urban');
    const max = getCarSpec('aveon-max');

    let replyText = '';
    let decidedState: 'idle' | 'reframe' | 'pivot' | 'hold' = 'hold';

    if (type === 'feature') {
      replyText = `Iska range dekhiye... certified range ${e1.range} hai, par real-world driving mein... matlab 390 se 420 km tak aaram se mil jata hai single charge par.`;
      decidedState = 'hold';
    } else if (type === 'size') {
      replyText = `Sahi baat hai, iski design dynamic aur spacious hai. Par agar aapko city driving ke liye compact size chahiye na, toh basically humara compact hatchback Aveon Urban model best rahega, jo ${urban.price} se shuru hota hai aur iski size bohot hi comfortable hai.`;
      decidedState = 'pivot';
    } else if (type === 'budget') {
      // Check reframe constraint
      if (reframeCount === 0) {
        replyText = `Arey sir, iska upfront price dekhiye... matlab thoda premium hai par running cost petrol car se bohot kam hai, bas ₹1.20 per km padta hai. Plus electric vehicle par zero maintenance hai.`;
        decidedState = 'reframe';
        setReframeCount(prev => prev + 1);
      } else {
        replyText = `Acha dekhiye, agar ${e1.price} budget se upar ja raha hai, toh basically humara compact city commuter, Aveon Urban dekh sakte hain. Iska price range ${urban.price} hai aur features bohot badhiya hain.`;
        decidedState = 'pivot';
      }
    }

    return { text: replyText, state: decidedState };
  };

  const triggerObjection = async (text: string, type: 'budget' | 'size' | 'feature') => {
    if (isSpeaking) return; // Prevent double trigger

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const userMsg: Message = { sender: 'user', text, timestamp };
    
    setMessages(prev => [...prev, userMsg]);
    setObjectionCount(prev => prev + 1);
    setIsSpeaking(true);

    // 1. Determine local state routing & fallback text
    const e1 = getCarSpec('aveon-e1');
    const urban = getCarSpec('aveon-urban');

    let decidedState: 'idle' | 'reframe' | 'pivot' | 'hold' = 'hold';
    let localFallbackText = '';
    let updatedReframeCount = reframeCount;

    if (type === 'feature') {
      decidedState = 'hold';
      localFallbackText = `Iska range dekhiye... certified range ${e1.range} hai, par real-world driving mein... matlab 400 km tak aaram se mil jata hai single charge par.`;
    } else if (type === 'size') {
      decidedState = 'pivot';
      localFallbackText = `Sahi baat hai, E1 SUV spacious hai. Par agar aapko city driving ke liye compact size chahiye na, toh basically humara compact hatchback Aveon Urban model best rahega, jo ${urban.price} se shuru hota hai aur iski size bohot hi comfortable hai.`;
    } else if (type === 'budget') {
      if (reframeCount === 0) {
        decidedState = 'reframe';
        localFallbackText = `Arey sir, iska upfront price dekhiye... matlab thoda premium hai par running cost petrol car se bohot kam hai, bas ₹1.20 per km padta hai. Plus electric vehicle par zero battery maintenance hai.`;
        updatedReframeCount = reframeCount + 1;
        setReframeCount(updatedReframeCount);
      } else {
        decidedState = 'pivot';
        localFallbackText = `Acha dekhiye, agar E1 budget se upar ja raha hai, toh basically humara compact city commuter, Aveon Urban dekh sakte hain. Iska price range ${urban.price} hai aur isme features bohot badhiya hain.`;
      }
    }

    // 2. Build Rohan System Prompt based on the state machine constraint
    const systemPrompt = `You are Rohan, a helpful, friendly voice sales agent at Aveon Motors speaking Hinglish.
You are pitching the Aveon E1 SUV (Price: ${e1.price}, Range: ${e1.range}, Battery: 60 kWh LFP Pack, Charging: 28 mins DC fast).
Current Conversation State: ${decidedState.toUpperCase()}
Objection Category: ${type.toUpperCase()}

INSTRUCTIONS:
1. Speak in a highly natural, warm Hinglish dialect.
2. Blend in conversational disfluency oral filler words (e.g., 'Haan toh...', 'Acha dekhiye...', 'Matlab...', 'Basically...') and brief pauses.
3. Keep the response short (under 3 sentences, maximum 45 words) as this is for a voice call stream.
4. Do NOT use any bullet points, list formats, asterisks, or markdown. Output raw spoken text only.
5. If state is REFRAME, defend Aveon E1 using value reframing (running cost is ₹1.20/km, zero battery maintenance). Do NOT suggest other cars.
6. If state is PIVOT, politely redirect and pitch the Aveon Urban Hatchback (Price: ${urban.price}, Range: 315 km Certified, fits small parking spots, regenerative braking).
7. If state is HOLD, answer the spec query directly and politely.`;

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userMessage: text,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.reply) {
        throw new Error("Invalid response");
      }

      const agentMsg: Message = {
        sender: 'agent',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        state: decidedState,
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsSpeaking(false);
      onStateUpdate(decidedState, type, updatedReframeCount);

    } catch (err) {
      console.warn("Groq API error, using local fallback response", err);
      // Timeout simulation for fallback to feel natural
      setTimeout(() => {
        const agentMsg: Message = {
          sender: 'agent',
          text: localFallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          state: decidedState,
        };
        setMessages(prev => [...prev, agentMsg]);
        setIsSpeaking(false);
        onStateUpdate(decidedState, type, updatedReframeCount);
      }, 800);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Mic className="h-5 w-5 text-emerald-400" />
            Live Caller Objection Sandbox
          </h3>
          <p className="text-xs text-zinc-400">
            Click user statements to test dialogue state changes, value reframing, and model cross-selling pivots.
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8.5 gap-1.5" onClick={handleReset}>
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Call State</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playback Objection Triggers */}
        <Card className="lg:col-span-1 border-zinc-800 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-sm">Objection Triggers</CardTitle>
            <CardDescription className="text-[11px]">
              Simulate caller objections to see how prompt routing triggers pivots.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              disabled={isSpeaking}
              className="w-full text-left justify-start h-auto py-2.5 px-3 text-xs leading-normal font-sans border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700"
              onClick={() => triggerObjection("Arey, ₹19 Lakhs starting price is too high for my budget.", 'budget')}
            >
              <span>1st Objection: E1 is too expensive</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={isSpeaking}
              className="w-full text-left justify-start h-auto py-2.5 px-3 text-xs leading-normal font-sans border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700"
              onClick={() => triggerObjection("Mujhe lagta hai ₹19L gaadi bohot mehengi padegi, please budget options batayein.", 'budget')}
            >
              <span>2nd Objection: Still too expensive</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={isSpeaking}
              className="w-full text-left justify-start h-auto py-2.5 px-3 text-xs leading-normal font-sans border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700"
              onClick={() => triggerObjection("Iski length 4.7 meters hai, kya is car ko city driving ke liye heavy padega?", 'size')}
            >
              <span>Objection: Size is too large for city</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={isSpeaking}
              className="w-full text-left justify-start h-auto py-2.5 px-3 text-xs leading-normal font-sans border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700"
              onClick={() => triggerObjection("Iska actual driving range kitna hai single charge par?", 'feature')}
            >
              <span>General Query: Tell me about range</span>
            </Button>

            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">State Machine Tracker</div>
              <div className="rounded-lg bg-zinc-950 p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Objections</span>
                  <span className="text-zinc-300 font-mono font-bold">{objectionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Reframed E1</span>
                  <span className="text-zinc-300 font-mono font-bold">{reframeCount}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Pivoted to Compact</span>
                  <span className="text-emerald-400 font-mono font-bold">{reframeCount > 1 ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Conversation Console */}
        <Card className="lg:col-span-2 border-zinc-800 bg-zinc-900/10 flex flex-col h-[400px] overflow-hidden">
          <CardHeader className="py-3 border-b border-zinc-850 flex flex-row justify-between items-center bg-zinc-900/30">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageCircle className="h-4.5 w-4.5 text-violet-400" />
              Dialogue Activity Stream
            </CardTitle>
            {isSpeaking && (
              <Badge variant="emerald" className="text-[9px] font-mono animate-pulse gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Synthesizing Speech...
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 font-sans bg-zinc-950/20">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-mono mb-1">
                  <span>{msg.sender === 'user' ? 'CUSTOMER' : 'VOICE_AGENT'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {msg.state && (
                    <>
                      <span>•</span>
                      <span className={`font-semibold ${
                        msg.state === 'reframe' ? 'text-rose-400' : msg.state === 'pivot' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {msg.state.toUpperCase()}
                      </span>
                    </>
                  )}
                </div>

                <div
                  className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed max-w-[85%] border ${
                    msg.sender === 'user'
                      ? 'bg-zinc-850 border-zinc-800 text-zinc-200 rounded-tr-none'
                      : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isSpeaking && (
              <div className="flex flex-col items-start">
                <div className="text-[9px] text-zinc-500 font-mono mb-1">VOICE_AGENT • Rendering Audio...</div>
                <div className="h-7 w-28 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center gap-1 px-3">
                  <div className="w-[3px] h-3 bg-emerald-500 rounded-full animate-waveform" />
                  <div className="w-[3px] h-4 bg-emerald-500 rounded-full animate-waveform" style={{ animationDelay: '0.2s' }} />
                  <div className="w-[3px] h-2 bg-emerald-500 rounded-full animate-waveform" style={{ animationDelay: '0.4s' }} />
                  <div className="w-[3px] h-5 bg-emerald-500 rounded-full animate-waveform" style={{ animationDelay: '0.1s' }} />
                  <div className="w-[3px] h-3 bg-emerald-500 rounded-full animate-waveform" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default ObjectionSimulator;
