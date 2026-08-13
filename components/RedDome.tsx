import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshDistortMaterial, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import { GlobalOceanState } from './RealisticOcean';

interface RedDomeProps {
    isSpeaking: boolean;
    isListening: boolean;
}

export default function RedDome({ isSpeaking, isListening }: RedDomeProps) {
    const orbGroupRef = useRef<THREE.Group>(null);
    const coreMatRef = useRef<any>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    const auraRef = useRef<THREE.Mesh>(null);
    const gyroRef = useRef<THREE.Group>(null);
    const shockwaveRef = useRef<THREE.Mesh>(null);
    
    // Voice Resonance Simulator Refs
    const simulatedVolumeRef = useRef(0);
    const lastVolumeChangeRef = useRef(0);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        
        let targetScale = 1;

        // Base Idle Position
        let hoverX = Math.sin(t * 0.5) * 8;
        let hoverZ = 0; 
        let hoverYOffset = 2.5;

        if (isSpeaking) {
            // Fly around the horizon (Lissajous curve trajectory)
            hoverX = Math.sin(t * 1.5) * 30 + Math.cos(t * 0.8) * 25; 
            hoverZ = Math.sin(t * 1.2) * 25; 
            hoverYOffset = 10 + Math.sin(t * 2.0) * 15; 
            
            // Subtle scaling when it moves
            targetScale = THREE.MathUtils.mapLinear(hoverZ, -25, 25, 1.0, 1.3); 
            targetScale = Math.max(1.0, targetScale);
        } else if (isListening) {
            targetScale = 1.05;
        }

        // Simulate speech volume
        if (isSpeaking) {
            if (t - lastVolumeChangeRef.current > 0.08) {
                const isPause = Math.random() > 0.7;
                simulatedVolumeRef.current = isPause ? Math.random() * 0.2 : Math.random() * 0.8 + 0.2;
                lastVolumeChangeRef.current = t;
            }
        } else {
            simulatedVolumeRef.current = 0;
        }

        const currentVol = simulatedVolumeRef.current;

        if (orbGroupRef.current) {
            orbGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            orbGroupRef.current.rotation.y = t * 0.2;
            orbGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
            
            // Bob up and down on the PHYSICAL waves
            const waveHeight = GlobalOceanState.getWaveHeight(hoverX, hoverZ + 20); // offset Z since group is at 20
            const bobbing = waveHeight + hoverYOffset; 
            
            const targetPos = new THREE.Vector3(hoverX, bobbing, hoverZ);
            orbGroupRef.current.position.lerp(targetPos, 0.08);
        }
        
        // Inner Core Plasma Animation
        if (coreMatRef.current) {
            const colors = ["#ff0022", "#00ffcc", "#dd00ff", "#ffffff"];
            const targetColorIndex = isSpeaking ? Math.floor(t * 5 + currentVol * 2) % colors.length : 0;
            const targetColor = new THREE.Color(colors[targetColorIndex]);
            
            coreMatRef.current.color.lerp(targetColor, 0.2);
            coreMatRef.current.emissive.lerp(targetColor, 0.2);
            
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
            
            gyroRef.current.children[0].rotation.x += targetRotSpeed * 0.01;
            gyroRef.current.children[1].rotation.y += targetRotSpeed * 0.015;
            gyroRef.current.children[2].rotation.z += targetRotSpeed * 0.02;

            gyroRef.current.children.forEach((child: any) => {
                if (child.material) {
                    child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, isSpeaking ? 0.3 + currentVol * 0.7 : 0.1, 0.2);
                }
            });
        }
        
        if (shockwaveRef.current) {
            if (isSpeaking && currentVol > 0.7) {
                if (shockwaveRef.current.scale.x > 8 || shockwaveRef.current.scale.x === 1) {
                    shockwaveRef.current.scale.set(1, 1, 1);
                    (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0.9;
                }
            }
            shockwaveRef.current.scale.addScalar(0.4);
            const mat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = Math.max(0, mat.opacity - 0.02);
        }

        if (lightRef.current) {
            const targetLight = isSpeaking ? 2500 + currentVol * 15000 : 2500;
            lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetLight, 0.2);
        }

        if (auraRef.current) {
            const auraMat = auraRef.current.material as any;
            const targetOpacity = isSpeaking ? 0.2 + currentVol * 0.6 : 0.1;
            auraMat.opacity = THREE.MathUtils.lerp(auraMat.opacity, targetOpacity, 0.2);
            
            const auraScale = 1.05 + Math.sin(t * 15) * 0.02 + (currentVol * 0.3);
            auraRef.current.scale.set(auraScale, auraScale, auraScale);
        }
    });

    return (
        <group position={[0, 10, 20]} ref={orbGroupRef}>
            {/* Outer Refractive Glass Shell */}
            <mesh castShadow>
                <sphereGeometry args={[14, 64, 64]} />
                <MeshTransmissionMaterial 
                    color="#ff4444" 
                    roughness={0.0}
                    transmission={1.0}
                    thickness={1.5}
                    ior={1.4}
                    clearcoat={1}
                />
            </mesh>

            {/* Inner Bubbling Plasma Core */}
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
            
            {/* Energy Aura (Outer Glow) */}
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
            <Sparkles 
                count={isSpeaking ? 800 : 200} 
                scale={12} 
                size={isSpeaking ? 15 : 6} 
                speed={isSpeaking ? 8 : 1} 
                opacity={0.8} 
                color={isSpeaking ? "#00ffcc" : "#ff0044"} 
            />
            
            {/* Audio Shockwave Ring */}
            <mesh ref={shockwaveRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -12, 0]}>
                <ringGeometry args={[14, 15, 64]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            {/* Massive internal power source that illuminates the dark ocean */}
            <pointLight ref={lightRef} color="#ff0022" intensity={2500} distance={200} decay={1.5} />
        </group>
    );
}
