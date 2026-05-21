'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function IdentityMaskHero() {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springX = useSpring(mouseX, { stiffness: 100, damping: 20 })
    const springY = useSpring(mouseY, { stiffness: 100, damping: 20 })

    // Create the clipPath string from motion values
    const clipPath = useTransform(
        [springX, springY],
        ([x, y]) => `circle(150px at ${x}px ${y}px)`
    )

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    return (
        <section className="relative h-screen w-full flex items-center justify-center bg-background overflow-hidden noise-overlay">
            {/* Background Image Layer */}
            <motion.div 
                className="absolute inset-0 z-0 opacity-20 grayscale pointer-events-none"
                style={{
                    backgroundImage: 'url("/projects/fantasy-football.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Content Layer */}
            <div className="relative z-10 w-full text-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center"
                >
                    <h1 className="kinetic-text text-[15vw] md:text-[20vw] select-none cursor-default leading-none">
                        <span className="relative inline-block">
                            NAVEEN
                            <motion.span 
                                className="absolute inset-0 text-white mix-blend-difference"
                                style={{
                                    clipPath: clipPath,
                                    WebkitClipPath: clipPath,
                                }}
                            >
                                NAVEEN
                            </motion.span>
                        </span>
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-12 space-y-4"
                    >
                        <p className="text-xs md:text-sm tracking-[0.8em] text-white/40 uppercase font-bold">
                            AI Engineer • Flutter Specialist • Digital Artist
                        </p>
                        <div className="flex justify-center gap-12 pt-12">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Scroll to Journey</span>
                                <motion.div 
                                    animate={{ height: [40, 80, 40] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-px bg-gradient-to-b from-[#26D4C4] to-transparent"
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Mouse Glow (Subtle) */}
            <motion.div 
                className="fixed top-0 left-0 w-[800px] h-[800px] bg-[#26D4C4]/10 rounded-full blur-[120px] pointer-events-none -z-10"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%'
                }}
            />
        </section>
    )
}
