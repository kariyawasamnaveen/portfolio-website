'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useMicVAD } from "@ricky0123/vad-react"
import { utils } from "@ricky0123/vad-web"
import * as ort from "onnxruntime-web"

if (typeof window !== "undefined") {
    console.log("[Voice AI ⚙️] Setting ONNX WASM Paths to Cloud CDN to bypass Next.js chunks routing...");
    ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/";
    ort.env.wasm.numThreads = 1; // IMPORTANT: Fixes SharedArrayBuffer errors
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
import { motion, AnimatePresence } from 'framer-motion'
import CentralPortalNav from '@/components/CentralPortalNav'
import ThreeDTechLab from '@/components/ThreeDTechLab'
import LoadingScreen from '@/components/LoadingScreen'
import { 
    FiGithub, FiLinkedin, FiMail, FiCpu, FiLayers, FiZap, 
    FiCheckCircle, FiX, FiExternalLink, FiPlay, FiTarget, 
    FiShield, FiActivity, FiArrowLeft, FiImage, FiVideo, FiMaximize2,
    FiChevronLeft, FiChevronRight, FiDatabase, FiServer, FiSmartphone, FiBox, FiCode,
    FiInstagram, FiFacebook, FiSend, FiMapPin, FiPhone, FiMessageCircle
} from 'react-icons/fi'
import { SiFlutter, SiDart, SiFirebase, SiNodedotjs, SiGooglecloud, SiCplusplus, SiTensorflow, SiWhatsapp } from 'react-icons/si'

type Zone = 'identity' | 'projects' | 'logic' | 'impact' | 'connect'

import { Project, PROJECTS_DATA } from '@/data/projects'

export default function Home() {
    const [activeZone, setActiveZone] = useState<Zone>('identity')
    const [lightboxReviewIndex, setLightboxReviewIndex] = useState<number | null>(null)
    const [currentReviewIndex, setCurrentReviewIndex] = useState(1)
    const [currentReelIndex, setCurrentReelIndex] = useState(1)
    const [isReelMuted, setIsReelMuted] = useState(true)
    const [showLoading, setShowLoading] = useState(true)
    const [hasPoweredUp, setHasPoweredUp] = useState(false)
    const [isPoweringUp, setIsPoweringUp] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isBotActive, setIsBotActive] = useState(false)
    const recognitionRef = useRef<any>(null)
    const isBotActiveRef = useRef(false)
    const isSpeakingRef = useRef(false)

    const processAudio = async (base64data: string) => {
        try {
            const startTime = performance.now();
            console.log(`[Voice AI ⏱️] Single API Request started at: ${startTime.toFixed(2)}ms`);
            
            const payload = { audioData: base64data, mimeType: 'audio/wav' };

            const response = await fetch('/api/chat/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const endTime = performance.now();
            console.log(`[Voice AI ⏱️] Process API HTTP Status: ${response.status} (Took ${(endTime - startTime).toFixed(2)}ms)`);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error("[Voice AI ❌] Backend returned Error:", errData);
                throw new Error(`API returned status ${response.status}: ${errData.details || 'No details'}`);
            }

            const data = await response.json();
            
            if (data.spokenResponse) {
                speakResponse(data.spokenResponse);
            }
            
            if (data.command === 'NAVIGATE' && data.target) {
                setActiveZone(data.target as Zone);
            } else if (data.command === 'OPEN_PROJECT' && data.target) {
                const proj = PROJECTS_DATA.find(p => p.id === data.target);
                if (proj) {
                    console.log("[Voice AI] Opening project:", proj.title);
                    setSelectedProject(proj);
                }
            }
        } catch (err) {
            console.error("[Voice AI ❌] Massive failure in Chat API pipeline:", err);
        }
    };

    const vad = useMicVAD({
        startOnLoad: false,
        model: "v5",
        baseAssetPath: "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.30/dist/",
        onnxWASMBasePath: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/",
        positiveSpeechThreshold: 0.85,
        minSpeechFrames: 5,
        onVADLoad: () => {
            console.log("[Voice AI 🟢] VAD Model Loaded Successfully! (Deep Debug: Core engine initialized)");
        },
        onSpeechStart: () => {
            console.log("[Voice AI 🗣️] Speech started! (Deep Debug: Silero VAD detected human voice)");
            setIsListening(true);
            if (window.speechSynthesis.speaking) {
                console.log("[Voice AI 🛑] BARGE-IN DETECTED! Muting bot (Deep Debug: Cancelling TTS)...");
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            }
        },
        onSpeechEnd: (audio) => {
            console.log("[Voice AI 🤫] Speech ended (Deep Debug: Silence detected). Audio size: " + audio.length);
            setIsListening(false);
            const wavBuffer = utils.encodeWAV(audio);
            const base64String = arrayBufferToBase64(wavBuffer);
            processAudio(base64String);
        },
        onVADMisfire: () => {
            console.log("[Voice AI 🗑️] VAD misfire (Deep Debug: Too short or false positive). Ignored.");
            setIsListening(false);
        },
        onFrameProcessed: (probabilities) => {
            // Uncomment below if you want extreme frame-by-frame debug, but it will flood the console
            // console.log(`[Voice AI 🕵️] Frame processed. Speech Prob: ${probabilities.isSpeech}`);
        }
    });

    useEffect(() => {
        if (isBotActive) {
            console.log("[Voice AI 🔌] Bot Activated: Calling vad.start() (Deep Debug)");
            vad.start();
        } else {
            console.log("[Voice AI 🔌] Bot Deactivated: Calling vad.pause() (Deep Debug)");
            vad.pause();
        }
    }, [isBotActive]);

    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [expandedMediaIndex, setExpandedMediaIndex] = useState<number | null>(null)
    const [showDeepDive, setShowDeepDive] = useState(false)

    // Compute all media for the selected project
    const allProjectMedia = useMemo(() => {
        if (!selectedProject) return []
        const media: { type: 'video' | 'image', url: string }[] = []
        if (selectedProject.video) {
            if (Array.isArray(selectedProject.video)) {
                selectedProject.video.forEach(v => media.push({ type: 'video', url: v }))
            } else if (selectedProject.video !== '') {
                media.push({ type: 'video', url: selectedProject.video })
            }
        }
        if (selectedProject.images && selectedProject.images.length > 0) {
            selectedProject.images.forEach(img => {
                media.push({ type: 'image', url: img })
            })
        }
        return media
    }, [selectedProject])

    // Keyboard navigation handlers
    const handleNextMedia = useCallback(() => {
        if (expandedMediaIndex !== null && allProjectMedia.length > 0) {
            setExpandedMediaIndex((prev) => prev !== null ? (prev + 1) % allProjectMedia.length : 0)
        }
    }, [expandedMediaIndex, allProjectMedia.length])

    const handlePrevMedia = useCallback(() => {
        if (expandedMediaIndex !== null && allProjectMedia.length > 0) {
            setExpandedMediaIndex((prev) => prev !== null ? (prev - 1 + allProjectMedia.length) % allProjectMedia.length : 0)
        }
    }, [expandedMediaIndex, allProjectMedia.length])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (expandedMediaIndex === null) return
            if (e.key === 'ArrowRight') handleNextMedia()
            if (e.key === 'ArrowLeft') handlePrevMedia()
            if (e.key === 'Escape') setExpandedMediaIndex(null)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [expandedMediaIndex, handleNextMedia, handlePrevMedia])

    useEffect(() => {
        const handleLightboxKeyDown = (e: KeyboardEvent) => {
            if (lightboxReviewIndex === null) return
            if (e.key === 'ArrowRight') setLightboxReviewIndex(prev => prev === 9 ? 1 : (prev! + 1))
            if (e.key === 'ArrowLeft') setLightboxReviewIndex(prev => prev === 1 ? 9 : (prev! - 1))
            if (e.key === 'Escape') setLightboxReviewIndex(null)
        }
        window.addEventListener('keydown', handleLightboxKeyDown)
        return () => window.removeEventListener('keydown', handleLightboxKeyDown)
    }, [lightboxReviewIndex])

    useEffect(() => {
        isBotActiveRef.current = isBotActive
    }, [isBotActive])

    useEffect(() => {
        isSpeakingRef.current = isSpeaking
    }, [isSpeaking])

    const getPreferredMaleVoice = useCallback((synth: SpeechSynthesis) => {
        const voices = synth.getVoices();
        return voices.find(v => v.name === 'Google UK English Male')
            || voices.find(v => v.name.includes('David'))
            || voices.find(v => v.name.includes('Mark'))
            || voices.find(v => v.name === 'Daniel')
            || voices.find(v => v.name === 'Alex')
            || voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('boy'))
            || voices.find(v => v.lang.includes('en-GB'))
            || voices.find(v => v.lang.includes('en'))
            || voices[0];
    }, []);

    const speakResponse = useCallback((text: string) => {
        console.log(`[Voice AI ⚙️] speakResponse called with text: "${text}"`);
        setIsSpeaking(true);
        try { 
            recognitionRef.current?.stop(); 
            console.log("[Voice AI ⚙️] Temporarily stopped listening for TTS.");
        } catch(e){
            console.error("[Voice AI ⚙️] Error stopping recognition:", e);
        }

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        
        const preferredVoice = getPreferredMaleVoice(synth);
        if (preferredVoice) {
            console.log(`[Voice AI ⚙️] Selected Voice: ${preferredVoice.name} (${preferredVoice.lang})`);
            utterance.voice = preferredVoice;
        } else {
            console.warn("[Voice AI ⚙️] No preferred male voice found, using default.");
        }
        
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onstart = () => console.log("[Voice AI ⚙️] 🔊 TTS Audio started playing...");
        
        utterance.onend = () => {
            console.log("[Voice AI ⚙️] 🔇 TTS Audio finished playing.");
            setIsSpeaking(false);
            if (isBotActiveRef.current) {
                setTimeout(() => {
                    console.log("[Voice AI ⚙️] Restarting recognition after TTS...");
                    try { recognitionRef.current?.start(); } catch(e){
                        console.error("[Voice AI ⚙️] Error restarting recognition:", e);
                    }
                }, 500);
            }
        };

        utterance.onerror = (e) => {
            console.error("[Voice AI ⚙️] ❌ TTS Error:", e);
            setIsSpeaking(false);
        };

        console.log("[Voice AI ⚙️] Invoking synth.speak()...");
        synth.speak(utterance);
    }, [getPreferredMaleVoice]);

    // Legacy manual logic completely removed, using Silero VAD above

    return (
        <>
            <AnimatePresence>
                {showLoading && (
                    <LoadingScreen onLoadingComplete={() => setShowLoading(false)} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!hasPoweredUp && !showLoading && (
                    <motion.div 
                        key="power-up"
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
                    >

                            <motion.button
                                onClick={() => {
                                    setIsPoweringUp(true);
                                    setTimeout(() => {
                                        setHasPoweredUp(true);
                                        setIsBotActive(true);
                                        // Trigger AI Voice
                                        const synth = window.speechSynthesis;
                                        const utterance = new SpeechSynthesisUtterance("Systems Online. Hi, I am Naveen's AI assistant. How can I help you explore his work?");
                                        const preferredVoice = getPreferredMaleVoice(synth);
                                        if (preferredVoice) utterance.voice = preferredVoice;
                                        utterance.pitch = 1.0;
                                        synth.speak(utterance);
                                    }, 1500);
                                }}
                                animate={isPoweringUp ? { scale: [1, 0.9, 2], opacity: [1, 1, 0] } : { scale: [1, 1.02, 1] }}
                                transition={isPoweringUp ? { duration: 1.5, ease: "easeInOut" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center group outline-none cursor-pointer"
                            >
                                <motion.div 
                                    animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.9, 1.1, 0.9] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.4)_0%,transparent_60%)] pointer-events-none"
                                />
                                <img 
                                    src="/fingerprint.png" 
                                    alt="Fingerprint Scanner" 
                                    className={`w-full h-full object-contain mix-blend-screen transition-all duration-700 relative z-10 ${isPoweringUp ? 'scale-110' : 'group-hover:scale-110'}`} 
                                />
                                <div className="absolute -bottom-8 w-full text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-600 group-hover:text-amber-500 transition-colors duration-500">
                                        {isPoweringUp ? 'Initializing...' : 'Authenticate'}
                                    </p>
                                </div>
                            </motion.button>
                        
                        {/* Dramatic Grid Lines when powering up */}
                        {isPoweringUp && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5] }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.15)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.main 
                initial={{ opacity: 0 }}
                animate={{ opacity: hasPoweredUp ? 1 : 0 }}
                transition={{ duration: 1.5 }}
                className="viewport-container bg-[#050505] text-white min-h-screen h-screen relative overflow-hidden flex flex-col"
            >
                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 blur-[150px] rounded-full" />
                </div>

                {/* Header */}
                <header className="fixed top-0 left-0 w-full p-10 z-[100] flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full" />
                            <img src="/logo-kariyawasam.jpg" alt="Logo" className="relative h-12 w-12 object-cover rounded-full border border-amber-500/30 shadow-2xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-[0.5em] text-amber-500 uppercase leading-none mb-1">Architect</span>
                            <span className="text-sm font-bold tracking-tighter uppercase">Naveen.K</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full shadow-2xl">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]" />
                        <span className="text-[9px] font-black tracking-[0.3em] text-neutral-300 uppercase leading-none">Status: Live for Hire</span>
                    </div>
                </header>

                <CentralPortalNav activeZone={activeZone} onZoneChange={setActiveZone} />

                <div className={`z-10 w-full max-w-7xl mx-auto px-10 flex ${['impact', 'projects'].includes(activeZone) ? 'absolute top-[120px] bottom-[90px] left-0 right-0 items-start overflow-y-auto pointer-events-none' : 'relative items-center h-screen pointer-events-none'}`}>
                    <AnimatePresence mode="wait">
                        {activeZone === 'identity' && (
                            <motion.div 
                                key="identity" 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-0"
                            >
                                <ThreeDTechLab 
                                    isListening={isListening} 
                                    isSpeaking={isSpeaking} 
                                    activeZone={activeZone}
                                    onExploreClick={() => setActiveZone('projects')}
                                />
                            </motion.div>
                        )}


                        {activeZone === 'projects' && (
                            <motion.div 
                                key="projects" 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-0 bg-black pointer-events-auto overflow-y-auto custom-scrollbar"
                            >
                                <div className="w-full max-w-5xl mx-auto px-10 pb-20 pt-[15vh]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {PROJECTS_DATA.map((project) => (
                                    <motion.div 
                                        key={project.id} 
                                        whileHover={{ 
                                            y: -8, 
                                            scale: 1.01,
                                            boxShadow: "0 20px 40px -15px rgba(245, 158, 11, 0.15)"
                                        }}
                                        onClick={() => setSelectedProject(project)}
                                        className="relative aspect-video rounded-[32px] overflow-hidden border border-white/10 cursor-pointer group shadow-2xl transition-all duration-500 backdrop-blur-md bg-black/20"
                                    >
                                        {/* Brightened Overlay */}
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/50 to-black/50" />
                                        
                                        {project.images && project.images[0] && (
                                            <img 
                                                src={project.images[0]} 
                                                alt={project.title} 
                                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" 
                                            />
                                        )}
                                        
                                        {/* Premium Ambient Light */}
                                        <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700" />
                                        
                                        <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-[1px] w-8 bg-amber-500/50" />
                                                <span className="text-[8px] font-black tracking-[0.4em] text-amber-500 uppercase leading-none opacity-80">{project.role}</span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-tight text-white/90 group-hover:text-white transition-colors">{project.title}</h3>
                                        </div>
                                    </motion.div>
                                ))}
                                </div>
                                </div>
                            </motion.div>
                        )}

                        {activeZone === 'logic' && (
                            <motion.div 
                                key="logic" 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full max-w-5xl mx-auto px-10 space-y-24 pb-32"
                            >
                                {/* Section 1: Tech Stack */}
                                <div className="space-y-12">
                                    <div className="flex items-center gap-6">
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/50" />
                                        <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">The Tech Stack</h2>
                                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/50" />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                        {[
                                            { name: 'Flutter', icon: <SiFlutter size={32} />, color: 'text-[#02569B]', border: 'group-hover:border-[#02569B]/50' },
                                            { name: 'Dart', icon: <SiDart size={32} />, color: 'text-[#0175C2]', border: 'group-hover:border-[#0175C2]/50' },
                                            { name: 'Firebase', icon: <SiFirebase size={32} />, color: 'text-[#FFCA28]', border: 'group-hover:border-[#FFCA28]/50' },
                                            { name: 'Node.js', icon: <SiNodedotjs size={32} />, color: 'text-[#339933]', border: 'group-hover:border-[#339933]/50' },
                                            { name: 'ML Kit', icon: <SiGooglecloud size={32} />, color: 'text-[#4285F4]', border: 'group-hover:border-[#4285F4]/50' },
                                            { name: 'Agora / AR', icon: <FiVideo size={32} />, color: 'text-amber-500', border: 'group-hover:border-amber-500/50' }
                                        ].map((tech, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ y: -5, scale: 1.05 }}
                                                className={`group flex flex-col items-center justify-center p-8 bg-neutral-900/50 backdrop-blur-xl rounded-[24px] border border-white/5 transition-all duration-300 ${tech.border} shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-neutral-800/80`}
                                            >
                                                <div className={`${tech.color} mb-4 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                                                    {tech.icon}
                                                </div>
                                                <span className="text-xs font-bold text-neutral-400 group-hover:text-white uppercase tracking-widest transition-colors">{tech.name}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 2: Architecture Philosophy */}
                                <div className="space-y-12">
                                    <div className="flex items-center gap-6">
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-emerald-500/50" />
                                        <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Architecture Philosophy</h2>
                                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-emerald-500/50" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {[
                                            {
                                                title: 'Clean Architecture',
                                                icon: <FiLayers size={24} />,
                                                desc: 'Separation of concerns. Ensuring UI, business logic, and data layers are completely decoupled for scalable, testable, and maintainable enterprise codebases.',
                                                color: 'emerald'
                                            },
                                            {
                                                title: 'BLoC Pattern',
                                                icon: <FiBox size={24} />,
                                                desc: 'Reactive state management in Flutter. Utilizing Streams to separate presentation from business logic, guaranteeing predictable and robust app states.',
                                                color: 'amber'
                                            },
                                            {
                                                title: 'MVC / Modular',
                                                icon: <FiCode size={24} />,
                                                desc: 'Structured backend environments. Designing scalable APIs and microservices using Model-View-Controller and feature-based modular folder structures.',
                                                color: 'blue'
                                            }
                                        ].map((pattern, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ y: -5 }}
                                                className="relative p-8 rounded-[32px] bg-gradient-to-b from-neutral-900 to-black border border-white/10 group overflow-hidden"
                                            >
                                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${pattern.color}-500/10 blur-[50px] group-hover:bg-${pattern.color}-500/20 transition-colors`} />
                                                <div className={`w-12 h-12 rounded-2xl bg-${pattern.color}-500/10 border border-${pattern.color}-500/20 flex items-center justify-center text-${pattern.color}-500 mb-6 group-hover:scale-110 transition-transform`}>
                                                    {pattern.icon}
                                                </div>
                                                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4">{pattern.title}</h3>
                                                <p className="text-sm font-medium text-neutral-400 leading-relaxed">{pattern.desc}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeZone === 'impact' && (
                            <motion.div 
                                key="impact" 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full max-w-7xl mx-auto px-6 md:px-10 pb-10"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                    {/* Left Side: Fiverr Reviews Masonry Grid */}
                                    <div className="lg:col-span-7 space-y-12">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-[2px] w-10 bg-amber-500" />
                                                <p className="text-[10px] font-black tracking-[0.6em] text-neutral-500 uppercase">Client Verification</p>
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
                                                Global <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Reputation.</span>
                                            </h2>
                                            <p className="text-neutral-400 font-medium">Real feedback from clients around the world on Fiverr.</p>
                                        </div>
                                        
                                        {/* Horizontal Carousel */}
                                        <div className="relative w-full max-w-2xl mx-auto">
                                            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group cursor-pointer"
                                                 onClick={() => setLightboxReviewIndex(currentReviewIndex)}>
                                                <AnimatePresence mode="wait">
                                                    <motion.img 
                                                        key={currentReviewIndex}
                                                        src={`/reviews/review-${currentReviewIndex}.png`}
                                                        alt={`Fiverr Client Review ${currentReviewIndex}`}
                                                        initial={{ opacity: 0, x: 50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -50 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                </AnimatePresence>

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                                                
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none">
                                                    <FiMaximize2 className="text-amber-500 mb-2" size={32} />
                                                    <span className="text-white font-bold tracking-widest text-sm uppercase shadow-black drop-shadow-md">Click to Expand</span>
                                                </div>

                                                <div className="absolute bottom-4 left-6 z-20 flex flex-col gap-1 pointer-events-none">
                                                    <div className="flex text-amber-500 drop-shadow-md">
                                                        {'★★★★★'.split('').map((star, j) => <span key={j} className="text-sm">{star}</span>)}
                                                    </div>
                                                    <span className="text-white/70 text-xs font-medium tracking-wider">Client Feedback {currentReviewIndex}/9</span>
                                                </div>
                                            </div>

                                            {/* Navigation Arrows */}
                                            <div className="flex items-center justify-center gap-6 mt-8">
                                                <button 
                                                    onClick={() => setCurrentReviewIndex(prev => prev === 1 ? 9 : prev - 1)}
                                                    className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-amber-500 hover:border-amber-500 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
                                                >
                                                    <FiChevronLeft size={24} />
                                                </button>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dot) => (
                                                        <div 
                                                            key={dot} 
                                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentReviewIndex === dot ? 'bg-amber-500 w-6' : 'bg-white/20'}`} 
                                                        />
                                                    ))}
                                                </div>
                                                <button 
                                                    onClick={() => setCurrentReviewIndex(prev => prev === 9 ? 1 : prev + 1)}
                                                    className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-amber-500 hover:border-amber-500 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
                                                >
                                                    <FiChevronRight size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Reels Mobile Mockup */}
                                    <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center relative mt-12">
                                        <div className="relative w-[380px] h-[760px] rounded-[50px] border-[10px] border-neutral-900 bg-black shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden flex-shrink-0 group">
                                            {/* Hardware Details (Notch, Buttons) */}
                                            <div className="absolute top-0 inset-x-0 h-7 bg-neutral-900 rounded-b-3xl w-40 mx-auto z-30 flex items-center justify-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                                <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full" />
                                            </div>
                                            
                                            {/* Smart Video Player */}
                                            <AnimatePresence mode="wait">
                                                <motion.video
                                                    key={currentReelIndex}
                                                    src={`/reels/reel-${currentReelIndex}.mp4`}
                                                    autoPlay
                                                    muted={isReelMuted}
                                                    loop
                                                    playsInline
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 1.05 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="absolute inset-0 w-full h-full object-contain"
                                                />
                                            </AnimatePresence>
                                            
                                            {/* UI Overlay */}
                                            <div className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none flex justify-between items-end">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center p-0.5 overflow-hidden">
                                                        <img src="/profile.png" alt="Profile" className="w-full h-full rounded-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-sm leading-tight drop-shadow-md">@naveen.k</p>
                                                        <p className="text-white/80 text-xs drop-shadow-md">Premium Mobile App Dev</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Volume Toggle */}
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setIsReelMuted(!isReelMuted); }}
                                                    className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all pointer-events-auto shadow-lg"
                                                >
                                                    {isReelMuted ? (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Carousel Controls */}
                                        <div className="flex items-center justify-center w-[380px] gap-4 mt-8 z-10">
                                            <button 
                                                onClick={() => setCurrentReelIndex(prev => prev === 1 ? 11 : prev - 1)}
                                                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all hover:scale-110 shadow-lg bg-white/5"
                                            >
                                                <FiChevronLeft size={24} />
                                            </button>
                                            <div className="flex gap-1.5 overflow-hidden w-24 justify-center">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((dot) => (
                                                    <div 
                                                        key={dot} 
                                                        className={`h-2 rounded-full transition-all duration-300 flex-shrink-0 ${currentReelIndex === dot ? 'bg-amber-500 w-4' : 'bg-white/20 w-2'}`} 
                                                    />
                                                ))}
                                            </div>
                                            <button 
                                                onClick={() => setCurrentReelIndex(prev => prev === 11 ? 1 : prev + 1)}
                                                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all hover:scale-110 shadow-lg bg-white/5"
                                            >
                                                <FiChevronRight size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeZone === 'connect' && (
                            <motion.div 
                                key="connect" 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full max-w-6xl mx-auto px-6 md:px-10 pb-32"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                    {/* Left Column: Contact Info & Socials */}
                                    <div className="space-y-12">
                                        <div className="space-y-6">
                                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Status: Available for Freelance Projects</span>
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
                                                Let's build <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">something great.</span>
                                            </h2>
                                        </div>

                                        <div className="space-y-8">
                                            {/* Email */}
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText('hknskariyawasamnaveen@gmail.com');
                                                    alert('Email copied to clipboard!');
                                                }}
                                                className="w-full group flex items-center justify-between p-6 bg-neutral-900/50 hover:bg-neutral-800/80 border border-white/5 hover:border-amber-500/30 rounded-2xl transition-all duration-300"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                                        <FiMail size={24} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Email</p>
                                                        <p className="text-sm md:text-base font-medium text-white">hknskariyawasamnaveen@gmail.com</p>
                                                    </div>
                                                </div>
                                            </button>

                                            {/* WhatsApp */}
                                            <a 
                                                href="https://wa.me/94719567269" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-full group flex items-center justify-between p-6 bg-neutral-900/50 hover:bg-neutral-800/80 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all duration-300"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                                        <SiWhatsapp size={24} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">WhatsApp</p>
                                                        <p className="text-sm md:text-base font-medium text-white">+94 71 956 7269</p>
                                                    </div>
                                                </div>
                                            </a>

                                            {/* Location */}
                                            <div className="w-full flex items-center p-6 bg-neutral-900/30 border border-white/5 rounded-2xl">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400">
                                                        <FiMapPin size={24} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Location</p>
                                                        <p className="text-sm md:text-base font-medium text-white">Colombo, Sri Lanka <span className="text-neutral-500 ml-2">| Remote</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Social Links */}
                                        <div>
                                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Connect on Socials</p>
                                            <div className="flex gap-4">
                                                {[
                                                    { icon: <FiGithub size={20} />, href: 'https://github.com/kariyawasamnaveen' },
                                                    { icon: <FiLinkedin size={20} />, href: 'https://www.linkedin.com/in/naveen-kariyawasam-b85507229/' },
                                                    { icon: <FiInstagram size={20} />, href: 'https://www.instagram.com/helpa.global/' },
                                                    { icon: <FiFacebook size={20} />, href: 'https://web.facebook.com/profile.php?id=61590280440577' }
                                                ].map((social, i) => (
                                                    <a
                                                        key={i}
                                                        href={social.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 hover:bg-neutral-800 transition-all hover:-translate-y-1"
                                                    >
                                                        {social.icon}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Contact Form */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent blur-[100px] rounded-[48px]" />
                                        <form 
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                const form = e.target as HTMLFormElement;
                                                const data = new FormData(form);
                                                try {
                                                    const response = await fetch("https://formspree.io/f/xojoezgn", {
                                                        method: "POST",
                                                        body: data,
                                                        headers: {
                                                            'Accept': 'application/json'
                                                        }
                                                    });
                                                    if (response.ok) {
                                                        alert("Message Sent successfully! We will get back to you soon.");
                                                        form.reset();
                                                    } else {
                                                        alert("Oops! There was a problem submitting your form.");
                                                    }
                                                } catch (error) {
                                                    alert("Oops! There was a problem submitting your form.");
                                                }
                                            }}
                                            className="relative bg-neutral-900/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl"
                                        >
                                            <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-8">Send a Message</h3>
                                            
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-4">Your Name</label>
                                                    <input 
                                                        type="text" 
                                                        name="name"
                                                        required
                                                        placeholder="John Doe"
                                                        className="w-full bg-black/50 border border-white/10 focus:border-amber-500 rounded-2xl px-6 py-4 text-white placeholder-neutral-700 outline-none transition-colors"
                                                    />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-4">Email Address</label>
                                                    <input 
                                                        type="email" 
                                                        name="email"
                                                        required
                                                        placeholder="john@example.com"
                                                        className="w-full bg-black/50 border border-white/10 focus:border-amber-500 rounded-2xl px-6 py-4 text-white placeholder-neutral-700 outline-none transition-colors"
                                                    />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-4">Message</label>
                                                    <textarea 
                                                        name="message"
                                                        required
                                                        placeholder="How can I help you?"
                                                        rows={4}
                                                        className="w-full bg-black/50 border border-white/10 focus:border-amber-500 rounded-2xl px-6 py-4 text-white placeholder-neutral-700 outline-none transition-colors resize-none"
                                                    />
                                                </div>

                                                <button 
                                                    type="submit"
                                                    className="w-full group flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-amber-500 transition-colors"
                                                >
                                                    Send Message
                                                    <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.main>

            {/* Immersive Project Portal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black flex flex-col overflow-hidden h-screen">
                        <div className="absolute inset-0 bg-black">
                            {(() => {
                                const v = selectedProject.video;
                                const videoUrl = Array.isArray(v) ? v[0] : v;
                                if (!videoUrl) return null;

                                return videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                                    <iframe 
                                        className="w-full h-full object-cover opacity-20 pointer-events-none"
                                        src={videoUrl}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                    />
                                ) : (
                                    <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
                                        <source src={videoUrl} type="video/mp4" />
                                    </video>
                                );
                            })()}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
                        </div>

                        <header className="relative z-10 p-10 flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <button 
                                    onClick={() => setSelectedProject(null)}
                                    className="bg-white/5 backdrop-blur-3xl px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3 text-[10px] font-black tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-2xl group"
                                >
                                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> BACK TO NEURAL GRID
                                </button>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase">Case Study Intelligence</span>
                                    <div className="h-4 w-[1px] bg-white/10" />
                                    <span className="text-sm font-bold uppercase tracking-tight text-white/90">{selectedProject.title}</span>
                                </div>
                            </div>
                        </header>

                        <div className="relative z-10 flex-1 flex items-center justify-center px-12 md:px-24">
                            <div className="max-w-7xl w-full grid lg:grid-cols-12 gap-16 items-center">
                                
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="space-y-4">
                                        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-amber-500 text-[10px] font-black tracking-[0.4em] uppercase block">{selectedProject.tagline}</motion.span>
                                        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{selectedProject.title}</motion.h2>
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl w-fit">
                                            <FiActivity className="text-amber-500" size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-200">Role: {selectedProject.role}</span>
                                        </motion.div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                                            <div className="flex items-center gap-3 text-amber-500/60">
                                                <FiTarget size={14} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Problem</span>
                                            </div>
                                            <p className="text-base text-neutral-400 font-medium leading-relaxed">{selectedProject.problem}</p>
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                                            <div className="flex items-center gap-3 text-emerald-500/60">
                                                <FiShield size={14} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Solution</span>
                                            </div>
                                            <p className="text-base text-neutral-200 font-medium leading-relaxed">{selectedProject.solution}</p>
                                        </motion.div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-6">
                                        {selectedProject.github && selectedProject.github !== '#' ? (
                                            <a 
                                                href={selectedProject.github} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-12 py-6 bg-white/5 backdrop-blur-3xl text-white rounded-2xl border border-white/10 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all shadow-2xl flex items-center gap-3 cursor-pointer group"
                                            >
                                                View Source Repository <FiGithub size={16} className="group-hover:scale-110 transition-transform" />
                                            </a>
                                        ) : (
                                            <button 
                                                disabled
                                                className="px-12 py-6 bg-white/5 backdrop-blur-3xl text-neutral-500 rounded-2xl border border-white/5 font-black uppercase text-[10px] tracking-widest cursor-not-allowed shadow-2xl flex items-center gap-3"
                                            >
                                                Private Repository <FiGithub size={16} />
                                            </button>
                                        )}
                                        
                                        {selectedProject.deepDive && (
                                            <button 
                                                onClick={() => setShowDeepDive(true)}
                                                className="px-12 py-6 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-2xl flex items-center gap-3 relative overflow-hidden group"
                                            >
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                                                <span className="relative z-10 flex items-center gap-3">Deep Dive Architecture <FiLayers size={16} /></span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-5 space-y-8">
                                    {/* Media Thumbnails Hub */}
                                    <div className="space-y-6 relative">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block">Project Media Assets</span>
                                        <div className="relative">
                                            <div className="max-h-[320px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
                                                <div className="grid grid-cols-4 gap-4 pb-4">
                                                    {/* Video Thumbnails */}
                                                    {selectedProject.video && (
                                                        Array.isArray(selectedProject.video) ? (
                                                            selectedProject.video.map((v, i) => (
                                                                <motion.button 
                                                                    key={`vid-${i}`}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    onClick={() => setExpandedMediaIndex(i)}
                                                                    className="aspect-square bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-500 hover:bg-amber-500/30 transition-all"
                                                                >
                                                                    <FiVideo size={20} />
                                                                </motion.button>
                                                            ))
                                                        ) : selectedProject.video !== '' ? (
                                                            <motion.button 
                                                                whileHover={{ scale: 1.05 }}
                                                                onClick={() => setExpandedMediaIndex(0)}
                                                                className="aspect-square bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-500 hover:bg-amber-500/30 transition-all"
                                                            >
                                                                <FiVideo size={20} />
                                                            </motion.button>
                                                        ) : null
                                                    )}
                                                    {/* Image Thumbnails */}
                                                    {selectedProject.images.map((img, i) => {
                                                        const videoOffset = Array.isArray(selectedProject.video) 
                                                            ? selectedProject.video.length 
                                                            : (selectedProject.video && selectedProject.video !== '' ? 1 : 0);
                                                        
                                                        return (
                                                            <motion.button 
                                                                key={i}
                                                                whileHover={{ scale: 1.05 }}
                                                                onClick={() => setExpandedMediaIndex(videoOffset + i)}
                                                                className="aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all"
                                                            >
                                                                <img src={img} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" alt="Project detail" />
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            {/* Fade overlay for scroll affordance */}
                                            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 space-y-8 shadow-2xl backdrop-blur-xl">
                                        <div className="space-y-6">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block">Performance Metrics</span>
                                            <div className="grid gap-4">
                                                {selectedProject.metrics.map((m) => (
                                                    <div key={m.label} className="flex justify-between items-end border-b border-white/5 pb-3">
                                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{m.label}</span>
                                                        <span className="text-xl font-black text-amber-500">{m.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block">Tech Blueprint</span>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.tech.map(t => (
                                                    <span key={t} className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/70">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Media Lightbox Overlay */}
            <AnimatePresence>
                {expandedMediaIndex !== null && allProjectMedia[expandedMediaIndex] && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-xl"
                    >
                        <button 
                            onClick={() => setExpandedMediaIndex(null)}
                            className="absolute top-8 right-8 md:top-12 md:right-12 w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors z-[2010]"
                        >
                            <FiX size={24} />
                        </button>

                        {allProjectMedia.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handlePrevMedia(); }}
                                    className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 z-[2010] shadow-2xl"
                                >
                                    <FiChevronLeft size={32} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleNextMedia(); }}
                                    className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 z-[2010] shadow-2xl"
                                >
                                    <FiChevronRight size={32} />
                                </button>
                                
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full z-[2010]">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                                        <span className="text-amber-500">{expandedMediaIndex + 1}</span> / {allProjectMedia.length}
                                    </span>
                                </div>
                            </>
                        )}

                        <motion.div 
                            key={expandedMediaIndex}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="relative max-w-6xl w-full h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 flex items-center justify-center p-4 z-[2000]"
                        >
                            {allProjectMedia[expandedMediaIndex].type === 'video' ? (
                                allProjectMedia[expandedMediaIndex].url.includes('youtube.com') || allProjectMedia[expandedMediaIndex].url.includes('youtu.be') ? (
                                    <iframe 
                                        className="w-full h-full max-h-[80vh] aspect-video rounded-2xl shadow-2xl"
                                        src={allProjectMedia[expandedMediaIndex].url.replace('&mute=1', '').replace('autoplay=1', 'autoplay=1&controls=1')}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media; fullscreen"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video autoPlay muted playsInline controls className="max-w-full max-h-full object-contain rounded-2xl">
                                        <source src={allProjectMedia[expandedMediaIndex].url} type="video/mp4" />
                                    </video>
                                )
                            ) : (
                                <img src={allProjectMedia[expandedMediaIndex].url} className="max-w-full max-h-full object-contain rounded-2xl" alt={`Gallery view ${expandedMediaIndex + 1}`} />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Deep Dive Architecture Slide-over */}
            <AnimatePresence>
                {showDeepDive && selectedProject?.deepDive && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowDeepDive(false)}
                            className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-screen w-full max-w-2xl bg-neutral-950/90 backdrop-blur-3xl border-l border-white/10 z-[3001] overflow-y-auto"
                        >
                            <div className="p-12 md:p-16 space-y-12">
                                <button 
                                    onClick={() => setShowDeepDive(false)}
                                    className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all mb-8"
                                >
                                    <FiArrowLeft size={20} />
                                </button>
                                
                                <div>
                                    <span className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase mb-4 block">Architectural Deep Dive</span>
                                    <h2 className="text-4xl font-black uppercase tracking-tight leading-none mb-8">{selectedProject.title}</h2>
                                    
                                    <div className="space-y-12">
                                        <section>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3"><div className="w-2 h-2 bg-amber-500 rounded-full" /> The Narrative</h3>
                                            <p className="text-neutral-400 leading-relaxed font-medium">{selectedProject.deepDive.story}</p>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> System Architecture</h3>
                                            <p className="text-neutral-400 leading-relaxed font-medium">{selectedProject.deepDive.architecture}</p>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Core Engineering Features</h3>
                                            <ul className="space-y-3">
                                                {selectedProject.deepDive.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                                        <FiCheckCircle className="text-amber-500" />
                                                        <span className="text-sm font-medium text-neutral-300">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Lightbox Modal for Fiverr Reviews */}
            <AnimatePresence>
                {lightboxReviewIndex !== null && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10"
                        onClick={() => setLightboxReviewIndex(null)}
                    >
                        <button 
                            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-xl border border-white/20 z-50"
                            onClick={(e) => { e.stopPropagation(); setLightboxReviewIndex(null); }}
                        >
                            <FiX size={24} />
                        </button>

                        {/* Lightbox Navigation Arrows */}
                        <button 
                            className="absolute left-6 w-14 h-14 bg-white/5 hover:bg-amber-500 hover:border-amber-500 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-xl border border-white/20 z-50 hover:scale-110 shadow-lg"
                            onClick={(e) => { e.stopPropagation(); setLightboxReviewIndex(prev => prev === 1 ? 9 : (prev! - 1)); }}
                        >
                            <FiChevronLeft size={30} />
                        </button>
                        
                        <button 
                            className="absolute right-6 w-14 h-14 bg-white/5 hover:bg-amber-500 hover:border-amber-500 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-xl border border-white/20 z-50 hover:scale-110 shadow-lg"
                            onClick={(e) => { e.stopPropagation(); setLightboxReviewIndex(prev => prev === 9 ? 1 : (prev! + 1)); }}
                        >
                            <FiChevronRight size={30} />
                        </button>
                        
                        <motion.div 
                            key={lightboxReviewIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-5xl w-full max-h-full rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.3)] border border-amber-500/30 bg-neutral-900"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img 
                                src={`/reviews/review-${lightboxReviewIndex}.png`}
                                alt={`Expanded Review ${lightboxReviewIndex}`} 
                                className="w-full h-auto max-h-[85vh] object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @keyframes shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                .animate-shimmer { animation: shimmer 5s ease infinite; }
                
                /* Premium Custom Scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(245, 158, 11, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(245, 158, 11, 0.5);
                }
            `}</style>
        </>
    )
}