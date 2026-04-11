import { SkillNode, PerformanceLevel } from '@/lib/types';

export const skillsData: SkillNode[] = [
    // Languages
    {
        id: 'dart',
        name: 'Dart',
        displayName: 'Dart',
        category: 'language',
        position: [0, 0, 0],
        connections: ['flutter'],
        color: '#0175C2',
        description: 'Language for Flutter',
        proficiency: 95
    },
    {
        id: 'python',
        name: 'Python',
        displayName: 'Python',
        category: 'language',
        position: [-3, 1, -2],
        connections: ['tensorflow', 'opencv'],
        color: '#3776AB',
        description: 'AI & Backend',
        proficiency: 90
    },
    {
        id: 'js',
        name: 'Javascript',
        displayName: 'JS',
        category: 'language',
        position: [2, -1, 2],
        connections: ['react', 'node'],
        color: '#F7DF1E',
        description: 'Web Essentials',
        proficiency: 88
    },
    {
        id: 'ts',
        name: 'TypeScript',
        displayName: 'TS',
        category: 'language',
        position: [2.5, 0, 1.5],
        connections: ['react', 'next'],
        color: '#3178C6',
        description: 'Type Safety',
        proficiency: 85
    },
    // Frameworks
    {
        id: 'flutter',
        name: 'Flutter',
        displayName: 'Flutter',
        category: 'framework',
        position: [0, 2, -1],
        connections: ['dart', 'firebase'],
        color: '#02569B',
        description: 'Cross-platform',
        proficiency: 95
    },
    {
        id: 'react',
        name: 'React',
        displayName: 'React',
        category: 'framework',
        position: [2, 1, 2],
        connections: ['js', 'ts', 'next'],
        color: '#61DAFB',
        description: 'UI Library',
        proficiency: 85
    },
    {
        id: 'next',
        name: 'Next.js',
        displayName: 'Next.js',
        category: 'framework',
        position: [3, 2, 1],
        connections: ['react'],
        color: '#000000',
        description: 'React Framework',
        proficiency: 80
    },
    {
        id: 'node',
        name: 'Node.js',
        displayName: 'Node.js',
        category: 'tool',
        position: [4, -1, 3],
        connections: ['js'],
        color: '#339933',
        description: 'Backend Runtime',
        proficiency: 75
    },
    // Tools
    {
        id: 'firebase',
        name: 'Firebase',
        displayName: 'Firebase',
        category: 'tool',
        position: [1, 3, -1],
        connections: ['flutter'],
        color: '#FFCA28',
        description: 'BaaS',
        proficiency: 85
    },
    {
        id: 'git',
        name: 'Git',
        displayName: 'Git',
        category: 'tool',
        position: [-1, -2, 1],
        connections: ['github'],
        color: '#F05032',
        description: 'Version Control',
        proficiency: 90
    },
    {
        id: 'github',
        name: 'GitHub',
        displayName: 'GitHub',
        category: 'tool',
        position: [-1.5, -3, 1],
        connections: ['git'],
        color: '#181717',
        description: 'Collaboration',
        proficiency: 90
    },
    {
        id: 'docker',
        name: 'Docker',
        displayName: 'Docker',
        category: 'tool',
        position: [5, -2, 0],
        connections: ['node'],
        color: '#2496ED',
        description: 'Containerization',
        proficiency: 65
    },
    // AI
    {
        id: 'tensorflow',
        name: 'TensorFlow',
        displayName: 'TensorFlow',
        category: 'ai',
        position: [-2, -1, -3],
        connections: ['python', 'keras'],
        color: '#FF6F00',
        description: 'ML Framework',
        proficiency: 75
    },
    {
        id: 'keras',
        name: 'Keras',
        displayName: 'Keras',
        category: 'ai',
        position: [-2.5, -0.5, -3.5],
        connections: ['tensorflow'],
        color: '#D00000',
        description: 'Deep Learning',
        proficiency: 75
    },
    {
        id: 'opencv',
        name: 'OpenCV',
        displayName: 'OpenCV',
        category: 'ai',
        position: [-3, -2, -2],
        connections: ['python'],
        color: '#5C3EE8',
        description: 'Computer Vision',
        proficiency: 80
    },
    {
        id: 'mediapipe',
        name: 'MediaPipe',
        displayName: 'MediaPipe',
        category: 'ai',
        position: [-1, 3, -2],
        connections: ['vision'],
        color: '#009688',
        description: 'ML Solutions',
        proficiency: 70
    },
    {
        id: 'pytorch',
        name: 'PyTorch',
        displayName: 'PyTorch',
        category: 'ai',
        position: [-4, 0, -3],
        connections: ['python'],
        color: '#EE4C2C',
        description: 'ML Framework',
        proficiency: 60
    },
    // Projects/Hubs
    {
        id: 'vision',
        name: 'Computer Vision',
        displayName: 'Comp Vision',
        category: 'project',
        position: [-2, 4, -3],
        connections: ['opencv', 'mediapipe'],
        color: '#9C27B0',
        description: 'Vision Projects',
        proficiency: 85
    },
    {
        id: 'mobile',
        name: 'Mobile Application Development',
        displayName: 'Mobile Apps',
        category: 'project',
        position: [1, 5, -1],
        connections: ['flutter'],
        color: '#4CAF50',
        description: 'App Projects',
        proficiency: 90
    },
    {
        id: 'web',
        name: 'Web Development',
        displayName: 'Web Dev',
        category: 'project',
        position: [4, 3, 2],
        connections: ['react', 'next'],
        color: '#2196F3',
        description: 'Web Projects',
        proficiency: 80
    },
];

export function getSkillsForPerformance(level: PerformanceLevel): SkillNode[] {
    const counts = { high: 20, medium: 15, low: 10, potato: 0 };
    return skillsData.slice(0, counts[level]);
}
