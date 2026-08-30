import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// DYNAMIC LIGHTNING STRIKES
export function Lightning() {
    const lightRef = useRef<THREE.PointLight>(null);
    
    useFrame((state, delta) => {
        if (lightRef.current) {
            // Random lightning strikes (1% chance per frame)
            if (Math.random() > 0.99) {
                // Flash intensely
                lightRef.current.intensity = 5000 + Math.random() * 5000;
                lightRef.current.position.set((Math.random() - 0.5) * 100, 40 + Math.random() * 20, (Math.random() - 0.5) * 100);
            } else {
                // Fade out quickly to simulate flash decay
                lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, delta * 15);
            }
        }
    });

    return <pointLight ref={lightRef} color="#ffffff" distance={200} decay={2} />;
}

// PROCEDURAL 3D AUDIO SYSTEM (Web Audio API)
export function ProceduralAudioSystem({ isPlaying, startDrift }: { isPlaying: boolean, startDrift?: boolean }) {
    const ctxRef = useRef<any>(null);
    const hasDropped = useRef(false);
    const oceanGainRef = useRef<any>(null);
    const oceanSourceRef = useRef<any>(null);

    // Initialize AudioContext
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        if (!ctxRef.current) {
            ctxRef.current = new AudioContextClass();
        }

        const resumeAudio = () => {
            if (ctxRef.current && ctxRef.current.state === 'suspended') ctxRef.current.resume();
        };
        document.addEventListener('click', resumeAudio);
        document.addEventListener('touchstart', resumeAudio);

        return () => {
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('touchstart', resumeAudio);
            if (oceanSourceRef.current) {
                try { oceanSourceRef.current.stop(); } catch (e) {}
            }
        };
    }, []);

    // Helper to start or adjust ocean noise
    const startOrUpdateOcean = (ctx: any, targetVolume: number) => {
        if (!oceanGainRef.current) {
            const bufferSize = ctx.sampleRate * 2;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            oceanSourceRef.current = ctx.createBufferSource();
            oceanSourceRef.current.buffer = noiseBuffer;
            oceanSourceRef.current.loop = true;
            
            const windFilter = ctx.createBiquadFilter();
            windFilter.type = 'lowpass';
            windFilter.frequency.value = 400; // Deep ocean rumble
            
            oceanGainRef.current = ctx.createGain();
            oceanGainRef.current.gain.value = 0; // Start silent, ramp up
            oceanGainRef.current.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 1);
            
            oceanSourceRef.current.connect(windFilter);
            windFilter.connect(oceanGainRef.current);
            oceanGainRef.current.connect(ctx.destination);
            oceanSourceRef.current.start();
        } else {
            // Smoothly ramp to new volume over 2 seconds
            oceanGainRef.current.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 2);
        }
    };

    // Trigger Cinematic Drop when falling starts!
    useEffect(() => {
        if (startDrift && ctxRef.current && !hasDropped.current) {
            hasDropped.current = true;
            const ctx = ctxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            // Generate a HIGHLY REALISTIC Sci-Fi Warp / Re-entry Sound using Filtered White Noise!
            // 1. Create 8 seconds of pure White Noise
            const bufferSize = ctx.sampleRate * 8;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                // White noise ranges from -1 to 1
                output[i] = Math.random() * 2 - 1; 
            }
            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = noiseBuffer;

            // 2. Use a Lowpass Filter to shape the noise into "Wind" or a "Jet Engine"
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.Q.value = 3; // Adds a slight whistling/jet resonance to the wind

            // 3. Animate the Filter Frequency to simulate SPEED (starts low, peaks in middle, ends low)
            filter.frequency.setValueAtTime(50, ctx.currentTime); // Deep rumble at start
            filter.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 4); // Rushing wind at peak speed
            filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 8); // Deep rumble upon arrival

            // 4. Animate the Volume (Fade in, hold, fade out)
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(1.2, ctx.currentTime + 2);
            gain.gain.setValueAtTime(1.2, ctx.currentTime + 6);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);

            // Connect everything
            noiseSource.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            // Start the massive 8-second cinematic warp sound!
            noiseSource.start();

            // Start ocean very quietly during the fall (building suspense)
            startOrUpdateOcean(ctx, 0.05);
        }
    }, [startDrift]);

    // Maximize Ocean when landed
    useEffect(() => {
        if (isPlaying && ctxRef.current) {
            startOrUpdateOcean(ctxRef.current, 0.4);
        }
    }, [isPlaying]);

    return null;
}

// REALISTIC RAIN STREAK TEXTURE
function useRaindropTexture() {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Draw a realistic thin long vertical streak for fast moving rain
            const gradient = ctx.createLinearGradient(32, 0, 32, 64);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
            ctx.fillStyle = gradient;
            ctx.fillRect(31, 0, 2, 64); // Very thin 2px line in the center
        }
        return new THREE.CanvasTexture(canvas);
    }, []);
}

// CINEMATIC RAIN (REALISTIC DROPLETS)
export function Rain() {
    const rainRef = useRef<THREE.Points>(null);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const dropCount = isMobile ? 1000 : 6000;
    const dropTexture = useRaindropTexture();
    
    const [positions, velocities] = useMemo(() => {
        const positions = new Float32Array(dropCount * 3);
        const velocities = new Float32Array(dropCount);
        
        for (let i = 0; i < dropCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = Math.random() * 40;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            velocities[i] = 40 + Math.random() * 30; // Very fast falling speed for realism
        }
        return [positions, velocities];
    }, []);

    useFrame((state, delta) => {
        if (rainRef.current) {
            const pos = rainRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < dropCount; i++) {
                pos[i * 3 + 1] -= velocities[i] * delta; // Fall down rapidly
                pos[i * 3] -= velocities[i] * delta * 0.1; // Slight wind blowing to the left
                
                if (pos[i * 3 + 1] < -2) {
                    pos[i * 3 + 1] = 40 + Math.random() * 10;
                    pos[i * 3] = (Math.random() - 0.5) * 100 + 10; // Offset start to compensate wind
                }
            }
            rainRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    if (isMobile) return null;

    return (
        <points ref={rainRef}>
            <bufferGeometry>
                <bufferAttribute 
                    attach="attributes-position" 
                    count={dropCount} 
                    args={[positions, 3]} 
                />
            </bufferGeometry>
            <pointsMaterial 
                size={0.6} 
                map={dropTexture} 
                transparent 
                opacity={0.7} 
                depthWrite={false} 
                blending={THREE.AdditiveBlending} 
            />
        </points>
    );
}

// COSMIC ENERGY HORIZON (Aurora/Storm Ring)
export function VoiceAuraLight({ isSpeaking }: { isSpeaking: boolean }) {
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame(({ clock }) => {
        if (lightRef.current) {
            const t = clock.getElapsedTime();
            if (isSpeaking) {
                // Energetic pulsing effect when speaking
                const targetIntensity = 1500 + Math.sin(t * 8) * 500;
                lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.2);
            } else {
                // Fade out completely when silent
                lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, 0.1);
            }
        }
    });

    // Massive light from above to illuminate the ocean 360 degrees
    return <pointLight ref={lightRef} position={[0, 100, -50]} distance={2000} color="#00e6ff" intensity={0} decay={1.5} />;
}
