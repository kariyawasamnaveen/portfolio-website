'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CentralPortalNav from '@/components/CentralPortalNav'
import LoadingScreen from '@/components/LoadingScreen'
import { 
    FiGithub, FiLinkedin, FiMail, FiCpu, FiLayers, FiZap, 
    FiCheckCircle, FiX, FiExternalLink, FiPlay, FiTarget, 
    FiShield, FiActivity, FiArrowLeft, FiImage, FiVideo, FiMaximize2 
} from 'react-icons/fi'

type Zone = 'identity' | 'projects' | 'logic' | 'connect'

interface Project {
    id: string;
    title: string;
    tagline: string;
    problem: string;
    solution: string;
    metrics: { label: string; value: string }[];
    tech: string[];
    video: string;
    images: string[];
    link: string;
    github?: string;
    role: string;
    deepDive?: {
        story: string;
        architecture: string;
        features: string[];
    };
}

const PROJECTS_DATA: Project[] = [
    {
        id: 'fantasy-ai',
        title: 'Fantasy AI',
        tagline: 'GPT-4 Video Synthesis',
        problem: 'Traditional video production is resource-intensive and slow, preventing rapid content iteration for creative teams.',
        solution: 'Developed an autonomous neural pipeline that synthesizes cinematic video content from text prompts in near real-time.',
        metrics: [
            { label: 'Processing Speed', value: '+340%' },
            { label: 'Cost Reduction', value: '85%' },
            { label: 'Output Fidelity', value: '4K/60fps' }
        ],
        tech: ['Python', 'OpenAI', 'Stable Diffusion', 'CUDA'],
        video: 'https://cdn.pixabay.com/video/2023/11/04/187702-881072973_large.mp4',
        images: [
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800'
        ],
        link: '#',
        github: '#',
        role: 'Lead AI Engineer'
    },
    {
        id: 'commish-ai',
        title: 'RecapAI',
        tagline: 'AI-Powered Fantasy Football Intelligence',
        problem: 'League commissioners spend hours manually gathering data and writing engaging weekly summaries for their fantasy football leagues.',
        solution: 'Built an AI-powered system that automatically fetches live league data and generates character-driven, narrative weekly recaps using LangChain and OpenAI.',
        metrics: [
            { label: 'Weekly Hours Saved', value: '15+' },
            { label: 'Automation', value: '100%' },
            { label: 'Persona Variations', value: 'Unlimited' }
        ],
        tech: ['Python', 'Streamlit', 'LangChain', 'Sleeper API'],
        video: '/projects/commish-ai/VEDIO_1.mov',
        images: [
            '/projects/commish-ai/commish-hero.png',
            '/projects/commish-ai/screenshot-1.png',
            '/projects/commish-ai/screenshot-2.png',
            '/projects/commish-ai/screenshot-3.png'
        ],
        link: '#',
        github: 'https://github.com/kariyawasamnaveen/fantasy-football-recap-demo',
        role: 'Full Stack AI Engineer',
        deepDive: {
            story: 'Fantasy football commissioners spend hours every week gathering data from Sleeper or ESPN, calculating stats, and writing engaging, trash-talk-filled weekly recaps for their leagues. I built Commish.ai to completely automate this process. It connects directly to the Sleeper API, pulls the latest weekly matchups, and feeds the data into a custom LangChain agent that generates highly personalized, character-driven weekly recaps (e.g. written in the style of Dwight Schrute or Snoop Dogg).',
            architecture: 'The system uses a streamlined architecture built entirely in Python using Streamlit for the frontend.\n\n1. Data Ingestion: The backend connects to the Sleeper API to fetch real-time roster, matchup, and scoring data. It processes this JSON data and maps players to their respective teams.\n\n2. AI Processing: The processed data is fed into a LangChain conversational agent powered by OpenAI. The agent uses custom prompt templates to analyze the matchups, identify the biggest blowouts or upsets, and generate a narrative summary injected with the chosen persona.\n\n3. Presentation: The Streamlit UI provides a simple, clean interface for commissioners to input their league ID, select a persona, and instantly generate the recap, saving them hours of manual work.',
            features: [
                'Live Data Fetching from Sleeper API',
                'Custom LLM Personas for engaging content',
                'Automated Matchup Analysis and Statistical Summaries',
                'Clean, responsive Streamlit User Interface'
            ]
        }
    },
    {
        id: 'estate-core',
        title: 'EstateCore',
        tagline: 'Neural Estate Intelligence',
        problem: 'Property managers in Kolkata struggle with high-volume, multilingual lead qualification and manual property damage assessment.',
        solution: 'Engineered a "Neural Concierge" using GPT-4 Vision and LangChain to automate lead capture, visual diagnosis, and communication in English, Hindi, and Bengali.',
        metrics: [
            { label: 'Response Latency', value: '< 1.5s' },
            { label: 'Lead Accuracy', value: '98%' },
            { label: 'Language Coverage', value: '100%' }
        ],
        tech: ['Node.js', 'Prisma', 'GPT-4 Vision', 'LangChain'],
        video: '/projects/contractor-ai/video_final.mp4',
        images: [
            '/projects/contractor-ai/hero.png',
            '/projects/contractor-ai/ss1.png',
            '/projects/contractor-ai/ss2.png',
            '/projects/contractor-ai/ss3.png',
            '/projects/contractor-ai/ss4.png'
        ],
        link: '#',
        github: 'https://github.com/kariyawasamnaveen/contractor-ai-backend',
        role: 'Lead Full Stack Engineer',
        deepDive: {
            story: 'The real estate renovation and contracting market in areas like Kolkata is intensely competitive and linguistically diverse. Local property managers and contractors were losing up to 40% of potential leads simply because they could not provide immediate, 24/7 responses in the client\'s native language (English, Hindi, or Bengali). Furthermore, the initial damage assessment phase was broken—clients would send low-quality images on WhatsApp, leading to inaccurate cost estimations. I architected EstateCore not just as a chatbot, but as an autonomous "Neural Concierge" designed to eliminate this friction entirely. It acts as the first line of interaction, diagnosing issues visually, conversing fluently in regional languages, and qualifying leads before a human ever steps in.',
            architecture: 'The system architecture is a highly decoupled, event-driven Node.js backend. At the edge, a lightweight, glassmorphic widget captures user intent and media payloads. \n\n1. Conversational Engine: Built utilizing LangChain, the system maintains stateful conversation memory, allowing the AI to remember context across multiple interactions. It dynamically detects the user\'s language and switches its NLP processing pipeline seamlessly.\n\n2. Vision Processing Pipeline: When a user uploads an image of property damage (e.g., a cracked wall or leaking pipe), the Node.js backend processes the file into a base64 buffer and securely routes it to the GPT-4 Vision API. The AI analyzes the structural integrity and outputs a preliminary diagnostic report directly into the chat.\n\n3. Data Persistence & Routing: A Prisma ORM layer sits atop a relational database, automatically extracting entities (Name, Phone Number, Service Intent) from the natural language flow. Once a lead is qualified, it triggers an asynchronous webhook to the Admin Dashboard.',
            features: [
                'Dynamic Language Detection & Switching (EN, HI, BN) via LangChain',
                'Zero-Shot Image Analysis using GPT-4 Vision capabilities',
                'Automated Entity Extraction (Name, Phone, Intent) from unstructured text',
                'Stateful Session Memory Management for contextual continuity',
                'Secure, rate-limited Node.js/Express API gateway',
                'Prisma-backed relational database for lead management'
            ]
        }
    },
    {
        id: 'bizlangai',
        title: 'BizLangAI',
        tagline: 'Enterprise Neural Knowledge Base',
        problem: 'Large enterprises waste time manually extracting metrics from complex M&A PDFs and logistics CSVs. Existing LLMs hallucinate or fail to plot complex data accurately.',
        solution: 'Built a robust FastAPI backend utilizing Pinecone and LangChain tool-calling to ensure 100% accurate data retrieval and dynamic chart generation.',
        metrics: [
            { label: 'Data Retrieval Time', value: '-98%' },
            { label: 'Chart Accuracy', value: '100%' },
            { label: 'Hallucinations', value: '0%' }
        ],
        tech: ['React', 'FastAPI', 'LangChain', 'Pandas'],
        video: '/projects/bizlangai/bizlangai-demo-video.mov',
        images: [
            '/projects/bizlangai/bizlangai-hero.png',
            '/projects/bizlangai/bizlangai-demo-1.png',
            '/projects/bizlangai/bizlangai-demo-2.png',
            '/projects/bizlangai/bizlangai-demo-3.png'
        ],
        link: '#',
        github: 'https://github.com/kariyawasamnaveen/bizlangai-frontend',
        role: 'Full Stack AI Engineer',
        deepDive: {
            story: 'Enterprise RAG systems often fail because they retrieve stale vectors from previous queries or cannot perform mathematical operations on tabular data. I designed BizLangAI to solve both issues. It strictly isolates document contexts by aggressively flushing the Pinecone vector database between sessions, ensuring zero cross-contamination. For tabular data, it bypasses standard RAG entirely.',
            architecture: 'The system uses a decoupled architecture with a React glassmorphism frontend and a FastAPI backend. \n\n1. Vector Pipeline: When a user uploads a PDF (like an M&A Due Diligence Report), the backend clears all existing vectors, chunks the new document, and stores it in Pinecone. This ensures absolute context purity.\n\n2. Dynamic Chart Generation: When a CSV is uploaded, the system switches from RAG to a LangChain Pandas DataFrame Agent. Using OpenAI\'s Tool Calling API, the agent autonomously writes and executes Matplotlib Python code in a secure sandbox, generates the chart, and serves it to the frontend.',
            features: [
                'Zero-Hallucination Vector Clearing Pipeline',
                'Autonomous Python Code Execution via LangChain Tool Calling',
                'Dynamic Matplotlib Chart Generation from CSVs',
                'Secure JWT Authentication and Session Management',
                'Responsive Glassmorphism UI tailored for Enterprise Dashboards'
            ]
        }
    },
    {
        id: 'heartsync',
        title: 'HeartSync Protocol',
        tagline: 'Cyber-Romantic Sync & Verification Hub',
        problem: 'Standard romantic surprise pages lack engaging tech aesthetics, interactivity, and security features suited for tech-forward couples.',
        solution: 'Built an interactive multi-phase React/Framer Motion application utilizing biometric validation simulations, 3D tilt polaroid rendering, and encrypted time calculation engines.',
        metrics: [
            { label: 'Timeline Locked', value: '100%' },
            { label: '3D Tilt Mechanics', value: '60fps' },
            { label: 'Encryption Status', value: 'Active' }
        ],
        tech: ['React', 'Framer Motion', 'TailwindCSS', 'Vite'],
        video: '/love_app/Screen Recording 2026-05-21 at 22.42.34.mov',
        images: [
            '/love_app/heartsync_cover.png',
            '/love_app/Screenshot 2026-05-21 at 22.33.31.png',
            '/love_app/Screenshot 2026-05-21 at 22.33.47.png',
            '/love_app/Screenshot 2026-05-21 at 22.33.58.png',
            '/love_app/Screenshot 2026-05-21 at 22.37.22.png',
            '/love_app/Screenshot 2026-05-21 at 22.37.57.png',
            '/love_app/Screenshot 2026-05-21 at 22.38.06.png'
        ],
        link: 'https://github.com/kariyawasamnaveen/valentine-surprise',
        github: 'https://github.com/kariyawasamnaveen/valentine-surprise',
        role: 'Creator & Lead Developer',
        deepDive: {
            story: 'Every developer wants to build something truly special and unique for their significant other. HeartSync Protocol is a fully interactive, cybersecurity-themed surprise portal created to celebrate our anniversary. Built with premium dark aesthetics, cybernetic grid interfaces, and custom physics animations, it guides the user through multi-phase sync processes, simulated biometric data scanning, and love node authorization, concluding with a fully interactive 3D Polaroid card and anniversary time counter.',
            architecture: 'The system features a lightweight single-page architectural design built with React, styled using custom TailwindCSS and modern typography.\n\n1. Simulated Security Layer: Employs standard console typewriter logs and interactive lock status widgets to gamify the user experience.\n\n2. Real-Time Duration Engine: Computes real-time precise millisecond durations to output the exact days elapsed since the relationship\'s establishment.\n\n3. 3D Tilt Graphics: Uses Framer Motion\'s useMotionValue, useSpring, and useTransform to track mouse movements on the viewport and tilt the Polaroid card dynamically in 3D space.',
            features: [
                'Multi-Phase Interactive Cyber-Romantic Gamification',
                '3D Tilt Polaroid Card using Spring Physics',
                'Simulated Biometric Data Authorization Node',
                'Interactive Console Logs & Particle Systems',
                'Responsive 100% Non-Scrollable UI layout design'
            ]
        }
    }
]

export default function Home() {
    const [activeZone, setActiveZone] = useState<Zone>('identity')
    const [showLoading, setShowLoading] = useState(true)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [expandedMedia, setExpandedMedia] = useState<{ type: 'video' | 'image', url: string } | null>(null)
    const [showDeepDive, setShowDeepDive] = useState(false)

    return (
        <>
            <AnimatePresence>
                {showLoading && (
                    <LoadingScreen onLoadingComplete={() => setShowLoading(false)} />
                )}
            </AnimatePresence>

            <motion.main 
                initial={{ opacity: 0 }}
                animate={{ opacity: showLoading ? 0 : 1 }}
                transition={{ duration: 1 }}
                className="viewport-container bg-[#050505] text-white min-h-screen h-screen relative overflow-hidden flex flex-col"
            >
                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 blur-[150px] rounded-full" />
                </div>

                {/* Header */}
                <header className="fixed top-0 left-0 w-full p-10 z-[100] flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full" />
                            <img src="/logo-kariyawasam.jpg" alt="Logo" className="relative h-12 w-12 object-cover rounded-full border border-amber-500/30 shadow-2xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-[0.5em] text-amber-500 uppercase leading-none mb-1">Architect</span>
                            <span className="text-sm font-bold tracking-tighter uppercase">Naveen.K</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full shadow-2xl">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]" />
                        <span className="text-[9px] font-black tracking-[0.3em] text-neutral-300 uppercase leading-none">Status: Live for Hire</span>
                    </div>
                </header>

                <CentralPortalNav activeZone={activeZone} onZoneChange={setActiveZone} />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-10 h-full flex items-center">
                    <AnimatePresence mode="wait">
                        {activeZone === 'identity' && (
                            <motion.div key="identity" className="grid lg:grid-cols-12 gap-12 items-center w-full">
                                <div className="lg:col-span-7 space-y-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-[2px] w-10 bg-amber-500" />
                                            <p className="text-[10px] font-black tracking-[0.6em] text-neutral-500 uppercase">Executive Dashboard</p>
                                        </div>
                                        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.85] uppercase">
                                            Naveen <br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 bg-[length:200%_auto] animate-shimmer">Sandeepa</span>
                                        </h1>
                                        <p className="text-xl text-neutral-400 max-w-xl font-medium leading-relaxed">
                                            Solving complex problems through scalable AI architectures and high-performance engineering.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'AI Logic', icon: <FiCpu />, val: '98%' },
                                            { label: 'Systems', icon: <FiLayers />, val: 'Elite' },
                                            { label: 'Velocity', icon: <FiZap />, val: 'Fast' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl group hover:border-amber-500/30 transition-all cursor-default">
                                                <div className="flex justify-between items-center mb-4 text-amber-500/50 group-hover:text-amber-500">
                                                    {stat.icon}
                                                    <span className="text-[8px] font-black uppercase tracking-widest">{stat.val}</span>
                                                </div>
                                                <p className="text-[10px] font-black tracking-widest uppercase text-neutral-500 group-hover:text-white">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-10">
                                        <button onClick={() => setActiveZone('projects')} className="px-12 py-5 bg-amber-600 hover:bg-amber-500 text-black rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all shadow-2xl transform hover:-translate-y-1">
                                            Explore Work
                                        </button>
                                        <div className="flex gap-6 border-l border-white/10 pl-10">
                                            <FiGithub className="text-neutral-600 hover:text-white cursor-pointer" size={20} />
                                            <FiLinkedin className="text-neutral-600 hover:text-white cursor-pointer" size={20} />
                                            <FiMail className="text-neutral-600 hover:text-white cursor-pointer" size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5 relative hidden lg:block">
                                    <div className="absolute inset-0 bg-amber-500/10 blur-[150px] rounded-full animate-pulse" />
                                    <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(245,158,11,0.15)]">
                                        <img src="/hero-premium.png" alt="Hero" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeZone === 'projects' && (
                            <motion.div key="projects" className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto px-10">
                                {PROJECTS_DATA.map((project) => (
                                    <motion.div 
                                        key={project.id} 
                                        whileHover={{ 
                                            y: -8, 
                                            scale: 1.01,
                                            boxShadow: "0 20px 40px -15px rgba(245, 158, 11, 0.15)"
                                        }}
                                        onClick={() => setSelectedProject(project)}
                                        className="relative aspect-video rounded-[32px] overflow-hidden border border-white/10 cursor-pointer group shadow-2xl transition-all duration-500"
                                    >
                                        {/* Brightened Overlay */}
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
                                        
                                        {project.images && project.images[0] && (
                                            <img 
                                                src={project.images[0]} 
                                                alt={project.title} 
                                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" 
                                            />
                                        )}
                                        
                                        {/* Premium Ambient Light */}
                                        <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700" />
                                        
                                        <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-[1px] w-8 bg-amber-500/50" />
                                                <span className="text-[8px] font-black tracking-[0.4em] text-amber-500 uppercase leading-none opacity-80">Narrative Grid</span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-tight text-white/90 group-hover:text-white transition-colors">{project.title}</h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.main>

            {/* Immersive Project Portal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black flex flex-col overflow-hidden h-screen">
                        <div className="absolute inset-0 bg-black">
                            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
                                <source src={selectedProject.video} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
                        </div>

                        <header className="relative z-10 p-10 flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <button 
                                    onClick={() => setSelectedProject(null)}
                                    className="bg-white/5 backdrop-blur-3xl px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3 text-[10px] font-black tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-2xl group"
                                >
                                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> BACK TO NEURAL GRID
                                </button>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase">Case Study Intelligence</span>
                                    <div className="h-4 w-[1px] bg-white/10" />
                                    <span className="text-sm font-bold uppercase tracking-tight text-white/90">{selectedProject.title}</span>
                                </div>
                            </div>
                        </header>

                        <div className="relative z-10 flex-1 flex items-center justify-center px-12 md:px-24">
                            <div className="max-w-7xl w-full grid lg:grid-cols-12 gap-16 items-center">
                                
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="space-y-4">
                                        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-amber-500 text-[10px] font-black tracking-[0.4em] uppercase block">{selectedProject.tagline}</motion.span>
                                        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{selectedProject.title}</motion.h2>
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl w-fit">
                                            <FiActivity className="text-amber-500" size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-200">Role: {selectedProject.role}</span>
                                        </motion.div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                                            <div className="flex items-center gap-3 text-amber-500/60">
                                                <FiTarget size={14} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Problem</span>
                                            </div>
                                            <p className="text-base text-neutral-400 font-medium leading-relaxed">{selectedProject.problem}</p>
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                                            <div className="flex items-center gap-3 text-emerald-500/60">
                                                <FiShield size={14} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Solution</span>
                                            </div>
                                            <p className="text-base text-neutral-200 font-medium leading-relaxed">{selectedProject.solution}</p>
                                        </motion.div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-6">
                                        {selectedProject.github && selectedProject.github !== '#' ? (
                                            <a 
                                                href={selectedProject.github} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-12 py-6 bg-white/5 backdrop-blur-3xl text-white rounded-2xl border border-white/10 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all shadow-2xl flex items-center gap-3 cursor-pointer group"
                                            >
                                                View Source Repository <FiGithub size={16} className="group-hover:scale-110 transition-transform" />
                                            </a>
                                        ) : (
                                            <button 
                                                disabled
                                                className="px-12 py-6 bg-white/5 backdrop-blur-3xl text-neutral-500 rounded-2xl border border-white/5 font-black uppercase text-[10px] tracking-widest cursor-not-allowed shadow-2xl flex items-center gap-3"
                                            >
                                                Private Repository <FiGithub size={16} />
                                            </button>
                                        )}
                                        
                                        {selectedProject.deepDive && (
                                            <button 
                                                onClick={() => setShowDeepDive(true)}
                                                className="px-12 py-6 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-2xl flex items-center gap-3 relative overflow-hidden group"
                                            >
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                                                <span className="relative z-10 flex items-center gap-3">Deep Dive Architecture <FiLayers size={16} /></span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-5 space-y-8">
                                    {/* Media Thumbnails Hub */}
                                    <div className="space-y-6">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block">Project Media Assets</span>
                                        <div className="grid grid-cols-4 gap-4">
                                            {/* Video Thumbnail */}
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => setExpandedMedia({ type: 'video', url: selectedProject.video })}
                                                className="aspect-square bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-500 hover:bg-amber-500/30 transition-all"
                                            >
                                                <FiVideo size={20} />
                                            </motion.button>
                                            {/* Image Thumbnails */}
                                            {selectedProject.images.map((img, i) => (
                                                <motion.button 
                                                    key={i}
                                                    whileHover={{ scale: 1.05 }}
                                                    onClick={() => setExpandedMedia({ type: 'image', url: img })}
                                                    className="aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all"
                                                >
                                                    <img src={img} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" alt="Project detail" />
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 space-y-8 shadow-2xl backdrop-blur-xl">
                                        <div className="space-y-6">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block">Performance Metrics</span>
                                            <div className="grid gap-4">
                                                {selectedProject.metrics.map((m) => (
                                                    <div key={m.label} className="flex justify-between items-end border-b border-white/5 pb-3">
                                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{m.label}</span>
                                                        <span className="text-xl font-black text-amber-500">{m.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block">Tech Blueprint</span>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.tech.map(t => (
                                                    <span key={t} className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/70">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Media Lightbox Overlay */}
            <AnimatePresence>
                {expandedMedia && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-12 backdrop-blur-xl"
                    >
                        <button 
                            onClick={() => setExpandedMedia(null)}
                            className="absolute top-12 right-12 w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors z-50"
                        >
                            <FiX size={24} />
                        </button>

                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="relative max-w-6xl w-full h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 flex items-center justify-center p-4"
                        >
                            {expandedMedia.type === 'video' ? (
                                <video autoPlay muted playsInline controls className="max-w-full max-h-full object-contain rounded-2xl">
                                    <source src={expandedMedia.url} type="video/mp4" />
                                </video>
                            ) : (
                                <img src={expandedMedia.url} className="max-w-full max-h-full object-contain rounded-2xl" alt="Expanded project detail" />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Deep Dive Architecture Slide-over */}
            <AnimatePresence>
                {showDeepDive && selectedProject?.deepDive && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowDeepDive(false)}
                            className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-screen w-full max-w-2xl bg-neutral-950/90 backdrop-blur-3xl border-l border-white/10 z-[3001] overflow-y-auto"
                        >
                            <div className="p-12 md:p-16 space-y-12">
                                <button 
                                    onClick={() => setShowDeepDive(false)}
                                    className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all mb-8"
                                >
                                    <FiArrowLeft size={20} />
                                </button>
                                
                                <div>
                                    <span className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase mb-4 block">Architectural Deep Dive</span>
                                    <h2 className="text-4xl font-black uppercase tracking-tight leading-none mb-8">{selectedProject.title}</h2>
                                    
                                    <div className="space-y-12">
                                        <section>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3"><div className="w-2 h-2 bg-amber-500 rounded-full" /> The Narrative</h3>
                                            <p className="text-neutral-400 leading-relaxed font-medium">{selectedProject.deepDive.story}</p>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> System Architecture</h3>
                                            <p className="text-neutral-400 leading-relaxed font-medium">{selectedProject.deepDive.architecture}</p>
                                        </section>

                                        <section>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Core Engineering Features</h3>
                                            <ul className="space-y-3">
                                                {selectedProject.deepDive.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                                        <FiCheckCircle className="text-amber-500" />
                                                        <span className="text-sm font-medium text-neutral-300">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @keyframes shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                .animate-shimmer { animation: shimmer 5s ease infinite; }
            `}</style>
        </>
    )
}