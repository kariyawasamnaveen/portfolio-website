import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { Water } from 'three-stdlib';

extend({ Water });

declare module '@react-three/fiber' {
  interface ThreeElements {
    water: any;
  }
}

// Global State to sync ocean waves between the Water and the Floating Orb
export const GlobalOceanState = {
    time: 0,
    speed: 1,
    sunPosition: new THREE.Vector3(0, 1, 1),
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

// REALISTIC MIDNIGHT OCEAN
export default function RealisticOcean({ isSpeaking }: { isSpeaking: boolean }) {
    const ref = useRef<any>(null);
    const gl = useThree((state) => state.gl);
    const waterNormals = useTexture('/waternormals.jpg');
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    const segs = typeof window !== 'undefined' && window.innerWidth < 768 ? 64 : 250;
    const geom = useMemo(() => new THREE.PlaneGeometry(2000, 2000, segs, segs), [segs]);
    
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: new THREE.Vector3(0, 1, 0.5).normalize(), // Directs the specular highlight towards the camera
            sunColor: 0xff0022, // Quantum AI Core Red reflection
            waterColor: 0x000511, // Extremely deep, dark cinematic ocean blue
            distortionScale: 4.5, // Increased distortion for more liquid feel
            fog: true,
            format: gl.outputColorSpace,
            alpha: 0.9, // Slightly more opaque for better reflections
        }),
        [waterNormals, gl]
    );

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
                    // --- ADVANCED SUBSURFACE SCATTERING ---
                    // Deep oceanic teal/cyan glow bleeding through the waves
                    float sssAmount = smoothstep(0.0, 2.0, vHeight);
                    vec3 sssColor = vec3(0.0, 0.5, 0.3); // Vibrant deep sea teal
                    gl_FragColor.rgb += sssColor * sssAmount * 0.9;
                    
                    // --- DYNAMIC SEA FOAM ---
                    // Brilliant white foam at the sharp peaks of the waves
                    float foamAmount = smoothstep(0.8, 2.0, vHeight);
                    vec3 foamColor = vec3(0.9, 0.95, 1.0); 
                    
                    // Blend foam on top
                    gl_FragColor.rgb = mix(gl_FragColor.rgb, foamColor, foamAmount * 0.85);
                    
                    // Maintain slight transparency for depth
                    gl_FragColor.a = 0.9;
                    
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
