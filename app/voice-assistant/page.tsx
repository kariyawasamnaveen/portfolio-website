'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function VoiceAssistantPage() {
  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md space-y-6"
      >
        <div className="text-6xl">🚀</div>
        <h1 className="text-3xl font-bold">Voice Assistant Optimized</h1>
        <p className="text-gray-400">
          This feature has been disabled in the current "Ultra-Light" mode to ensure maximum website performance and loading speed.
        </p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[#26D4C4] text-black rounded-lg font-bold"
          >
            Go Back Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}