import React, { useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Float, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 3D Glass Orb with Hacker Core
function HackerOrb() {
    const groupRef = useRef<THREE.Group>(null);
    const texture = useTexture('/cyber_hacker_logo.png');
    texture.colorSpace = THREE.SRGBColorSpace;

    useFrame((state) => {
        if (groupRef.current) {
            // Cinematic subtle floating rotation
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
            <group ref={groupRef}>
                {/* The Inner AI Hacker Core (Image mapped to a disk) */}
                <mesh position={[0, 0, 0]}>
                    <circleGeometry args={[1.7, 64]} />
                    <meshStandardMaterial 
                        map={texture} 
                        roughness={0.2} 
                        metalness={0.8} 
                        emissive="#ff0033"
                        emissiveIntensity={0.1}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* The Outer Quantum Glass Shell */}
                <mesh>
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshPhysicalMaterial 
                        color="#ffffff"
                        metalness={0.1}
                        roughness={0}
                        transmission={1} // True Glass Refraction
                        ior={1.4}
                        thickness={0.8}
                        clearcoat={1}
                        transparent
                        opacity={1}
                    />
                </mesh>

                {/* Floating Digital Sparkles */}
                <Sparkles count={50} scale={5} size={2} speed={0.4} opacity={0.5} color="#00ffff" />
                <Sparkles count={50} scale={5} size={1.5} speed={0.6} opacity={0.5} color="#ff0033" />
            </group>
        </Float>
    );
}

export default function CodeLogo() {
    return (
        <div className="relative flex flex-col items-center justify-center w-full h-[300px] md:h-[400px] pointer-events-none select-none">
            
            {/* 1. TRUE 3D REALISTIC SCENE */}
            <div className="absolute inset-0 z-10">
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                    <ambientLight intensity={0.5} color="#ffffff" />
                    <spotLight position={[5, 10, 5]} intensity={100} color="#ff0033" penumbra={1} />
                    <spotLight position={[-5, -10, 5]} intensity={100} color="#00ffff" penumbra={1} />
                    
                    <Suspense fallback={null}>
                        <Environment preset="city" />
                        <HackerOrb />
                        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#000000" />
                    </Suspense>
                </Canvas>
            </div>

            {/* 2. TYPOGRAPHY (Now positioned absolutely so it doesn't push the canvas) */}
            <motion.div 
                className="absolute bottom-[-20px] flex flex-col items-center z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                {/* KARIYAWASAM */}
                <h1 
                    className="font-bold uppercase text-[20px] md:text-[26px] tracking-[0.35em] text-white whitespace-nowrap"
                    style={{ 
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        textShadow: '0 0 15px rgba(255,255,255,0.5)',
                    }}
                >
                    Kariyawasam
                </h1>
                
                {/* CODER */}
                <h2 
                    className="font-light uppercase text-[12px] md:text-[16px] tracking-[0.6em] text-red-500 mt-[-2px] md:mt-0 whitespace-nowrap pl-2"
                    style={{ 
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        textShadow: '0 0 20px rgba(255,0,0,0.8)',
                    }}
                >
                    Coder
                </h2>
            </motion.div>
        </div>
    );
}
