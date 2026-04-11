'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMic, FiStopCircle, FiDownload, FiMessageSquare } from 'react-icons/fi'
import { LiveKitRoom, RoomAudioRenderer, useVoiceAssistant } from '@livekit/components-react'
import Navbar from '@/components/Navbar'
import VoiceAvatar from '@/components/VoiceAvatar'
import TranscriptDisplay from '@/components/TranscriptDisplay'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

function ConnectedVoiceInterface() {
  const { state } = useVoiceAssistant()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [textInput, setTextInput] = useState('')
  const [language, setLanguage] = useState('english')
  const [voiceType, setVoiceType] = useState('female')
  const [conversation, setConversation] = useState<Message[]>([
    { role: 'assistant', text: "Hi! I'm Naveen Kariyawasam's AI assistant. Ask me anything about his AI projects, Flutter apps, or research simulations!" }
  ])

  const isListening = state === 'listening'
  const isSpeaking = state === 'speaking'

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim()) {
      setConversation([...conversation, { role: 'user', text: textInput }])
      setTextInput('')
    }
  }

  const handleQuickAction = (action: string) => {
    setConversation([...conversation, { role: 'user', text: action }])
  }

  const downloadPDF = () => {
    alert('PDF download feature - Will generate conversation summary')
  }

  const quickActions = [
    "Tell me about Naveen's AI skills",
    "What Flutter apps has he built?",
    "How can I hire him on Fiverr?",
    "Explain his research work"
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#26D4C410_1px,transparent_1px),linear-gradient(to_bottom,#26D4C410_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(38,212,196,0.15), transparent 50%)`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 space-y-4"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              AI Voice Assistant
            </h1>
            <p className="text-lg text-gray-400">
              Talk to my AI assistant - Ask anything about my work!
            </p>
          </motion.div>

          {/* Settings Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#26D4C4] transition-colors"
            >
              <option value="english" className="bg-gray-900">English</option>
              <option value="sinhala" className="bg-gray-900">සිංහල</option>
            </select>

            <select
              value={voiceType}
              onChange={(e) => setVoiceType(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#26D4C4] transition-colors"
            >
              <option value="female" className="bg-gray-900">Female Voice</option>
              <option value="male" className="bg-gray-900">Male Voice</option>
              <option value="neutral" className="bg-gray-900">Neutral Voice</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadPDF}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:border-[#26D4C4] transition-all flex items-center gap-2"
            >
              <FiDownload size={18} />
              Download PDF
            </motion.button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Avatar & Controls */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Avatar */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                <VoiceAvatar
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                />
              </div>

              {/* Voice Controls */}
              <div className="space-y-4">
                {/* Status Display */}
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-[#26D4C4] font-semibold">
                    {state === 'listening' ? '🎤 Listening...' : state === 'speaking' ? '🔊 Speaking...' : '✅ Connected - Start speaking!'}
                  </p>
                </div>

                {/* Text Input */}
                <form onSubmit={handleTextSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Or type your message..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#26D4C4] transition-colors"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-[#26D4C4] text-black rounded-lg font-bold flex items-center gap-2"
                  >
                    <FiMessageSquare size={18} />
                    Send
                  </motion.button>
                </form>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <p className="text-sm text-gray-400 font-medium">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAction(action)}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:border-[#26D4C4]/50 transition-all text-left"
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Transcript */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TranscriptDisplay
                conversation={conversation}
                isSpeaking={isSpeaking}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VoiceAssistantPage() {
  const [token, setToken] = useState('')
  const [url, setUrl] = useState('')
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const connectToRoom = async () => {
    console.log('🟢 Connecting to room...')
    setLoading(true)
    try {
      console.log('🟢 Fetching token...')
      const res = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: 'voice-assistant',
          participantName: 'User-' + Math.random().toString(36).substring(7)
        })
      })

      console.log('🟢 Token response:', res.status)
      const data = await res.json()
      console.log('🟢 Token received:', data.token ? 'YES' : 'NO')
      console.log('🟢 LiveKit URL:', process.env.NEXT_PUBLIC_LIVEKIT_URL)

      setToken(data.token)
      setUrl(data.serverUrl)
      setConnected(true)
      console.log('✅ Connection setup complete')
    } catch (error) {
      console.error('❌ Connection error:', error)
      alert('Connection failed. Please check if your LiveKit API Keys are set in .env.local')
    } finally {
      setLoading(false)
    }
  }

  if (!connected) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
          <div className="fixed inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#26D4C410_1px,transparent_1px),linear-gradient(to_bottom,#26D4C410_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(38,212,196,0.15), transparent 50%)`
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative text-center"
          >
            <div className="text-8xl mb-6">🤖</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              AI Voice Assistant
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Connect to start a voice conversation with my AI assistant
            </p>
            <motion.button
              onClick={connectToRoom}
              disabled={loading}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(38,212,196,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-[#26D4C4] text-black rounded-xl font-bold text-xl shadow-lg shadow-[#26D4C4]/20 disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Start Voice Assistant'}
            </motion.button>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <LiveKitRoom
        token={token}
        serverUrl={url}
        connect={true}
        audio={true}
      >
        <ConnectedVoiceInterface />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </>
  )
}