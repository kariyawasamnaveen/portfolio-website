import re

with open('/Users/n.skariyawasam/.gemini/antigravity-ide/scratch/portfolio-website/app/page.tsx', 'r') as f:
    content = f.read()

# 1. Add imports
content = content.replace("import VoiceAura from '@/components/VoiceAura'", "import VoiceAssistantWidget from '@/components/VoiceAssistantWidget'")
content = content.replace("import FloatingVoicePrompts from '@/components/FloatingVoicePrompts'", "import { useAppStore } from '@/store/useAppStore'")

# 2. Replace state definitions and VAD logic
start_marker = "    const [activeZone, setActiveZone] = useState<Zone>('identity')"
end_marker = "    // Legacy manual logic completely removed, using Silero VAD above"

new_state_block = """    const [lightboxReviewIndex, setLightboxReviewIndex] = useState<number | null>(null)
    const [currentReviewIndex, setCurrentReviewIndex] = useState(1)
    const [currentReelIndex, setCurrentReelIndex] = useState(1)
    const [isReelMuted, setIsReelMuted] = useState(true)
    const [isPoweringUp, setIsPoweringUp] = useState(false)
    const [hasPoweredUp, setHasPoweredUp] = useState(false);
    const [isUiRevealed, setIsUiRevealed] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [isAssetsReady, setIsAssetsReady] = useState(false);
    const [startDrift, setStartDrift] = useState(false);
    const [isRevealing, setIsRevealing] = useState(true)
    const [expandedMediaIndex, setExpandedMediaIndex] = useState<number | null>(null)
    const [showDeepDive, setShowDeepDive] = useState(false)
    
    const { 
        activeZone, setActiveZone, 
        selectedProject, 
        codeHighlight, 
        isBotActive, 
        isListening, 
        isSpeaking,
        showHint,
        activeTech,
        isAnalyzing 
    } = useAppStore()

    useEffect(() => {
        // Force browser to load voices into memory as early as possible
        window.speechSynthesis.getVoices();
    }, []);

    useEffect(() => {
        if (!showLoading) {
            setHasPoweredUp(true);
        }
    }, [showLoading]);

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
"""

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_state_block + content[end_idx + len(end_marker):]

# 3. Replace VoiceAura and persistent UI
voice_aura_start = """                    <VoiceAura 
                        isListening={isListening} 
                        isSpeaking={isSpeaking}
                        hasCompletedIntro={isUiRevealed}
                        startDrift={startDrift}
                        onDriftComplete={() => setIsUiRevealed(true)}
                        onReady={(ready) => setIsAssetsReady(ready)}
                    />"""

voice_aura_replacement = """                    <VoiceAssistantWidget 
                        isUiRevealed={isUiRevealed}
                        hasPoweredUp={hasPoweredUp}
                        startDrift={startDrift}
                        setIsUiRevealed={setIsUiRevealed}
                        setIsAssetsReady={setIsAssetsReady}
                    />"""

content = content.replace(voice_aura_start, voice_aura_replacement)

# Remove persistent visualizer
persistent_visualizer = """                                    {/* The Voice AI Persistent Visualizer (Hidden on Identity page) */}
                                    {activeZone !== 'identity' && (
                                        <div className="ml-6 pl-6 border-l border-white/10 flex items-center">
                                            <div 
                                                className={`relative w-6 h-6 rounded-full transition-all duration-700 
                                                    ${isSpeaking ? 'bg-red-500 shadow-[0_0_25px_8px_rgba(239,68,68,0.8)] scale-125' : 
                                                      isListening ? 'bg-red-600 shadow-[0_0_20px_5px_rgba(220,38,38,0.7)] animate-pulse' : 
                                                      'bg-red-950 shadow-[0_0_10px_2px_rgba(153,27,27,0.5)]'}`}
                                                style={{
                                                    background: 'radial-gradient(circle at 30% 30%, #ef4444, #991b1b, #450a0a)'
                                                }}
                                            >
                                                {/* Glossy top highlight for 3D sphere look */}
                                                <div className="absolute top-[15%] left-[20%] w-[50%] h-[35%] rounded-full bg-white/40 blur-[1px] -rotate-12" />
                                                
                                                {/* Pulse rings */}
                                                {(isSpeaking || isListening) && <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-50 duration-1000" />}
                                                {isSpeaking && <div className="absolute inset-[-4px] rounded-full animate-ping bg-red-500 opacity-30 duration-700 delay-100" />}
                                            </div>
                                        </div>
                                    )}"""
content = content.replace(persistent_visualizer, "")

# Remove FloatingVoicePrompts
floating_voice_prompts = """                {/* Floating Voice Commands on Identity Page */}
                {activeZone === 'identity' && (
                    <FloatingVoicePrompts 
                        isVisible={showHint && !isSpeaking && !isListening} 
                        onCommandClick={(text) => {
                            setShowHint(false); // Hide bubbles immediately
                            processText(text); // Trigger AI
                        }} 
                    />
                )}"""
content = content.replace(floating_voice_prompts, "")

with open('/Users/n.skariyawasam/.gemini/antigravity-ide/scratch/portfolio-website/app/page.tsx', 'w') as f:
    f.write(content)

print("Refactor completed successfully!")
