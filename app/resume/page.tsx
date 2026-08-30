'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCode, FiTerminal, FiDatabase, FiCpu, FiLayout, FiGithub, FiExternalLink, FiFileText } from 'react-icons/fi';
import { BsFiletypeJson } from 'react-icons/bs';

export default function ResumePage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hoveredBox, setHoveredBox] = useState<number | null>(null);

    useEffect(() => {
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
        downloadAnchorNode.setAttribute("download", "naveen_resume_ai_readable.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Staggered animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const boxVariants = {
        hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: "easeOut" } }
    };

    const BentoBox = ({ 
        children, 
        className = "", 
        index,
        glowColor = "rgba(0, 255, 255, 0.15)"
    }: { 
        children: React.ReactNode, 
        className?: string, 
        index: number,
        glowColor?: string 
    }) => {
        const isHovered = hoveredBox === index;
        return (
            <motion.div
                variants={boxVariants as any}
                onMouseEnter={() => setHoveredBox(index)}
                onMouseLeave={() => setHoveredBox(null)}
                className={`relative rounded-[24px] overflow-hidden border transition-all duration-500 ${isHovered ? 'border-cyan-400/50 bg-black/60' : 'border-white/10 bg-black/40'} backdrop-blur-2xl ${className}`}
                style={{
                    boxShadow: isHovered ? `0 0 40px ${glowColor}` : '0 0 0px transparent'
                }}
            >
                {/* Internal gradient sweep on hover */}
                <div 
                    className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
                />
                <div className="relative z-10 w-full h-full p-6 md:p-8 flex flex-col">
                    {children}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#020305] text-white overflow-x-hidden selection:bg-cyan-900/30 font-sans pb-24">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.03)_0%,transparent_70%)]" />
                <div 
                    className="absolute inset-0 opacity-30 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,255,255,0.08), transparent 40%)`
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-32">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                            <span className="text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-mono font-bold">System Online • 2027 Standards</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Interactive<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Resume</span>
                        </h1>
                    </div>
                </motion.div>

                {/* The Bento Grid */}
                <motion.div 
                    variants={containerVariants as any}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[160px]"
                >
                    {/* 1. Identity Core (Span 2x2) */}
                    <BentoBox index={1} className="md:col-span-2 md:row-span-2">
                        <div className="flex-1 flex flex-col justify-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">Naveen Kariyawasam</h2>
                            <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-6">Creative Coder & Developer</p>
                            <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-md">
                                Architecting futuristic digital experiences and robust AI-driven systems. Specializing in bridging the gap between breathtaking aesthetics and high-performance engineering.
                            </p>
                            <div className="flex gap-4 mt-auto">
                                <a href="https://github.com/kariyawasamnaveen" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-400/50 transition-all text-neutral-400 hover:text-cyan-400 z-20">
                                    <FiGithub size={18} />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-blue-500/50 transition-all text-neutral-400 hover:text-blue-500 z-20">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </a>
                            </div>
                        </div>
                    </BentoBox>

                    {/* 2. Download Actions (Span 2x1) */}
                    <BentoBox index={2} className="md:col-span-2 md:row-span-1" glowColor="rgba(245, 158, 11, 0.15)">
                        <div className="flex flex-col md:flex-row gap-4 w-full h-full relative z-20">
                            <a 
                                href="/resume.pdf" 
                                download
                                className="flex-1 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all flex flex-col items-center justify-center p-4 group"
                            >
                                <FiFileText className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                                <span className="text-amber-500 font-bold text-sm">Classic PDF CV</span>
                                <span className="text-amber-500/50 text-[10px] uppercase tracking-widest mt-1">Human Readable</span>
                            </a>
                            <button 
                                onClick={handleDownloadJson}
                                className="flex-1 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all flex flex-col items-center justify-center p-4 group"
                            >
                                <BsFiletypeJson className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                                <span className="text-blue-400 font-bold text-sm">JSON Format CV</span>
                                <span className="text-blue-400/50 text-[10px] uppercase tracking-widest mt-1">AI / ATS Readable</span>
                            </button>
                        </div>
                    </BentoBox>

                    {/* 3. Metrics / Live Data (Span 2x1) */}
                    <BentoBox index={3} className="md:col-span-2 md:row-span-1">
                        <div className="flex items-center justify-between w-full h-full">
                            <div className="flex-1 flex flex-col items-center justify-center border-r border-white/10">
                                <span className="text-3xl font-black text-white">42+</span>
                                <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 text-center">Projects</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center border-r border-white/10">
                                <span className="text-3xl font-black text-white">1.2k</span>
                                <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 text-center">Commits</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-cyan-400">99%</span>
                                <span className="text-[10px] text-cyan-400/50 uppercase tracking-widest mt-1 text-center">Uptime</span>
                            </div>
                        </div>
                    </BentoBox>

                    {/* 4. Tech Constellation (Span 2x3) */}
                    <BentoBox index={4} className="md:col-span-2 md:row-span-3">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-3">
                            <FiTerminal className="text-cyan-500" /> Technology Stack
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-6 w-full h-full">
                            {/* AI / Backend */}
                            <div className="space-y-4">
                                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2 font-mono">Engine & Core</div>
                                {[
                                    { name: 'Python', icon: <FiCode /> },
                                    { name: 'TensorFlow', icon: <FiCpu /> },
                                    { name: 'Node.js', icon: <FiDatabase /> }
                                ].map((tech, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-colors">
                                        <div className="text-cyan-500">{tech.icon}</div>
                                        <span className="text-sm font-medium">{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Frontend */}
                            <div className="space-y-4">
                                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2 font-mono">Interface</div>
                                {[
                                    { name: 'React', icon: <FiLayout /> },
                                    { name: 'Next.js', icon: <FiLayout /> },
                                    { name: 'TailwindCSS', icon: <FiLayout /> }
                                ].map((tech, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-colors">
                                        <div className="text-cyan-500">{tech.icon}</div>
                                        <span className="text-sm font-medium">{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BentoBox>

                    {/* 5. Chronology / Experience (Span 2x3) */}
                    <BentoBox index={5} className="md:col-span-2 md:row-span-3">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-3">
                            <FiCpu className="text-cyan-500" /> Professional Timeline
                        </h3>
                        
                        <div className="relative pl-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-4">
                            {/* Vertical Line */}
                            <div className="absolute top-2 bottom-2 left-2 w-[1px] bg-gradient-to-b from-cyan-500/50 via-white/10 to-transparent" />
                            
                            {[
                                {
                                    role: "AI/ML Engineer",
                                    company: "Tech Nova Systems",
                                    period: "2023 - Present",
                                    description: "Architecting predictive models and neural networks. Optimizing backend data pipelines for real-time inference.",
                                    current: true
                                },
                                {
                                    role: "Full Stack Developer",
                                    company: "Quantum Web Solutions",
                                    period: "2021 - 2023",
                                    description: "Built scalable web architectures using Next.js and Node. Designed highly interactive UI/UX experiences.",
                                    current: false
                                },
                                {
                                    role: "Frontend Freelancer",
                                    company: "Global Clients",
                                    period: "2019 - 2021",
                                    description: "Developed custom web applications and e-commerce platforms with React and modern CSS frameworks.",
                                    current: false
                                }
                            ].map((job, i) => (
                                <div key={i} className="relative">
                                    {/* Timeline Node */}
                                    <div className={`absolute -left-[29px] top-1.5 w-3 h-3 rounded-full border-2 ${job.current ? 'bg-cyan-500 border-black shadow-[0_0_10px_rgba(0,255,255,0.8)]' : 'bg-black border-white/20'}`} />
                                    
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase mb-1">{job.period}</span>
                                        <h4 className="text-lg font-bold text-white mb-0.5">{job.role}</h4>
                                        <span className="text-sm text-neutral-400 mb-3">{job.company}</span>
                                        <p className="text-sm text-neutral-500 leading-relaxed">
                                            {job.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoBox>

                </motion.div>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 255, 255, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 255, 255, 0.5);
                }
            `}</style>
        </div>
    );
}