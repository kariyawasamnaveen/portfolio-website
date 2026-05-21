'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiExternalLink } from 'react-icons/fi'

export default function HeroSection() {
    return (
        <section className="pt-32 pb-20 px-6 lg:px-20">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid lg:grid-cols-5 gap-12 items-center">
                    
                    {/* Left - Info */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="space-y-4">
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-6xl font-bold tracking-tight text-white"
                            >
                                Software Engineer & <br />
                                <span className="text-blue-500">AI Specialist.</span>
                            </motion.h1>
                            <p className="text-xl text-neutral-400 max-w-xl leading-relaxed">
                                I build scalable mobile applications and intelligent backend systems. 
                                Specializing in <span className="text-white font-medium">Flutter</span>, 
                                <span className="text-white font-medium"> Python</span>, and 
                                <span className="text-white font-medium"> Cloud Architecture</span>.
                            </p>
                        </div>

                        {/* Social & CTA */}
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex gap-4">
                                {[
                                    { Icon: FiGithub, href: 'https://github.com/kariyawasamnaveen' },
                                    { Icon: FiLinkedin, href: '#' },
                                    { Icon: FiMail, href: 'mailto:contact@naveen.me' }
                                ].map(({ Icon, href }, i) => (
                                    <a 
                                        key={i} 
                                        href={href} 
                                        target="_blank" 
                                        className="w-11 h-11 rounded-lg bg-[#171717] border border-[#262626] flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-all"
                                    >
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                            <div className="h-8 w-px bg-neutral-800" />
                            <a href="/resume" className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-2">
                                Download Resume <FiExternalLink />
                            </a>
                        </div>

                        {/* Tech Stack Chips */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Main Tech Stack</p>
                            <div className="flex flex-wrap gap-2">
                                {['Flutter', 'Dart', 'Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'Firebase', 'AWS'].map(tech => (
                                    <span key={tech} className="px-3 py-1 bg-[#171717] border border-[#262626] rounded-md text-xs font-medium text-neutral-300">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right - Profile Photo Area */}
                    <div className="lg:col-span-2 flex justify-center">
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                            {/* Decorative border */}
                            <div className="absolute inset-0 border-2 border-dashed border-neutral-800 rounded-full animate-[spin_20s_linear_infinite]" />
                            
                            <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-[#171717] shadow-2xl">
                                <img 
                                    src="/naveen.png" 
                                    alt="Naveen Kariyawasam" 
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -bottom-2 -right-2 px-4 py-2 bg-blue-600 rounded-lg text-xs font-bold text-white shadow-xl">
                                4+ Years Exp.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
