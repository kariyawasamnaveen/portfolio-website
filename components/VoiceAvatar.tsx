'use client'
import { motion } from 'framer-motion'


interface VoiceAvatarProps {
  isListening: boolean
  isSpeaking: boolean
}

export default function VoiceAvatar({ isListening, isSpeaking }: VoiceAvatarProps) {
  const particles = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Ring */}
      <motion.div
        animate={{
          rotate: 360,
          scale: isListening ? 1.1 : isSpeaking ? 1.05 : 1
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.5 }
        }}
        className="absolute inset-0 rounded-full border-2 border-[#26D4C4]/30"
      />

      {/* Middle Ring */}
      <motion.div
        animate={{
          rotate: -360,
          scale: isListening ? 1.15 : isSpeaking ? 1.1 : 1
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.5 }
        }}
        className="absolute inset-4 rounded-full border border-[#26D4C4]/20"
      />

      {/* Particles */}
      {(isListening || isSpeaking) && particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#26D4C4] rounded-full"
          animate={{
            x: [0, Math.cos(i * 18 * Math.PI / 180) * 100],
            y: [0, Math.sin(i * 18 * Math.PI / 180) * 100],
            opacity: [1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}

      {/* Core Orb */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.2, 1] : isSpeaking ? [1, 1.1, 1] : 1,
          boxShadow: isListening
            ? ['0 0 60px rgba(38,212,196,0.6)', '0 0 100px rgba(38,212,196,0.8)', '0 0 60px rgba(38,212,196,0.6)']
            : isSpeaking
              ? ['0 0 40px rgba(38,212,196,0.5)', '0 0 80px rgba(38,212,196,0.7)', '0 0 40px rgba(38,212,196,0.5)']
              : '0 0 30px rgba(38,212,196,0.4)'
        }}
        transition={{
          scale: { duration: 1, repeat: Infinity },
          boxShadow: { duration: 1.5, repeat: Infinity }
        }}
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#26D4C4] to-white flex items-center justify-center"
      >
        {/* Inner Glow */}
        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="text-4xl"
          >
            {isListening ? '🎤' : isSpeaking ? '🔊' : '🤖'}
          </motion.div>
        </div>
      </motion.div>

      {/* Waveform */}
      {isSpeaking && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-1">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: [8, 32, 8]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
              className="w-1 bg-[#26D4C4] rounded-full"
            />
          ))}
        </div>
      )}

      {/* Status Text */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm font-medium text-[#26D4C4]"
        >
          {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
        </motion.p>
      </div>
    </div>
  )
}