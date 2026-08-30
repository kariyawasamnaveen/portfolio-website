'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

type Zone = 'identity' | 'projects' | 'logic' | 'impact' | 'connect'

interface CentralPortalNavProps {
    activeZone: Zone
    onZoneChange: (zone: Zone) => void
}

export default function CentralPortalNav({ activeZone, onZoneChange }: CentralPortalNavProps) {
    const zones: { id: Zone, label: string }[] = [
        { id: 'identity', label: 'IDENTITY' },
        { id: 'projects', label: 'PROJECTS' },
        { id: 'logic', label: 'LOGIC' },
        { id: 'impact', label: 'IMPACT' },
        { id: 'connect', label: 'CONNECT' }
    ]

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-4">
            
            {/* Social Icons Integrated into Dock Area */}
            <div className="flex justify-center gap-6 text-neutral-500 mb-3 md:mb-1">
                <a href="https://github.com/kariyawasamnaveen" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-white transition-colors duration-300">
                    <FiGithub size={14} />
                </a>
                <a href="https://www.linkedin.com/in/naveen-kariyawasam-b85507229/" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-white transition-colors duration-300">
                    <FiLinkedin size={14} />
                </a>
                <button onClick={() => {
                    navigator.clipboard.writeText('hknskariyawasamnaveen@gmail.com');
                    alert('Email copied!');
                }} className="hover:text-white transition-colors duration-300">
                    <FiMail size={14} />
                </button>
            </div>

            {/* Deep Sea Glassmorphism Nav Dock */}
            <div className="flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/5 px-2 md:pl-2 md:pr-1 py-1.5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] w-[95vw] md:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {zones.map((zone) => (
                    <button
                        key={zone.id}
                        onClick={() => onZoneChange(zone.id)}
                        className="relative px-3 md:px-6 py-2 group flex items-center justify-center min-w-max"
                    >
                        <span className={`
                            text-[8px] md:text-[9px] font-bold tracking-[0.15em] md:tracking-[0.25em] transition-all duration-300 z-10
                            ${activeZone === zone.id 
                                ? 'text-[#00FF9D] drop-shadow-[0_0_8px_rgba(0,255,157,0.6)]' 
                                : 'text-neutral-500 group-hover:text-neutral-300'}
                        `}>
                            {zone.label}
                        </span>
                        
                        {activeZone === zone.id && (
                            <motion.div 
                                layoutId="nav-indicator"
                                className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#00FF9D] shadow-[0_0_12px_rgba(0,255,157,1)] rounded-t-full"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
                
            </div>
        </div>
    )
}
