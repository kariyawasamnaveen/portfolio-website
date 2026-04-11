'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

interface TranscriptDisplayProps {
  conversation: Message[]
  isSpeaking: boolean
}

export default function TranscriptDisplay({ conversation, isSpeaking }: TranscriptDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation])

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <h3 className="text-xl font-bold text-white">Conversation</h3>
        {isSpeaking && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-2 text-[#26D4C4] text-sm"
          >
            <div className="w-2 h-2 bg-[#26D4C4] rounded-full" />
            AI is typing...
          </motion.div>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2"
      >
        <AnimatePresence>
          {conversation.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[#26D4C4] text-black rounded-br-none'
                    : 'bg-white/10 text-white rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold opacity-70">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {conversation.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Start a conversation by speaking or typing...
        </div>
      )}
    </div>
  )
}