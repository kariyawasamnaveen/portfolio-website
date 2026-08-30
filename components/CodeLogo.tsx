import React, { useRef, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows, Center, useAnimations, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// 1. THE TRUE 3D HACKER MODEL COMPONENT
function HackerModel({ isHovered, isSpeaking }: { isHovered: boolean, isSpeaking?: boolean }) {
    const { scene } = useGLTF('/avaturn_avatar.glb');
    const groupRef = useRef<THREE.Group>(null);
    const headBoneRef = useRef<THREE.Bone | null>(null);
    const faceMeshesRef = useRef<{mesh: THREE.SkinnedMesh, smile: number, talk: number, blinkL: number, blinkR: number}[]>([]);

    // Mathematically perfect scale and Y-offset for the circular portrait
    const fixedScale = 6.2; // Scaled up slightly as requested
    const fixedPositionY = -10.2; // Adjusted for new scale

    React.useEffect(() => {
        // Reset face meshes on mount/scene change
        faceMeshesRef.current = [];
        
        scene.traverse((child: any) => {
            // Find Head/Neck Bone for LookAt tracking
            if (child.isBone) {
                const name = child.name.toLowerCase();
                if (name.includes('head') || name.includes('neck')) {
                    if (!headBoneRef.current || name.includes('head')) { 
                        headBoneRef.current = child;
                    }
                }
                // Force Arms down and backwards (tucked behind back) to hide them perfectly!
                if (name === 'leftarm') {
                    child.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), 0.5); // Backward
                    child.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -1.2); // Down
                } else if (name === 'rightarm') {
                    child.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), 0.5); // Backward
                    child.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), 1.2); // Down
                } else if (name === 'leftshoulder') {
                    child.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -0.2);
                } else if (name === 'rightshoulder') {
                    child.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), 0.2);
                }
                
                // Straighten forearms so they point straight down instead of bending up
                if (name === 'leftforearm' || name === 'rightforearm') {
                    child.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), 0.5); // Backward
                }
            }
            
            // Find ALL SkinnedMeshes with facial blendshapes (Head, Teeth, etc)
            if (child.isSkinnedMesh && child.morphTargetDictionary) {
                const dict = child.morphTargetDictionary;
                let smile = -1, talk = -1, blinkL = -1, blinkR = -1;
                for (const key in dict) {
                    const k = key.toLowerCase();
                    // Exact matches to prevent asymmetric distortion (like jawLeft or mouthSmileLeft)
                    if (k === 'mouthsmile' || k === 'smile') smile = dict[key];
                    if (k === 'jawopen' || k === 'mouthopen' || k === 'vrc.v_aa') talk = dict[key];
                    if (k === 'eyeblinkleft' || k === 'eyeblink_l' || k === 'blinkleft') blinkL = dict[key];
                    if (k === 'eyeblinkright' || k === 'eyeblink_r' || k === 'blinkright') blinkR = dict[key];
                }
                // If it has ANY facial expressions, add it to our array!
                if (smile !== -1 || talk !== -1 || blinkL !== -1 || blinkR !== -1) {
                    faceMeshesRef.current.push({ mesh: child, smile, talk, blinkL, blinkR });
                }
            }

            // Fix Materials: Glitch backup and Glass Transparency
            if (child.isMesh && child.material) {
                const matName = child.material.name ? child.material.name.toLowerCase() : '';
                
                // Fix Glasses Lenses being solid white
                if (matName.includes('glass') || matName.includes('lens')) {
                    child.material.transparent = true;
                    child.material.opacity = 0.3;
                    child.material.roughness = 0;
                    child.material.metalness = 0.8;
                }

                child.material._originalWireframe = child.material.wireframe === true;
                child.material._originalEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000);
                child.material._originalEmissiveIntensity = child.material.emissiveIntensity !== undefined ? child.material.emissiveIntensity : 1;
                child.material._isGlowMaterial = child.material.emissiveMap || child.material._originalEmissive.getHex() > 0;
            }
        });
    }, [scene]);

    useFrame((state) => {
        const mouseTargetX = (state.pointer.x * Math.PI) / 3;
        const mouseTargetY = (state.pointer.y * Math.PI) / 3;
        const idleRotation = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        
        const targetRotY = isHovered ? mouseTargetX : idleRotation;
        const targetRotX = isHovered ? -mouseTargetY : idleRotation * 0.5;

        // Bone Tracking: Make the Head Look At the Mouse
        if (headBoneRef.current) {
            headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetRotY, 0.1);
            headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, targetRotX, 0.1);
            
            if (groupRef.current) {
                groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
                groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.05);
            }
        } else if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
        }
        
        // Breathing Scale
        if (groupRef.current) {
            const targetScale = isHovered ? 1.05 : 1;
            groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05));
        }

        // Facial Expressions: AUTOMATIC DEMO MODE
        const time = state.clock.elapsedTime;
        
        // Force smile: 3 seconds smiling, 3 seconds serious
        const targetSmile = (time % 6) > 3 ? 1.0 : 0.0;
        
        // Force talking: Talk for 2 seconds, stop for 2 seconds
        const isFakeTalking = (time % 4) > 2;
        // Combine multiple sine waves for a much more natural, syllable-like lip sync!
        const naturalTalk = (Math.sin(time * 25) * 0.5 + Math.sin(time * 12) * 0.5) * 0.6 + 0.2;
        const targetTalk = isFakeTalking ? Math.max(0, naturalTalk) : 0.0;
        
        // Blinking Logic
        const blinkCycle = time % 4; // Blink every ~4 seconds
        const isBlinking = blinkCycle > 3.8;
        const blinkValue = isBlinking ? Math.sin((blinkCycle - 3.8) * Math.PI * 5) : 0; // Quick pulse 0->1->0

        faceMeshesRef.current.forEach(({ mesh, smile, talk, blinkL, blinkR }) => {
            if (smile !== -1) {
                const currentSmile = mesh.morphTargetInfluences![smile];
                mesh.morphTargetInfluences![smile] = THREE.MathUtils.lerp(currentSmile, targetSmile, 0.1);
            }
            if (talk !== -1) {
                const currentTalk = mesh.morphTargetInfluences![talk];
                mesh.morphTargetInfluences![talk] = THREE.MathUtils.lerp(currentTalk, targetTalk, 0.3);
            }
            if (blinkL !== -1) {
                mesh.morphTargetInfluences![blinkL] = Math.max(0, blinkValue);
            }
            if (blinkR !== -1) {
                mesh.morphTargetInfluences![blinkR] = Math.max(0, blinkValue);
            }
        });

        // 2036 CYBER-GOD GLITCH & GLOW PHYSICS
        scene.traverse((child: any) => {
            if (child.isMesh && child.material && !child.material.name?.toLowerCase().includes('glass')) {
                if (isHovered) {
                    if (child.material._isGlowMaterial) {
                        child.material.emissive = new THREE.Color(0x00ffff);
                        const pulse = Math.sin(time * 15) * 0.5 + 0.5;
                        child.material.emissiveIntensity = 5 + (pulse * 5);
                    } else {
                        const isGlitching = Math.random() > 0.98;
                        child.material.wireframe = isGlitching;
                    }
                } else {
                    child.material.wireframe = child.material._originalWireframe;
                    child.material.emissive = child.material._originalEmissive;
                    child.material.emissiveIntensity = child.material._originalEmissiveIntensity;
                }
            }
        });
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.05, 0.05]}>
                <primitive object={scene} scale={fixedScale} position={[0, fixedPositionY, 0]} />
            </Float>
        </group>
    );
}

useGLTF.preload('/avaturn_avatar.glb');

// 2. THE MAIN COMPONENT
export default function CodeLogo({ isSpeaking }: { isSpeaking?: boolean }) {
    const [isHovered, setIsHovered] = useState(false);
    const [boneNames, setBoneNames] = useState<string[]>([]);

    const textVariants = {
        hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { delay: i * 0.06, duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
        }),
        hover: (i: number) => ({
            y: [0, -6, 0],
            color: "#00ffff", 
            transition: { delay: i * 0.02, duration: 0.4, ease: "easeInOut" }
        })
    };

    const nameText = "KARIYAWASAM".split("");

    return (
        <div 
            className="relative flex flex-col items-center justify-center w-[320px] h-[480px] md:w-[450px] md:h-[600px] cursor-pointer -mt-4 md:-mt-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 3. TRUE 3D CANVAS LAYER - PREMIUM ROUND FRAME */}
            <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-[2px] transition-all duration-500 z-30 pointer-events-auto ${isHovered ? 'border-cyan-400 shadow-[0_0_50px_rgba(0,255,255,0.4)]' : 'border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.1)]'} bg-black/40 backdrop-blur-xl`}>
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : [1, 2]}>
                    <Suspense fallback={null}>
                        {/* Cinematic PBR Lighting */}
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[-5, 5, 5]} intensity={2.0} color="#00ffff" />
                        <directionalLight position={[5, 5, 2]} intensity={1.5} color="#ffffff" />
                        <pointLight position={[0, 2, 2]} intensity={2} color="#ffffff" distance={5} />
                        
                        {/* The Model */}
                        <HackerModel isHovered={isHovered} isSpeaking={isSpeaking} />
                        
                        {/* 2036 CYBER-GOD POST PROCESSING - DISABLED ON MOBILE FOR MAX PERFORMANCE */}
                        {typeof window !== 'undefined' && window.innerWidth >= 768 && (
                            <EffectComposer>
                                <Bloom 
                                    luminanceThreshold={0.5} 
                                    mipmapBlur 
                                    intensity={1.5} 
                                />
                            </EffectComposer>
                        )}
                    </Suspense>
                </Canvas>
            </div>

            {/* 4. PREMIUM TYPOGRAPHY */}
            <div className={`mt-8 text-center flex flex-col items-center transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                
                {/* Glitch / Staggered Name Reveal */}
                <div className="flex space-x-1 mb-4 font-extrabold text-xl md:text-3xl tracking-[0.15em] md:tracking-[0.25em]">
                    {nameText.map((char, index) => (
                        <motion.span
                            key={index}
                            custom={index}
                            initial="hidden"
                            animate={isHovered ? "hover" : "visible"}
                            variants={textVariants as any}
                            className={`inline-block ${isHovered ? '' : 'bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500'}`}
                            style={{ 
                                textShadow: isHovered ? '0 0 15px rgba(0,255,255,0.8)' : 'none'
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </div>

                {/* Glassmorphism Title Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    transition={{ delay: 0.8, type: 'spring' }}
                    className={`relative px-5 py-1.5 rounded-full border ${isHovered ? 'border-cyan-400/60 bg-cyan-900/40' : 'border-white/10 bg-black/30'} backdrop-blur-md font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase overflow-hidden transition-all duration-500 mt-2`}
                >
                    <span className={`relative z-10 font-semibold ${isHovered ? "text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" : "text-white/60"}`}>
                        Creative Coder
                    </span>
                    {/* Framer Motion Shimmer on Hover */}
                    {isHovered && (
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
}
