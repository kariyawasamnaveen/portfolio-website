import React, { useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Float, ContactShadows, Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';

// Clean, Sleek 3D Floating Medallion
function HackerMedallion() {
    const groupRef = useRef<THREE.Group>(null);
    const texture = useTexture('/cyber_hacker_logo.png');
    texture.colorSpace = THREE.SRGBColorSpace;

    useFrame((state) => {
        if (groupRef.current) {
            // Very subtle, premium 3D rotation
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
        }
    });

    return (
        <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.5}>
            <group ref={groupRef}>
                {/* The Logo Mesh */}
                <mesh>
                    <circleGeometry args={[2, 64]} />
                    <meshBasicMaterial 
                        map={texture} 
                        side={THREE.DoubleSide}
                        transparent
                    />
                </mesh>

                {/* Glowing Aura Ring Behind the Logo */}
                <mesh position={[0, 0, -0.05]}>
                    <ringGeometry args={[2, 2.1, 64]} />
                    <meshBasicMaterial color="#ff0033" transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>

                {/* Subtle Holographic Sparks */}
                <Sparkles count={30} scale={4.5} size={1.5} speed={0.4} opacity={0.8} color="#00ffff" />
                <Sparkles count={30} scale={4.5} size={1.5} speed={0.4} opacity={0.8} color="#ff0033" />
            </group>
        </Float>
    );
}

export default function CodeLogo() {
    return (
        <div className="relative flex flex-col items-center justify-center w-[250px] h-[350px] md:w-[350px] md:h-[450px] pointer-events-none select-none">
            
            {/* 1. TRUE 3D REALISTIC SCENE - Clean and Premium */}
            <div className="absolute inset-0 z-10">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
                    <Suspense fallback={null}>
                        <Center>
                            <HackerMedallion />
                        </Center>
                        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
                    </Suspense>
                </Canvas>
            </div>

            {/* 2. TYPOGRAPHY */}
            <motion.div 
                className="absolute bottom-4 flex flex-col items-center z-20"
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
