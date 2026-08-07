import re

with open('components/ThreeDTechLab.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import React, { useRef, useMemo, useState, useEffect } from 'react';",
    "import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';"
)

content = content.replace(
    "import { OrbitControls, Float, Grid, Line } from '@react-three/drei';",
    "import { OrbitControls, Float, Grid, Line, MeshDistortMaterial, Environment } from '@react-three/drei';"
)

# Remove old components and add new ones
# Match from `function RealGodTierCore` to the end of `function CinematicHorizon`
old_components_regex = re.compile(
    r"// The Ultimate Hero Core with God Rays, Cracks, and Halos!.*?function CinematicHorizon\(\) \{.*?\}\n",
    re.DOTALL
)

new_components = """// LIQUID VOICE CORE
function LiquidVoiceCore({ isListening, isSpeaking, setSunRef }: { isListening: boolean; isSpeaking: boolean, setSunRef: (ref: THREE.Mesh) => void }) {
    const sunMeshRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const [distort, setDistort] = useState(0.2);
    const [speed, setSpeed] = useState(2);
    const [intensity, setIntensity] = useState(2);
    const [emissiveColor, setEmissiveColor] = useState("#ff4400");
    
    useEffect(() => {
        if (sunMeshRef.current) {
            setSunRef(sunMeshRef.current);
        }
    }, [setSunRef]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        
        let targetDistort = 0.2;
        let targetSpeed = 2;
        let targetIntensity = 2;
        let targetEmissive = "#ff4400";
        let targetScale = 1;

        if (isSpeaking) {
            targetDistort = 0.6;
            targetSpeed = 8;
            targetIntensity = 8;
            targetEmissive = "#ffaa00";
            targetScale = 1.3;
        } else if (isListening) {
            targetDistort = 0.4;
            targetSpeed = 4;
            targetIntensity = 4;
            targetEmissive = "#ff8800";
            targetScale = 1.1;
        }
        
        setDistort(THREE.MathUtils.lerp(distort, targetDistort, 0.1));
        setSpeed(THREE.MathUtils.lerp(speed, targetSpeed, 0.1));
        setIntensity(THREE.MathUtils.lerp(intensity, targetIntensity, 0.1));
        setEmissiveColor(targetEmissive);

        if (coreRef.current && sunMeshRef.current) {
            coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            sunMeshRef.current.scale.setScalar(targetScale * 0.5);
            coreRef.current.rotation.y = t * 0.5;
        }
    });

    return (
        <group>
            <Float speed={3} rotationIntensity={1} floatIntensity={2}>
                <mesh ref={sunMeshRef} visible={true}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial color={emissiveColor} toneMapped={false} transparent opacity={0.2} />
                </mesh>

                <mesh ref={coreRef}>
                    <sphereGeometry args={[2, 64, 64]} />
                    <MeshDistortMaterial
                        color="#ff2200"
                        emissive={emissiveColor}
                        emissiveIntensity={intensity}
                        roughness={0.2}
                        metalness={0.8}
                        distort={distort}
                        speed={speed}
                    />
                </mesh>
                <pointLight distance={30} intensity={intensity * 10} color={emissiveColor} />
            </Float>
        </group>
    );
}

// REALISTIC MIDNIGHT OCEAN
function RealisticOcean({ isSpeaking }: { isSpeaking: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const speedRef = useRef(1);
    
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speedRef.current;
        speedRef.current = THREE.MathUtils.lerp(speedRef.current, isSpeaking ? 2.5 : 1, 0.05);

        if (meshRef.current) {
            const positions = meshRef.current.geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const wave1 = Math.sin(x * 0.5 + t) * 0.5;
                const wave2 = Math.sin(y * 0.3 + t * 0.8) * 0.5;
                const wave3 = Math.sin((x + y) * 0.2 + t * 1.2) * 0.3;
                positions.setZ(i, wave1 + wave2 + wave3 - 3.5); 
            }
            positions.needsUpdate = true;
            meshRef.current.geometry.computeVertexNormals();
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100, 150, 150]} />
            <meshStandardMaterial 
                color="#00081a" 
                roughness={0.1} 
                metalness={0.9} 
            />
        </mesh>
    );
}
"""

content = old_components_regex.sub(new_components, content)


# Now update the Canvas rendering
old_canvas = """                    <ambientLight intensity={0.2} />

                    <RealGodTierCore isListening={isListening} isSpeaking={isSpeaking} setSunRef={setSunRef} />
                    
                    <CinematicHorizon />
                    
                    <points>"""

new_canvas = """                    <ambientLight intensity={0.2} />
                    <directionalLight position={[10, 10, 5]} intensity={0.5} color="#0066ff" />
                    <Suspense fallback={null}>
                        <Environment preset="night" />
                        <LiquidVoiceCore isListening={isListening} isSpeaking={isSpeaking} setSunRef={setSunRef} />
                        <RealisticOcean isSpeaking={isSpeaking} />
                    </Suspense>

                    <points>"""

content = content.replace(old_canvas, new_canvas)

with open('components/ThreeDTechLab.tsx', 'w') as f:
    f.write(content)
print("Patched ThreeDTechLab.tsx with Midnight Ocean and Liquid Core!")
