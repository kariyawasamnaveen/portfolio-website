'use client';

import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';
import { GestureRecognizer } from '@/lib/utils/gestureRecognition';
import { GestureType } from '@/lib/types';
import toast from 'react-hot-toast';

// Helper to log to terminal
const logToTerminal = (message: string, data?: any) => {
    fetch('/api/debug-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ component: 'GestureController', message, data })
    }).catch(() => { });
};

export function GestureController() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
    const recognizer = useRef(new GestureRecognizer());
    const {
        isGestureModeEnabled,
        toggleGestureMode,
        updateGesture,
        updateCursorPosition,
        setCameraPermission
    } = usePortfolioStore();

    useEffect(() => {
        logToTerminal(`Gesture Mode is: ${isGestureModeEnabled ? 'ENABLED' : 'DISABLED'}`);

        if (!isGestureModeEnabled) {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(t => t.stop());
                videoRef.current.srcObject = null;
            }
            return;
        }

        // 1. Initialize HandLandmarker
        const initLandmarker = async () => {
            try {
                logToTerminal('Initializing MediaPipe HandLandmarker...');
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
                );
                const landmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
                        delegate: 'GPU',
                    },
                    runningMode: 'VIDEO',
                    numHands: 1
                });
                setHandLandmarker(landmarker);
                logToTerminal('MediaPipe Initialized Successfully');
            } catch (e: any) {
                console.error('Failed to init MediaPipe:', e);
                logToTerminal('FATAL ERROR: Failed to init MediaPipe', e.message);
                toast.error('Failed to load gesture AI');
                toggleGestureMode();
            }
        };

        initLandmarker();

        return () => { }
    }, [isGestureModeEnabled, toggleGestureMode]);

    // 2. Start Camera when landmarker is ready
    useEffect(() => {
        if (!handLandmarker || !isGestureModeEnabled) return;

        const startCam = async () => {
            try {
                logToTerminal('Requesting Camera Access...');
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: 'user' }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play(); // FORCE PLAY
                    setCameraPermission('granted');
                    toast.success('Gesture Control Active! 👋');
                    logToTerminal('Camera Access GRANTED and Stream Started');
                }
            } catch (err: any) {
                console.error('Camera error', err);
                logToTerminal('Camera Access DENIED or Error', err.message);
                setCameraPermission('denied');
                toast.error('Camera denied. Cannot use gestures.');
                toggleGestureMode();
            }
        };

        startCam();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(t => t.stop());
            }
        }
    }, [handLandmarker, isGestureModeEnabled, setCameraPermission, toggleGestureMode]);

    // 3. Detection Loop
    useEffect(() => {
        if (!handLandmarker || !videoRef.current) return;

        let rafId: number;
        let lastTime = -1;
        let lastLoggedGesture = GestureType.IDLE;
        let frameCount = 0;

        const detect = async () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                frameCount++;
                if (videoRef.current.currentTime !== lastTime) {
                    lastTime = videoRef.current.currentTime;
                    try {
                        const results = handLandmarker.detectForVideo(videoRef.current, Date.now());

                        // Debug: Log loop activity every 200 frames to prove it runs
                        if (frameCount % 200 === 0) {
                            logToTerminal(`Loop Active. Hands found: ${results.landmarks.length}`);
                        }

                        // Always draw debug info
                        if (canvasRef.current) {
                            const ctx = canvasRef.current.getContext('2d');
                            if (ctx) {
                                // Match canvas size roughly
                                canvasRef.current.width = videoRef.current.videoWidth || 320;
                                canvasRef.current.height = videoRef.current.videoHeight || 240;

                                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                                ctx.save();
                                ctx.scale(-1, 1);
                                ctx.translate(-canvasRef.current.width, 0);

                                if (results.landmarks && results.landmarks[0]) {
                                    // Found Hand
                                    const landmarks = results.landmarks[0];
                                    ctx.fillStyle = '#00ff00';
                                    landmarks.forEach(lm => {
                                        ctx.beginPath();
                                        ctx.arc(lm.x * canvasRef.current!.width, lm.y * canvasRef.current!.height, 4, 0, 2 * Math.PI);
                                        ctx.fill();
                                    });
                                }
                                ctx.restore();

                                // Draw Status Text (Not mirrored)
                                ctx.fillStyle = results.landmarks.length > 0 ? '#00ff00' : '#ff0000';
                                ctx.font = '16px monospace';
                                ctx.fillText(results.landmarks.length > 0 ? 'HAND DETECTED' : 'SEARCHING...', 10, 30);
                            }
                        }

                        if (results.landmarks && results.landmarks[0]) {
                            const landmarks = results.landmarks[0];
                            const indexTip = landmarks[8];

                            // Mirror X
                            const curX = (1 - indexTip.x) * window.innerWidth;
                            const curY = indexTip.y * window.innerHeight;

                            updateCursorPosition(curX, curY);

                            const gesture = recognizer.current.recognize(landmarks);
                            updateGesture(gesture);

                            if (gesture !== lastLoggedGesture && gesture !== GestureType.IDLE) {
                                logToTerminal(`Gesture Detected: ${gesture}`);
                                lastLoggedGesture = gesture;
                            }

                            // Trigger Actions
                            if (gesture !== GestureType.IDLE) {
                                const state = usePortfolioStore.getState();

                                if (gesture === GestureType.CLICK) {
                                    const el = document.elementFromPoint(state.gestureCursorPosition.x, state.gestureCursorPosition.y);
                                    if (el) {
                                        // logToTerminal('Clicking element', el.tagName);
                                        el.dispatchEvent(new MouseEvent('click', {
                                            view: window,
                                            bubbles: true,
                                            cancelable: true,
                                            clientX: state.gestureCursorPosition.x,
                                            clientY: state.gestureCursorPosition.y
                                        }));
                                    }
                                } else if (gesture === GestureType.SCROLL_UP) {
                                    logToTerminal('Scrolling UP');
                                    window.scrollBy({ top: -200, behavior: 'smooth' });
                                } else if (gesture === GestureType.SCROLL_DOWN) {
                                    logToTerminal('Scrolling DOWN');
                                    window.scrollBy({ top: 200, behavior: 'smooth' });
                                } else if (gesture === GestureType.PEACE_SIGN) {
                                    logToTerminal('Peace Sign Detected - Stopping');
                                    toast('Gesture Mode Disabled', { icon: '✌️' });
                                    toggleGestureMode();
                                }
                            }
                        }
                    } catch (err: any) {
                        console.error("Detection Error", err);
                    }
                }
            }
            rafId = requestAnimationFrame(detect);
        };

        detect();
        return () => cancelAnimationFrame(rafId);
    }, [handLandmarker, updateCursorPosition, updateGesture, toggleGestureMode]);

    // 4. Debug / Visualization Canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !videoRef.current || !handLandmarker) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw loop for debug overlay
        let rafId: number;
        const drawDebug = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                // Match canvas size to video
                canvas.width = videoRef.current.videoWidth || 320;
                canvas.height = videoRef.current.videoHeight || 240;

                // Draw Tracked Landmarks
                // We use the results from the detection loop, but we need to access them.
                // Since detection loop is separate, we can just re-detect or share state.
                // For simplicity/performance, let's move the draw logic INTO the detect loop if possible
                // or just draw the tracking points if we save them to a ref.
            }
            // actually, simpler to keep video hidden (opacity 0) and just show a "Preview" if user wants?
            // The USER said "add debug prints". 
            // Better approach: Let's remove 'hidden' and make it a small PIP window in the corner.
        };
    }, []);

    // Function to draw landmarks on the debug canvas
    const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
        // Simple skeleton
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#ff0000';

        for (const point of landmarks) {
            const x = point.x * ctx.canvas.width;
            const y = point.y * ctx.canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    };

    return (
        <>
            {/* 
               CRITICAL FIX: Video must NOT be 'hidden' (display: none) or detection fails.
               We use opacity-0 z-[-1] to hide it from view but keep it in DOM render tree.
               OR we show it as a small debug window.
            */}
            <video
                ref={videoRef}
                className={`fixed bottom-4 right-4 w-64 h-48 object-cover rounded-lg border-2 border-green-500 z-[60] transition-opacity duration-300 ${usePortfolioStore.getState().isGestureModeEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                autoPlay
                playsInline
                muted
            />
            {/* Debug Overlay Canvas on top of video */}
            <canvas
                ref={canvasRef}
                className={`fixed bottom-4 right-4 w-64 h-48 z-[61] pointer-events-none ${usePortfolioStore.getState().isGestureModeEnabled ? 'opacity-100' : 'opacity-0'}`}
            />
        </>
    );
}
