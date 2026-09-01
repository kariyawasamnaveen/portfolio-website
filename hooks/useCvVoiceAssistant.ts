import { useState, useRef, useCallback, useEffect } from 'react';
import { useMicVAD } from "@ricky0123/vad-react";
import { utils } from "@ricky0123/vad-web";
import { useRouter } from 'next/navigation';

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function useCvVoiceAssistant() {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
    const router = useRouter();

    const recognitionRef = useRef<any>(null);
    const hasGreetedRef = useRef(false);

    const getPreferredVoice = useCallback((synth: SpeechSynthesis) => {
        const voices = synth.getVoices();
        if (!voices || voices.length === 0) return null;

        const strictMaleVoice = voices.find(v => v.name === 'Google UK English Male')
            || voices.find(v => v.name === 'Daniel') 
            || voices.find(v => v.name === 'Alex') 
            || voices.find(v => v.name === 'Arthur') 
            || voices.find(v => v.name === 'Oliver') 
            || voices.find(v => v.name === 'Fred') 
            || voices.find(v => v.name.includes('David')) 
            || voices.find(v => v.name.includes('Mark')) 
            || voices.find(v => v.name.toLowerCase().includes('male'))
            || voices.find(v => v.name.toLowerCase().includes('boy'));

        if (strictMaleVoice) return strictMaleVoice;

        const knownFemale = ['samantha', 'karen', 'victoria', 'moira', 'tessa', 'veena', 'fiona', 'luciana', 'female', 'woman', 'girl', 'zira', 'hazel', 'siri', 'catherine', 'martha'];
        const safeFallback = voices.find(v => !knownFemale.some(f => v.name.toLowerCase().includes(f)) && v.lang.includes('en'));

        return safeFallback || voices[0];
    }, []);

    const speakResponse = useCallback((text: string) => {
        setIsSpeaking(true);
        try { recognitionRef.current?.stop(); } catch(e){}

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        
        const preferredVoice = getPreferredVoice(synth);
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        utterance.rate = 0.95; // Slower, more deliberate pacing
        utterance.pitch = 0.9; // Slightly deeper for professionalism
        utterance.volume = 1.0; 
        
        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => setIsSpeaking(false);

        synth.speak(utterance);
    }, [getPreferredVoice]);

    const processAudio = useCallback(async (base64data: string) => {
        try {
            const payload = { 
                audioData: base64data, 
                mimeType: 'audio/wav',
                currentContext: "Looking at Naveen's CV/Resume directly"
            };

            const response = await fetch('/api/chat/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('API failed');

            const data = await response.json();
            
            if (data.spokenResponse) {
                speakResponse(data.spokenResponse);
            }
            if (data.transcript && data.spokenResponse) {
                conversationHistoryRef.current.push({ role: 'user', text: data.transcript });
                conversationHistoryRef.current.push({ role: 'ai', text: data.spokenResponse });
                if (conversationHistoryRef.current.length > 8) {
                    conversationHistoryRef.current = conversationHistoryRef.current.slice(conversationHistoryRef.current.length - 8);
                }
            }

            if (data.highlight) {
                setActiveHighlight(data.highlight);
            }
            
            // Handle cross-navigation
            if (data.command === 'NAVIGATE' && data.target) {
                if (data.target === 'identity' || data.target === 'home' || data.target === 'back') {
                    router.push('/');
                } else {
                    router.push(`/?targetZone=${data.target}`);
                }
            } else if (data.command === 'OPEN_PROJECT' && data.target) {
                router.push(`/?targetProject=${data.target}`);
            } else if (data.command === 'HIGHLIGHT_CODE') {
                router.push(`/?targetZone=logic&highlight=${data.highlightTarget || ''}`);
            }
        } catch (err) {
            console.error("[CV Voice AI ❌] Error:", err);
        }
    }, [speakResponse, router]);

    const vad = useMicVAD({
        startOnLoad: false,
        model: "v5",
        baseAssetPath: "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.30/dist/",
        onnxWASMBasePath: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/",
        positiveSpeechThreshold: 0.90,
        negativeSpeechThreshold: 0.70,
        minSpeechMs: 250,
        onSpeechStart: () => {
            setIsListening(true);
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            }
        },
        onSpeechEnd: (audio) => {
            setIsListening(false);
            const wavBuffer = utils.encodeWAV(audio);
            const base64String = arrayBufferToBase64(wavBuffer);
            processAudio(base64String);
        },
        onVADMisfire: () => {
            setIsListening(false);
        }
    });

    useEffect(() => {
        if (isActive) {
            vad.start();
            if (!hasGreetedRef.current) {
                hasGreetedRef.current = true;
                setTimeout(() => {
                    speakResponse("Hello, and welcome to Naveen's CV. I'm his personal AI representative. Naveen specializes in high-velocity Full-Stack and AI engineering. Would you like me to walk you through his recent freelance projects, or dive into his specific tech stack?");
                }, 200);
            }
        } else {
            vad.pause();
            setIsSpeaking(false);
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        }
    }, [isActive, vad, speakResponse]);

    useEffect(() => {
        if (!isActive) {
            setActiveHighlight(null);
        }
    }, [isActive]);

    return {
        isActive,
        setIsActive,
        isListening,
        isSpeaking,
        activeHighlight,
        setActiveHighlight,
        vad
    };
}
