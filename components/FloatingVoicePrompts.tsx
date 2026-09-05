'use client';

import React from 'react';
import { VOICE_COMMANDS } from '@/data/voice-prompts';

import { motion, AnimatePresence } from 'framer-motion';

interface FloatingVoicePromptsProps {
    onCommandClick: (text: string, targetZone?: string) => void;
    isVisible: boolean;
}



export default function FloatingVoicePrompts({ onCommandClick, isVisible }: FloatingVoicePromptsProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <div className="absolute inset-0 z-50 pointer-events-none">
                    {VOICE_COMMANDS.map((cmd, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: [0, -15, 0] // Gentle floating up and down
                            }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ 
                                opacity: { duration: 0.5, delay: idx * 0.2 },
                                scale: { duration: 0.5, delay: idx * 0.2 },
                                y: { 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    ease: "easeInOut",
                                    delay: idx * 0.5 
                                }
                            }}
                            className="absolute pointer-events-auto cursor-pointer group"
                            style={{
                                top: cmd.top,
                                left: cmd.left,
                                right: cmd.right,
                                bottom: cmd.bottom
                            }}
                            onClick={() => onCommandClick(cmd.text, cmd.targetZone)}
                        >
                            <div className="relative">
                                {/* Glow Behind */}
                                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Glass Bubble */}
                                <div className="relative px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-3 overflow-hidden group-hover:border-cyan-500/50 group-hover:bg-white/10 transition-all duration-300">
                                    {/* Inner Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    <span className="text-xl">💬</span>
                                    <span className="text-sm font-medium text-white/90 whitespace-nowrap">
                                        "{cmd.text}"
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
}
