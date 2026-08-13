import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import logoVert from '../shaders/logo.vert';
import logoFrag from '../shaders/logo.frag';

interface ThreeLoadingCoreProps {
    startDrift: boolean;
}

export default function ThreeLoadingCore({ startDrift }: ThreeLoadingCoreProps) {
    const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load('/logo-kariyawasam.jpg', (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            setLogoTexture(tex);
        });
    }, []);
    
    // Shader material references
    const logoMatRef = useRef<THREE.MeshBasicMaterial>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const ring3Ref = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);



    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        
        // Update shader/material uniforms
        if (logoMatRef.current) {
            // If drift started, fade out the standard material
            if (startDrift) {
                logoMatRef.current.opacity = THREE.MathUtils.lerp(
                    logoMatRef.current.opacity, 
                    0, 
                    delta * 3 
                );
            }
        }

        // Animate 3D Holographic Gyroscope Rings
        if (ring1Ref.current) {
            ring1Ref.current.rotation.x = Math.sin(time * 0.5) * 0.5 + Math.PI / 4;
            ring1Ref.current.rotation.y = Math.cos(time * 0.3) * 0.5;
            ring1Ref.current.rotation.z += delta * 0.5;
        }
        
        if (ring2Ref.current) {
            ring2Ref.current.rotation.x = -Math.sin(time * 0.4) * 0.5 - Math.PI / 4;
            ring2Ref.current.rotation.y = -Math.cos(time * 0.6) * 0.5;
            ring2Ref.current.rotation.z -= delta * 0.8;
            
            // Shatter/fade the rings too
            if (startDrift) {
                const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
                mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, delta * 2);
            }
        }

        if (ring3Ref.current) {
            ring3Ref.current.rotation.x = Math.PI / 2;
            ring3Ref.current.rotation.z += delta * 0.2;
            if (startDrift) {
                const mat = ring3Ref.current.material as THREE.MeshBasicMaterial;
                mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, delta * 2);
            }
        }

        // Gentle floating for the whole group
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(time) * 1.5;
        }
    });

    return (
        <group ref={groupRef} position={[0, 5, 270]} scale={[0.3, 0.3, 0.3]}>
            
            {/* The 3D Logo (Fallback to standard material for max compatibility) */}
            {logoTexture && (
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[60, 60]} />
                    <meshBasicMaterial 
                        ref={logoMatRef}
                        map={logoTexture} 
                        transparent={true} 
                        side={THREE.DoubleSide} 
                        opacity={1.0}
                    />
                </mesh>
            )}

            {/* Neon 3D Gyroscope Rings */}
            
            {/* Outer subtle ring */}
            <mesh ref={ring1Ref}>
                <torusGeometry args={[44, 0.1, 16, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </mesh>

            {/* Inner Crimson Glowing Ring */}
            <mesh ref={ring2Ref}>
                <torusGeometry args={[36, 0.4, 16, 100]} />
                <meshBasicMaterial color="#ff2a2a" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Dotted/Dashed Tracking Ring using wireframe trick */}
            <mesh ref={ring3Ref}>
                <torusGeometry args={[30, 0.2, 8, 30]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.3} wireframe />
            </mesh>
            
        </group>
    );
}
