import { create } from 'zustand';
import { Project } from '@/data/projects';

export type Zone = 'identity' | 'logic' | 'projects' | 'impact' | 'connect';
export type TechId = 'flutter' | 'react' | 'node' | 'python' | 'agentic' | 'edge' | 'healing' | 'zerotrust' | 'web3' | 'cicd' | null;

export interface HistorySnapshot {
    route: string;
    zone: Zone;
    projectOpen: string | null;
    highlight: string | null;
}

interface AppState {
    activeZone: Zone;
    setActiveZone: (zone: Zone) => void;

    isBotActive: boolean;
    setIsBotActive: (active: boolean) => void;

    isListening: boolean;
    isPttActive: boolean;
    setIsListening: (listening: boolean) => void;
    setIsPttActive: (active: boolean) => void;

    isSpeaking: boolean;
    setIsSpeaking: (speaking: boolean) => void;

    activeTech: TechId;
    setActiveTech: (tech: TechId) => void;

    isAnalyzing: boolean;
    setIsAnalyzing: (analyzing: boolean) => void;

    showHint: boolean;
    setShowHint: (show: boolean) => void;

    selectedProject: Project | null;
    setSelectedProject: (project: Project | null) => void;

    codeHighlight: string | null;
    setCodeHighlight: (h: string | null) => void;

    contactForm: { email: string; message: string };
    setContactForm: (form: { email: string; message: string } | ((prev: { email: string; message: string }) => { email: string; message: string })) => void;

    globalSpeak: (text: string) => void;
    hasSeenLoadingScreen: boolean;
    setHasSeenLoadingScreen: (seen: boolean) => void;
    setGlobalSpeak: (fn: (text: string) => void) => void;

    historyStack: HistorySnapshot[];
    pushHistory: (snapshot: HistorySnapshot) => void;
    popHistory: () => HistorySnapshot | null;
}

export const useAppStore = create<AppState>((set) => ({
    activeZone: 'identity',
    setActiveZone: (zone) => set({ activeZone: zone }),

    isBotActive: true,
    setIsBotActive: (active) => set({ isBotActive: active }),

    isListening: false,
    isPttActive: false,
    setIsListening: (listening) => set({ isListening: listening }),
    setIsPttActive: (active) => set({ isPttActive: active }),

    isSpeaking: false,
    setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),

    activeTech: null,
    setActiveTech: (tech) => set({ activeTech: tech }),

    isAnalyzing: false,
    setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

    showHint: false,
    setShowHint: (show) => set({ showHint: show }),

    selectedProject: null,
    setSelectedProject: (project) => set({ selectedProject: project }),

    codeHighlight: null,
    setCodeHighlight: (h) => set({ codeHighlight: h }),

    contactForm: { email: '', message: '' },
    setContactForm: (form) => set((state) => ({ 
        contactForm: typeof form === 'function' ? form(state.contactForm) : form 
    })),

    globalSpeak: () => {},
    hasSeenLoadingScreen: false,
    setHasSeenLoadingScreen: (seen) => set({ hasSeenLoadingScreen: seen }),
    setGlobalSpeak: (fn) => set({ globalSpeak: fn }),

    historyStack: [],
    pushHistory: (snapshot) => set((state) => {
        // Prevent pushing duplicate consecutive states
        const last = state.historyStack[state.historyStack.length - 1];
        if (last && last.route === snapshot.route && last.zone === snapshot.zone && last.projectOpen === snapshot.projectOpen && last.highlight === snapshot.highlight) {
            return state;
        }
        return { historyStack: [...state.historyStack, snapshot] };
    }),
    popHistory: () => {
        let popped: HistorySnapshot | null = null;
        set((state) => {
            if (state.historyStack.length === 0) return state;
            const newStack = [...state.historyStack];
            popped = newStack.pop() || null;
            return { historyStack: newStack };
        });
        return popped;
    },
}));

