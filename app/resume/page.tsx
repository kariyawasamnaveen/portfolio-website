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
            name: "Naveen Kariyawasam",
            title: "Creative Coder & Developer",
            skills: ["Python", "React", "Next.js", "AI/ML", "Flutter"],
            experience: [
                { role: "Senior Developer", company: "Tech Nova", year: "2024-Present" },
                { role: "Full Stack Engineer", company: "Quantum Web", year: "2021-2024" }
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
        <div className="min-h-screen bg-[#020305] text-neutral-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative pb-32 pt-24 md:pt-32">
            
            {/* Ambient Lighting Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.03)_0%,transparent_70%)]" />
                <div 
                    className="absolute inset-0 opacity-40 transition-opacity duration-300"
                    style={{
                        background: \`radial-gradient(circle 800px at \${mousePosition.x}px \${mousePosition.y}px, rgba(0,255,255,0.06), transparent 40%)\`
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all"
                >
                    <FiDownload size={16} /> PDF
                </a>
                <button 
                    onClick={handleDownloadJson}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
                >
                    <BsFiletypeJson size={16} /> JSON
                </button>
            </div>

            {/* The Holographic Document (A4 Proportion) */}
            <AnimatePresence>
                {isLoaded && (
                    <motion.div
                        variants={documentVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-10 max-w-[850px] mx-auto w-[95%] min-h-[1100px] bg-[#050914]/80 backdrop-blur-2xl border border-white/5 rounded-sm p-8 md:p-16 lg:p-20 shadow-[0_0_50px_rgba(0,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.02)]"
                    >
                        {/* Scanning Line Animation */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,1)] animate-scan opacity-30" />

                        {/* --- HEADER --- */}
                        <header className="border-b border-white/10 pb-8 mb-10 relative">
                            {/* Decorative corner brackets */}
                            <div className="absolute -top-4 -left-4 w-4 h-4 border-t border-l border-cyan-500/50" />
                            <div className="absolute -top-4 -right-4 w-4 h-4 border-t border-r border-cyan-500/50" />
                            
                            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 font-mono">
                                <TypewriterText text="Naveen Kariyawasam" delay={0.2} />
                            </h1>
                            <h2 className="text-lg md:text-xl text-cyan-400 font-mono tracking-widest uppercase mb-6">
                                <TypewriterText text="Creative Coder & Developer" delay={0.8} />
                            </h2>
                            
                            <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-400">
                                <a href="mailto:contact@example.com" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                                    <FiMail /> contact@example.com
                                </a>
                                <span className="flex items-center gap-2">
                                    <FiMapPin /> Colombo, Sri Lanka (Remote)
                                </span>
                                <a href="https://github.com/kariyawasamnaveen" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                                    <FiGithub /> github.com/kariyawasamnaveen
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                                    <FiLinkedin /> linkedin.com/in/naveen
                                </a>
                            </div>
                        </header>

                        {/* --- SUMMARY --- */}
                        <section className="mb-12">
                            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                <FiTerminal className="text-cyan-500" /> Executive Summary
                            </h3>
                            <p className="text-neutral-400 leading-relaxed text-sm text-justify">
                                <TypewriterText 
                                    text="Visionary Creative Coder and AI/ML Engineer with a relentless passion for architecting futuristic digital experiences. Specializing in bridging the gap between breathtaking aesthetics and high-performance engineering. Proven ability to lead full-stack development life cycles, design quantum-inspired UI/UX, and deploy robust backend infrastructures. Seeking to leverage deep technical expertise to build the next generation of intelligent, highly interactive web applications." 
                                    delay={1.5} 
                                />
                            </p>
                        </section>

                        {/* --- EXPERIENCE --- */}
                        <section className="mb-12">
                            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <FiBriefcase className="text-cyan-500" /> Professional Experience
                            </h3>
                            
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-cyan-500/50 before:via-white/10 before:to-transparent">
                                
                                {[
                                    {
                                        role: "Senior AI/ML Engineer",
                                        company: "Tech Nova Systems",
                                        date: "2023 — Present",
                                        points: [
                                            "Architected and deployed predictive neural networks reducing operational latency by 45%.",
                                            "Led a team of 4 developers to build a real-time data inference pipeline using Python and TensorFlow.",
                                            "Integrated advanced LLMs into the core product, generating $2M+ in new annual recurring revenue."
                                        ]
                                    },
                                    {
                                        role: "Full Stack Developer",
                                        company: "Quantum Web Solutions",
                                        date: "2021 — 2023",
                                        points: [
                                            "Designed and implemented highly scalable microservices using Node.js and Next.js.",
                                            "Pioneered the 'Biomimetic UI' design system, standardizing components across 5 enterprise applications.",
                                            "Optimized database queries in PostgreSQL, improving dashboard load times by over 60%."
                                        ]
                                    },
                                    {
                                        role: "Frontend Engineer (Freelance)",
                                        company: "Global Clients",
                                        date: "2019 — 2021",
                                        points: [
                                            "Developed custom, high-performance web applications using React, TailwindCSS, and Framer Motion.",
                                            "Delivered 20+ projects with perfect 5-star client satisfaction, focusing on seamless animations and UX."
                                        ]
                                    }
                                ].map((job, index) => (
                                    <div 
                                        key={index}
                                        className={\`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group \${hoveredExp !== null && hoveredExp !== index ? 'opacity-30' : 'opacity-100'} transition-opacity duration-300\`}
                                        onMouseEnter={() => setHoveredExp(index)}
                                        onMouseLeave={() => setHoveredExp(null)}
                                    >
                                        {/* Icon */}
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-black bg-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.6)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                                        
                                        {/* Content Card */}
                                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-5 rounded-lg border border-transparent group-hover:border-white/10 group-hover:bg-white/[0.02] transition-colors">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                                                <h4 className="font-bold text-white text-base">{job.role}</h4>
                                                <span className="text-[10px] font-mono text-cyan-500 tracking-widest uppercase border border-cyan-500/30 px-2 py-0.5 rounded-sm bg-cyan-500/10 shrink-0">
                                                    {job.date}
                                                </span>
                                            </div>
                                            <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-3">{job.company}</div>
                                            <ul className="space-y-2">
                                                {job.points.map((point, i) => (
                                                    <li key={i} className="text-sm text-neutral-400 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-white/20 before:rounded-full group-hover:before:bg-cyan-500/50 before:transition-colors">
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* --- SKILLS MATRIX --- */}
                        <section className="mb-12">
                            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <FiCode className="text-cyan-500" /> Core Competencies
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    {
                                        category: "Languages & Frameworks",
                                        skills: ["JavaScript (ES6+)", "TypeScript", "Python", "React", "Next.js", "Node.js", "Flutter", "Dart"]
                                    },
                                    {
                                        category: "AI & Data Engineering",
                                        skills: ["TensorFlow", "PyTorch", "OpenAI API", "LangChain", "Pandas", "Scikit-Learn"]
                                    },
                                    {
                                        category: "Database & Cloud",
                                        skills: ["PostgreSQL", "MongoDB", "Firebase", "Google Cloud", "AWS", "Vercel"]
                                    },
                                    {
                                        category: "Design & Tools",
                                        skills: ["Figma", "Framer Motion", "TailwindCSS", "Three.js", "Git / GitHub", "Docker"]
                                    }
                                ].map((group, index) => (
                                    <div key={index} className="space-y-3">
                                        <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-widest">{group.category}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {group.skills.map((skill, i) => (
                                                <span 
                                                    key={i} 
                                                    className="text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 px-2 py-1 rounded hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-default"
                                                >
                                                    <span className="text-cyan-500/50 mr-1 opacity-0 hover:opacity-100 transition-opacity">$&gt;</span>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* --- EDUCATION --- */}
                        <section>
                            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <FiBook className="text-cyan-500" /> Education
                            </h3>
                            
                            <div className="p-5 rounded-lg border border-white/5 bg-white/[0.01]">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                                    <h4 className="font-bold text-white text-base">BSc (Hons) in Computer Science</h4>
                                    <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
                                        2018 — 2022
                                    </span>
                                </div>
                                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">University of Colombo</div>
                                <p className="text-sm text-neutral-400 leading-relaxed">
                                    Graduated with First Class Honors. Specialized in Artificial Intelligence and Human-Computer Interaction. 
                                    Awarded the "Innovative Project of the Year" for developing a neural-net based sign language translator.
                                </p>
                            </div>
                        </section>

                        {/* Bottom decorative brackets */}
                        <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b border-l border-cyan-500/50" />
                        <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b border-r border-cyan-500/50" />
                        
                    </motion.div>
                )}
            </AnimatePresence>
            
            <style jsx global>{\`
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 0.3; }
                    90% { opacity: 0.3; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
            \`}</style>
        </div>
    );
}