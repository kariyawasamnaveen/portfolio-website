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

// Global State to sync ocean waves between the Water and the Floating Orb
const GlobalOceanState = {
    time: 0,
    speed: 1,
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

// REALISTIC FLOATING ORB (Rathu Dodol Bole)
function FloatingOrb({ isListening, isSpeaking, setSunRef }: { isListening: boolean; isSpeaking: boolean, setSunRef: (ref: THREE.Mesh) => void }) {
    const orbRef = useRef<THREE.Mesh>(null);
    
    const [distort, setDistort] = useState(0.4);
    const [speed, setSpeed] = useState(3);
    
    useEffect(() => {
        if (orbRef.current) {
            setSunRef(orbRef.current);
        }
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

        if (orbRef.current) {
            orbRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            orbRef.current.rotation.y = t * 0.2;
            orbRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
            
            // Mouse Follow Interaction
            const mouseX = state.pointer.x * 8; 
            const mouseZ = -5 + (state.pointer.y * -4); 
            
            // Bob up and down on the PHYSICAL waves
            // We sample the wave height at the orb's target (x,z) position
            const waveHeight = GlobalOceanState.getWaveHeight(mouseX, mouseZ);
            const bobbing = waveHeight + 1.2; // Offset by 1.2 so it sits mostly on top of the water
            
            // Smoothly move towards mouse position, but lock Y to wave height
            const targetPos = new THREE.Vector3(mouseX, bobbing, mouseZ);
            
            if (isSpeaking) {
                targetPos.set(0, 1.5, -3); // Rise up and come close when speaking
            }
            
            orbRef.current.position.lerp(targetPos, 0.08);
            
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
            <mesh ref={orbRef} castShadow>
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

// HEAVY RAIN PARTICLE SYSTEM (REALISTIC DROPS)
function Rain() {
    const rainRef = useRef<THREE.Points>(null);
    const dropCount = 12000;
    
    // Create a perfectly round, soft droplet texture programmatically
    const dropTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (context) {
            const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 32, 32);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    const [positions, velocities] = useMemo(() => {
        const positions = new Float32Array(dropCount * 3);
        const velocities = new Float32Array(dropCount);
        for (let i = 0; i < dropCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100; // x
            positions[i * 3 + 1] = Math.random() * 40; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
            velocities[i] = 0.5 + Math.random() * 0.5; // fall speed
        }
        return [positions, velocities];
    }, []);

    useFrame((state, delta) => {
        if (rainRef.current) {
            const pos = rainRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < dropCount; i++) {
                // Drastically reduced speed (from 70 down to 12)
                pos[i * 3 + 1] -= velocities[i] * delta * 12; 
                
                // Slight wind effect
                pos[i * 3] -= velocities[i] * delta * 1.5; 

                if (pos[i * 3 + 1] < -2) {
                    pos[i * 3 + 1] = 40; // reset to top
                    pos[i * 3] = (Math.random() - 0.5) * 100; // reset X to avoid gaps
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
                    count={dropCount} 
                    array={positions} 
                    itemSize={3} 
                />
            </bufferGeometry>
            <pointsMaterial 
                map={dropTexture}
                size={0.12} 
                color="#b3d4ff" 
                transparent 
                opacity={0.6} 
                depthWrite={false} 
                blending={THREE.AdditiveBlending} 
            />
        </points>
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
                    // Foam at peaks (height > 0.5)
                    float foam = smoothstep(0.5, 1.8, vHeight);
                    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 1.0, 1.0), foam * 0.9);
                    
                    // Subsurface Scattering (Cyan light bleeding through waves)
                    float sss = smoothstep(-0.5, 1.5, vHeight);
                    gl_FragColor.rgb += vec3(0.0, 0.4, 0.8) * sss * 0.6;
                    
                    #include <tonemapping_fragment>
                    `
                );
            };
        }
    }, []);

    useFrame((state, delta) => {
        // Accumulate time continuously based on speed to prevent jumps
        GlobalOceanState.speed = THREE.MathUtils.lerp(GlobalOceanState.speed, isSpeaking ? 2.5 : 1, 0.05);
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
                    
                    {/* Volumetric Surface Fog */}
                    <fog attach="fog" args={['#010611', 2, 40]} />
                    <color attach="background" args={['#010611']} />
                    
                    <ambientLight intensity={0.5} color="#002244" />
                    <spotLight position={[0, 20, 20]} intensity={100} decay={2} distance={100} color="#00aaff" penumbra={1} angle={Math.PI / 3} />
                    
                    {/* Deep Volumetric Sub-lighting (Red light from abyss) */}
                    <pointLight position={[0, -15, 0]} intensity={250} distance={40} decay={1.5} color="#ff0022" />
                    
                    <Suspense fallback={null}>
                        {/* Night HDRI for realistic dark water reflections */}
                        <Environment preset="night" background={false} environmentIntensity={0.5} />
                        <FloatingOrb isListening={isListening} isSpeaking={isSpeaking} setSunRef={setSunRef} />
                        <RealisticOcean isSpeaking={isSpeaking} />
                    </Suspense>

                    <Rain />

                    {/* POST PROCESSING (Bloom + Volumetric God Rays) */}
                    <EffectComposer disableNormalPass multisampling={0}>
                        {sunRef && (
                            <GodRays 
                                sun={sunRef} 
                                samples={100} 
                                density={0.96} 
                                decay={0.93} 
                                weight={0.6} 
                                exposure={0.8} 
                                clampMax={1} 
                                blur={true}
                            />
                        )}
                        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={2.0} />
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
