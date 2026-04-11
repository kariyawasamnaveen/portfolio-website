'use client';

import { usePerformanceMonitor } from '@/lib/hooks/usePerformanceMonitor';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';

export function PerformanceMonitor() {
    usePerformanceMonitor(); // Activates logic
    const { currentFPS, performanceLevel, showPerformanceMonitor } = usePortfolioStore();

    if (!showPerformanceMonitor) return null; // Or a small toggle

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur text-green-400 text-xs p-2 rounded-lg font-mono border border-gray-800 pointer-events-none select-none">
            <div className="font-bold flex items-center gap-2">
                <span className={currentFPS < 30 ? 'text-red-500' : 'text-green-500'}>
                    ●
                </span>
                {currentFPS} FPS
            </div>
            <div className="text-gray-400 mt-1 capitalize">
                Quality: {performanceLevel}
            </div>
        </div>
    );
}
