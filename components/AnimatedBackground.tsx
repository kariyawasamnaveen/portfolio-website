'use client'

import { useState, useEffect, useRef } from 'react'

export default function AnimatedBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const ticking = useRef(false)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    setMousePosition({ x: e.clientX, y: e.clientY })
                    ticking.current = false
                })
                ticking.current = true
            }
        }

        // Add passive event listener for better performance
        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Static Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#26D4C410_1px,transparent_1px),linear-gradient(to_bottom,#26D4C410_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Dynamic Radial Gradient */}
            <div
                className="absolute inset-0 will-change-[background]"
                style={{
                    background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(38,212,196,0.15), transparent 50%)`
                }}
            />
        </div>
    )
}
