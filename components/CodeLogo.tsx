'use client'

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import RealisticOcean from './RealisticOcean';

function WaterLineCamera({ isClicked }: { isClicked?: boolean }) {
    const { camera } = useThree();
    const speed = useRef(0);
    const startY = 1.2; 
    
    // Noise variables for handheld shake
    const timeRef = useRef(0);

    useFrame((state, delta) => {
        timeRef.current += delta;
        const t = timeRef.current;
        
        if (isClicked) {
            speed.current = Math.min(speed.current + delta * 30, 60);
            camera.position.y += speed.current * delta;
            camera.position.z -= speed.current * delta * 1.2; 
            
            // Subtle FOV pull
            if ((camera as THREE.PerspectiveCamera).fov > 50) {
                (camera as THREE.PerspectiveCamera).fov -= 0.5;
                (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
            }
        } else {
            // Complex realistic wave bobbing + Handheld shake
            const waveBob = Math.sin(t * 1.5) * 0.4 + Math.cos(t * 0.8) * 0.2;
            const shakeX = Math.sin(t * 3.2) * 0.05 + Math.cos(t * 4.1) * 0.02;
            const shakeY = Math.cos(t * 2.7) * 0.05 + Math.sin(t * 3.8) * 0.02;
            
            camera.position.y = startY + waveBob;
            camera.position.x = shakeX;
            camera.position.z = 25;
            
            // Handheld rotation
            camera.rotation.x = -0.02 + shakeY * 0.5;
            camera.rotation.z = shakeX * 0.2;
        }
    });
    return null;
}

export default function CodeLogo({
    isClicked, isSpeaking, onReportTime
}: {
    isClicked?: boolean
    isSpeaking?: boolean
    onReportTime?: (name:string, time:number) => void
}) {
    const reported = useRef(false);
    useEffect(() => {
        if (onReportTime && !reported.current) {
            reported.current = true;
            onReportTime('Realistic Ocean Polished Intro', Date.now());
        }
    }, [onReportTime]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
            <motion.div
                className="absolute inset-0 z-0 pointer-events-auto"
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ duration: 2 }}
            >
                <Canvas
                    camera={{ position: [0, 1.2, 25], fov: 75 }}
                    dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
                    gl={{ alpha: false, antialias: false }}
                    scene={{ background: new THREE.Color('#010000') }}
                >
                    <Suspense fallback={null}>
                        {/* Heavy Fog to blend horizon naturally */}
                        <fogExp2 attach="fog" args={['#010000', 0.025]} />
                        <ambientLight intensity={0.15} color="#440000" />
                        
                        <WaterLineCamera isClicked={isClicked} />
                        <RealisticOcean isSpeaking={isSpeaking || false} />
                        
                        {/* Red glow that reflects heavily on water directly under the text */}
                        <pointLight position={[0, 5, 10]} intensity={300} color="#ff2200" distance={50} />
                        <pointLight position={[0, 10, -150]} intensity={8000} color="#ff0000" distance={400} />
                        
                        {/* Post Processing for Film Look */}
                        <EffectComposer>
                            <Vignette eskil={false} offset={0.3} darkness={0.9} blendFunction={BlendFunction.NORMAL} />
                            <ChromaticAberration 
                                blendFunction={BlendFunction.NORMAL} 
                                offset={new THREE.Vector2(0.002, 0.002)} 
                                radialModulation={false} modulationOffset={0} />
                        </EffectComposer>
                    </Suspense>
                </Canvas>
                
                {/* CSS Overlay for extra cinematic grading */}
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.95) 100%)' }} />
            </motion.div>

            <motion.div
                className="relative z-20 flex flex-col items-center gap-4 pointer-events-none mix-blend-screen"
                animate={ isClicked ? { scale: 1.5, opacity: 0, filter: 'blur(15px)', y: -100 } : { scale: 1, opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.8, ease: "easeIn" }}
            >
                <h1 className="text-5xl md:text-7xl font-black tracking-[0.25em] text-white opacity-95"
                    style={{ textShadow: '0 0 50px rgba(255,0,0,0.9), 0 0 15px rgba(255,100,100,0.6)' }}>
                    KARIYAWASAM
                </h1>
                <p className="font-mono text-gray-300 tracking-[0.6em] text-sm md:text-base uppercase opacity-60">
                    CREATIVE CODER
                </p>
                <motion.div
                    className="mt-10 flex flex-col items-center gap-2 pointer-events-none select-none"
                    animate={{ opacity: [0.3, 0.9, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="text-xs md:text-sm font-mono tracking-[0.5em] text-white uppercase opacity-70">
                        CLICK TO ENTER
                    </span>
                    <div className="w-px h-10 bg-gradient-to-b from-white to-transparent opacity-60" />
                </motion.div>
            </motion.div>
            
            <motion.div 
                className="absolute inset-0 z-50 pointer-events-none bg-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: isClicked ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ mixBlendMode: 'overlay' }}
            />
        </div>
    );
}
