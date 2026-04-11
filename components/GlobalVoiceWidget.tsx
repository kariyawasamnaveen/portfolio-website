'use client'
import { useState, useEffect } from 'react'
import { LiveKitRoom, useVoiceAssistant, RoomAudioRenderer } from '@livekit/components-react'
import { usePathname } from 'next/navigation'
import { FiMic, FiX, FiMinimize2, FiMaximize2 } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import VoiceAvatar from './VoiceAvatar'

function AssistantContent({ minimized, setMinimized, onClose }: any) {
    const { state, audioTrack } = useVoiceAssistant()
    const pathname = usePathname()
    const [lastPath, setLastPath] = useState(pathname)

    // Context Awareness: Send path updates (simulated via console/internal state for now as direct msg needs more setup)
    // In a real generic AI setup, we would send a data message to the backend.
    useEffect(() => {
        if (pathname !== lastPath) {
            console.log(`Navigation context change: ${lastPath} -> ${pathname}`)
            setLastPath(pathname)
            // Here you would trigger a context update to the bot
        }
    }, [pathname, lastPath])

    if (minimized) {
        return (
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setMinimized(false)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-[#26D4C4] rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform"
            >
                <span className="text-2xl">🤖</span>
                {state === 'speaking' && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </motion.button>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    AI Advisor <span className="text-xs text-[#26D4C4] px-1.5 py-0.5 bg-[#26D4C4]/10 rounded-full">Live</span>
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => setMinimized(true)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition">
                        <FiMinimize2 size={16} />
                    </button>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition">
                        <FiX size={16} />
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="p-6 flex flex-col items-center">
                <div className="w-40 h-40 mb-4">
                    <VoiceAvatar isListening={state === 'listening'} isSpeaking={state === 'speaking'} />
                </div>

                <p className="text-center text-gray-300 text-sm mb-4">
                    {state === 'listening' ? "I'm listening..." : state === 'speaking' ? "Speaking..." : "Ask me about this page!"}
                </p>

                {pathname.includes('/projects') && (
                    <div className="mb-4 px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-xs text-blue-300 text-center">
                        💡 I can explain the tech stack of this project.
                    </div>
                )}
            </div>

            {/* Audio Renderer (Invisible) */}
            <RoomAudioRenderer />
        </motion.div>
    )
}

export default function GlobalVoiceWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [minimized, setMinimized] = useState(false)
    const [token, setToken] = useState('')
    const [url, setUrl] = useState('')

    const connect = async () => {
        try {
            const res = await fetch('/api/livekit-token?room=user-session')
            if (!res.ok) throw new Error('Failed to fetch token')

            const data = await res.json()
            setToken(data.token)
            setUrl(data.serverUrl)
            setIsOpen(true)
            setMinimized(false)
        } catch (e) {
            console.error(e)
            alert("Failed to connect to AI Assistant. Please check if your LiveKit API Keys are set in .env.local")
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={connect}
                className="fixed bottom-6 right-6 px-4 py-3 bg-[#26D4C4] text-black font-bold rounded-full shadow-lg hover:scale-105 transition-all z-50 flex items-center gap-2"
            >
                <span className="text-xl">🤖</span>
                <span className="hidden md:inline">Ask AI</span>
            </button>
        )
    }

    return (
        <LiveKitRoom
            token={token}
            serverUrl={url}
            connect={true}
            audio={true}
        >
            <AssistantContent
                minimized={minimized}
                setMinimized={setMinimized}
                onClose={() => setIsOpen(false)}
            />
        </LiveKitRoom>
    )
}
