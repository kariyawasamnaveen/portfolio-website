'use client';

import { usePortfolioStore } from '@/lib/stores/portfolioStore';
import { motion } from 'framer-motion';

export function FeatureToggles() {
    const {
        toggle3DNetwork,
        toggleGestureMode,
        is3DNetworkEnabled,
        isGestureModeEnabled,
        togglePerformanceMonitor,
        showPerformanceMonitor
    } = usePortfolioStore();

    return (
        <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 pointer-events-auto">
            <Tooltip text="Toggle 3D Background">
                <button
                    onClick={toggle3DNetwork}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg border border-white/10 ${is3DNetworkEnabled ? 'bg-blue-600 text-white' : 'bg-black/50 text-gray-400 hover:bg-gray-800'}`}
                >
                    3D
                </button>
            </Tooltip>

            <Tooltip text="Toggle Hand Gestures">
                <button
                    onClick={toggleGestureMode}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg border border-white/10 ${isGestureModeEnabled ? 'bg-green-600 text-white' : 'bg-black/50 text-gray-400 hover:bg-gray-800'}`}
                >
                    👋
                </button>
            </Tooltip>

            <Tooltip text="Show FPS">
                <button
                    onClick={togglePerformanceMonitor}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg border border-white/10 ${showPerformanceMonitor ? 'bg-purple-600 text-white' : 'bg-black/50 text-gray-400 hover:bg-gray-800'}`}
                >
                    ⚡
                </button>
            </Tooltip>
        </div>
    );
}

function Tooltip({ text, children }: { text: string, children: React.ReactNode }) {
    return (
        <div className="group relative flex items-center">
            <div className="absolute right-full mr-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {text}
            </div>
            {children}
        </div>
    );
}
