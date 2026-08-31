'use client'
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiGithub, FiLinkedin, FiMail, FiMapPin, FiTerminal, FiBriefcase, FiBook, FiCode, FiLayers } from 'react-icons/fi';
import { BsFiletypeJson } from 'react-icons/bs';
import Link from 'next/link';
import { RESUME_DATA } from '@/data/resume';
import { PROJECTS_DATA } from '@/data/projects';
import { useCvVoiceAssistant } from '@/hooks/useCvVoiceAssistant';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

export default function ResumePage() {
    const { isActive, setIsActive, isListening, isSpeaking, activeHighlight } = useCvVoiceAssistant();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const [hoveredExp, setHoveredExp] = useState<number | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const resumeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoaded(true);
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleDownloadJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(RESUME_DATA, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "naveen_resume.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleDownloadPdf = async () => {
        if (!resumeRef.current) return;
        setIsGeneratingPdf(true);
        let originalTransform = '';
        try {
            // Temporarily disable the animation properties that might mess up the canvas capture
            originalTransform = resumeRef.current.style.transform;
            resumeRef.current.style.transform = 'none';
            resumeRef.current.classList.add('pdf-capture-mode');

            // html-to-image uses SVG foreignObject which bypasses html2canvas's manual CSS parsing
            const imgData = await toJpeg(resumeRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: '#050914',
                style: {
                    transform: 'none', // Ensure animations don't clip
                },
                filter: (node) => {
                    // Exclude interactive buttons and scanner lines from the static PDF
                    if (node.classList && node.classList.contains('exclude-from-pdf')) {
                        return false;
                    }
                    return true;
                }
            });
            
            // A4 dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Calculate image dimensions to fit A4 width while maintaining aspect ratio
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            // Fill background with dark theme color to prevent white gaps
            pdf.setFillColor('#050914');
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            
            // Center the CV vertically if it's shorter than A4
            // Wait, for a professional CV, it should ALWAYS start at the top, not the middle.
            const yOffset = 0; // Set to 0 so it aligns to the top edge perfectly.
            
            pdf.addImage(imgData, 'JPEG', 0, yOffset, pdfWidth, imgHeight);
            
            // If the CV is taller than one A4 page, add new pages
            let heightLeft = imgHeight - pdfHeight;
            let position = yOffset - pdfHeight;
            
            while (heightLeft > 0) {
                pdf.addPage();
                pdf.setFillColor('#050914');
                pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
                position -= pdfHeight;
            }
            
            pdf.save('Naveen_Kariyawasam_Resume.pdf');
        } catch (error) {
            console.error('Failed to generate PDF', error);
        } finally {
            if (resumeRef.current) {
                resumeRef.current.style.transform = originalTransform;
                resumeRef.current.classList.remove('pdf-capture-mode');
            }
            setIsGeneratingPdf(false);
        }
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
                <button 
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGeneratingPdf ? <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /> : <FiDownload size={14} />}
                    {isGeneratingPdf ? 'GENERATING...' : 'PDF'}
                </button>
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
                        ref={resumeRef}
                        variants={documentVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-10 w-full max-w-[800px] max-h-[90vh] aspect-[1/1.414] bg-[#050914] border border-white/5 rounded-sm p-4 md:p-6 shadow-[0_0_50px_rgba(0,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.02)] overflow-hidden flex flex-col"
                    >
                        {/* Scanning Line Animation (hidden in PDF) */}
                        <div className="exclude-from-pdf absolute top-0 left-0 right-0 h-1 bg-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,1)] animate-scan opacity-30" />

                        {/* --- HEADER --- */}
                        <header className="border-b border-white/10 pb-4 mb-6 relative">
                            {/* Decorative corner brackets */}
                            <div className="absolute -top-4 -left-4 w-4 h-4 border-t border-l border-cyan-500/50" />
                            <div className="absolute -top-4 -right-4 w-4 h-4 border-t border-r border-cyan-500/50" />
                            
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-1 font-mono hover:opacity-50 transition-opacity cursor-default">
                                NAVEEN KARIYAWASAM
                            </h1>
                            <h2 className="text-[10px] md:text-xs text-cyan-400 font-mono tracking-widest uppercase mb-3 hover:opacity-50 transition-opacity cursor-default">
                                FULL-STACK & AI SOLUTIONS DEVELOPER
                            </h2>
                            
                            <div className="flex flex-wrap gap-2 text-[9px] font-mono text-neutral-400">
                                <a href="mailto:hknskariyawasamnaveen@gmail.com" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
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

                            {/* AI Agent CTA (hidden in PDF) */}
                            <div className="exclude-from-pdf absolute top-0 right-0 mt-0 mr-0 hidden md:block">
                                <button 
                                    onClick={() => setIsActive(!isActive)}
                                    className={`group relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white transition-all duration-200 border rounded-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] 
                                        ${isActive ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50'}`}
                                >
                                    <div 
                                        className={`mr-3 relative w-3.5 h-3.5 rounded-full shadow-[0_0_15px_3px_rgba(220,38,38,0.7)] transition-all duration-700
                                            ${isSpeaking ? 'bg-red-500 scale-125' : 
                                              isListening ? 'bg-red-600 animate-pulse' : 
                                              isActive ? 'bg-red-700' : 'bg-red-900 opacity-50'}`} 
                                        style={{ background: 'radial-gradient(circle at 30% 30%, #ef4444, #991b1b, #450a0a)' }}
                                    >
                                        <div className="absolute top-[15%] left-[20%] w-[50%] h-[35%] rounded-full bg-white/40 blur-[1px] -rotate-12" />
                                        {(isSpeaking || isListening) && <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-50 duration-1000" />}
                                        {isSpeaking && <div className="absolute inset-[-4px] rounded-full animate-ping bg-red-500 opacity-30 duration-700 delay-100" />}
                                    </div>
                                    <span className="tracking-widest uppercase text-[10px]">
                                        {isActive ? (isSpeaking ? 'AI is speaking...' : isListening ? 'Listening...' : 'End AI Interview') : 'Interview My AI'}
                                    </span>
                                </button>
                            </div>
                        </header>

                        {/* 2-COLUMN LAYOUT FOR SINGLE-SCREEN FIT */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 flex-1 overflow-hidden">
                            
                            {/* LEFT COLUMN: Summary, Skills, Edu */}
                            <div className="lg:w-[35%] flex flex-col gap-3">
                                {/* --- SUMMARY --- */}
                                <section className={`hover-magnify p-2 -m-2 rounded ${activeHighlight === 'summary' ? 'active-highlight' : ''}`}>
                                    <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <FiTerminal className="text-cyan-500" /> Summary
                                    </h3>
                                    <motion.p 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        transition={{ delay: 1.5, duration: 1 }}
                                        className="text-neutral-400 leading-relaxed text-[10px] text-justify"
                                    >
                                        Agile Full-Stack & AI Solutions Remote Contractor. I bridge the gap between high-velocity product execution and scalable cloud engineering. Leveraging deep hands-on expertise in mobile architecture, modern backend services, and autonomous agent orchestration to ship production-ready systems on tight turnaround sprints.
                                    </motion.p>
                                </section>

                                {/* --- SKILLS MATRIX --- */}
                                <section className={`hover-magnify p-2 -m-2 rounded ${activeHighlight === 'skills' ? 'active-highlight' : ''}`}>
                                    <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
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
                                                <h4 className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">{group.category}</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {group.skills.map((skill, i) => (
                                                        <span key={i} className="text-[9px] font-mono text-neutral-300 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded cursor-default">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* --- EDUCATION & CERTS --- */}
                                <section className={`hover-magnify p-2 -m-2 rounded ${activeHighlight === 'education' ? 'active-highlight' : ''}`}>
                                    <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <FiBook className="text-cyan-500" /> Education & Certs
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        <div className="p-2 rounded-md border border-white/5 bg-white/[0.01]">
                                            <h4 className="font-bold text-white text-[10px] mb-1">BSc (Hons) Computer Science</h4>
                                            <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Univ. of Kelaniya (2023-2027)</div>
                                            <p className="text-[9px] text-neutral-500 leading-relaxed">Specialized in Artificial Intelligence.</p>
                                        </div>
                                        <div className="p-2 rounded-md border border-white/5 bg-white/[0.01]">
                                            <h4 className="font-bold text-white text-[10px] mb-1">Software Engineering Internship</h4>
                                            <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">Trace Expert City (T2T)</div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT COLUMN: Experience */}
                            <div className="lg:w-[65%] flex flex-col">
                                <section className={`hover-magnify p-2 -m-2 rounded ${activeHighlight === 'experience' ? 'active-highlight' : ''}`}>
                                    <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <FiBriefcase className="text-cyan-500" /> Experience
                                    </h3>
                                    
                                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[7px] before:-translate-x-px before:h-full before:w-[1px] before:bg-gradient-to-b before:from-cyan-500/50 before:via-white/10 before:to-transparent">
                                        {[
                                            {
                                                role: "Full Stack Mobile Developer",
                                                company: "Fitness Tracker Pro (Client Sprint)",
                                                date: "2026",
                                                points: [
                                                    "Published a cross-platform health aggregation app directly on the Google Play Store.",
                                                    "Integrated Apple Health and Google Fit APIs to fetch real-time step counts and metrics.",
                                                    "Implemented Firebase Auth and Cloud Firestore for seamless cloud syncing and local caching."
                                                ]
                                            },
                                            {
                                                role: "Full Stack AI Engineer",
                                                company: "BizLangAI (Internship)",
                                                date: "2026",
                                                points: [
                                                    "Built a FastAPI backend using Pinecone and LangChain for enterprise PDF knowledge retrieval.",
                                                    "Implemented autonomous Python code execution via LangChain Tool Calling for CSV chart generation.",
                                                    "Developed a secure, responsive glassmorphism React frontend for corporate dashboards."
                                                ]
                                            },
                                            {
                                                role: "Lead Mobile & Backend Developer",
                                                company: "Shemet Dating & Live (Client Sprint)",
                                                date: "2025",
                                                points: [
                                                    "Architected a real-time ecosystem using Flutter and Firebase Cloud Functions.",
                                                    "Integrated Agora WebRTC and DeepAR for low-latency live video with 3D AR face filters.",
                                                    "Implemented Google ML-Kit for automated face verification to eliminate fake profiles."
                                                ]
                                            },
                                            {
                                                role: "Lead Full Stack Engineer",
                                                company: "EstateCore (Client Sprint)",
                                                date: "2023 — 2024",
                                                points: [
                                                    "Engineered a 'Neural Concierge' using GPT-4 Vision and LangChain for automated lead capture.",
                                                    "Built an event-driven Node.js backend to process multi-lingual (EN, HI, BN) conversations.",
                                                    "Integrated Prisma ORM for automated entity extraction and relational lead management."
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
                                                <div className="flex-1 p-2 rounded-lg border border-transparent group-hover:border-white/10 group-hover:bg-white/[0.02] transition-colors -mt-2">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-0.5 gap-1">
                                                        <h4 className="font-bold text-white text-[12px]">{job.role}</h4>
                                                        <span className="text-[8px] font-mono text-cyan-400 font-bold tracking-widest uppercase border border-cyan-500/30 px-1.5 py-0.5 rounded bg-cyan-500/10">
                                                            {job.date}
                                                        </span>
                                                    </div>
                                                    <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">{job.company}</div>
                                                    <ul className="space-y-1">
                                                        {job.points.map((point, i) => (
                                                            <li key={i} className="text-[10px] text-neutral-400 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-white/20 before:rounded-full group-hover:before:bg-cyan-500/50">
                                                                {point}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* --- NOTABLE PROJECTS --- */}
                                <section className="mt-4">
                                    <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                        <FiLayers className="text-cyan-500" /> Notable Projects
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {PROJECTS_DATA.slice(0, 3).map((project, i) => (
                                            <div key={i} className={`p-2 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors hover-magnify ${activeHighlight === project.id ? 'active-highlight' : ''}`}>
                                                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-1 gap-1">
                                                    <h4 className="font-bold text-white text-[11px]">{project.title}</h4>
                                                    <span className="text-[8px] font-mono font-bold text-cyan-400 tracking-widest uppercase">{project.role}</span>
                                                </div>
                                                <p className="text-[10px] text-neutral-400 leading-relaxed mb-2 line-clamp-2">
                                                    {project.tagline}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.tech.slice(0, 5).map((tech, j) => (
                                                        <span key={j} className="text-[8px] font-mono text-neutral-300 bg-black/50 border border-white/10 px-1.5 py-0.5 rounded">
                                                            {tech}
                                                        </span>
                                                    ))}
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