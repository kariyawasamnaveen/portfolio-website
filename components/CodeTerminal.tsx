'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiCode, FiTerminal } from 'react-icons/fi';
import { SiFirebase, SiGooglecloud } from 'react-icons/si';
import { CODE_SNIPPETS } from '@/data/terminal-snippets';
import { type TechId as GlobalTechId } from '@/store/useAppStore';

export type TechId = 'agentic' | 'edge' | 'healing' | 'zerotrust' | 'web3' | 'cicd' | null;

interface CodeTerminalProps {
    activeTech: TechId;
    setActiveTech: (tech: TechId) => void;
    isAnalyzing: boolean;
    onAnalyze?: (tech: TechId) => void;
    codeHighlight?: string | null;
}


export function CodeTerminal({ activeTech, setActiveTech, onAnalyze, isAnalyzing, codeHighlight }: CodeTerminalProps) {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        if (!activeTech) {
            setLines(['// SYSTEM IDLE', '// SELECT A TECHNOLOGY TO INITIATE CODE INJECTION...']);
            return;
        }

        const fullCode = CODE_SNIPPETS[activeTech as keyof typeof CODE_SNIPPETS].code;
        const codeLines = fullCode.split('\n');
        setLines([]);
        
        let currentLines: string[] = [];
        let i = 0;
        
        const interval = setInterval(() => {
            if (i < codeLines.length) {
                currentLines = [...currentLines, codeLines[i]];
                setLines(currentLines);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [activeTech]);

    const techs = [
        { id: 'agentic' as TechId, name: 'Autonomous AI (LLMs)', icon: <FiCpu size={18} />, activeColor: 'border-[#FF007F] text-[#ff4da6]', bg: 'hover:border-[#FF007F]/40' },
        { id: 'edge' as TechId, name: 'Global Edge Network', icon: <FiTerminal size={18} />, activeColor: 'border-[#339933] text-[#6dbf6d]', bg: 'hover:border-[#339933]/40' },
        { id: 'healing' as TechId, name: 'Self-Healing Clusters', icon: <SiFirebase size={18} />, activeColor: 'border-[#FFCA28] text-[#ffd454]', bg: 'hover:border-[#FFCA28]/40' },
        { id: 'zerotrust' as TechId, name: 'Zero-Trust Security', icon: <SiGooglecloud size={18} />, activeColor: 'border-[#4285F4] text-[#7baaf7]', bg: 'hover:border-[#4285F4]/40' },
        { id: 'web3' as TechId, name: 'Decentralized State (Web3)', icon: <FiCode size={18} />, activeColor: 'border-[#8c52ff] text-[#b388ff]', bg: 'hover:border-[#8c52ff]/40' },
        { id: 'cicd' as TechId, name: 'Zero-Downtime Pipelines', icon: <FiCpu size={18} />, activeColor: 'border-[#ff5722] text-[#ff8a65]', bg: 'hover:border-[#ff5722]/40' },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto lg:h-[520px] min-h-[600px] lg:min-h-0">
            {/* Left: Selector */}
            <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-3">
                <div className="text-[10px] font-black tracking-[0.25em] text-neutral-600 uppercase mb-1 flex items-center gap-2">
                    <FiTerminal size={12} /> Environment
                </div>
                {techs.map((tech) => {
                    const isActive = activeTech === tech.id;
                    return (
                        <button
                            key={String(tech.id)}
                            onClick={() => setActiveTech(tech.id)}
                            className={[
                                'flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200',
                                isActive
                                    ? `bg-neutral-800/80 ${tech.activeColor} shadow-lg`
                                    : `bg-neutral-900/40 border-white/5 text-neutral-400 ${tech.bg}`,
                            ].join(' ')}
                        >
                            {tech.icon}
                            <span className="text-sm font-semibold">{tech.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Right: IDE */}
            <div className="flex-1 flex flex-col bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-w-0">
                {/* IDE Title Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-mono text-neutral-500 flex items-center gap-1.5">
                        <FiCode size={11} />
                        {activeTech ? CODE_SNIPPETS[activeTech as keyof typeof CODE_SNIPPETS].title : 'terminal — idle'}
                    </span>
                    <button
                        onClick={() => onAnalyze && onAnalyze(activeTech)}
                        disabled={!activeTech || isAnalyzing}
                        className={[
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all overflow-hidden relative group',
                            !activeTech || isAnalyzing
                                ? 'opacity-40 cursor-not-allowed text-neutral-500 bg-neutral-800'
                                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:shadow-[0_0_12px_rgba(34,211,238,0.25)]',
                        ].join(' ')}
                    >
                            {/* Scanning Animation Background */}
                            {isAnalyzing && (
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent w-[200%]"
                                    animate={{ x: ['-100%', '50%'] }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                />
                            )}
                            <motion.span
                                animate={isAnalyzing ? { rotate: 360 } : {}}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="relative z-10"
                            >
                                <FiCpu size={12} />
                            </motion.span>
                            <span className="relative z-10">{isAnalyzing ? 'SCANNING CODE...' : 'RUN AI REVIEW'}</span>
                    </button>

                </div>

                <div className="flex-1 overflow-y-auto p-5 font-mono text-sm leading-relaxed whitespace-pre bg-[#0d1117]">
                    {lines.map((line, i) => {
                        const isHighlighted = codeHighlight && line.toLowerCase().includes(codeHighlight.toLowerCase());
                        
                        return (
                            <div key={i} className={`flex text-xs md:text-sm font-mono leading-relaxed group transition-colors duration-300 ${isHighlighted ? 'bg-amber-500/20 rounded px-2 -mx-2' : ''}`}>
                                <span className={`w-8 shrink-0 select-none border-r border-white/5 mr-4 text-right pr-4 ${isHighlighted ? 'text-amber-500 font-bold' : 'text-neutral-600'}`}>
                                    {i + 1}
                                </span>
                                <span className={`whitespace-pre ${isHighlighted ? 'text-amber-300 font-bold' : 'text-emerald-400 group-hover:text-emerald-300'}`}>
                                    {line || ' '}
                                </span>
                            </div>
                        );
                    })}
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.75 }}
                        className="inline-block w-[7px] h-[14px] bg-emerald-400 ml-12 mt-1 rounded-sm"
                    />
                </div>
            </div>
        </div>
    );
}
