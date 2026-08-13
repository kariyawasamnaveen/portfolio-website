import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Vignette, Glitch } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import RealisticOcean from './RealisticOcean';
import RedDome from './RedDome';
import CameraRig from './CameraRig';
import AudioController from './AudioController';
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
    // Since we use procedural shaders and no GLTFs, useProgress might stay at 0. We use a short timeout to ensure compilation.
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
        <Canvas dpr={settings.dpr} gl={{ antialias: false, powerPreference: "high-performance" }} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <PerformanceMonitor onDecline={() => downgrade()} bounds={[30, 60]}>
                <Suspense fallback={null}>
                    {/* Environment */}
                    <RealisticOcean />
                    <RedDome isSpeaking={isSpeaking} isListening={isListening} />
                    
                    {/* Camera Control & Audio */}
                    <CameraRig startDrift={startDrift} hasCompletedIntro={hasCompletedIntro} onDriftComplete={onDriftComplete} />
                    <AudioController startDrift={startDrift} hasCompletedIntro={hasCompletedIntro} />
                    
                    {/* Post-Processing Stack */}
                    <EffectComposer disableNormalPass multisampling={0}>
                        {settings.bloom && (
                            <Bloom 
                                intensity={2.5} 
                                mipmapBlur 
                                luminanceThreshold={0.9} 
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
                                blendFunction={BlendFunction.NORMAL} 
                            />
                        )}

                        <Vignette eskil={false} offset={0.1} darkness={1.1} />

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
