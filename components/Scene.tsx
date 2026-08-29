import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, useProgress, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Vignette, Glitch, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import RealisticOcean from './RealisticOcean';
import RedDome from './RedDome';
import CameraRig from './CameraRig';
import AudioController from './AudioController';
import { Lightning, ProceduralAudioSystem, Rain, VoiceAuraLight } from './EnvironmentEffects';
import { useQualityTier } from '../hooks/useQualityTier';

interface SceneProps {
    isListening: boolean;
    isSpeaking: boolean;
    hasCompletedIntro: boolean;
    startDrift: boolean;
    onDriftComplete: () => void;
    onReady?: (ready: boolean) => void;
}

export default function Scene({ isListening, isSpeaking, hasCompletedIntro, startDrift, onDriftComplete, onReady }: SceneProps) {
    const { tier, settings, downgrade } = useQualityTier();
    const { progress } = useProgress();
    const [glitchActive, setGlitchActive] = useState(false);

    // Notify parent when assets/shaders are ready so "CLICK TO ENTER" becomes interactable.
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onReady) onReady(true);
        }, 500);
        return () => clearTimeout(timer);
    }, [onReady]);

    // Trigger canvas glitch briefly when drift starts
    useEffect(() => {
        if (startDrift && !hasCompletedIntro) {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 500);
        }
    }, [startDrift, hasCompletedIntro]);

    // Calculate dynamic post-processing states
    const isWarping = startDrift && !hasCompletedIntro;

    return (
        <Canvas camera={{ position: [0, 4, 150], fov: 60 }} dpr={settings.dpr} gl={{ antialias: false, powerPreference: "high-performance" }} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <PerformanceMonitor onDecline={() => downgrade()}>
                <Suspense fallback={null}>
                    {/* Fog and Background */}
                    <fog attach="fog" args={['#010611', 20, 90]} />
                    <color attach="background" args={['#010611']} />
                    
                    {/* The Deep Abyss Floor (Seabed) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -25, 0]}>
                        <planeGeometry args={[1000, 1000]} />
                        <meshStandardMaterial color="#000511" roughness={1} metalness={0} />
                    </mesh>

                    {/* Base Lighting */}
                    <ambientLight intensity={0.4} color="#001122" />
                    <spotLight position={[0, 20, 20]} intensity={50} decay={2} distance={100} color="#004466" penumbra={1} angle={Math.PI / 3} />
                    <pointLight position={[0, -15, -50]} intensity={250} distance={80} decay={1.5} color="#ff0022" />

                    {/* Intergalactic Starry Sky */}
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />

                    {/* Dynamic Environment Effects */}
                    <VoiceAuraLight isSpeaking={isSpeaking} />
                    <Lightning />
                    <ProceduralAudioSystem isPlaying={hasCompletedIntro} startDrift={startDrift} />
                    <Rain />

                    {/* The Core Elements */}
                    <RealisticOcean isSpeaking={isSpeaking} />
                    <RedDome isSpeaking={isSpeaking} isListening={isListening} />
                    
                    {/* Camera Control & Audio */}
                    <CameraRig startDrift={startDrift} hasCompletedIntro={hasCompletedIntro} onDriftComplete={onDriftComplete} />
                    
                    {/* Post-Processing Stack */}
                    <EffectComposer multisampling={0}>
                        {settings.bloom && (
                            <Bloom 
                                intensity={1.5} 
                                mipmapBlur 
                                luminanceThreshold={0.2} 
                                luminanceSmoothing={0.1} 
                            />
                        )}
                        
                        {settings.dof && hasCompletedIntro && (
                            <DepthOfField 
                                focusDistance={0.0} 
                                focalLength={0.02} 
                                bokehScale={2} 
                                height={480} 
                            />
                        )}
                        
                        {settings.chromaticAberration && isWarping && (
                            <ChromaticAberration 
                                offset={new THREE.Vector2(0.005, 0.005)} 
                            />
                        )}

                        <Vignette eskil={false} offset={0.1} darkness={1.2} />
                        <Noise opacity={0.03} />

                        {glitchActive && (
                            <Glitch 
                                delay={new THREE.Vector2(0, 0)} 
                                duration={new THREE.Vector2(0.1, 0.3)} 
                                strength={new THREE.Vector2(0.1, 0.5)} 
                                active={true} 
                                ratio={0.8}
                            />
                        )}
                    </EffectComposer>
                    
                </Suspense>
            </PerformanceMonitor>
        </Canvas>
    );
}
