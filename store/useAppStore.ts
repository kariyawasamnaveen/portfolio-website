import { create } from 'zustand';
import { Project } from '@/data/projects';

export type Zone = 'identity' | 'logic' | 'projects' | 'impact' | 'connect';
export type TechId = 'flutter' | 'react' | 'node' | 'python' | 'agentic' | 'edge' | 'healing' | 'zerotrust' | 'web3' | 'cicd' | null;

interface AppState {
    activeZone: Zone;
    setActiveZone: (zone: Zone) => void;

    isBotActive: boolean;
    setIsBotActive: (active: boolean) => void;

    isListening: boolean;
    isPttActive: boolean;
    setIsListening: (listening: boolean) => void;

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
}

export const useAppStore = create<AppState>((set) => ({
    activeZone: 'identity',
    setActiveZone: (zone) => set({ activeZone: zone }),

    isBotActive: true,
    setIsBotActive: (active) => set({ isBotActive: active }),

    isListening: false,
    isPttActive: false,
    setIsListening: (listening) => set({ isListening: listening }),

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
}));

