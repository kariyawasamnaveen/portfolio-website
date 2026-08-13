'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  LiveKitRoom, 
  useVoiceAssistant, 
  RoomAudioRenderer
} from '@livekit/components-react';
import { FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const NeuralAetherOrb = ({ state, volume }: { state: string, volume: number }) => {
  const isActive = state === 'speaking' || state === 'listening';
  
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* The Refined Compact Neural Core - No outer glow */}
      <motion.div
        animate={{
          scale: state === 'speaking' ? (1 + volume * 1.5) : (state === 'listening' ? [1, 1.05, 1] : 1),
        }}
        className="relative w-14 h-14 rounded-full z-10 overflow-hidden border border-white/40 shadow-2xl bg-black"
      >
        {/* Layer 1: Electric Magenta/Indigo Swirl */}
        <motion.div 
          animate={{ 
            rotate: 360,
            borderRadius: ["30% 70% 70% 30%", "70% 30% 30% 70%", "30% 70% 70% 30%"]
          }}
          transition={{ duration: isActive ? 3 : 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-40%] opacity-95"
          style={{ background: 'linear-gradient(45deg, #d946ef, #4f46e5, #06b6d4)' }}
        />

        {/* Layer 2: Vibrant Cyan/Gold Pulse */}
        <motion.div 
          animate={{ 
            rotate: -360,
            borderRadius: ["50% 50% 30% 70%", "50% 50% 70% 30%", "50% 50% 30% 70%"]
          }}
          transition={{ duration: isActive ? 5 : 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-30%] opacity-80 mix-blend-overlay"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #f59e0b, #d946ef)' }}
        />

        {/* Internal Glow Overlay */}
        <motion.div 
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white/10 blur-[2px]" 
        />

        {/* Glass Refraction Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_70%)] rounded-full" />
        
        {/* Scanline */}
        <motion.div 
          animate={{ y: [-40, 80] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-0 w-full h-[1px] bg-white/40 blur-[0.5px] z-20"
        />
      </motion.div>
    </div>
  );
};

export default function VoiceAssistant() {
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  const connectToAI = useCallback(async () => {
    if (status === 'connecting' || status === 'connected') return;
    setStatus('connecting');
    try {
      const resp = await fetch(`/api/livekit/token?room=portfolio-room&participant=visitor`);
      const data = await resp.json();
      setWsUrl(data.url);
      setToken(data.token);
      setStatus('connected');
    } catch (e: any) {
      setStatus('error');
    }
  }, [status]);

  useEffect(() => {
    const handleInteraction = () => {
      if (status === 'idle') connectToAI();
    };
    window.addEventListener('click', handleInteraction, { capture: true });
    return () => window.removeEventListener('click', handleInteraction, { capture: true });
  }, [status, connectToAI]);

  return (
    <>
      <AnimatePresence>
        {status === 'connected' && token && wsUrl && (
          <div className="fixed bottom-2 right-2 z-[10000] flex flex-col items-center">
            <LiveKitRoom
              token={token}
              serverUrl={wsUrl}
              connect={true}
              audio={true}
              onDisconnected={() => setStatus('idle')}
            >
              <AssistantContent />
              <RoomAudioRenderer />
            </LiveKitRoom>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === 'connecting' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-8 right-8 z-[10001] bg-black/80 backdrop-blur-3xl px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-4 text-white shadow-2xl"
          >
            <FiLoader className="w-4 h-4 text-amber-500 animate-spin" />
            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-amber-500/80">Connecting AI...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AssistantContent() {
  const { state, audioTrack } = useVoiceAssistant();
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if ((audioTrack as any)?.track) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(new MediaStream([(audioTrack as any).track.mediaStreamTrack]));
      const analyzer = audioContext.createAnalyser();
      source.connect(analyzer);
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      const updateVolume = () => {
        analyzer.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(average / 130);
        requestAnimationFrame(updateVolume);
      };
      updateVolume();
      return () => { if (audioContext.state !== 'closed') audioContext.close(); };
    }
  }, [audioTrack]);

  return (
    <div className="flex flex-col items-center">
      <NeuralAetherOrb state={state} volume={volume} />
    </div>
  );
}
