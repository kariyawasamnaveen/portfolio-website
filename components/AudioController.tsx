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
        if (startDrift && !hasCompletedIntro) {
            // Trigger whoosh on click
            if (whooshRef.current) {
                whooshRef.current.volume = 0.8;
                whooshRef.current.play().catch(e => console.warn("Audio autoplay blocked:", e));
            }
        }
    }, [startDrift, hasCompletedIntro]);

    useEffect(() => {
        if (hasCompletedIntro) {
            // Start ambient and hum after arrival
            if (ambientRef.current) {
                ambientRef.current.volume = 0.3;
                ambientRef.current.play().catch(e => console.warn("Audio autoplay blocked:", e));
            }
            if (humRef.current) {
                humRef.current.volume = 0.5;
                humRef.current.play().catch(e => console.warn("Audio autoplay blocked:", e));
            }
        }
    }, [hasCompletedIntro]);

    return null; // Purely logical component
}
