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
    isSpeaking?: boolean;
}

// Masterclass Custom Easing Curve (Dramatic slow start, snappy finish)
const exquisiteEase = [0.76, 0, 0.24, 1];

export default function LoadingScreen({ onLoadingComplete, onDriftStart, isReady = true, isSpeaking }: LoadingScreenProps) {
    const [isClicked, setIsClicked] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [isHovered, setIsHovered] = useState(false)

    const handleClick = () => {
        if (!isReady || isClicked) return;
        setIsClicked(true)
        
        // Unlock speech synthesis on mobile (iOS/Android requirement)
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const unlockUtterance = new SpeechSynthesisUtterance('');
            unlockUtterance.volume = 0;
            window.speechSynthesis.speak(unlockUtterance);
        }
        
        // Let the logo dissolve extremely fast
        setTimeout(() => {
            setIsVisible(false)
            onDriftStart() 
            onLoadingComplete() 
        }, 500) // Reduced from 3000ms to 500ms
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
                        duration: isClicked ? 0.5 : 3, 
                        ease: exquisiteEase as any,
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
                        transition={isClicked ? { duration: 0.5, ease: exquisiteEase as any } : {}}
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
                                
                                <CodeLogo isSpeaking={isSpeaking} />
                                
                            </motion.div>

                        </div>
                        
                    </motion.div>

                    {/* Masterclass Typography (Swiss Style) - Removed for 2031 biomimetic interface */}


                </motion.div>
            )}
        </AnimatePresence>
    )
}
