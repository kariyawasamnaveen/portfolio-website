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
import { OrbitControls, Float, Html, Grid, Line, MeshDistortMaterial, Environment, useTexture, MeshTransmissionMaterial } from '@react-three/drei';
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

// REALISTIC FLOATING ORB (Rathu Dodol Bole)
function FloatingOrb({ isListening, isSpeaking, setSunRef }: { isListening: boolean; isSpeaking: boolean, setSunRef: (ref: THREE.Mesh) => void }) {
    const orbRef = useRef<THREE.Mesh>(null);
    const sunMeshRef = useRef<THREE.Mesh>(null);
    
    const [distort, setDistort] = useState(0.4);
    const [speed, setSpeed] = useState(3);
    
    useEffect(() => {
        if (sunMeshRef.current) setSunRef(sunMeshRef.current);
    }, [setSunRef]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        
        let targetDistort = 0.4;
        let targetSpeed = 3;
        let targetScale = 1;

        if (isSpeaking) {
            targetDistort = 0.8;
            targetSpeed = 6;
            targetScale = 1.2;
        } else if (isListening) {
            targetDistort = 0.6;
            targetSpeed = 4;
            targetScale = 1.05;
        }
        
        setDistort(THREE.MathUtils.lerp(distort, targetDistort, 0.1));
        setSpeed(THREE.MathUtils.lerp(speed, targetSpeed, 0.1));

        if (orbRef.current && sunMeshRef.current) {
            orbRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            sunMeshRef.current.scale.setScalar(targetScale);
            orbRef.current.rotation.y = t * 0.2;
            orbRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
            
            // Float on water (RealisticOcean is at y = 0)
            // Bob up and down on the waves
            const bobbing = Math.sin(t * 2) * 0.2 + 0.8; // Offset by 0.8 so it sits mostly on top of the water
            
            // Mouse Follow Interaction
            const mouseX = state.pointer.x * 8; 
            const mouseZ = -5 + (state.pointer.y * -4); 
            
            // Smoothly move towards mouse position, but keep floating on water
            const targetPos = new THREE.Vector3(mouseX, bobbing, mouseZ);
            
            if (isSpeaking) {
                targetPos.set(0, 1.5, -3); // Rise up and come close when speaking
            }
            
            orbRef.current.position.lerp(targetPos, 0.05);
            
            // Dynamic color for the orb
            const mat = orbRef.current.material as any;
            const targetColor = isSpeaking ? new THREE.Color("#ff0044") : new THREE.Color("#aa0011"); 
            const targetEmissive = isSpeaking ? new THREE.Color("#ff0022") : new THREE.Color("#440000");
            mat.color.lerp(targetColor, 0.05);
            mat.emissive.lerp(targetEmissive, 0.05);
            mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, isSpeaking ? 1.5 : 0.5, 0.1);
        }
    });

    return (
        <group>
            <mesh ref={sunMeshRef} visible={false}>
                <sphereGeometry args={[1.5, 8, 8]} />
            </mesh>
            
            <mesh ref={orbRef}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <MeshDistortMaterial
                    color="#aa0011"
                    emissive="#440000"
                    emissiveIntensity={isSpeaking ? 1.5 : 0.5}
                    roughness={0.1}
                    metalness={0.8}
                    clearcoat={1}
                    distort={distort}
                    speed={speed}
                />
            </mesh>
        </group>
    );
}

// REALISTIC MIDNIGHT OCEAN
function RealisticOcean({ isSpeaking }: { isSpeaking: boolean }) {
    const ref = useRef<any>(null);
    const gl = useThree((state) => state.gl);
    const waterNormals = useTexture('/waternormals.jpg');
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    const geom = useMemo(() => new THREE.PlaneGeometry(100, 100, 150, 150), []);
    
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: new THREE.Vector3(0, 1, 1).normalize(),
            sunColor: 0x00ffff,
            waterColor: 0x000a1f,
            distortionScale: 3.7,
            fog: true,
            format: gl.outputColorSpace,
        }),
        [waterNormals, gl]
    );

    const speedRef = useRef(1);

    useEffect(() => {
        if (ref.current) {
            ref.current.material.side = THREE.DoubleSide;
            ref.current.material.transparent = true;
            ref.current.material.opacity = 0.9;
        }
    }, []);

    useFrame((state, delta) => {
        speedRef.current = THREE.MathUtils.lerp(speedRef.current, isSpeaking ? 2.5 : 1, 0.05);
        if (ref.current) {
            ref.current.material.uniforms.time.value += delta * speedRef.current * 0.5;
        }

        const positions = geom.attributes.position;
        const t = state.clock.getElapsedTime() * speedRef.current;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const wave1 = Math.sin(x * 0.3 + t * 0.8) * 0.8;
            const wave2 = Math.sin(y * 0.2 + t * 0.5) * 0.5;
            const wave3 = Math.sin((x + y) * 0.15 + t * 1.0) * 0.4;
            positions.setZ(i, wave1 + wave2 + wave3 - 3.5); 
        }
        positions.needsUpdate = true;
        geom.computeVertexNormals();
    });

    return <water ref={ref} args={[geom, config]} rotation={[-Math.PI / 2, 0, 0]} />;
}

// PURE CLEAN UI
function PixelPerfectUI({ onExploreClick, activeZone }: { onExploreClick: () => void, activeZone?: string }) {
    if (activeZone !== 'identity') return null;

    return (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center max-w-[1400px] mx-auto px-10">
            {/* Removed text block based on request */}

            {/* Social Icons only */}
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-6">
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
    activeZone?: string;
    onExploreClick: () => void;
}

export default function ThreeDTechLab({ isListening, isSpeaking, activeZone, onExploreClick }: ThreeDTechLabProps) {
    const [mounted, setMounted] = useState(false);
    const [sunRef, setSunRef] = useState<THREE.Mesh | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 w-full h-full bg-[#010611] overflow-hidden">
            
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 1.5, 12], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
                    
                    <fog attach="fog" args={['#010611', 10, 60]} />
                    <color attach="background" args={['#010611']} />
                    
                    <ambientLight intensity={0.5} color="#002244" />
                    <spotLight position={[0, 20, 20]} intensity={100} decay={2} distance={100} color="#00aaff" penumbra={1} angle={Math.PI / 3} />
                    <Suspense fallback={null}>
                        <Environment preset="city" environmentIntensity={0.1} />
                        <FloatingOrb isListening={isListening} isSpeaking={isSpeaking} setSunRef={setSunRef} />
                        <RealisticOcean isSpeaking={isSpeaking} />
                    </Suspense>

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
                                density={0.8} 
                                decay={0.9} 
                                weight={0.3} 
                                exposure={0.2} 
                                clampMax={1} 
                                blur={true}
                            />
                        )}
                        <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.5} />
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

            <PixelPerfectUI onExploreClick={onExploreClick} activeZone={activeZone} />

        </div>
    );
}
