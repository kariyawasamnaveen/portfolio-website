'use client'

import { motion } from 'framer-motion'
import { FiCpu, FiLayout, FiCode, FiActivity, FiArrowUpRight, FiMail } from 'react-icons/fi'
import Link from 'next/link'

const BentoCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`glass glass-hover p-8 rounded-3xl overflow-hidden relative group ${className}`}
    >
        {children}
    </motion.div>
)

export default function BentoSection() {
    return (
        <section className="px-6 lg:px-20 pb-40">
            <div className="max-w-7xl mx-auto">
                <div className="bento-grid">
                    
                    {/* Skills - Large Card */}
                    <BentoCard className="col-span-2 row-span-2 bg-gradient-to-br from-[#26D4C4]/10 to-transparent">
                        <div className="h-full flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#26D4C4]/20 flex items-center justify-center text-[#26D4C4]">
                                    <FiCpu size={24} />
                                </div>
                                <h3 className="text-3xl font-bold">Technical Core</h3>
                                <p className="text-white/50 max-w-sm">
                                    Specializing in high-performance AI integration and seamless cross-platform development.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-8">
                                {['Python', 'Dart', 'React', 'TensorFlow', 'PostgreSQL', 'Next.js'].map(skill => (
                                    <span key={skill} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </BentoCard>

                    {/* Status - Small Card */}
                    <BentoCard className="col-span-1 row-span-1">
                        <div className="flex flex-col h-full justify-between">
                            <FiActivity className="text-[#26D4C4]" size={24} />
                            <div>
                                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">Status</h4>
                                <p className="text-lg font-bold">Final Year Undergraduate</p>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Github - Small Card */}
                    <BentoCard className="col-span-1 row-span-1 flex items-center justify-center">
                        <Link href="https://github.com/kariyawasamnaveen" target="_blank" className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                            <FiCode size={40} className="text-white/20 group-hover:text-[#26D4C4] transition-colors" />
                            <span className="text-xs font-bold uppercase tracking-widest">GitHub</span>
                        </Link>
                    </BentoCard>

                    {/* Project Teaser - Horizontal Card */}
                    <BentoCard className="col-span-2 row-span-1 bg-[#4f46e5]/5 border-[#4f46e5]/20">
                        <div className="flex items-center justify-between h-full">
                            <div>
                                <h3 className="text-2xl font-bold">50+ Projects</h3>
                                <p className="text-white/40 text-sm">Building since 2021</p>
                            </div>
                            <Link href="/projects">
                                <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                    <FiArrowUpRight size={20} />
                                </button>
                            </Link>
                        </div>
                    </BentoCard>

                    {/* Experience - Vertical Card */}
                    <BentoCard className="col-span-1 row-span-2">
                         <div className="space-y-6">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <FiLayout size={20} />
                            </div>
                            <h3 className="text-xl font-bold">Full Stack <br />Visionary</h3>
                            <div className="space-y-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] text-white/40 uppercase mb-1">Flutter</p>
                                    <p className="text-xs font-bold italic">High Performance Mobile Apps</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] text-white/40 uppercase mb-1">AI/ML</p>
                                    <p className="text-xs font-bold italic">Intelligent Data Solutions</p>
                                </div>
                            </div>
                         </div>
                    </BentoCard>

                    {/* Connect - Small Card */}
                    <BentoCard className="col-span-1 row-span-1 bg-[#26D4C4] text-black">
                        <Link href="/contact" className="h-full flex flex-col justify-between">
                            <FiMail size={24} />
                            <p className="text-xl font-black leading-tight">LET'S <br />WORK.</p>
                        </Link>
                    </BentoCard>

                </div>
            </div>
        </section>
    )
}
