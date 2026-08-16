import React from 'react';
import { motion } from 'framer-motion';

export default function CodeLogo() {
    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full text-white pointer-events-none select-none">
            
            {/* 1. THE HACKER HOODIE (Intricate SVG) */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        {/* Glowing Red Filter */}
                        <filter id="red-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Outer Angular Hood */}
                    <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d="M 100 15 L 145 40 L 155 90 L 135 130 L 100 115 L 65 130 L 45 90 L 55 40 Z" 
                        fill="none" 
                        stroke="#ffffff" 
                        strokeWidth="3" 
                        strokeLinejoin="round"
                    />
                    
                    {/* Inner Dark Depth (The Face Shadow) */}
                    <path 
                        d="M 100 25 L 135 45 L 140 85 L 100 100 L 60 85 L 65 45 Z" 
                        fill="#050505" 
                        stroke="#330000" 
                        strokeWidth="1" 
                    />

                    {/* Cybernetic Bandana / Mask */}
                    <motion.polygon 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        points="65,90 100,80 135,90 125,120 100,135 75,120" 
                        fill="#ffffff" 
                    />
                    
                    {/* Mask Slits / Grille */}
                    <line x1="85" y1="105" x2="115" y2="105" stroke="#000" strokeWidth="2" />
                    <line x1="90" y1="112" x2="110" y2="112" stroke="#000" strokeWidth="2" />
                    <line x1="95" y1="119" x2="105" y2="119" stroke="#000" strokeWidth="2" />

                    {/* Glowing Eyes */}
                    <motion.polygon 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0.5, 1, 0.5], scale: 1 }}
                        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                        points="75,65 92,70 75,75 70,70" 
                        fill="#ff0033" 
                        filter="url(#red-glow)"
                    />
                    <motion.polygon 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0.5, 1, 0.5], scale: 1 }}
                        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                        points="125,65 108,70 125,75 130,70" 
                        fill="#ff0033" 
                        filter="url(#red-glow)"
                    />

                    {/* Angular Shoulders */}
                    <motion.path 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1.5 }}
                        d="M 140 105 L 185 130 L 195 180 L 150 180 L 135 140 L 100 125 L 65 140 L 50 180 L 5 180 L 15 130 L 60 105 Z" 
                        fill="none" 
                        stroke="#ffffff" 
                        strokeWidth="2" 
                        strokeLinejoin="round"
                    />

                    {/* Inner Shoulder Accents (Circuit lines) */}
                    <path d="M 160 145 L 180 145 L 185 170" fill="none" stroke="#ff0033" strokeWidth="1" opacity="0.6" />
                    <path d="M 40 145 L 20 145 L 15 170" fill="none" stroke="#ff0033" strokeWidth="1" opacity="0.6" />
                </svg>
            </div>

            {/* 2. TYPOGRAPHY */}
            <motion.div 
                className="mt-4 flex flex-col items-center z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                {/* KARIYAWASAM */}
                <h1 
                    className="font-bold uppercase text-[22px] md:text-[28px] tracking-[0.35em] text-white whitespace-nowrap"
                    style={{ 
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        textShadow: '0 0 10px rgba(255,255,255,0.3)',
                    }}
                >
                    Kariyawasam
                </h1>
                
                {/* CODER */}
                <h2 
                    className="font-light uppercase text-[14px] md:text-[18px] tracking-[0.6em] text-red-500 mt-[-2px] md:mt-0 whitespace-nowrap pl-2"
                    style={{ 
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        textShadow: '0 0 15px rgba(255,0,0,0.6)',
                    }}
                >
                    Coder
                </h2>
            </motion.div>

            {/* 3. GLITCH / DRIP LINES (Data flow bleeding down) */}
            <div className="absolute top-[80%] flex justify-center gap-[6px] w-full h-[60px] md:h-[80px] overflow-hidden opacity-80 mix-blend-screen mask-image-linear">
                {[...Array(15)].map((_, i) => {
                    const isRed = Math.random() > 0.7;
                    const height = 40 + Math.random() * 60;
                    const delay = Math.random() * 2;
                    const duration = 1.5 + Math.random() * 2;

                    return (
                        <motion.div
                            key={i}
                            className={`w-[1.5px] rounded-full ${isRed ? 'bg-gradient-to-b from-red-600 to-transparent' : 'bg-gradient-to-b from-white to-transparent'}`}
                            style={{ height: `${height}%` }}
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: [0, 20, 0], opacity: [0.3, 1, 0.3] }}
                            transition={{ delay, duration, repeat: Infinity, ease: "easeInOut" }}
                        />
                    );
                })}
            </div>

            {/* Global style to fade out the drips at the bottom */}
            <style dangerouslySetInnerHTML={{__html: `
                .mask-image-linear {
                    -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
                    mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
                }
            `}} />
        </div>
    );
}
