'use client';

import * as THREE from 'three';
import { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Stars, Float, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';
import { getSkillsForPerformance } from '@/lib/data/skillsData';
import { SimplifiedFallback } from './SimplifiedFallback';
import type { SkillNode } from '@/lib/types';

// Helper to log
const logToTerminal = (message: string) => {
    fetch('/api/debug-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ component: 'NeuralNetworkBackground', message })
    }).catch(() => { });
};

// --- Sub-components ---

function CameraFly() {
    // Cinematic "Fly-through" + Hand Gesture Control
    // Access store directly in loop to avoid React re-renders on every frame (Transient Update)
    const { viewport } = useThree();

    useFrame((state) => {
        const t = state.clock.elapsedTime * 0.1;

        // Base Movement (Auto)
        let targetX = Math.sin(t) * 8;
        let targetY = Math.cos(t * 0.8) * 2;
        let targetZ = 15 + Math.cos(t) * 2;

        // Visual Debug: Check if gesture is active
        const { isGestureModeEnabled, gestureCursorPosition } = usePortfolioStore.getState();

        if (isGestureModeEnabled) {
            const { x, y } = gestureCursorPosition;
            // x, y are screen coordinates.
            // If x,y are 0,0 it might be initialization, so we check if they are non-zero logic if needed
            // But simpler: just offset based on center deviation

            if (x !== 0 || y !== 0) {
                // Remap scren coords (0..width) to 3D offset (-10..10)
                const handX = (x / window.innerWidth - 0.5) * 20;
                const handY = -(y / window.innerHeight - 0.5) * 10;

                targetX += handX;
                targetY += handY;
            }
        }

        // Smooth Interpolation
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

function NetworkConnections({ nodes }: { nodes: SkillNode[] }) {
    const lines = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        nodes.forEach(n =>
            n.connections.forEach(cId => {
                const target = nodes.find(x => x.id === cId);
                if (target) {
                    pts.push(new THREE.Vector3(...n.position).multiplyScalar(1.5)); // SPREAD: Multiply position by 1.5
                    pts.push(new THREE.Vector3(...target.position).multiplyScalar(1.5));
                }
            })
        );
        return pts;
    }, [nodes]);

    if (lines.length === 0) return null;

    return (
        <lineSegments>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array(lines.flatMap(v => [v.x, v.y, v.z])), 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial color="#00ffff" transparent opacity={0.15} linewidth={1} />
        </lineSegments>
    );
}

function NodeGeometry({ category }: { category: string }) {
    switch (category) {
        case 'language': return <sphereGeometry args={[0.2, 32, 32]} />;
        case 'framework': return <icosahedronGeometry args={[0.25, 0]} />;
        case 'ai': return <octahedronGeometry args={[0.22, 0]} />;
        case 'tool': return <boxGeometry args={[0.2, 0.2, 0.2]} />;
        case 'project': return <dodecahedronGeometry args={[0.25, 0]} />;
        default: return <sphereGeometry args={[0.2, 16, 16]} />;
    }
}

function NetworkNode({ skill }: { skill: SkillNode }) {
    const mesh = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    // Spread the position!
    const spreadPosition = useMemo(() =>
        new THREE.Vector3(...skill.position).multiplyScalar(1.5), // SPREAD FACTOR 1.5x
        [skill.position]);

    // Random phase
    const randomPhase = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.x += 0.002;
            mesh.current.rotation.y += 0.005;

            const t = state.clock.elapsedTime + randomPhase;
            const baseScale = hovered ? 1.5 : 1;
            const pulse = Math.sin(t * 2) * 0.1;
            mesh.current.scale.setScalar(baseScale + pulse);
        }
    });

    return (
        <Float speed={hovered ? 2 : 1} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={spreadPosition}>
                <mesh
                    ref={mesh}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
                >
                    <NodeGeometry category={skill.category} />
                    <meshPhysicalMaterial
                        color={hovered ? '#ffffff' : skill.color}
                        emissive={skill.color}
                        emissiveIntensity={hovered ? 3 : 1.5}
                        roughness={0.2}
                        metalness={0.8}
                        clearcoat={1}
                    />
                    <Html distanceFactor={12} position={[0, 0.4, 0]} style={{ pointerEvents: 'none' }}>
                        <div
                            className={`transition-all duration-300 ${hovered ? 'scale-125 opacity-100 z-50' : 'scale-100 opacity-80'} text-[10px] font-mono tracking-widest px-2 py-1 rounded border backdrop-blur-md whitespace-nowrap shadow-[0_0_10px_rgba(0,255,255,0.2)]`}
                            style={{
                                color: hovered ? '#fff' : '#cdfcff',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                borderColor: skill.color
                            }}
                        >
                            {skill.displayName}
                        </div>
                    </Html>
                </mesh>
            </group>
        </Float>
    );
}

function Scene() {
    const level = usePortfolioStore(s => s.performanceLevel);
    const nodes = useMemo(() => getSkillsForPerformance(level), [level]);

    useEffect(() => {
        logToTerminal(`Scene Mounted with EXPANDED NETWORK. Level: ${level}`);
    }, [level]);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />

            {/* Camera Movement: Wide Pan/Fly */}
            <CameraFly />

            {/* Atmosphere */}
            <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

            {/* Lights */}
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />

            <group>
                {nodes.map(skill => <NetworkNode key={skill.id} skill={skill} />)}
                <NetworkConnections nodes={nodes} />
            </group>

            {/* Bloom for Tech Feel */}
            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.2}
                    mipmapBlur
                    intensity={0.8}
                    radius={0.4}
                />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </>
    );
}

export function NeuralNetworkBackground() {
    const level = usePortfolioStore(s => s.performanceLevel);

    if (level === 'potato') return <SimplifiedFallback />;

    return (
        <div className="fixed inset-0 -z-10 bg-black">
            <Canvas
                dpr={[1, 1.5]}
                gl={{ alpha: false, antialias: false, powerPreference: "high-performance" }}
            >
                <color attach="background" args={['#030308']} />
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}
