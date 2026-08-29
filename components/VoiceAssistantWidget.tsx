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
    const { isListening, isSpeaking, showHint, setShowHint, activeZone } = useAppStore();
    
    // Initialize the logic hook here
    const { processText } = useVoiceAssistant({
        isUiRevealed,
        hasPoweredUp,
        setIsAssetsReady,
    });

    return (
        <>
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
