import { useState, useEffect } from 'react';

export type QualityTier = 'LOW' | 'MED' | 'HIGH';

export interface TierSettings {
    dpr: number;
    waveCount: number;
    particleCount: number;
    bloom: boolean;
    dof: boolean;
    chromaticAberration: boolean;
    shadows: boolean;
}

const TIER_CONFIG: Record<QualityTier, TierSettings> = {
    LOW: {
        dpr: 1, // Cap pixel ratio to 1 for weak GPUs
        waveCount: 1, // Only basic sine wave
        particleCount: 0, // No particles
        bloom: false, // Expensive pass disabled
        dof: false, // Expensive pass disabled
        chromaticAberration: false,
        shadows: false
    },
    MED: {
        dpr: 1.5,
        waveCount: 2, // Gerstner waves enabled but limited
        particleCount: 50,
        bloom: false, // Too heavy for mid-tier
        dof: false, // Still too heavy for mid-tier mobile
        chromaticAberration: true, // Cheap enough for warp speed
        shadows: false // Fake shadows instead
    },
    HIGH: {
        dpr: 2, // Full retina resolution
        waveCount: 4, // Complex overlapping Gerstner waves
        particleCount: 150,
        bloom: true,
        dof: true, // Cinematic depth of field enabled
        chromaticAberration: true,
        shadows: true
    }
};

export function useQualityTier() {
    const [tier, setTier] = useState<QualityTier>('MED'); // Default to MED before detection
    
    useEffect(() => {
        // Run once on mount
        let detectedTier: QualityTier = 'HIGH';
        
        // 1. Mobile check (simple userAgent)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 2. Hardware Concurrency (Logical CPU cores)
        const cores = navigator.hardwareConcurrency || 4;
        
        // 3. Device Memory (Chrome specific)
        const memory = (navigator as any).deviceMemory || 4;

        if (isMobile) {
            detectedTier = 'LOW'; // Force LOW on mobile for performance
        } else {
            if (cores < 4 || memory < 4) {
                detectedTier = 'MED';
            }
        }

        // Try to get GPU Info to catch weak desktop GPUs
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
                    // Weak mobile GPUs
                    if (renderer.includes('mali') || renderer.includes('adreno 3') || renderer.includes('powervr')) {
                        detectedTier = 'LOW';
                    }
                    // Intel integrated graphics
                    if (renderer.includes('intel')) {
                        detectedTier = detectedTier === 'HIGH' ? 'MED' : detectedTier;
                    }
                }
            }
        } catch (e) {
            console.warn("Could not read GPU info");
        }

        setTier(detectedTier);
    }, []);

    const downgrade = () => {
        setTier(current => {
            if (current === 'HIGH') return 'MED';
            if (current === 'MED') return 'LOW';
            return 'LOW';
        });
    };

    return { tier, settings: TIER_CONFIG[tier], downgrade };
}
