'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiGithub, FiLinkedin, FiMail, FiMapPin, FiTerminal, FiBriefcase, FiBook, FiCode } from 'react-icons/fi';
import { BsFiletypeJson } from 'react-icons/bs';

export default function ResumePage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const [hoveredExp, setHoveredExp] = useState<number | null>(null);

    useEffect(() => {
        setIsLoaded(true);
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleDownloadJson = () => {
        const resumeData = {
            name: "NAVEEN KARIYAWASAM",
            title: "FULL-STACK & AI SOLUTIONS DEVELOPER",
            skills: ["Flutter", "Python", "FastAPI", "Next.js", "LangChain", "OpenAI GPT"],
            experience: [
                { role: "Full-Stack & AI Solutions Contractor", company: "HelpA Global Service", year: "2024-Present" },
                { role: "Mobile & Full-Stack Developer", company: "Freelance / Remote Contractor", year: "2023-2024" }
            ]
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "naveen_resume.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
        return (
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay }}
                className="inline-block"
            >
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ delay: delay + i * 0.02, duration: 0.1 }}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.span>
        );
    };

    // Glitch animation for the main document
    const documentVariants = {
        hidden: { opacity: 0, scale: 0.98, y: 20, filter: 'blur(20px) hue-rotate(90deg)' },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            filter: 'blur(0px) hue-rotate(0deg)',
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="h-screen bg-[#020305] text-neutral-300 font-sans selection:bg-cyan-500/30 overflow-y-auto overflow-x-hidden relative flex items-center justify-center p-2 md:p-4">
            
            {/* Ambient Lighting Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.03)_0%,transparent_70%)]" />
                <div 
                    className="absolute inset-0 opacity-40 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,255,255,0.06), transparent 40%)`
                    }}
                />
                {/* Subtle tech grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-[length:32px_32px]" />
            </div>

            {/* Sticky Actions Bar */}
            <div className="fixed top-6 right-6 md:top-8 md:right-12 z-50 flex gap-4">
                <a 
                    href="/resume.pdf" 
                    download
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all"
                >
                    <FiDownload size={14} /> PDF
                </a>
                <button 
                    onClick={handleDownloadJson}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
                >
                    <BsFiletypeJson size={14} /> JSON
                </button>
            </div>

            {/* The Holographic Document (A4 Proportion) */}
            <AnimatePresence>
                {isLoaded && (
                    <motion.div
                        variants={documentVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-10 max-w-[1000px] w-full bg-[#050914]/80 backdrop-blur-2xl border border-white/5 rounded-sm p-5 md:p-8 shadow-[0_0_50px_rgba(0,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.02)]"
                    >
                        {/* Scanning Line Animation */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,1)] animate-scan opacity-30" />

                        {/* --- HEADER --- */}
                        <header className="border-b border-white/10 pb-4 mb-6 relative">
                            {/* Decorative corner brackets */}
                            <div className="absolute -top-4 -left-4 w-4 h-4 border-t border-l border-cyan-500/50" />
                            <div className="absolute -top-4 -right-4 w-4 h-4 border-t border-r border-cyan-500/50" />
                            
                            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1 font-mono">
                                <TypewriterText text="NAVEEN KARIYAWASAM" delay={0.2} />
                            </h1>
                            <h2 className="text-xs md:text-sm text-cyan-400 font-mono tracking-widest uppercase mb-4">
                                <TypewriterText text="FULL-STACK & AI SOLUTIONS DEVELOPER" delay={0.8} />
                            </h2>
                            
                            <div className="flex flex-wrap gap-3 text-[10px] font-mono text-neutral-400">
                                <a href="mailto:hknskariyawasamnaveen@gmail.com" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                                    <FiMail /> hknskariyawasamnaveen@gmail.com
                                </a>
                                <span className="flex items-center gap-2">
                                    <FiMapPin /> Colombo, Sri Lanka (Remote)
                                </span>
                                <a href="https://github.com/kariyawasamnaveen" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                                    <FiGithub /> github.com/kariyawasamnaveen
                                </a>
                                <a href="https://linkedin.com/in/naveen-kariyawasam" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                                    <FiLinkedin /> linkedin.com/in/naveen-kariyawasam
                                </a>
                            </div>
                        </header>

                        {/* 2-COLUMN LAYOUT FOR SINGLE-SCREEN FIT */}
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                            
                            {/* LEFT COLUMN: Summary, Skills, Edu */}
                            <div className="lg:w-[35%] flex flex-col gap-5">
                                {/* --- SUMMARY --- */}
                                <section>
                                    <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <FiTerminal className="text-cyan-500" /> Summary
                                    </h3>
                                    <motion.p 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        transition={{ delay: 1.5, duration: 1 }}
                                        className="text-neutral-400 leading-relaxed text-[11px] text-justify"
                                    >
                                        Agile Full-Stack & AI Solutions Remote Contractor. I bridge the gap between high-velocity product execution and scalable cloud engineering. Leveraging deep hands-on expertise in mobile architecture, modern backend services, and autonomous agent orchestration to ship production-ready systems on tight turnaround sprints.
                                    </motion.p>
                                </section>

                                {/* --- SKILLS MATRIX --- */}
                                <section>
                                    <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                        <FiCode className="text-cyan-500" /> Skills
                                    </h3>
                                    
                                    <div className="flex flex-col gap-4">
                                        {[
                                            {
                                                category: "Core",
                                                skills: ["Flutter", "Dart", "Python", "FastAPI", "Next.js", "TypeScript", "WebRTC", "PostgreSQL"]
                                            },
                                            {
                                                category: "AI & Data",
                                                skills: ["LangChain", "Pinecone (RAG)", "OpenAI GPT", "Google Gemini", "Pandas", "Scikit-Learn"]
                                            },
                                            {
                                                category: "Integrations",
                                                skills: ["Telegram Bot API", "Google Calendar API", "n8n", "Make.com", "Docker", "Git"]
                                            }
                                        ].map((group, index) => (
                                            <div key={index}>
                                                <h4 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">{group.category}</h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {group.skills.map((skill, i) => (
                                                        <span key={i} className="text-[10px] font-mono text-neutral-300 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded cursor-default">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* --- EDUCATION & CERTS --- */}
                                <section>
                                    <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <FiBook className="text-cyan-500" /> Education & Certs
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        <div className="p-2 rounded-lg border border-white/5 bg-white/[0.01]">
                                            <h4 className="font-bold text-white text-[11px] mb-1">BSc (Hons) Computer Science</h4>
                                            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Univ. of Kelaniya (2023-2027)</div>
                                            <p className="text-[9px] text-neutral-500 leading-relaxed">Specialized in Artificial Intelligence.</p>
                                        </div>
                                        <div className="p-2 rounded-lg border border-white/5 bg-white/[0.01]">
                                            <h4 className="font-bold text-white text-[11px] mb-1">Software Engineering Internship</h4>
                                            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Trace Expert City (T2T)</div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT COLUMN: Experience */}
                            <div className="lg:w-[65%]">
                                <section>
                                    <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <FiBriefcase className="text-cyan-500" /> Experience
                                    </h3>
                                    
                                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[7px] before:-translate-x-px before:h-full before:w-[1px] before:bg-gradient-to-b before:from-cyan-500/50 before:via-white/10 before:to-transparent">
                                        {[
                                            {
                                                role: "Full-Stack & AI Solutions Contractor",
                                                company: "HelpA Global Service",
                                                date: "2024 — Present",
                                                points: [
                                                    "Architected an enterprise RAG knowledge engine using FastAPI, Pinecone, and LangChain.",
                                                    "Engineered a multi-device low-latency WebRTC live-streaming app with on-device ML.",
                                                    "Built automated lead booking engine syncing calendar webhooks with real-time Telegram/email alerts."
                                                ]
                                            },
                                            {
                                                role: "Mobile & Full-Stack Developer",
                                                company: "Freelance / Remote Contractor",
                                                date: "2023 — 2024",
                                                points: [
                                                    "Developed cross-platform production mobile apps in Flutter with clean state management.",
                                                    "Built voice-driven automated scheduling PWAs (Next.js, NextAuth, Groq LLM pipelines).",
                                                    "Designed RESTful backend services, db schemas (SQLAlchemy, PostgreSQL), and event workflows."
                                                ]
                                            }
                                        ].map((job, index) => (
                                            <div 
                                                key={index}
                                                className={`relative flex items-start gap-4 group ${hoveredExp !== null && hoveredExp !== index ? 'opacity-30' : 'opacity-100'} transition-opacity duration-300`}
                                                onMouseEnter={() => setHoveredExp(index)}
                                                onMouseLeave={() => setHoveredExp(null)}
                                            >
                                                {/* Node */}
                                                <div className="mt-1 flex items-center justify-center w-4 h-4 rounded-full border border-black bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.6)] shrink-0 z-10" />
                                                
                                                {/* Content */}
                                                <div className="flex-1 p-2.5 rounded-lg border border-transparent group-hover:border-white/10 group-hover:bg-white/[0.02] transition-colors -mt-2">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <h4 className="font-bold text-white text-[13px]">{job.role}</h4>
                                                        <span className="text-[8px] font-mono text-cyan-500 tracking-widest uppercase border border-cyan-500/30 px-1 py-0.5 rounded-sm bg-cyan-500/10">
                                                            {job.date}
                                                        </span>
                                                    </div>
                                                    <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">{job.company}</div>
                                                    <ul className="space-y-1">
                                                        {job.points.map((point, i) => (
                                                            <li key={i} className="text-[11px] text-neutral-400 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-white/20 before:rounded-full group-hover:before:bg-cyan-500/50">
                                                                {point}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Bottom decorative brackets */}
                        <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b border-l border-cyan-500/50" />
                        <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b border-r border-cyan-500/50" />
                        
                    </motion.div>
                )}
            </AnimatePresence>
            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 0.3; }
                    90% { opacity: 0.3; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
            `}</style>
        </div>
    );
}