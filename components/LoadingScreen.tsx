'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CodeLogo from './CodeLogo'

// The True Spherical Logo Mesh
const LogoSphereMesh = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        new THREE.TextureLoader().load('/logo-kariyawasam.jpg', (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            setTexture(tex);
        });
    }, []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
            meshRef.current.rotation.x += delta * 0.2;
        }
    });

    if (!texture) return null;

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1.2, 64, 64]} />
            <meshBasicMaterial 
                map={texture} 
                transparent={true} 
            />
        </mesh>
    );
}

interface LoadingScreenProps {
    onLoadingComplete: () => void;
    onDriftStart: () => void;
    isReady?: boolean;
}

// Masterclass Custom Easing Curve (Dramatic slow start, snappy finish)
const exquisiteEase = [0.76, 0, 0.24, 1];

export default function LoadingScreen({ onLoadingComplete, onDriftStart, isReady = true }: LoadingScreenProps) {
    const [isClicked, setIsClicked] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [isHovered, setIsHovered] = useState(false)

    const handleClick = () => {
        if (!isReady || isClicked) return;
        setIsClicked(true)
        
        // Let the logo dissolve completely over 3 seconds with our new physics
        setTimeout(() => {
            setIsVisible(false)
            onDriftStart() 
            onLoadingComplete() 
        }, 3000)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="logo-phase"
                    initial={{ opacity: 0, backgroundColor: '#000000' }}
                    animate={{ 
                        // Crossfade to the deep abyssal background of the 3D scene
                        backgroundColor: isClicked ? 'rgba(0,0,0,0)' : '#020305',
                        scale: isClicked ? 1.05 : 1, // Extremely subtle push-in
                        opacity: isClicked ? 0 : 1
                    }}
                    transition={{ 
                        duration: 3, 
                        ease: exquisiteEase,
                    }}
                    className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden group ${isReady ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'}`}
                    onClick={handleClick}
                >
                    {/* Apple-Style Matte Frosted Glass Background */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* The Matte Glass layer that blurs the 3D scene underneath */}
                        <div className="absolute inset-0 bg-[#020305]/60 backdrop-blur-[40px] saturate-150" />
                        
                        {/* Premium Grain/Noise Texture for that tactile matte finish */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
                        
                        {/* Single central subtle crimson glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-red-900/10 blur-[120px] rounded-full mix-blend-screen" />
                    </div>

                    {/* Interactive Logo Container - Geometric Masterpiece */}
                    <motion.div
                        className="relative flex items-center justify-center cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handleClick}
                        animate={isClicked ? { scale: 1.1, opacity: 0 } : { scale: 1, opacity: 1 }}
                        transition={isClicked ? { duration: 2.5, ease: exquisiteEase } : {}}
                    >
                        
                        {/* 10 YEARS FUTURE: THE QUANTUM NEURAL CORE */}
                        <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] flex items-center justify-center z-20">
                            
                            {/* RINGS AND GLOW (Evaporates UP as colored smoke) */}
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                animate={isClicked ? {
                                    y: -300,           // Shoots up
                                    scaleX: 0.5,
                                    scaleY: 3,         // Stretches into smoke
                                    opacity: 0,
                                    filter: 'blur(30px) hue-rotate(180deg) brightness(2)' // Cyan smoke
                                } : {
                                    y: 0, scaleX: 1, scaleY: 1, opacity: 1, filter: 'blur(0px) hue-rotate(0deg) brightness(1)'
                                }}
                                transition={{ duration: 2, ease: "easeOut" }}
                            >
                                {/* Outer Dyson Data Rings (Erratic, Complex Orbit) */}
                                {[
                                    { rx: 360, ry: 180, rz: 360, dur: 12 },
                                    { rx: -360, ry: 360, rz: 180, dur: 15 },
                                    { rx: 180, ry: -360, rz: -360, dur: 18 },
                                    { rx: -180, ry: -180, rz: 360, dur: 20 },
                                ].map((ring, i) => (
                                    <motion.div
                                        key={`dyson-${i}`}
                                        className={`absolute inset-0 rounded-full border border-white/5 ${i % 2 === 0 ? 'border-t-red-500/50' : 'border-b-white/30'}`}
                                        style={{ transformStyle: 'preserve-3d' }}
                                        animate={{ 
                                            rotateX: [0, ring.rx], 
                                            rotateY: [0, ring.ry], 
                                            rotateZ: [0, ring.rz] 
                                        }}
                                        transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
                                    />
                                ))}

                                {/* Inner High-Speed Accelerator Rings */}
                                {[
                                    { rz: 360, border: 'border-l-red-500/80', dur: 2 },
                                    { rz: -360, border: 'border-r-white/80', dur: 3 },
                                ].map((ring, i) => (
                                    <motion.div
                                        key={`accel-${i}`}
                                        className={`absolute w-[170px] h-[170px] md:w-[210px] md:h-[210px] rounded-full border-[2px] border-transparent ${ring.border}`}
                                        animate={{ rotateZ: [0, ring.rz] }}
                                        transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
                                    />
                                ))}

                                {/* Quantum Targeting Crosshair */}
                                <motion.div 
                                    className="absolute w-[40px] h-[40px] border border-red-500/40 rounded-full"
                                    animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </motion.div>

                            {/* THE LOGO CORE (Dissolves on the spot) */}
                            <motion.div 
                                className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] z-30 flex items-center justify-center"
                                animate={isClicked ? {
                                    scale: 1.4,       // Expands as it dissipates
                                    opacity: 0,       // Dissolves completely
                                    filter: 'blur(25px) brightness(2)' // Bright flash and heavy blur to simulate disintegration
                                } : {
                                    scale: [1, 1.05, 1], opacity: 1, filter: ['blur(0px) brightness(1)', 'blur(0px) brightness(1.3)', 'blur(0px) brightness(1)']
                                }}
                                transition={isClicked ? { duration: 1.2, ease: "easeOut" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {/* Neural Energy Core Glow */}
                                <div className="absolute inset-0 rounded-full bg-red-600/10 blur-[25px] animate-pulse pointer-events-none" />
                                
                                <CodeLogo />
                                
                            </motion.div>

                        </div>
                        
                    </motion.div>

                    {/* Masterclass Typography (Swiss Style) */}
                    <div className={`mt-24 flex flex-col items-center justify-center transition-all duration-1000 ${isClicked ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        {/* Active AI Indicator */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_#ff2a2a]" />
                            <p className="text-white/40 font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase">
                                {isReady ? "System Active" : "Initializing..."}
                            </p>
                        </div>
                        
                        {/* Elegant Interaction Text */}
                        <motion.p
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="text-white/80 font-sans font-light text-xs md:text-sm tracking-[0.5em] uppercase"
                        >
                            Click to Enter
                        </motion.p>
                    </div>

                    {/* Minimalist Grid Coordinates (Replacing Boot Logs) */}
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 font-mono text-[8px] md:text-[9px] text-white/20 flex flex-col items-start tracking-[0.3em] uppercase pointer-events-none">
                        <div>LOC: 43.002.19</div>
                        <div>SYS: NEURAL_LNK_01</div>
                        <div>STT: {isReady ? 'AWAITING' : 'SYNCING'}</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
