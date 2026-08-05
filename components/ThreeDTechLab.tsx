"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Grid, Line } from '@react-three/drei';
import { EffectComposer, Bloom, GodRays } from '@react-three/postprocessing';
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
        const lines = [];
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

// The Ultimate Hero Core with God Rays, Cracks, and Halos!
function RealGodTierCore({ isListening, isSpeaking, setSunRef }: { isListening: boolean; isSpeaking: boolean, setSunRef: (ref: THREE.Mesh) => void }) {
    const machineRef = useRef<THREE.Group>(null);
    const innerCoreRef = useRef<THREE.Mesh>(null);
    const sunMeshRef = useRef<THREE.Mesh>(null);
    
    // Geometries
    const outerGeo = useMemo(() => new THREE.IcosahedronGeometry(2.4, 0), []);
    const middleGeo = useMemo(() => {
        const geo = new THREE.OctahedronGeometry(1.6, 0);
        geo.rotateX(Math.PI / 4);
        return geo;
    }, []);
    const innerGeo = useMemo(() => new THREE.IcosahedronGeometry(1.1, 0), []);

    // Golden Amber
    const baseColor = useMemo(() => new THREE.Color("#ff6600"), []); 
    const activeColor = useMemo(() => new THREE.Color("#ffaa00"), []); 
    const [currentEmissive, setCurrentEmissive] = useState(baseColor);
    const [intensity, setIntensity] = useState(2);

    useEffect(() => {
        if (sunMeshRef.current) {
            setSunRef(sunMeshRef.current);
        }
    }, [setSunRef]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        
        if (machineRef.current && innerCoreRef.current && sunMeshRef.current) {
            machineRef.current.rotation.y = t * 0.1;
            machineRef.current.rotation.x = t * 0.05;

            innerCoreRef.current.rotation.y = t * 0.2;
            innerCoreRef.current.rotation.x = t * -0.1;
            
            let scale = 1;
            let targetColor = baseColor;
            let targetIntensity = 2;

            if (isSpeaking) {
                scale = 1.08 + Math.sin(t * 25) * 0.03;
                targetColor = activeColor;
                targetIntensity = 8;
            } else if (isListening) {
                scale = 1.04 + Math.sin(t * 5) * 0.015;
                targetColor = activeColor;
                targetIntensity = 5;
            } else {
                scale = 1 + Math.sin(t * 1.2) * 0.01;
                targetIntensity = 2;
            }

            setCurrentEmissive(targetColor);
            setIntensity(targetIntensity);

            machineRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.15);
            innerCoreRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.15);
            
            // Pulse the sun (God Rays source)
            sunMeshRef.current.scale.setScalar(scale * 0.5);
        }
    });

    return (
        <group>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                
                {/* 1. THE SUN (Hidden from view, used only for GodRays volumetric scattering) */}
                <mesh ref={sunMeshRef} visible={true}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshBasicMaterial color="#ffaa00" toneMapped={false} transparent opacity={0.5} />
                </mesh>

                {/* 2. INNER CORE - Dark Solid with PERFECT Cracks */}
                <group ref={innerCoreRef}>
                    <mesh geometry={innerGeo}>
                        <meshStandardMaterial color="#020100" roughness={0.2} metalness={0.8} />
                    </mesh>
                    {/* Glowing Cracks: Using GlowingStructure with 0 nodeSize perfectly outlines the solid core! */}
                    <GlowingStructure geometry={innerGeo} color={currentEmissive} lineWidth={2} nodeSize={0} opacity={0.8} />
                </group>

                {/* 3. UNIFIED MACHINERY (Web + Halos) */}
                <group ref={machineRef}>
                    <GlowingStructure geometry={outerGeo} color={currentEmissive} lineWidth={3} nodeSize={0.08} opacity={1} />
                    <GlowingStructure geometry={middleGeo} color={currentEmissive} lineWidth={1.5} nodeSize={0.06} opacity={0.9} />
                    <InterconnectedStruts outerGeo={outerGeo} innerGeo={middleGeo} color={currentEmissive} lineWidth={1} />
                </group>

                <pointLight distance={30} intensity={intensity * 10} color="#ffaa00" />
            </Float>
        </group>
    );
}

// CLEAN & PREMIUM ENVIRONMENT
function CinematicHorizon() {
    return (
        <group>
            <Grid 
                position={[0, -3.5, 0]} 
                args={[200, 200]} 
                cellSize={1} 
                cellThickness={1} 
                cellColor="#06b6d4" 
                sectionSize={5} 
                sectionThickness={2} 
                sectionColor="#0284c7" 
                fadeDistance={100} 
                fadeStrength={1.5}
            />
            <pointLight position={[0, -1, -25]} intensity={500} color="#06b6d4" distance={50} decay={2} />
            <pointLight position={[-25, -1, -25]} intensity={400} color="#0284c7" distance={50} decay={2} />
            <pointLight position={[25, -1, -25]} intensity={400} color="#0284c7" distance={50} decay={2} />
            <pointLight position={[0, -3, 0]} intensity={20} color="#06b6d4" distance={20} />
        </group>
    );
}

// PURE CLEAN UI
function PixelPerfectUI({ onExploreClick }: { onExploreClick: () => void }) {
    return (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center max-w-[1400px] mx-auto px-10">
            <div className="absolute top-[20%] left-[5%] pointer-events-auto select-none">
                <h1 className="text-[3.5rem] leading-[1.1] font-black uppercase tracking-tight text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                    Voice Bot<br/>Architect
                </h1>
                <h2 className="text-xl font-semibold text-cyan-400 tracking-wide mb-1 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">NAVEEN SANDEEPA</h2>
                <p className="text-sm text-neutral-400 font-mono tracking-widest uppercase">Elite Backend Engineer</p>
            </div>

            {/* Sleek Premium CTA Button */}
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-6">
                <button 
                    onClick={onExploreClick}
                    className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/20 backdrop-blur-md text-white font-black text-xs tracking-[0.2em] uppercase rounded-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:border-cyan-400/50"
                >
                    Explore My Projects
                </button>
                <div className="flex justify-center gap-6 text-neutral-500">
                    <a href="https://github.com/kariyawasamnaveen" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                        <FiGithub size={20} />
                    </a>
                    <a href="https://www.linkedin.com/in/naveen-kariyawasam-b85507229/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                        <FiLinkedin size={20} />
                    </a>
                    <button onClick={() => {
                        navigator.clipboard.writeText('hknskariyawasamnaveen@gmail.com');
                        alert('Email copied!');
                    }} className="hover:text-cyan-400 transition-colors">
                        <FiMail size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ThreeDTechLabProps {
    isListening: boolean;
    isSpeaking: boolean;
    onExploreClick: () => void;
}

export default function ThreeDTechLab({ isListening, isSpeaking, onExploreClick }: ThreeDTechLabProps) {
    const [mounted, setMounted] = useState(false);
    const [sunRef, setSunRef] = useState<THREE.Mesh | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 w-full h-full bg-[#010308] overflow-hidden">
            
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 1.5, 12], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
                    
                    <fog attach="fog" args={['#010308', 10, 100]} />
                    <color attach="background" args={['#010308']} />
                    
                    <ambientLight intensity={0.2} />

                    <RealGodTierCore isListening={isListening} isSpeaking={isSpeaking} setSunRef={setSunRef} />
                    
                    <CinematicHorizon />
                    
                    <points>
                        <bufferGeometry>
                            <bufferAttribute 
                                attach="attributes-position" 
                                count={1500} 
                                array={new Float32Array(4500).map(() => (Math.random() - 0.5) * 80)} 
                                itemSize={3} 
                            />
                        </bufferGeometry>
                        <pointsMaterial size={0.06} color="#06b6d4" transparent opacity={0.5} sizeAttenuation />
                    </points>

                    {/* POST PROCESSING (Bloom + Volumetric God Rays) */}
                    <EffectComposer disableNormalPass multisampling={0}>
                        {sunRef && (
                            <GodRays 
                                sun={sunRef} 
                                samples={60} 
                                density={0.96} 
                                decay={0.9} 
                                weight={0.6} 
                                exposure={0.8} 
                                clampMax={1} 
                                blur={true}
                            />
                        )}
                        <Bloom luminanceThreshold={0.4} mipmapBlur intensity={2} />
                    </EffectComposer>

                    <OrbitControls 
                        enableZoom={false} 
                        enablePan={false} 
                        autoRotate 
                        autoRotateSpeed={0.3} 
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 2.1}
                        minAzimuthAngle={-Math.PI / 6}
                        maxAzimuthAngle={Math.PI / 6}
                    />
                </Canvas>
            </div>

            <PixelPerfectUI onExploreClick={onExploreClick} />

        </div>
    );
}
