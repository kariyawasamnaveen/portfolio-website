import { useEffect, useRef, useCallback, useState } from 'react';
import { useMicVAD } from "@ricky0123/vad-react";
import { utils } from "@ricky0123/vad-web";
import { useRouter } from 'next/navigation';
import { useAppStore, TechId, Zone } from '@/store/useAppStore';
import { PROJECTS_DATA, Project } from '@/data/projects';

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function useVoiceAssistant({
    isUiRevealed,
    hasPoweredUp,
    setIsAssetsReady
}: {
    isUiRevealed: boolean;
    hasPoweredUp: boolean;
    setIsAssetsReady: (ready: boolean) => void;
}) {
    const router = useRouter();
    // global states
    const {
        isBotActive, setIsBotActive,
        isSpeaking, setIsSpeaking,
        isListening, setIsListening,
        isPttActive,
        activeZone, setActiveZone,
        activeTech, setActiveTech,
        showHint, setShowHint,
        selectedProject, setSelectedProject,
        setContactForm, setCodeHighlight,
        pushHistory, popHistory, codeHighlight
    } = useAppStore();

    // Refs
    const recognitionRef = useRef<any>(null);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const isBotActiveRef = useRef(isBotActive);
    const isSpeakingRef = useRef(isSpeaking);
    const hasGreetedRef = useRef(false);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const nudgeCountRef = useRef(0);
    const visitedZonesRef = useRef<Set<string>>(new Set(['identity']));
    const visitedProjectsRef = useRef<Set<string>>(new Set());
    const conversationHistoryRef = useRef<{role: string, text: string}[]>([]);

    useEffect(() => { isBotActiveRef.current = isBotActive; }, [isBotActive]);
    useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);

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
        
        utterance.rate = 1.1; 
        utterance.pitch = 0.8; 
        utterance.volume = 1.0; 
        
        utterance.onend = () => {
            setIsSpeaking(false);
            if (isBotActiveRef.current) {
                setTimeout(() => {
                    try { recognitionRef.current?.start(); } catch(e){}
                }, 500);
            }
        };

        utterance.onerror = () => setIsSpeaking(false);

        synth.speak(utterance);
    }, [getPreferredVoice, setIsSpeaking]);

    useEffect(() => {
        useAppStore.getState().setGlobalSpeak(speakResponse);
    }, [speakResponse]);

    const processAudio = useCallback(async (base64data: string) => {
        try {
            const payload = { 
                audioData: base64data, 
                mimeType: 'audio/wav',
                currentContext: selectedProject ? `Looking at project: ${selectedProject.id}` : `Looking at zone: ${activeZone}`,
                conversationHistory: conversationHistoryRef.current
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
            if (data.transcript && data.spokenResponse) {
                conversationHistoryRef.current.push({ role: 'user', text: data.transcript });
                conversationHistoryRef.current.push({ role: 'ai', text: data.spokenResponse });
                if (conversationHistoryRef.current.length > 8) {
                    conversationHistoryRef.current = conversationHistoryRef.current.slice(conversationHistoryRef.current.length - 8);
                }
            }
            
            const saveHistory = () => {
                pushHistory({
                    route: window.location.pathname,
                    zone: activeZone,
                    projectOpen: selectedProject ? selectedProject.id : null,
                    highlight: codeHighlight
                });
            };

            if (data.command === 'NAVIGATE' && data.target) {
                saveHistory();
                if (['resume', 'guestbook', 'calculator', 'playground'].includes(data.target)) {
                    router.push('/' + data.target);
                } else {
                    setActiveZone(data.target as Zone);
                }
                setCodeHighlight(null);
            } else if (data.command === 'OPEN_PROJECT' && data.target) {
                saveHistory();
                const proj = PROJECTS_DATA.find(p => p.id === data.target);
                if (proj) setSelectedProject(proj);
            } else if (data.command === 'FILL_FORM') {
                saveHistory();
                setActiveZone('connect');
                if (data.formData) {
                    setContactForm(prev => ({
                        email: data.formData.email || prev.email,
                        message: data.formData.message || prev.message
                    }));
                }
            } else if (data.command === 'HIGHLIGHT_CODE') {
                saveHistory();
                setActiveZone('logic');
                if (data.highlightTarget) {
                    setCodeHighlight(data.highlightTarget.toLowerCase());
                    if (['agentic', 'edge', 'healing', 'zerotrust', 'web3', 'cicd'].includes(data.highlightTarget.toLowerCase())) {
                        setActiveTech(data.highlightTarget.toLowerCase() as TechId);
                    }
                }
            } else if (data.command === 'GO_BACK') {
                const prev = popHistory();
                if (prev) {
                    if (prev.route !== window.location.pathname) {
                        window.location.href = prev.route; // Hard redirect for simplicity, or we could dispatch an event
                    } else {
                        setActiveZone(prev.zone);
                        setCodeHighlight(prev.highlight);
                        const proj = PROJECTS_DATA.find(p => p.id === prev.projectOpen);
                        setSelectedProject(proj || null);
                    }
                } else {
                    // Fallback if no history
                    setSelectedProject(null);
                    setCodeHighlight(null);
                    setActiveZone('identity');
                }
            } else if (data.command === 'SWITCH_CODE_TAB') {
                if (data.target) {
                    setActiveTech(data.target as TechId);
                }
            } else if (data.command === 'TOGGLE_CODE_VIEW') {
                window.dispatchEvent(new CustomEvent('ai-toggle-code-view', { detail: data.target }));
            } else if (data.command === 'OPEN_SOCIAL_LINK') {
                if (data.target === 'linkedin') {
                    window.open('https://www.linkedin.com/in/naveen-kariyawasam-b85507229/', '_blank');
                } else if (data.target === 'github') {
                    window.open('https://github.com/kariyawasamnaveen', '_blank');
                } else if (data.target === 'email') {
                    navigator.clipboard.writeText('hknskariyawasamnaveen@gmail.com');
                }
            } else if (data.command === 'GALLERY_NAV') {
                if (data.target === 'next') {
                    window.dispatchEvent(new CustomEvent('ai-gallery-next'));
                } else if (data.target === 'previous') {
                    window.dispatchEvent(new CustomEvent('ai-gallery-previous'));
                }
            } else if (data.command === 'OPEN_EXTERNAL_LINK') {
                if (selectedProject) {
                    const url = data.target === 'github' ? selectedProject.github_url : selectedProject.demo_url;
                    if (url && url !== '#') {
                        window.open(url, '_blank');
                    }
                }
            } else if (data.command === 'SCROLL') {
                if (data.target === 'down') {
                    window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
                } else if (data.target === 'up') {
                    window.scrollBy({ top: -window.innerHeight * 0.7, behavior: 'smooth' });
                } else if (data.target === 'top') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (data.target === 'bottom') {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            } else if (data.command === 'SUBMIT_FORM') {
                window.dispatchEvent(new CustomEvent('ai-submit-form'));
            }
        } catch (err) {
            console.error("[Voice AI ❌] Massive failure in Chat API pipeline:", err);
        }
    }, [activeZone, selectedProject, speakResponse, setActiveZone, setCodeHighlight, setSelectedProject, setContactForm, setActiveTech]);

    const processText = useCallback(async (textPrompt: string) => {
        try {
            setIsListening(true); 
            nudgeCountRef.current = 0; 
            
            const payload = { 
                textPrompt, 
                currentContext: selectedProject ? `Looking at project: ${selectedProject.id}` : `Looking at zone: ${activeZone}`,
                conversationHistory: conversationHistoryRef.current
            };

            const response = await fetch('/api/chat/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            setIsListening(false);
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
            if (data.transcript && data.spokenResponse) {
                conversationHistoryRef.current.push({ role: 'user', text: data.transcript });
                conversationHistoryRef.current.push({ role: 'ai', text: data.spokenResponse });
                if (conversationHistoryRef.current.length > 8) {
                    conversationHistoryRef.current = conversationHistoryRef.current.slice(conversationHistoryRef.current.length - 8);
                }
            }
            
            if (data.command === 'NAVIGATE' && data.target) {
                if (['resume', 'guestbook', 'calculator', 'playground'].includes(data.target)) {
                    router.push('/' + data.target);
                } else {
                    setActiveZone(data.target as Zone);
                }
                setCodeHighlight(null); 
            } else if (data.command === 'OPEN_PROJECT' && data.target) {
                const proj = PROJECTS_DATA.find(p => p.id === data.target);
                if (proj) setSelectedProject(proj);
            } else if (data.command === 'FILL_FORM') {
                setActiveZone('connect');
                if (data.formData) {
                    setContactForm(prev => ({
                        email: data.formData.email || prev.email,
                        message: data.formData.message || prev.message
                    }));
                }
            } else if (data.command === 'HIGHLIGHT_CODE') {
                setActiveZone('logic');
                if (data.highlightTarget) {
                    setCodeHighlight(data.highlightTarget.toLowerCase());
                    if (['agentic', 'edge', 'healing', 'zerotrust', 'web3', 'cicd'].includes(data.highlightTarget.toLowerCase())) {
                        setActiveTech(data.highlightTarget.toLowerCase() as TechId);
                    }
                }
            } else if (data.command === 'CLOSE_MODAL') {
                setSelectedProject(null);
            } else if (data.command === 'SWITCH_CODE_TAB') {
                if (data.target) {
                    setActiveTech(data.target as TechId);
                }
            } else if (data.command === 'TOGGLE_CODE_VIEW') {
                window.dispatchEvent(new CustomEvent('ai-toggle-code-view', { detail: data.target }));
            } else if (data.command === 'OPEN_SOCIAL_LINK') {
                if (data.target === 'linkedin') {
                    window.open('https://www.linkedin.com/in/naveen-kariyawasam-b85507229/', '_blank');
                } else if (data.target === 'github') {
                    window.open('https://github.com/kariyawasamnaveen', '_blank');
                } else if (data.target === 'email') {
                    navigator.clipboard.writeText('hknskariyawasamnaveen@gmail.com');
                }
            } else if (data.command === 'GALLERY_NAV') {
                if (data.target === 'next') {
                    window.dispatchEvent(new CustomEvent('ai-gallery-next'));
                } else if (data.target === 'previous') {
                    window.dispatchEvent(new CustomEvent('ai-gallery-previous'));
                }
            } else if (data.command === 'OPEN_EXTERNAL_LINK') {
                if (selectedProject) {
                    const url = data.target === 'github' ? selectedProject.github_url : selectedProject.demo_url;
                    if (url && url !== '#') {
                        window.open(url, '_blank');
                    }
                }
            } else if (data.command === 'SCROLL') {
                if (data.target === 'down') {
                    window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
                } else if (data.target === 'up') {
                    window.scrollBy({ top: -window.innerHeight * 0.7, behavior: 'smooth' });
                } else if (data.target === 'top') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (data.target === 'bottom') {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            } else if (data.command === 'SUBMIT_FORM') {
                window.dispatchEvent(new CustomEvent('ai-submit-form'));
            }
        } catch (err) {
            setIsListening(false);
            console.error("[Voice AI ❌] Text Command Error:", err);
        }
    }, [activeZone, selectedProject, setIsListening, speakResponse, setActiveZone, setCodeHighlight, setSelectedProject, setContactForm, setActiveTech]);

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
           if (vad.userSpeaking) {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            nudgeCountRef.current = 0; 
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            }
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
        if (!hasPoweredUp) {
            vad.pause();
            return;
        }
        
        if (isMobile) {
            // Mobile: requires Push-to-Talk
            if (isPttActive) {
                vad.start();
            } else {
                vad.pause();
            }
        } else {
            // Desktop: Always listening
            if (isBotActive) {
                vad.start();
            } else {
                vad.pause();
            }
        }
    }, [isBotActive, hasPoweredUp, isPttActive, isMobile, vad]);

    useEffect(() => {
        if (isUiRevealed && !hasGreetedRef.current) {
            hasGreetedRef.current = true;
            setTimeout(() => {
                setIsBotActive(true); 
                
                const urlParams = new URLSearchParams(window.location.search);
                const isFromCV = urlParams.get('source') === 'cv';
                
                if (isFromCV) {
                    speakResponse("Hey there! I see you just came from Naveen's CV. I've got his entire resume, all his timelines, and project details loaded into my neural network. Feel free to ask me anything about his experience, or ask me to show you a specific project architecture!");
                } else {
                    speakResponse("Oh, hey there! Welcome to Naveen's digital universe. I'm his personal AI, acting as your Sales Engineer today. You know, Naveen is an incredible Lead Architect. He builds these crazy high-performance Flutter apps and massive Node.js systems. My job is to guide you around... So, just tell me out loud: do you want to see his code, understand his architecture, or maybe we can just chat? What are you looking for today?");
                }
            }, 200); 
        }
    }, [isUiRevealed, speakResponse, setIsBotActive]);

    useEffect(() => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        
        if (isBotActive && !isSpeaking && !isListening && hasGreetedRef.current && nudgeCountRef.current < 2) {
            silenceTimerRef.current = setTimeout(() => {
                nudgeCountRef.current += 1;
                setShowHint(true);
                
                if (selectedProject) {
                    const projectPhrases = [
                        `I see you're deep into the ${selectedProject.title} project. Ask me if you need architectural details.`,
                        `Take your time reviewing ${selectedProject.title}. I'm here when you're ready to dive deeper.`,
                        `The tech stack for ${selectedProject.title} is quite extensive. Let me know if you want me to break it down.`
                    ];
                    speakResponse(projectPhrases[Math.floor(Math.random() * projectPhrases.length)]);
                } else if (activeZone === 'logic') {
                    const logicPhrases = [
                        "I'm just analyzing the background telemetry... let me know if you want to scan any code.",
                        "Naveen's architecture can be heavy. Take your time reading it.",
                        "If you select a technology tab, I can run an AI review on the code for you."
                    ];
                    speakResponse(logicPhrases[Math.floor(Math.random() * logicPhrases.length)]);
                } else if (activeZone === 'projects') {
                    const projPhrases = [
                        "Feel free to click on any project to see its architecture.",
                        "If you want, just say 'open Habit Flow' or 'show me Shemet'.",
                        "The projects here are highly optimized. Need me to explain any of them?"
                    ];
                    speakResponse(projPhrases[Math.floor(Math.random() * projPhrases.length)]);
                } else {
                    const idlePhrases = [
                        "Are you still there? You can say things like 'show me your code' or 'what is your tech stack'.",
                        "If you're not sure what to do, just ask 'what can you do?' and I'll explain.",
                        "I'm still listening. Let me know if you want to explore the architecture or see some projects."
                    ];
                    speakResponse(idlePhrases[Math.floor(Math.random() * idlePhrases.length)]);
                }
            }, 25000); 
        }
        
        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [isSpeaking, isListening, isBotActive, selectedProject, activeZone, setShowHint, speakResponse]);

    return {
        vad,
        processText,
        speakResponse
    };
}
