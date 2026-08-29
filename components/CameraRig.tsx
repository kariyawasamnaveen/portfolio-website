import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

interface CameraRigProps {
    startDrift?: boolean;
    hasCompletedIntro?: boolean;
    onDriftComplete?: () => void;
}

// EaseInOutExpo function
function easeInOutExpo(x: number): number {
    if (x === 0) return 0;
    if (x === 1) return 1;
    if (x < 0.5) return Math.pow(2, 20 * x - 10) / 2;
    return (2 - Math.pow(2, -20 * x + 10)) / 2;
}

// Simple deterministic noise for camera jitter
function randomNoise(time: number) {
    return Math.sin(time * 12.9898) * Math.sin(time * 78.233);
}

export default function CameraRig({ startDrift, hasCompletedIntro, onDriftComplete }: CameraRigProps) {
    const { camera, scene } = useThree();
    const controlsRef = useRef<any>(null);
    const driftDoneRef = useRef(false);
    
    // Animation constants
    const startZ = 300;
    const endZ = 80; // Stop further back from dome center
    const driftDuration = 8;
    const [driftStartTime, setDriftStartTime] = useState<number | null>(null);

    // Initial setup
    useEffect(() => {
        if (!hasCompletedIntro && !startDrift) {
            camera.position.set(0, 5, startZ);
            camera.lookAt(0, 10, 20);
            scene.fog = new THREE.FogExp2("#050508", 0.005);
            scene.background = new THREE.Color("#020203");
        }
    }, [hasCompletedIntro, startDrift, camera, scene]);

    useFrame((state) => {
        if (hasCompletedIntro) {
            if (controlsRef.current && !driftDoneRef.current) {
                driftDoneRef.current = true;
                controlsRef.current.target.set(0, 10, 20);
                controlsRef.current.update();
            }
            return;
        }

        if (startDrift && !driftDoneRef.current) {
            if (driftStartTime === null) {
                setDriftStartTime(state.clock.getElapsedTime());
                return;
            }

            const elapsed = state.clock.getElapsedTime() - driftStartTime;
            let progress = Math.min(elapsed / driftDuration, 1.0);
            
            // Apply ease curve
            const easeProgress = easeInOutExpo(progress);

            // Phase 1: Drift
            if (progress < 1.0) {
                // Base position
                const currentZ = THREE.MathUtils.lerp(startZ, endZ, easeProgress);
                
                // Micro-jitter noise based on speed (derivative of easeProgress is high in middle)
                const speed = progress > 0.2 && progress < 0.8 ? 1.0 : 0.2;
                const jitterX = randomNoise(state.clock.elapsedTime * 10) * speed * 2;
                const jitterY = randomNoise(state.clock.elapsedTime * 15 + 100) * speed * 2;

                camera.position.set(jitterX, 5 + jitterY, currentZ);
                
                // Dynamic FOV stretch during warp
                const baseFov = 60;
                const maxFov = 100;
                const fovStretch = Math.sin(progress * Math.PI); // Peak at 0.5
                (camera as THREE.PerspectiveCamera).fov = baseFov + (maxFov - baseFov) * fovStretch;
                (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

                // Dynamic Fog thinning
                if (scene.fog instanceof THREE.FogExp2) {
                    scene.fog.density = THREE.MathUtils.lerp(0.005, 0.001, easeProgress);
                }

                camera.lookAt(0, 10, 20);
                
            } else {
                // Phase 2: Arrived
                driftDoneRef.current = true;
                
                // Smoothly restore FOV
                (camera as THREE.PerspectiveCamera).fov = 60;
                (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
                
                if (controlsRef.current) {
                    controlsRef.current.target.set(0, 10, 20);
                    controlsRef.current.update();
                }

                if (onDriftComplete) onDriftComplete();
            }
        }
    });

    return (
        <OrbitControls 
            ref={controlsRef}
            enableDamping 
            dampingFactor={0.05} 
            maxPolarAngle={Math.PI / 2 + 0.1} // Allow looking slightly below horizon
            minPolarAngle={Math.PI / 3}
            enableZoom={false}
            enablePan={false}
        />
    );
}
