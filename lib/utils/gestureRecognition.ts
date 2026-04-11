import { GestureType, HandLandmark } from '@/lib/types';

export class GestureRecognizer {
    private lastGestureTime = 0;
    private readonly cooldown = 600; // ms
    private palmHistory: { y: number, t: number }[] = [];

    recognize(landmarks: HandLandmark[]): GestureType {
        if (!landmarks || Date.now() - this.lastGestureTime < this.cooldown)
            return GestureType.IDLE;

        // Key landmarks mapping: 0=Wrist, 4=ThumbTip, 8=IndexTip, 5=IndexBase
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const indexBase = landmarks[5];
        const middleTip = landmarks[12];
        const middleBase = landmarks[9];
        const ringTip = landmarks[16];
        const ringBase = landmarks[13];
        // pinkyTip = 20, pinkyBase = 17

        const now = Date.now();

        // 1. Pinch Gesture: Index + Thumb close
        const dist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
        if (dist < 0.04) {
            this.lastGestureTime = now;
            return GestureType.CLICK;
        }

        // 2. Peace Sign: Index+Middle UP, Ring+Pinky DOWN
        // Y grows downwards in screen coordinates usually, but check Mediapipe coords. 
        // Typically Y=0 top, Y=1 bottom. So smaller Y = higher up.
        if (indexTip.y < indexBase.y &&
            middleTip.y < middleBase.y &&
            ringTip.y > ringBase.y &&
            landmarks[20].y > landmarks[17].y // Pinky folded
        ) {
            this.lastGestureTime = now;
            return GestureType.PEACE_SIGN;
        }

        // 3. Scroll Logic: Track simple vertical movement of wrist
        this.palmHistory.push({ y: wrist.y, t: now });
        this.palmHistory = this.palmHistory.filter(p => now - p.t < 300); // Keep last 300ms

        if (this.palmHistory.length > 5) {
            const dy = this.palmHistory[this.palmHistory.length - 1].y - this.palmHistory[0].y;
            // dy < -0.15 means Y decreased significantly -> moving UP
            // dy > 0.15 means Y increased significantly -> moving DOWN

            // Logic: Hand moves UP -> Scroll UP (Window Y decreases)
            if (dy < -0.15) {
                this.palmHistory = [];
                this.lastGestureTime = now;
                return GestureType.SCROLL_UP; // Or SCROLL_DOWN depending on natural scrolling preference
            }
            if (dy > 0.15) {
                this.palmHistory = [];
                this.lastGestureTime = now;
                return GestureType.SCROLL_DOWN;
            }
        }

        return GestureType.IDLE;
    }
}
