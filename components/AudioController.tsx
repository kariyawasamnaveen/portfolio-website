import React, { useEffect, useRef } from 'react';

interface AudioControllerProps {
    startDrift: boolean;
    hasCompletedIntro: boolean;
}

export default function AudioController({ startDrift, hasCompletedIntro }: AudioControllerProps) {
    const whooshRef = useRef<HTMLAudioElement | null>(null);
    const ambientRef = useRef<HTMLAudioElement | null>(null);
    const humRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio objects
        // Assuming files are placed in /public/audio/
        whooshRef.current = new Audio('/audio/whoosh.mp3');
        ambientRef.current = new Audio('/audio/ocean_ambient.mp3');
        humRef.current = new Audio('/audio/sub_bass_hum.mp3');

        if (ambientRef.current) ambientRef.current.loop = true;
        if (humRef.current) humRef.current.loop = true;

        return () => {
            if (whooshRef.current) whooshRef.current.pause();
            if (ambientRef.current) ambientRef.current.pause();
            if (humRef.current) humRef.current.pause();
        };
    }, []);

    useEffect(() => {
        if (startDrift) {
            // 1. Play Whoosh at max volume for the drop
            if (whooshRef.current) {
                whooshRef.current.volume = 1.0; 
                whooshRef.current.play().catch(e => console.warn("Audio autoplay blocked:", e));
            }
            
            // 2. Start Ocean Ambient and Bass Hum very quietly
            if (ambientRef.current) {
                ambientRef.current.volume = 0.05; 
                ambientRef.current.play().catch(e => console.warn("Audio autoplay blocked:", e));
            }
            if (humRef.current) {
                humRef.current.volume = 0.1; 
                humRef.current.play().catch(e => console.warn("Audio autoplay blocked:", e));
            }

            // 3. IMMEDIATELY start a slow, continuous fade-in over 4 seconds so there is NEVER a silent gap
            let step = 0;
            const targetAmbient = 0.4;
            const targetHum = 0.6;
            const steps = 80; // 80 steps * 50ms = 4000ms (4 seconds)
            
            const fadeInterval = setInterval(() => {
                step++;
                if (ambientRef.current) {
                    const currentVol = ambientRef.current.volume;
                    if (currentVol < targetAmbient) {
                        ambientRef.current.volume = Math.min(targetAmbient, currentVol + (targetAmbient / steps));
                    }
                }
                if (humRef.current) {
                    const currentVol = humRef.current.volume;
                    if (currentVol < targetHum) {
                        humRef.current.volume = Math.min(targetHum, currentVol + (targetHum / steps));
                    }
                }
                
                if (step >= steps) {
                    clearInterval(fadeInterval);
                }
            }, 50);
            
            return () => clearInterval(fadeInterval);
        }
    }, [startDrift]);

    return null; // Purely logical component
}
