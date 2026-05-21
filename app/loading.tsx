'use client'
import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Rings */}
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 rounded-full border-t-2 border-[#26D4C4] shadow-[0_0_15px_#26D4C4]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-r-2 border-purple-500 shadow-[0_0_15px_#a855f7]"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-b-2 border-blue-500 shadow-[0_0_15px_#3b82f6]"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Loading Text */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/80 font-medium tracking-[0.3em] text-sm uppercase"
        >
          Loading
        </motion.div>
      </div>
    </div>
  )
}
