'use client'

import React from 'react';
import FloatingVoicePrompts from '@/components/FloatingVoicePrompts';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useAppStore } from '@/store/useAppStore';

interface VoiceAssistantWidgetProps {
    isUiRevealed: boolean;
    hasPoweredUp: boolean;
    startDrift: boolean;
    setIsUiRevealed: (v: boolean) => void;
    setIsAssetsReady: (v: boolean) => void;
}

export default function VoiceAssistantWidget({
    isUiRevealed,
    hasPoweredUp,
    startDrift,
    setIsUiRevealed,
    setIsAssetsReady
}: VoiceAssistantWidgetProps) {
    const { isListening, isSpeaking, showHint, setShowHint, activeZone, isPttActive, setIsPttActive } = useAppStore();
    
    // Initialize the logic hook here
    const { processText } = useVoiceAssistant({
        isUiRevealed,
        hasPoweredUp,
        setIsAssetsReady,
    });

    return (
        <>
            {/* Push-to-Talk Button for Mobile Only */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]">
                <button
                    onPointerDown={() => setIsPttActive(true)}
                    onPointerUp={() => setIsPttActive(false)}
                    onPointerLeave={() => setIsPttActive(false)}
                    onContextMenu={(e) => e.preventDefault()}
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 select-none touch-none
                        ${isPttActive ? 'bg-red-500 scale-110 shadow-[0_0_20px_5px_rgba(239,68,68,0.6)]' : 'bg-neutral-800/80 border border-neutral-700/50 text-neutral-400'}`}
                >
                    {isPttActive && <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-40 duration-700" />}
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    {isPttActive && (
                        <span className="absolute -top-8 text-[10px] font-bold text-red-500 uppercase tracking-widest whitespace-nowrap">
                            Listening...
                        </span>
                    )}
                    {!isPttActive && (
                        <span className="absolute -top-8 text-[10px] font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap">
                            Hold to Speak
                        </span>
                    )}
                </button>
            </div>

            {/* The Voice AI Persistent Visualizer (Hidden on Identity page) */}
            {activeZone !== 'identity' && (
                <div className="fixed top-24 right-6 md:top-8 md:left-64 md:right-auto z-[200] md:ml-6 md:pl-6 md:border-l border-white/10 flex items-center pointer-events-none">
                    <div 
                        className={`relative w-6 h-6 rounded-full transition-all duration-700 
                            ${isSpeaking ? 'bg-red-500 shadow-[0_0_25px_8px_rgba(239,68,68,0.8)] scale-125' : 
                              isListening ? 'bg-red-600 shadow-[0_0_20px_5px_rgba(220,38,38,0.7)] animate-pulse' : 
                              'bg-red-950 shadow-[0_0_10px_2px_rgba(153,27,27,0.5)]'}`}
                        style={{ background: 'radial-gradient(circle at 30% 30%, #ef4444, #991b1b, #450a0a)' }}
                    >
                        <div className="absolute top-[15%] left-[20%] w-[50%] h-[35%] rounded-full bg-white/40 blur-[1px] -rotate-12" />
                        {(isSpeaking || isListening) && <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-50 duration-1000" />}
                        {isSpeaking && <div className="absolute inset-[-4px] rounded-full animate-ping bg-red-500 opacity-30 duration-700 delay-100" />}
                    </div>
                </div>
            )}

            {/* Floating Voice Commands on Identity Page */}
            {activeZone === 'identity' && (
                <FloatingVoicePrompts 
                    isVisible={showHint && !isSpeaking && !isListening} 
                    onCommandClick={(text: string) => {
                        setShowHint(false);
                        processText(text);
                    }} 
                />
            )}
        </>
    );
}
