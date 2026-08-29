'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Phone, PhoneOff, AlertCircle, Info, Zap, ShieldAlert, CheckCircle2, User, Mic, Send } from 'lucide-react';
import { DynamicWaveform } from './DynamicWaveform';
import { CallStateInspector, CallState } from './CallStateInspector';
import { useAppState } from '@/context/AppStateContext';

interface TimelineItem {
  sender: 'agent' | 'user' | 'system';
  text: string;
  time: string;
}

export const LiveCallStudio: React.FC = () => {
  const { selectedModel, activeLocale } = useAppState();

  const [callStatus, setCallStatus] = useState<'DISCONNECTED' | 'RINGING' | 'CONNECTED'>('DISCONNECTED');
  const [callState, setCallState] = useState<CallState>('DISCONNECTED');
  const [speakerState, setSpeakerState] = useState<'user' | 'agent' | 'idle' | 'calling'>('idle');
  const [turnCount, setTurnCount] = useState<number>(0);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [objectionCount, setObjectionCount] = useState<number>(0);

  const [customInput, setCustomInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Send Custom Interactive Message Handler
  const handleSendCustomMessage = async (passedText?: string) => {
    const textToSend = passedText || customInput;
    if (!textToSend.trim() || callStatus !== 'CONNECTED') return;

    if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);

    setSpeakerState('user');
    const currentDuration = formatDuration(duration);
    const updatedTimeline: TimelineItem[] = [
      ...timeline,
      { sender: 'user', text: textToSend, time: currentDuration }
    ];
    setTimeline(updatedTimeline);
    setCustomInput('');

    // Dynamically classify/update callState based on text input
    const lowerText = textToSend.toLowerCase();
    let nextState: CallState = callState;

    if (lowerText.includes('budget') || lowerText.includes('price') || lowerText.includes('expensive') || lowerText.includes('lakh') || lowerText.includes('sasta') || lowerText.includes('paise')) {
      const nextCount = objectionCount + 1;
      setObjectionCount(nextCount);
      if (nextCount === 1) {
        nextState = 'OBJECTION_REFRAME';
      } else {
        nextState = 'CROSS_SELL_PIVOT';
      }
    } else if (lowerText.includes('book') || lowerText.includes('test drive') || lowerText.includes('drive') || lowerText.includes('schedule') || lowerText.includes('kal') || lowerText.includes('try')) {
      nextState = 'BOOKING_CONFIRMATION';
    } else if (lowerText.includes('range') || lowerText.includes('charge') || lowerText.includes('battery') || lowerText.includes('km') || lowerText.includes('time') || lowerText.includes('speed')) {
      nextState = 'VALUE_PROPOSITION';
    } else if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('namaskar') || lowerText.includes('priya') || lowerText.includes('kya')) {
      nextState = 'GREETING';
    }

    setCallState(nextState);

    // Dynamic processing delayed by 800ms to feel natural
    playbackTimeoutRef.current = setTimeout(async () => {
      setSpeakerState('agent');
      setTurnCount(prev => prev + 1);

      let fallbackText = "Haan toh... I understand. Humein batayiye, aap aur kya jaana chahenge?";
      if (nextState === 'OBJECTION_REFRAME') {
        fallbackText = 'I understand, Rahul ji. Par ₹18.99 Lakhs ex-showroom price hone par bhi, iska certified running cost sirf ₹1.20 per km padta hai. Yeh regular petrol car se kaafi sasta hai.';
      } else if (nextState === 'CROSS_SELL_PIVOT') {
        fallbackText = 'Acha, agar budget abhi priority hai toh humare paas Aveon Urban compact model bhi hai under ₹11.49 Lakhs ex-showroom. Kya iska specs share karoon?';
      } else if (nextState === 'BOOKING_CONFIRMATION') {
        fallbackText = 'Bohot badhiya sir! Main kal subah 11 baje ka showroom test drive slot book kar deti hoon. Aapko exact WhatsApp location bhej di hai.';
      }

      const reply = await getLiveAgentResponse(
        textToSend,
        nextState,
        fallbackText,
        updatedTimeline
      );

      setTimeline(prev => [
        ...prev,
        { sender: 'agent', text: reply, time: formatDuration(duration) }
      ]);

      playbackTimeoutRef.current = setTimeout(() => {
        setSpeakerState('idle');
      }, 4000);
    }, 800);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        
        const localeLower = activeLocale.toLowerCase();
        if (localeLower.includes('marathlish')) {
          rec.lang = 'mr-IN';
        } else if (localeLower.includes('tanglish')) {
          rec.lang = 'ta-IN';
        } else {
          rec.lang = 'hi-IN';
        }
        
        rec.onstart = () => {
          setIsListening(true);
        };
        
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCustomInput(transcript);
          handleSendCustomMessage(transcript);
        };
        
        rec.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
        
        rec.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current = rec;
      }
    }
  }, [activeLocale]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setCustomInput('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Speech recognition already started or busy", e);
      }
    }
  };

  // Start ticking call duration
  useEffect(() => {
    if (callStatus === 'CONNECTED') {
      durationIntervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      setDuration(0);
    }
    return () => {
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
    };
  }, [callStatus]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
    };
  }, []);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock audio beeps for dialing ringtone
  const playRingTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      
      // Stop beep after 400ms
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 400);
    } catch (e) {
      console.warn('Audio Context not allowed by user interaction yet', e);
    }
  };

  const handleStartCall = () => {
    setCallStatus('RINGING');
    setSpeakerState('calling');
    setCallState('DISCONNECTED');
    setTurnCount(0);
    setObjectionCount(0);
    setTimeline([{ sender: 'system', text: 'Dialing outbound lead: Rahul Sharma (+91 98765 43210)...', time: '0:00' }]);

    playRingTone();

    // Answer call after 2s
    playbackTimeoutRef.current = setTimeout(() => {
      setCallStatus('CONNECTED');
      setCallState('GREETING');
      setSpeakerState('agent');
      setTurnCount(1);
      setTimeline(prev => [
        ...prev,
        { sender: 'system', text: 'Call Answered. Direct connection established.', time: '0:02' },
        { sender: 'agent', text: 'Namaskar! Aveon Motors se Priya bol rahi hoon. Kya meri baat Rahul ji se ho rahi hai?', time: '0:02' }
      ]);

      // Return speaker state to idle after greeting finishes
      playbackTimeoutRef.current = setTimeout(() => {
        setSpeakerState('idle');
      }, 3000);

    }, 2000);
  };

  const handleHangUp = () => {
    if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
    setCallStatus('DISCONNECTED');
    setCallState('DISCONNECTED');
    setSpeakerState('idle');
    setTimeline(prev => [...prev, { sender: 'system', text: 'Call disconnected by operator.', time: formatDuration(duration) }]);
  };

  // Helper to fetch dynamic LLM response from Groq API with robust fallback
  async function getLiveAgentResponse(
    userText: string,
    stateForPrompt: string,
    fallbackText: string,
    currentTimeline: TimelineItem[]
  ): Promise<string> {
    const systemPrompt = `You are Priya, a polite, warm, and highly proactive female sales advisor at Aveon Motors showroom speaking Hinglish.
You are making an OUTBOUND sales pitch call to Rahul Sharma (+91 98765-43210).
We are presenting the ${selectedModel} (Locale dialect: ${activeLocale}).
Current Call State: ${stateForPrompt}

CRITICAL RULES FOR OUTBOUND SALES PITCH:
1. You are pitching, NOT answering customer service. Do NOT passively ask "Aapka koi sawal ho toh batayein" or wait for the user to ask questions. You must lead the conversation and drive the pitch.
2. Keep the response very short (under 3 sentences, max 40 words) for a voice call.
3. Blend in natural Hinglish disfluency fillers (e.g., 'Haan toh...', 'Acha dekhiye...', 'Matlab...', 'Basically...') and brief pauses.
4. Do NOT use list formats, bullet points, asterisks, or markdown. Output raw spoken text only.

DIALOGUE STATE SYSTEM GUIDELINES:
- Under 'GREETING': Introduce yourself warmly as Priya from Aveon Motors, confirm Rahul's identity, and pitch the new launch of ${selectedModel} SUV. Ask them if they are considering shifting to an electric vehicle.
- Under 'VALUE_PROPOSITION': Pitch the core highlights of ${selectedModel} (e.g. ARAI certified range, space, battery) and ask if they would like to experience it in a test drive.
- Under 'OBJECTION_REFRAME': Defend the value. Reframe the price by explaining the low running cost of ₹1.20/km and savings over petrol. Ask if this fuel-savings math makes sense to them. Do NOT pivot to other models yet.
- Under 'CROSS_SELL_PIVOT': Pivot to the budget alternative, Aveon Urban (₹11.49L, compact and easy city parking). Ask if they want to check out this model.
- Under 'BOOKING_CONFIRMATION': Confirm a test drive booking for tomorrow morning at 11 AM at their nearest showroom and ask if that time works.`;

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userMessage: userText,
          conversationHistory: currentTimeline
            .filter(item => item.sender !== 'system')
            .map(item => ({
              sender: item.sender,
              text: item.text,
            })),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.reply) {
        throw new Error("API call failed");
      }
      return data.reply;
    } catch (e) {
      console.warn("Groq API failed in Live Simulator, using local fallback response", e);
      return fallbackText;
    }
  };

  // 1. Simulate User Interruption (Barge-in test)
  const triggerInterruption = async () => {
    if (callStatus !== 'CONNECTED') return;
    
    // Stop any pending agent speech
    if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
    
    setSpeakerState('user');
    const userText = 'Arey wait wait, main already ek electric vehicle own karta hoon!';
    const currentDuration = formatDuration(duration);
    const updatedTimeline: TimelineItem[] = [
      ...timeline,
      { sender: 'user', text: userText, time: currentDuration }
    ];
    setTimeline(updatedTimeline);

    // Agent barge-in response within 400ms VAD detection
    playbackTimeoutRef.current = setTimeout(async () => {
      setSpeakerState('agent');
      setCallState('VALUE_PROPOSITION');
      setTurnCount(prev => prev + 1);

      const reply = await getLiveAgentResponse(
        userText,
        'VALUE_PROPOSITION',
        'Oh, acha! (pauses) Arey bohot badhiya sir! Aap abhi kaunsi EV chala rahe hain?',
        updatedTimeline
      );

      setTimeline(prev => [
        ...prev,
        { sender: 'agent', text: reply, time: formatDuration(duration) }
      ]);
      
      playbackTimeoutRef.current = setTimeout(() => {
        setSpeakerState('idle');
      }, 3500);
    }, 400);
  };

  // 2. Simulate Budget Objection
  const triggerObjection = async () => {
    if (callStatus !== 'CONNECTED') return;

    if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);

    setSpeakerState('user');
    const userText = 'Mujhe Aveon E1 toh pasand hai, par iska price aur maintenance bohot high lag raha hai.';
    const currentDuration = formatDuration(duration);
    const updatedTimeline: TimelineItem[] = [
      ...timeline,
      { sender: 'user', text: userText, time: currentDuration }
    ];
    setTimeline(updatedTimeline);

    const nextCount = objectionCount + 1;
    setObjectionCount(nextCount);

    // Dynamic processing delayed by 800ms to feel natural
    playbackTimeoutRef.current = setTimeout(async () => {
      setSpeakerState('agent');
      setTurnCount(prev => prev + 1);

      if (nextCount === 1) {
        setCallState('OBJECTION_REFRAME');
        const reply = await getLiveAgentResponse(
          userText,
          'OBJECTION_REFRAME',
          'I understand, Rahul ji. Par ₹18.99 Lakhs ex-showroom price hone par bhi, iska certified running cost sirf ₹1.20 per km padta hai. Yeh regular petrol car se kaafi sasta hai.',
          updatedTimeline
        );
        setTimeline(prev => [
          ...prev,
          { sender: 'agent', text: reply, time: formatDuration(duration) }
        ]);
      } else {
        setCallState('CROSS_SELL_PIVOT');
        const reply = await getLiveAgentResponse(
          userText,
          'CROSS_SELL_PIVOT',
          'Acha, agar budget abhi priority hai toh humare paas Aveon Urban compact model bhi hai under ₹11.49 Lakhs ex-showroom. Kya iska specs share karoon?',
          updatedTimeline
        );
        setTimeline(prev => [
          ...prev,
          { sender: 'agent', text: reply, time: formatDuration(duration) }
        ]);
      }

      playbackTimeoutRef.current = setTimeout(() => {
        setSpeakerState('idle');
      }, 5000);
    }, 800);
  };

  // 3. Ask Spec Question (Charging)
  const triggerSpecQuestion = async () => {
    if (callStatus !== 'CONNECTED') return;

    if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);

    setSpeakerState('user');
    const userText = 'Iska charging time kitna lagta hai full hone mein?';
    const currentDuration = formatDuration(duration);
    const updatedTimeline: TimelineItem[] = [
      ...timeline,
      { sender: 'user', text: userText, time: currentDuration }
    ];
    setTimeline(updatedTimeline);

    playbackTimeoutRef.current = setTimeout(async () => {
      setSpeakerState('agent');
      setTurnCount(prev => prev + 1);

      const reply = await getLiveAgentResponse(
        userText,
        'GENERAL_SPECS',
        'Aveon E1 ko regular DC fast charger se charge hone mein lagbhag 45 minutes lagte hain zero se eighty percent tak.',
        updatedTimeline
      );

      setTimeline(prev => [
        ...prev,
        { sender: 'agent', text: reply, time: formatDuration(duration) }
      ]);

      playbackTimeoutRef.current = setTimeout(() => {
        setSpeakerState('idle');
      }, 4000);
    }, 600);
  };

  // 4. Booking Close Trigger
  const triggerBookingClose = async () => {
    if (callStatus !== 'CONNECTED') return;

    if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);

    setSpeakerState('user');
    const userText = 'Thik hai, main test drive lena chahunga.';
    const currentDuration = formatDuration(duration);
    const updatedTimeline: TimelineItem[] = [
      ...timeline,
      { sender: 'user', text: userText, time: currentDuration }
    ];
    setTimeline(updatedTimeline);

    playbackTimeoutRef.current = setTimeout(async () => {
      setSpeakerState('agent');
      setCallState('BOOKING_CONFIRMATION');
      setTurnCount(prev => prev + 1);

      const reply = await getLiveAgentResponse(
        userText,
        'BOOKING_CONFIRMATION',
        'Bohot badhiya sir! Main kal subah 11 baje ka showroom test drive slot book kar deti hoon. Aapko exact WhatsApp location bhej di hai.',
        updatedTimeline
      );

      setTimeline(prev => [
        ...prev,
        { sender: 'agent', text: reply, time: formatDuration(duration) }
      ]);

      playbackTimeoutRef.current = setTimeout(() => {
        setSpeakerState('idle');
      }, 4000);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Call Simulator Dashboard (Left 7 Columns) */}
      <div className="lg:col-span-8 space-y-6">
        <Card className="border-zinc-800 bg-zinc-900/10">
          <CardHeader className="py-4 border-b border-zinc-850 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${callStatus === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400 animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Outbound Call Sandbox</CardTitle>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">TARGET: Rahul Sharma (+91 98765...)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              {callStatus === 'CONNECTED' && (
                <>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {formatDuration(duration)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    VAD Active
                  </span>
                </>
              )}
              {callStatus === 'RINGING' && (
                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                  DIALING...
                </span>
              )}
              {callStatus === 'DISCONNECTED' && (
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">
                  OFFLINE
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-6">
            {/* Audio Waveform Canvas */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">
                <span>Real-Time Speech Signal</span>
                <span className="text-zinc-400">{speakerState === 'agent' ? 'VOICE_AGENT SPEAKING' : speakerState === 'user' ? 'CALLER SPEAKING' : 'IDLE / LISTENING'}</span>
              </div>
              <DynamicWaveform speakerState={speakerState} />
            </div>

            {/* Simulated Call Log Console */}
            <div className="border border-zinc-850 bg-zinc-950/80 rounded-xl p-4 min-h-[250px] max-h-[300px] overflow-y-auto space-y-4">
              {timeline.map((item, idx) => {
                if (item.sender === 'system') {
                  return (
                    <div key={idx} className="text-center py-1.5 border-y border-dashed border-zinc-850/60 text-[10px] text-zinc-500 font-mono">
                      {item.text}
                    </div>
                  );
                }

                return (
                  <div key={idx} className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] text-zinc-500 font-mono mb-1">
                      {item.sender === 'user' ? 'CALLER' : 'VOICE_AGENT'} • {item.time}
                    </span>
                    <div
                      className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[85%] border ${
                        item.sender === 'user'
                          ? 'border-emerald-500/20 bg-emerald-950/5 text-zinc-200'
                          : 'border-zinc-850 bg-zinc-900/60 text-zinc-300'
                      }`}
                    >
                      {item.text}
                    </div>
                  </div>
                );
              })}

              {timeline.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-xs">
                  <Mic className="h-6 w-6 text-zinc-700 mb-2" />
                  <span>Start the outbound dial to open audio stream connection.</span>
                </div>
              )}
            </div>

            {/* Custom Interactive Chat & Voice Input */}
            {callStatus === 'CONNECTED' && (
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-850/40">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendCustomMessage();
                    }}
                    placeholder="Type your reply to Priya (e.g., 'price is too high', 'what is the range?')..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 pr-10"
                    disabled={speakerState === 'agent'}
                  />
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                      isListening 
                        ? 'bg-rose-500/10 text-rose-400 animate-pulse' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                    title={isListening ? "Listening... click to stop" : "Speak with microphone"}
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Button
                  variant="emerald"
                  size="sm"
                  onClick={() => handleSendCustomMessage()}
                  disabled={!customInput.trim() || speakerState === 'agent'}
                  className="h-8 text-[11px]"
                >
                  <Send className="w-3 h-3 mr-1" />
                  <span>Send</span>
                </Button>
              </div>
            )}

            {/* Action Simulator Controls */}
            <div className="pt-3 border-t border-zinc-850/60 space-y-3">
              <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider block">Interaction Simulator Triggers</span>
              
              <div className="flex flex-wrap items-center gap-2">
                {callStatus === 'DISCONNECTED' ? (
                  <Button
                    variant="emerald"
                    size="sm"
                    className="h-9 px-4 font-semibold text-xs gap-1.5"
                    onClick={handleStartCall}
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    <span>Dial Lead</span>
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    className="h-9 px-4 font-semibold text-xs gap-1.5"
                    onClick={handleHangUp}
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Hang Up</span>
                  </Button>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={callStatus !== 'CONNECTED'}
                    className="h-9 text-xs border-zinc-850"
                    onClick={triggerInterruption}
                    title="Simulate user barge-in speech detection cutoff"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trigger Barge-In</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={callStatus !== 'CONNECTED'}
                    className="h-9 text-xs border-zinc-850"
                    onClick={triggerObjection}
                    title="Objection 1: Run Reframe | Objection 2: Cross-Sell Urban Suggestion"
                  >
                    <span>💰 Price Objection</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={callStatus !== 'CONNECTED'}
                    className="h-9 text-xs border-zinc-850"
                    onClick={triggerSpecQuestion}
                    title="Test asking spec questions"
                  >
                    <span>❓ Charging Spec</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={callStatus !== 'CONNECTED'}
                    className="h-9 text-xs border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/5 bg-emerald-500/5"
                    onClick={triggerBookingClose}
                    title="Proceed to Booking"
                  >
                    <span>🎯 Book Test Drive</span>
                  </Button>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* State Inspector Sidebar (Right 4 Columns) */}
      <div className="lg:col-span-4">
        <CallStateInspector
          currentState={callState}
          turnCount={turnCount}
          modelInjected={selectedModel}
          alternateInjected={selectedModel === 'Aveon Urban' ? 'Aveon E1 (SUV)' : 'Aveon Urban (Budget)'}
          disfluencyRate={`${activeLocale.includes('Hinglish') ? 'Hinglish' : activeLocale.includes('Marathlish') ? 'Marathlish' : 'Tanglish'} Markers (40%)`}
        />
      </div>

    </div>
  );
};
export default LiveCallStudio;
