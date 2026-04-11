export type PerformanceLevel = 'high' | 'medium' | 'low' | 'potato';

export enum GestureType {
    IDLE = 'idle',
    SCROLL_UP = 'scroll_up',
    SCROLL_DOWN = 'scroll_down',
    CLICK = 'click',
    PEACE_SIGN = 'peace_sign',
    THUMBS_UP = 'thumbs_up'
}

export interface SkillNode {
    id: string;
    name: string;
    displayName: string;
    category: 'language' | 'framework' | 'tool' | 'ai' | 'project';
    position: [number, number, number];
    connections: string[];
    color: string; // hex
    description: string;
    proficiency: number; // 0-100
    metadata?: {
        yearsOfExperience?: number;
        projectCount?: number;
        url?: string;
    };
}

export interface HandLandmark {
    x: number;
    y: number;
    z: number;
}
