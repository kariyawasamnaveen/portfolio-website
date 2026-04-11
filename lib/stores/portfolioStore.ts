import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PerformanceLevel, GestureType } from '@/lib/types';

interface Store {
    performanceLevel: PerformanceLevel;
    autoPerformanceMode: boolean;
    currentFPS: number;
    is3DNetworkEnabled: boolean;
    isGestureModeEnabled: boolean;
    currentGesture: GestureType;
    gestureCursorPosition: { x: number; y: number };
    cameraPermission: 'granted' | 'denied' | 'prompt';
    showPerformanceMonitor: boolean;
    showWebcamPreview: boolean;

    updateFPS: (fps: number) => void;
    toggle3DNetwork: () => void;
    toggleGestureMode: () => void;
    updateCursorPosition: (x: number, y: number) => void;
    setCameraPermission: (status: 'granted' | 'denied' | 'prompt') => void;
    updateGesture: (gesture: GestureType) => void;
    togglePerformanceMonitor: () => void;
    toggleWebcamPreview: () => void;
    setPerformanceLevel: (level: PerformanceLevel) => void;
}

export const usePortfolioStore = create<Store>()(
    persist(
        (set, get) => ({
            performanceLevel: 'high',
            autoPerformanceMode: true,
            currentFPS: 60,
            is3DNetworkEnabled: true,
            isGestureModeEnabled: false,
            currentGesture: GestureType.IDLE,
            gestureCursorPosition: { x: 0, y: 0 },
            cameraPermission: 'prompt',
            showPerformanceMonitor: false,
            showWebcamPreview: true,

            updateFPS: (fps) => {
                if (get().autoPerformanceMode) {
                    let level: PerformanceLevel =
                        fps < 20 ? 'potato' : fps < 30 ? 'low' : fps < 45 ? 'medium' : 'high';
                    set({ currentFPS: fps, performanceLevel: level });
                } else {
                    set({ currentFPS: fps });
                }
            },

            toggle3DNetwork: () => set(s => ({ is3DNetworkEnabled: !s.is3DNetworkEnabled })),
            toggleGestureMode: () => set(s => ({ isGestureModeEnabled: !s.isGestureModeEnabled })),
            updateCursorPosition: (x, y) => set({ gestureCursorPosition: { x, y } }),
            setCameraPermission: (status) => set({ cameraPermission: status }),
            updateGesture: (gesture) => set({ currentGesture: gesture }),
            togglePerformanceMonitor: () => set(s => ({ showPerformanceMonitor: !s.showPerformanceMonitor })),
            toggleWebcamPreview: () => set(s => ({ showWebcamPreview: !s.showWebcamPreview })),
            setPerformanceLevel: (level) => set({ performanceLevel: level }),
        }),
        { name: 'portfolio-prefs' }
    )
);
