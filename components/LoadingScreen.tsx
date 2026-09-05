'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
const CodeLogo = dynamic(() => import('./CodeLogo'), { ssr: false, loading: () => <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full bg-red-900/20 animate-pulse border border-red-900/30 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-red-700 animate-spin" /></div> })

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
    const [loadTime, setLoadTime] = useState<number | null>(null)
    const [elementTimes, setElementTimes] = useState<Record<string, number>>({})
    const mountTimeRef = useRef<number>(Date.now())

    useEffect(() => {
        // Record rings mount time (since they are CSS-driven and mount immediately)
        const now = (Date.now() - mountTimeRef.current) / 1000;
        setElementTimes(prev => ({
            ...prev,
            'Outer Rings': now,
            'Inner Rings': now,
            'Crosshair': now
        }));
    }, []);

    useEffect(() => {
        if (isReady && loadTime === null) {
            setLoadTime((Date.now() - mountTimeRef.current) / 1000)
        }
    }, [isReady, loadTime])

    const handleClick = () => {
        if (!isReady || isClicked) return;
        setIsClicked(true)
        
        // Unlock speech synthesis on mobile (iOS/Android requirement)
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const unlockUtterance = new SpeechSynthesisUtterance(' ');
            unlockUtterance.volume = 0.01;
            window.speechSynthesis.speak(unlockUtterance);
            window.speechSynthesis.resume();
        }
        
        // Let the logo dissolve extremely fast
        setTimeout(() => {
            setIsVisible(false)
            onDriftStart() 
            onLoadingComplete() 
        }, 800) // Reduced from 3000ms to 500ms
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
                        <div className="absolute inset-0 bg-[#020305]/80 md:bg-[#020305]/60 md:backdrop-blur-[40px] saturate-150" />
                        
                        {/* Premium Grain/Noise Texture for that tactile matte finish (DESKTOP ONLY - Kills Mobile GPU) */}
                        <div className="hidden md:block absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
                        
                        {/* Single central subtle crimson glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-red-900/10 blur-[120px] rounded-full mix-blend-screen" />
                    </div>

                    {/* Interactive Logo Container - Geometric Masterpiece */}
                    <motion.div
                        className="relative w-full h-full flex items-center justify-center cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handleClick}
                        animate={isClicked ? { scale: 1.1, opacity: 0 } : { scale: 1, opacity: 1 }}
                        transition={isClicked ? { duration: 0.5, ease: exquisiteEase as any } : {}}
                    >
                        
                                                {/* 10 YEARS FUTURE: THE QUANTUM NEURAL CORE */}
                        <div className="absolute inset-0 w-screen h-screen flex items-center justify-center z-20 overflow-hidden">
                            
                            {/* THE LOGO CORE (Dissolves on the spot) */}
                            <motion.div 
                                className="relative w-full h-full z-30 flex items-center justify-center"
                                animate={isClicked ? {
                                    scale: 1.4,
                                    opacity: 0,
                                    filter: 'blur(25px) brightness(2)'
                                } : {
                                    scale: [1, 1.05, 1], opacity: 1, filter: ['blur(0px) brightness(1)', 'blur(0px) brightness(1.3)', 'blur(0px) brightness(1)']
                                }}
                                transition={isClicked ? { duration: 1.2, ease: "easeOut" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {/* Neural Energy Core Glow */}
                                <div className="absolute inset-0 rounded-full bg-cyan-600/5 blur-[35px] animate-pulse pointer-events-none" />
                                
                                <CodeLogo 
                                    isClicked={isClicked}
                                    isSpeaking={isSpeaking} 
                                    onReportTime={(name, time) => {
                                        setElementTimes(prev => ({ ...prev, [name]: (time - mountTimeRef.current) / 1000 }))
                                    }}
                                />
                            </motion.div>

                        </div>
                        
                    </motion.div>

                    {/* Masterclass Typography (Swiss Style) - Removed for 2031 biomimetic interface */}


                </motion.div>
            )}
        </AnimatePresence>
    )
}
