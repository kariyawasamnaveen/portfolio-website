import { useEffect } from 'react';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';

export function usePerformanceMonitor() {
    const updateFPS = usePortfolioStore(s => s.updateFPS);
    useEffect(() => {
        let frames = 0, lastTime = performance.now();
        let rafId: number;

        const loop = () => {
            frames++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                updateFPS(Math.round(frames * 1000 / (now - lastTime)));
                frames = 0; lastTime = now;
            }
            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, [updateFPS]);
}
