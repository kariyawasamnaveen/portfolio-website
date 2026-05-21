'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
    const [phase, setPhase] = useState<'bloom' | 'hold' | 'fade'>('bloom')

    useEffect(() => {
        // Timeline
        const timer1 = setTimeout(() => setPhase('hold'), 1000) // Bloom takes 1s
        const timer2 = setTimeout(() => setPhase('fade'), 2500) // Hold for 1.5s
        const timer3 = setTimeout(() => onLoadingComplete(), 3500) // Fade takes 1s

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
        }
    }, [onLoadingComplete])

    return (
        <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                {phase !== 'fade' ? (
                    <motion.div
                        key="logo-container"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1,
                        }}
                        exit={{ 
                            scale: [1, 1.1, 0.9, 1.2, 0],
                            opacity: 0,
                            filter: [
                                "contrast(1) brightness(1) blur(0px)",
                                "contrast(2) brightness(1.5) blur(2px)",
                                "contrast(5) brightness(2) blur(10px)",
                                "contrast(0) brightness(0) blur(20px)"
                            ],
                            x: [0, -10, 15, -5, 0],
                            y: [0, 5, -10, 8, 0],
                        }}
                        transition={{ 
                            duration: 1,
                            ease: "circOut",
                            exit: { duration: 0.8, ease: "easeInOut" }
                        }}
                        className="relative"
                    >
                        <img 
                            src="/logo-kariyawasam.jpg" 
                            alt="Logo" 
                            className="w-32 h-32 md:w-48 md:h-48 object-contain mix-blend-screen contrast-150"
                            style={{ 
                                clipPath: 'circle(45% at center)',
                                WebkitClipPath: 'circle(45% at center)'
                            }}
                        />
                    </motion.div>
                ) : (
                    /* Chaotic fragment particles for the "unorganized" look */
                    <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                                animate={{ 
                                    opacity: 0, 
                                    scale: 0, 
                                    x: (Math.random() - 0.5) * 400, 
                                    y: (Math.random() - 0.5) * 400,
                                    rotate: Math.random() * 360
                                }}
                                transition={{ duration: 0.6, delay: Math.random() * 0.3 }}
                                className="absolute w-4 h-4 bg-blue-500/30 blur-sm"
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
