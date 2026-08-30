"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Water } from 'three-stdlib';

extend({ Water });

declare module '@react-three/fiber' {
  interface ThreeElements {
    water: any;
}
}
import { OrbitControls, Float, Html, Grid, Line, MeshDistortMaterial, Environment, useTexture, MeshTransmissionMaterial, SpotLight, Stars, Sparkles, Box, Cylinder, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

// Helper hook to extract unique edges and vertices
function useWireframeData(geometry: THREE.BufferGeometry) {
    return useMemo(() => {
        const edgeGeo = new THREE.EdgesGeometry(geometry);
        const pos = edgeGeo.attributes.position.array;
        const lines = [];
        for (let i = 0; i < pos.length; i += 6) {
            lines.push([
                new THREE.Vector3(pos[i], pos[i+1], pos[i+2]),
                new THREE.Vector3(pos[i+3], pos[i+4], pos[i+5])
            ]);
        }
        
        const vertices: THREE.Vector3[] = [];
        const geomPos = geometry.attributes.position.array;
        for (let i = 0; i < geomPos.length; i += 3) {
            const v = new THREE.Vector3(geomPos[i], geomPos[i+1], geomPos[i+2]);
            if (!vertices.some(existing => existing.distanceTo(v) < 0.05)) {
                vertices.push(v);
            }
        }
        return { lines, vertices };
    }, [geometry]);
}

// Generates a soft Radial Gradient Texture for Halos / Lens Flares
function useHaloTexture() {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        if (context) {
            const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(255, 200, 100, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 128, 128);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);
}

// Renders Thick Edges and now perfect Lens Flare Halos!
function GlowingStructure({ geometry, color, lineWidth, nodeSize, opacity = 0.9 }: { geometry: THREE.BufferGeometry, color: THREE.Color, lineWidth: number, nodeSize: number, opacity?: number }) {
    const { lines, vertices } = useWireframeData(geometry);
    const haloTexture = useHaloTexture();

    return (
        <group>
            {lines.map((pts, i) => (
                <Line 
                    key={`line-${i}`} 
                    points={pts} 
                    color={color} 
                    lineWidth={lineWidth} 
                    toneMapped={false} 
                    transparent
                    opacity={opacity}
                />
            ))}
            {/* Render Halos only if nodeSize > 0 */}
            {nodeSize > 0 && vertices.map((v, i) => (
                <sprite key={`node-${i}`} position={v} scale={nodeSize * 4}>
                    <spriteMaterial 
                        map={haloTexture} 
                        color={color} 
                        transparent 
                        blending={THREE.AdditiveBlending} 
                        depthWrite={false} 
                        opacity={opacity}
                    />
                </sprite>
            ))}
        </group>
    );
}

// CLEANER Interconnected Struts (less messy, perfect geometric web)
function InterconnectedStruts({ outerGeo, innerGeo, color, lineWidth }: { outerGeo: THREE.BufferGeometry, innerGeo: THREE.BufferGeometry, color: THREE.Color, lineWidth: number }) {
    const { vertices: outV } = useWireframeData(outerGeo);
    const { vertices: inV } = useWireframeData(innerGeo);

    const struts = useMemo(() => {
        const lines: [THREE.Vector3, THREE.Vector3][] = [];
        // Connect each INNER vertex (Octahedron has 6) to its 2 nearest OUTER vertices (Icosahedron)
        // This dramatically reduces clutter and creates a perfect inner-to-outer web!
        inV.forEach(iv => {
            const sorted = outV.slice().sort((a,b) => a.distanceTo(iv) - b.distanceTo(iv));
            if (sorted[0]) lines.push([iv, sorted[0]]);
            if (sorted[1]) lines.push([iv, sorted[1]]);
        });
        return lines;
    }, [outV, inV]);

    return (
        <group>
            {struts.map((pts, i) => (
                <Line 
                    key={`strut-${i}`} 
                    points={pts} 
                    color={color} 
                    lineWidth={lineWidth} 
                    toneMapped={false} 
                    transparent 
                    opacity={0.3} 
                />
            ))}
        </group>
    );
}

// Global State to sync ocean waves between the Water and the Floating Orb
const GlobalOceanState = {
    time: 0,
    speed: 1,
    sunPosition: new THREE.Vector3(0, 1, 1),
    getWaveHeight(worldX: number, worldZ: number) {
        const localX = worldX;
        const localY = -worldZ; // Plane local Y is World -Z because of -Math.PI/2 rotation
        const t = this.time;
        const wave1 = Math.sin(localX * 0.3 + t * 0.8) * 0.8;
        const wave2 = Math.sin(localY * 0.2 + t * 0.5) * 0.5;
        const wave3 = Math.sin((localX + localY) * 0.15 + t * 1.0) * 0.4;
        return wave1 + wave2 + wave3 - 3.5;
    }
};
// COSMIC LIGHTNING (Connects Orb to Stars)
function CosmicLightning({ isActive }: { isActive: boolean }) {
    const linesRef = useRef<THREE.LineSegments>(null);
    const geomRef = useRef<THREE.BufferGeometry>(null);

    const maxLines = 5;
    const segments = 12;
    const maxPoints = maxLines * segments * 2; // Line segments need start and end

    useEffect(() => {
        if (geomRef.current) {
            const positions = new Float32Array(maxPoints * 3);
            geomRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        }
    }, []);

    useFrame(() => {
        if (!linesRef.current || !geomRef.current) return;
        
        linesRef.current.visible = isActive;
        if (!isActive) return;

        const positions = geomRef.current.attributes.position.array as Float32Array;
        if (!positions) return;
        
        let ptIdx = 0;
        const numBolts = Math.floor(Math.random() * 3) + 3; // 3 to 5 bolts
        
        for (let i = 0; i < numBolts; i++) {
            let prev = new THREE.Vector3(0, 0, 0);
            
            // Target a distant star high up
            const target = new THREE.Vector3(
                (Math.random() - 0.5) * 300,
                150 + Math.random() * 100,
                (Math.random() - 0.5) * 300
            );
            
            for (let j = 1; j <= segments; j++) {
                const progress = j / segments;
                const current = new THREE.Vector3().lerpVectors(new THREE.Vector3(0,0,0), target, progress);
                
                // Add jagged jitter
                const jitter = progress * 40;
                current.x += (Math.random() - 0.5) * jitter;
                current.y += (Math.random() - 0.5) * jitter;
                current.z += (Math.random() - 0.5) * jitter;

                // Add line segment (prev -> current)
                positions[ptIdx++] = prev.x;
                positions[ptIdx++] = prev.y;
                positions[ptIdx++] = prev.z;
                positions[ptIdx++] = current.x;
                positions[ptIdx++] = current.y;
                positions[ptIdx++] = current.z;
                
                prev.copy(current);
            }
        }
        
        // Zero out remaining unused points in the buffer
        for (; ptIdx < positions.length; ptIdx++) {
            positions[ptIdx] = 0;
        }
        
        geomRef.current.attributes.position.needsUpdate = true;
    });

    return (
        <lineSegments ref={linesRef}>
            <bufferGeometry ref={geomRef} />
            <lineBasicMaterial color="#ff3377" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
        </lineSegments>
    );
}
// COSMIC ENERGY HORIZON (Aurora/Storm Ring)
function VoiceAuraLight({ isSpeaking }: { isSpeaking: boolean }) {
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

// REALISTIC FLOATING ORB (Quantum AI Core)
function FloatingOrb({ isListening, isSpeaking, setSunRef }: { isListening: boolean; isSpeaking: boolean, setSunRef: (ref: THREE.Mesh) => void }) {
    const orbGroupRef = useRef<THREE.Group>(null);
    const coreMatRef = useRef<any>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    const auraRef = useRef<THREE.Mesh>(null);
    const gyroRef = useRef<THREE.Group>(null);
    const shockwaveRef = useRef<THREE.Mesh>(null);
    
    // Voice Resonance Simulator Refs
    const simulatedVolumeRef = useRef(0);
    const lastVolumeChangeRef = useRef(0);
    
    useEffect(() => {
        if (orbGroupRef.current) {
            setSunRef(orbGroupRef.current as any);
        }
    }, [setSunRef]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        
        let targetScale = 1;

        // Base Idle Position
        let hoverX = Math.sin(t * 0.5) * 8;
        let hoverZ = -50; 
        let hoverYOffset = 2.5;

        if (isSpeaking) {
            // Fly around the horizon (Lissajous curve trajectory)
            hoverX = Math.sin(t * 1.5) * 30 + Math.cos(t * 0.8) * 25; 
            hoverZ = -50 + Math.sin(t * 1.2) * 25; // Swings from -75 to -25
            hoverYOffset = 10 + Math.sin(t * 2.0) * 15; 
            
            // Subtle scaling when it moves
            targetScale = THREE.MathUtils.mapLinear(hoverZ, -75, -25, 1.0, 1.3); 
            targetScale = Math.max(1.0, targetScale);
        } else if (isListening) {
            targetScale = 1.05;
        }

        // Simulate speech volume (Syllables / Anunadaya)
        if (isSpeaking) {
            // Update volume target every ~80ms to mimic fast syllable changes
            if (t - lastVolumeChangeRef.current > 0.08) {
                // Speech is spiky. 30% chance of a pause (low volume), 70% chance of a syllable (high volume)
                const isPause = Math.random() > 0.7;
                simulatedVolumeRef.current = isPause ? Math.random() * 0.2 : Math.random() * 0.8 + 0.2;
                lastVolumeChangeRef.current = t;
            }
        } else {
            simulatedVolumeRef.current = 0;
        }

        const currentVol = simulatedVolumeRef.current; // Value from 0.0 to 1.0

        if (orbGroupRef.current) {
            orbGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            orbGroupRef.current.rotation.y = t * 0.2;
            orbGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
            
            // Bob up and down on the PHYSICAL waves
            const waveHeight = GlobalOceanState.getWaveHeight(hoverX, hoverZ);
            const bobbing = waveHeight + hoverYOffset; 
            
            const targetPos = new THREE.Vector3(hoverX, bobbing, hoverZ);
            orbGroupRef.current.position.lerp(targetPos, 0.08);
        }
        
        // Inner Core Plasma Animation (Audio Reactive)
        if (coreMatRef.current) {
            // Colors cycle through hot energy colors when speaking, influenced by volume
            const colors = ["#ff0022", "#00ffcc", "#dd00ff", "#ffffff"]; // Added Cyan for advanced tech look
            const targetColorIndex = isSpeaking ? Math.floor(t * 5 + currentVol * 2) % colors.length : 0;
            const targetColor = new THREE.Color(colors[targetColorIndex]);
            
            coreMatRef.current.color.lerp(targetColor, 0.2); // Faster lerp for audio react
            coreMatRef.current.emissive.lerp(targetColor, 0.2);
            
            // Distort and Speed react instantly to volume!
            const targetDistort = isSpeaking ? 0.4 + currentVol * 0.8 : 0.2;
            const targetSpeed = isSpeaking ? 3 + currentVol * 25 : 2;
            const targetEmissive = isSpeaking ? 3.0 + currentVol * 15.0 : 2.0;

            coreMatRef.current.distort = THREE.MathUtils.lerp(coreMatRef.current.distort, targetDistort, 0.2);
            coreMatRef.current.speed = THREE.MathUtils.lerp(coreMatRef.current.speed, targetSpeed, 0.3);
            coreMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(coreMatRef.current.emissiveIntensity, targetEmissive, 0.3);
        }

        if (gyroRef.current) {
            const baseRotSpeed = 0.5;
            const targetRotSpeed = isSpeaking ? 5 + currentVol * 15 : baseRotSpeed;
            
            // Spin individual rings
            gyroRef.current.children[0].rotation.x += targetRotSpeed * 0.01;
            gyroRef.current.children[1].rotation.y += targetRotSpeed * 0.015;
            gyroRef.current.children[2].rotation.z += targetRotSpeed * 0.02;

            // Flash rings on volume
            gyroRef.current.children.forEach((child: any) => {
                if (child.material) {
                    child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, isSpeaking ? 0.3 + currentVol * 0.7 : 0.1, 0.2);
                }
            });
        }
        
        if (shockwaveRef.current) {
            if (isSpeaking && currentVol > 0.7) { // High volume spike triggers a shockwave
                if (shockwaveRef.current.scale.x > 8 || shockwaveRef.current.scale.x === 1) { // Reset if too big or fresh
                    shockwaveRef.current.scale.set(1, 1, 1);
                    (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0.9;
                }
            }
            // Expand wave and fade out
            shockwaveRef.current.scale.addScalar(0.4);
            const mat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = Math.max(0, mat.opacity - 0.02);
        }

        if (lightRef.current) {
            // Massive light burst on the water reacting to syllables
            const targetLight = isSpeaking ? 2500 + currentVol * 15000 : 2500;
            lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetLight, 0.2);
        }

        if (auraRef.current) {
            const auraMat = auraRef.current.material as any;
            const targetOpacity = isSpeaking ? 0.2 + currentVol * 0.6 : 0.1;
            auraMat.opacity = THREE.MathUtils.lerp(auraMat.opacity, targetOpacity, 0.2);
            
            // Pulsing energy size for aura, pulsing with voice!
            const auraScale = 1.05 + Math.sin(t * 15) * 0.02 + (currentVol * 0.3);
            auraRef.current.scale.set(auraScale, auraScale, auraScale);
        }
    });

    return (
        <group ref={orbGroupRef}>
            {/* Outer Refractive Glass Shell - Resized */}
            <mesh castShadow>
                <sphereGeometry args={[14, 64, 64]} />
                <MeshTransmissionMaterial 
                    color="#ff4444" 
                    roughness={0.0}
                    transmission={1.0} // Fully glass
                    thickness={1.5} // Refraction thickness
                    ior={1.4} // Index of Refraction
                    clearcoat={1}
                />
            </mesh>

            {/* Inner Bubbling Plasma Core - Resized */}
            <mesh>
                <sphereGeometry args={[10.8, 64, 64]} />
                <MeshDistortMaterial
                    ref={coreMatRef}
                    color="#aa0011"
                    emissive="#ff0011"
                    emissiveIntensity={2}
                    distort={0.2}
                    speed={2}
                />
            </mesh>
            
            {/* Energy Aura (Outer Glow) - Resized */}
            <mesh ref={auraRef}>
                <sphereGeometry args={[14.8, 32, 32]} />
                <meshBasicMaterial color="#ff0022" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            
            {/* Quantum Gyroscope Rings */}
            <group ref={gyroRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[16.8, 0.08, 16, 100]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false}/>
                </mesh>
                <mesh rotation={[0, Math.PI / 4, 0]}>
                    <torusGeometry args={[18.0, 0.08, 16, 100]} />
                    <meshBasicMaterial color="#00ffcc" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false}/>
                </mesh>
                <mesh rotation={[0, -Math.PI / 4, 0]}>
                    <torusGeometry args={[19.2, 0.08, 16, 100]} />
                    <meshBasicMaterial color="#ff0044" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false}/>
                </mesh>
            </group>
            
            {/* Neural Spark Swarm */}
            {typeof window !== 'undefined' && window.innerWidth >= 768 && (
                <Sparkles 
                    count={isSpeaking ? 800 : 200} 
                    scale={12} 
                    size={isSpeaking ? 15 : 6} 
                    speed={isSpeaking ? 8 : 1} 
                    opacity={0.8} 
                    color={isSpeaking ? "#00ffcc" : "#ff0044"} 
                />
            )}
            
            {/* Audio Shockwave Ring (lays flat on ocean surface) */}
            <mesh ref={shockwaveRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
                <ringGeometry args={[3, 3.5, 64]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            {/* Massive internal power source that illuminates the dark ocean */}
            <pointLight ref={lightRef} color="#ff0022" intensity={2500} distance={200} decay={1.5} />
            
            {/* Intergalactic Cosmic Lightning Connection */}
            <CosmicLightning isActive={isSpeaking || isListening} />
        </group>
    );
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
function Rain() {
    const rainRef = useRef<THREE.Points>(null);
    const dropCount = 6000;
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

    return (
        <points ref={rainRef}>
            <bufferGeometry>
                <bufferAttribute 
                    attach="attributes-position" 
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

// THE RAFT & SURVIVOR
function LoneSurvivorOnRaft({ startDrift, hasCompletedIntro }: { startDrift?: boolean, hasCompletedIntro?: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const startTimeRef = useRef(0);
    const [driftStarted, setDriftStarted] = useState(false);
    const driftDuration = 8000;
    
    // Position it 5 units in front of the camera
    const startZ = 295; // Camera is at 300
    const endZ = 15;   // Camera ends at 20

    // Custom EaseInOutExpo curve for hyper-realistic acceleration and smooth deceleration
    const easeInOutExpo = (x: number): number => {
        return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
    };

    const previousZ = useRef(startZ);

    useEffect(() => {
        if (hasCompletedIntro) {
            if (groupRef.current) groupRef.current.position.z = endZ;
        } else if (startDrift && !driftStarted) {
            startTimeRef.current = Date.now();
            setDriftStarted(true);
            previousZ.current = startZ;
        }
    }, [hasCompletedIntro, startDrift, driftStarted]);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        
        const time = clock.getElapsedTime();
        const waveHeight = GlobalOceanState.getWaveHeight(groupRef.current.position.x, groupRef.current.position.z);
        
        // Drifting logic & Velocity calculation
        let velocity = 0;
        if (driftStarted && !hasCompletedIntro) {
            const elapsed = Date.now() - startTimeRef.current;
            if (elapsed < driftDuration) {
                const progress = elapsed / driftDuration;
                const ease = easeInOutExpo(progress);
                const currentZ = startZ - ((startZ - endZ) * ease);
                
                velocity = previousZ.current - currentZ; // Distance moved this frame
                previousZ.current = currentZ;
                groupRef.current.position.z = currentZ;
            } else {
                groupRef.current.position.z = endZ;
                velocity = 0;
            }
        } else if (!hasCompletedIntro && !driftStarted) {
            groupRef.current.position.z = startZ;
        }

        // Physics-based Raft Momentum
        // When velocity is high, nose lifts up. When it drops suddenly, it splashes down.
        const pitchFromVelocity = velocity * 0.5; // Lift nose proportional to speed
        const bobbing = Math.sin(time * 1.5) * 0.05; // Normal ocean bobbing
        
        groupRef.current.position.y = waveHeight;
        groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
        // Combine natural bobbing with physics momentum
        groupRef.current.rotation.x = bobbing - pitchFromVelocity;
    });

    return (
        <group ref={groupRef} position={[0, -2, startZ]}>
            {/* Raft */}
            <Box args={[2, 0.2, 3]} position={[0, 0, 0]} receiveShadow castShadow>
                <meshStandardMaterial color="#1a120e" roughness={0.9} />
            </Box>
            {/* Lone Person Silhouette */}
            <Cylinder args={[0.2, 0.3, 1.0, 16]} position={[0, 0.6, 0]} castShadow>
                <meshStandardMaterial color="#000000" />
            </Cylinder>
            {/* Head */}
            <Sphere args={[0.2, 16, 16]} position={[0, 1.3, 0.1]} castShadow>
                <meshStandardMaterial color="#000000" />
            </Sphere>
        </group>
    );
}





// FIRST PERSON CINEMATIC CAMERA (Raft Drift + First Person after)
function FirstPersonCamera({ isListening, isSpeaking, hasCompletedIntro, startDrift, onDriftComplete }: { isListening: boolean; isSpeaking: boolean, hasCompletedIntro?: boolean, startDrift?: boolean, onDriftComplete?: () => void }) {
    const { camera, scene } = useThree();
    const controlsRef = useRef<any>(null);
    const spotLightRef = useRef<THREE.SpotLight>(null);
    const targetObj = useMemo(() => new THREE.Object3D(), []);
    const startTimeRef = useRef(0);
    const driftDoneRef = useRef(false);
    const [driftStarted, setDriftStarted] = useState(false);
    
    // The raft drift: camera starts at Z=300 (very far away), drifts to Z=20 over 8 seconds.
    // The Red Orb sits at Z=-50. So the camera will end up 70 units away, looking at it.
    const driftDuration = 8000;
    const startZ = 300;
    const endZ = 20;
    const orbLookAt = new THREE.Vector3(0, 8, -50); // The orb center

    // Custom EaseInOutExpo curve for hyper-realistic acceleration and smooth deceleration
    const easeInOutExpo = (x: number): number => {
        return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
    };

    // Find the ambient light to manipulate
    const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.AmbientLight) {
                ambientLightRef.current = child;
            }
        });
    }, [scene]);

    // Initialize
    useEffect(() => {
        if (hasCompletedIntro) {
            // Instantly jump to final state, skip animation
            camera.position.set(0, 4, endZ);
            camera.lookAt(orbLookAt);
            if (controlsRef.current) {
                const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
                const newTarget = camera.position.clone().add(lookDir.multiplyScalar(0.01));
                controlsRef.current.target.copy(newTarget);
                controlsRef.current.enabled = true;
            }
            driftDoneRef.current = true;
            startTimeRef.current = Date.now() - driftDuration - 1000; // Force elapsed > driftDuration
        } else if (startDrift && !driftStarted) {
            startTimeRef.current = Date.now();
            setDriftStarted(true);
            driftDoneRef.current = false;
            // Start far, looking at orb
            camera.position.set(0, 4, startZ);
            camera.lookAt(orbLookAt);
            // Disable controls initially
            if (controlsRef.current) {
                controlsRef.current.enabled = false;
            }
        }
    }, [camera, hasCompletedIntro, startDrift, driftStarted]);

    useFrame(() => {
        if (driftStarted || hasCompletedIntro) {
            const elapsed = Date.now() - startTimeRef.current;
            
            if (elapsed < driftDuration) {
                // PHASE 1: Cinematic drift
                if (controlsRef.current) controlsRef.current.enabled = false;
                
                const progress = elapsed / driftDuration;
                // Hyper-smooth acceleration and deceleration
                const ease = easeInOutExpo(progress);
                const currentZ = startZ - ((startZ - endZ) * ease);
                
                camera.position.z = currentZ;
                camera.position.y = 4; // Fixed height
                
                // Dynamic Atmosphere (Fog & Light)
                // Far away: dense fog, dark. Near: clear fog, bright red glow.
                if (scene.fog) {
                    (scene.fog as THREE.Fog).near = THREE.MathUtils.lerp(50, 20, ease);
                    (scene.fog as THREE.Fog).far = THREE.MathUtils.lerp(500, 150, ease); // Fog recedes slightly to reveal orb sharply
                }
                if (ambientLightRef.current) {
                    ambientLightRef.current.intensity = THREE.MathUtils.lerp(0.5, 1.5, ease); // Light intensifies
                }

                // Camera shake & FOV stretch based on current velocity (derivative of position)
                // Highest velocity is at progress = 0.5 for EaseInOut
                const speedFactor = progress < 0.5 ? ease * 2 : (1 - ease) * 2;
                if (speedFactor > 0.05) {
                    const shake = speedFactor * 0.5;
                    camera.position.x = (Math.random() - 0.5) * shake;
                    camera.position.y = 4 + (Math.random() - 0.5) * shake;
                    (camera as THREE.PerspectiveCamera).fov = 60 + (speedFactor * 40); // Warp speed FOV
                    camera.updateProjectionMatrix();
                } else {
                    // Smoothly restore FOV when speed drops near the end
                    const currentFov = (camera as THREE.PerspectiveCamera).fov;
                    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(currentFov, 60, 0.1);
                    camera.updateProjectionMatrix();
                }

                // Always look directly at the orb
                camera.lookAt(orbLookAt);
            } else {
                // Smoothly reset FOV to 60
                const currentFov = (camera as THREE.PerspectiveCamera).fov;
                if (currentFov > 60.1) {
                    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(currentFov, 60, 0.1);
                    camera.updateProjectionMatrix();
                }
                
                // PHASE 2: Hand off to OrbitControls for first-person look-around
                if (!driftDoneRef.current && controlsRef.current) {
                    driftDoneRef.current = true;
                    // CRITICAL: set target 0.01 units AHEAD of camera's current look direction
                    // This keeps camera at current position instead of teleporting it to the orb
                    const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
                    const newTarget = camera.position.clone().add(lookDir.multiplyScalar(0.01));
                    controlsRef.current.target.copy(newTarget);
                    controlsRef.current.enabled = true;
                    if (onDriftComplete) onDriftComplete();
                }
            }
        } else if (!hasCompletedIntro && !driftStarted) {
            // INITIAL STAGING: Before the drift even begins, the camera must be placed perfectly at Z=300
            // and the dark foggy atmosphere must be set. This ensures that when the LoadingScreen crossfades,
            // the user sees the dark ocean smoothly, instead of a sudden teleport from Z=0 to Z=300.
            camera.position.set(0, 4, startZ);
            camera.lookAt(orbLookAt);
            
            if (scene.fog) {
                (scene.fog as THREE.Fog).near = 50;
                (scene.fog as THREE.Fog).far = 500;
            }
            if (ambientLightRef.current) {
                ambientLightRef.current.intensity = 0.5;
            }
        }


        // Sync lantern to camera
        if (spotLightRef.current) {
            const forward = new THREE.Vector3(0, -0.3, -1).applyQuaternion(camera.quaternion).normalize();
            spotLightRef.current.position.copy(camera.position).add(new THREE.Vector3(0, 0.3, 0));
            targetObj.position.copy(camera.position).add(forward.multiplyScalar(50));
        }
    });

    return (
        <>
            <primitive object={targetObj} />
            {/* The Lantern Beam */}
            <SpotLight
                ref={spotLightRef}
                target={targetObj}
                color="#f59e0b"
                intensity={600}
                distance={120}
                angle={0.7}
                penumbra={0.9}
                decay={1.5}
                castShadow
            />
            <OrbitControls 
                ref={controlsRef}
                target={[0, 8, -50]}
                enabled={false}
                enableZoom={false} 
                enablePan={false} 
                enableDamping={true}
                dampingFactor={0.05}
                minDistance={0.01} 
                maxDistance={0.01}
                minPolarAngle={0.1}
                maxPolarAngle={Math.PI - 0.1}
                rotateSpeed={0.6}
                makeDefault
            />
        </>
    );
}

// DYNAMIC LIGHTNING STRIKES
function Lightning() {
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
function ProceduralAudioSystem() {
    useEffect(() => {
        // Only run in browser
        if (typeof window === 'undefined') return;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();

        // 1. Wind Noise (Pink/Brown noise filter)
        const bufferSize = ctx.sampleRate * 2; // 2 seconds
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const windSource = ctx.createBufferSource();
        windSource.buffer = noiseBuffer;
        windSource.loop = true;

        const windFilter = ctx.createBiquadFilter();
        windFilter.type = 'lowpass';
        windFilter.frequency.value = 400; // Low rumble

        const windGain = ctx.createGain();
        windGain.gain.value = 0.5;

        windSource.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(ctx.destination);
        windSource.start();

        // Must resume context on interaction
        const resumeAudio = () => {
            if (ctx.state === 'suspended') ctx.resume();
        };
        document.addEventListener('click', resumeAudio);
        document.addEventListener('touchstart', resumeAudio);

        return () => {
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('touchstart', resumeAudio);
            windSource.stop();
            ctx.close();
        };
    }, []);

    return null;
}

// REALISTIC MIDNIGHT OCEAN
function RealisticOcean({ isSpeaking, isListening }: { isSpeaking: boolean, isListening: boolean }) {
    const ref = useRef<any>(null);
    const gl = useThree((state) => state.gl);
    const waterNormals = useTexture('/waternormals.jpg');
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    const geom = useMemo(() => new THREE.PlaneGeometry(2000, 2000, 250, 250), []);
    
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: new THREE.Vector3(0, 1, 0.5).normalize(), // Directs the specular highlight towards the camera
            sunColor: 0xff0022, // Quantum AI Core Red reflection
            waterColor: 0x000511, // Extremely deep, dark cinematic ocean blue
            distortionScale: 4.5, // Increased distortion for more liquid feel
            fog: true,
            format: gl.outputColorSpace,
            alpha: 0.9, // Slightly more opaque for better reflections
        }),
        [waterNormals, gl]
    );

    const speedRef = useRef(1);

    useEffect(() => {
        if (ref.current) {
            ref.current.material.side = THREE.DoubleSide;
            ref.current.material.transparent = true;
            ref.current.material.opacity = 0.9;
            
            // Inject Sea Foam and Subsurface Scattering into THREE.Water shader
            ref.current.material.onBeforeCompile = (shader: any) => {
                // Pass Z position (Wave Height) to Fragment Shader
                shader.vertexShader = shader.vertexShader.replace(
                    'void main() {',
                    'varying float vHeight;\nvoid main() {'
                );
                shader.vertexShader = shader.vertexShader.replace(
                    '#include <begin_vertex>',
                    '#include <begin_vertex>\nvHeight = position.z;'
                );
                
                // Receive in Fragment Shader
                shader.fragmentShader = shader.fragmentShader.replace(
                    'void main() {',
                    'varying float vHeight;\nvoid main() {'
                );
                
                // Inject Foam (white peaks) and Subsurface Scattering (cyan bleeding)
                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <tonemapping_fragment>',
                    `
                    // --- ADVANCED SUBSURFACE SCATTERING ---
                    // Deep oceanic teal/cyan glow bleeding through the waves
                    float sssAmount = smoothstep(0.0, 2.0, vHeight);
                    vec3 sssColor = vec3(0.0, 0.5, 0.3); // Vibrant deep sea teal
                    gl_FragColor.rgb += sssColor * sssAmount * 0.9;
                    
                    // --- DYNAMIC SEA FOAM ---
                    // Brilliant white foam at the sharp peaks of the waves
                    float foamAmount = smoothstep(0.8, 2.0, vHeight);
                    vec3 foamColor = vec3(0.9, 0.95, 1.0); 
                    
                    // Blend foam on top
                    gl_FragColor.rgb = mix(gl_FragColor.rgb, foamColor, foamAmount * 0.85);
                    
                    // Maintain slight transparency for depth
                    gl_FragColor.a = 0.9;
                    
                    #include <tonemapping_fragment>
                    `
                );
            };
        }
    }, []);

    useFrame((state, delta) => {
        // Accumulate time continuously based on speed to prevent jumps
        // If listening (thinking) -> highly turbulent (4.0). If speaking -> focused (2.0). Idle -> calm (1.0).
        const targetSpeed = isListening ? 4.0 : isSpeaking ? 2.0 : 1.0;
        GlobalOceanState.speed = THREE.MathUtils.lerp(GlobalOceanState.speed, targetSpeed, 0.05);
        GlobalOceanState.time += delta * GlobalOceanState.speed;
        
        if (ref.current) {
            ref.current.material.uniforms.time.value += delta * GlobalOceanState.speed * 0.5;
        }

        const positions = geom.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            
            // Reuse the global wave math to modify the vertex Z (which becomes World Y)
            // We pass (x, -y) because local Y is World -Z
            const height = GlobalOceanState.getWaveHeight(x, -y);
            positions.setZ(i, height); 
        }
        positions.needsUpdate = true;
        geom.computeVertexNormals();
    });

    return <water ref={ref} args={[geom, config]} rotation={[-Math.PI / 2, 0, 0]} />;
}

// DYNAMIC DAY/NIGHT SKY MANAGER HAS BEEN REMOVED

// PURE CLEAN UI
function PixelPerfectUI({ onExploreClick, activeZone }: { onExploreClick: () => void, activeZone?: string }) {
    return null; // Entirely handled by CentralPortalNav now
}

interface ThreeDTechLabProps {
    isListening: boolean;
    isSpeaking: boolean;
    activeZone?: string;
    hasCompletedIntro?: boolean;
    startDrift?: boolean;
    onDriftComplete?: () => void;
    onExploreClick: () => void;
}

export default function ThreeDTechLab({ isSpeaking, isListening, activeZone, hasCompletedIntro, startDrift, onDriftComplete, onExploreClick }: ThreeDTechLabProps) {
    // Only render on client to avoid hydration mismatch with Canvas
    const [mounted, setMounted] = useState(false);
    const [sunRef, setSunRef] = useState<THREE.Mesh | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 w-full h-full bg-[#010611] overflow-hidden">
            
            <div className="absolute inset-0 z-0">
                <Canvas 
                    camera={{ position: [0, 4, 300], fov: 60 }} 
                    dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)} 
                    gl={{ antialias: false }}
                >
                    
                    {/* Fog: thinner so orb is visible from 350 units distance */}
                    <fog attach="fog" args={['#010611', 50, 500]} />
                    <color attach="background" args={['#010611']} />
                    
                    {/* The Deep Abyss Floor (Seabed) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -25, 0]}>
                        <planeGeometry args={[1000, 1000]} />
                        <meshStandardMaterial color="#000511" roughness={1} metalness={0} />
                    </mesh>

                    <ambientLight intensity={1.5} color="#445566" />
                    <spotLight position={[0, 20, 20]} intensity={50} decay={2} distance={100} color="#004466" penumbra={1} angle={Math.PI / 3} />

                    {/* INTERGALACTIC STARRY SKY */}
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />

                    {/* VOICE ASSISTANT 360 LIGHTING */}
                    <VoiceAuraLight isSpeaking={isSpeaking} />

                    {/* Deep Volumetric Sub-lighting (Red light from abyss) */}
                    <pointLight position={[0, -15, -50]} intensity={250} distance={80} decay={1.5} color="#ff0022" />
                    
                    {/* WEATHER & SOUNDS */}
                    <ProceduralAudioSystem />
                    <Lightning />

                    <Suspense fallback={null}>
                        {/* Removed heavy remote HDR environment to drastically improve load time. Relying on explicit lights. */}
                        <FloatingOrb isListening={isListening} isSpeaking={isSpeaking} setSunRef={setSunRef} />
                        <RealisticOcean isSpeaking={isSpeaking} isListening={isListening} />
                        <LoneSurvivorOnRaft startDrift={startDrift} hasCompletedIntro={hasCompletedIntro} />
                    </Suspense>

                    <Rain />

                    {/* POST PROCESSING (Cinematic Stack - Crisp & Clear without blur) */}
                    <EffectComposer multisampling={0}>
                        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
                        <Vignette eskil={false} offset={0.1} darkness={1.2} />
                        <Noise opacity={0.03} />
                    </EffectComposer>

                    <FirstPersonCamera 
                        isListening={isListening} 
                        isSpeaking={isSpeaking} 
                        hasCompletedIntro={hasCompletedIntro}
                        startDrift={startDrift}
                        onDriftComplete={onDriftComplete} 
                    />
                </Canvas>
            </div>

            <PixelPerfectUI onExploreClick={onExploreClick} activeZone={activeZone} />

        </div>
    );
}
