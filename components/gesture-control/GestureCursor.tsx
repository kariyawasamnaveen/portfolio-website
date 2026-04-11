'use client';

import { motion } from 'framer-motion';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';
import { GestureType } from '@/lib/types';

export function GestureCursor() {
    const { isGestureModeEnabled, gestureCursorPosition, currentGesture } = usePortfolioStore();

    if (!isGestureModeEnabled) return null;

    // Different cursor styles based on gesture
    const isClicking = currentGesture === GestureType.CLICK;
    const isScrolling = currentGesture === GestureType.SCROLL_UP || currentGesture === GestureType.SCROLL_DOWN;

    return (
        <>
            {/* Main Cursor */}
            <motion.div
                className="fixed z-[100] w-6 h-6 border-2 border-green-500 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.5)]"
                animate={{
                    x: gestureCursorPosition.x,
                    y: gestureCursorPosition.y,
                    scale: isClicking ? 0.8 : 1,
                    borderColor: isClicking ? '#3b82f6' : '#22c55e', // blue when click, green otherwise
                }}
                transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 300,
                    mass: 0.2
                }}
            >
                <div className={`w-2 h-2 rounded-full ${isClicking ? 'bg-blue-500' : 'bg-green-500'}`} />
            </motion.div>

            {/* Gesture feedback label */}
            {currentGesture !== GestureType.IDLE && (
                <motion.div
                    className="fixed z-[100] pointer-events-none text-white text-xs font-bold uppercase tracking-wider backdrop-blur px-2 py-1 rounded bg-black/50"
                    animate={{
                        x: gestureCursorPosition.x + 20,
                        y: gestureCursorPosition.y + 20,
                    }}
                >
                    {currentGesture.replace(/_/g, ' ')}
                </motion.div>
            )}
        </>
    );
}
