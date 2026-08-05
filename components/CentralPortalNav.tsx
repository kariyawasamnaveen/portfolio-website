'use client'

import { motion } from 'framer-motion'

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
        <div className="bottom-nav-dock">
            {zones.map((zone) => (
                <button
                    key={zone.id}
                    onClick={() => onZoneChange(zone.id)}
                    className="relative px-6 py-2 group"
                >
                    <span className={`
                        text-[10px] font-bold tracking-[0.2em] transition-colors duration-300
                        ${activeZone === zone.id ? 'text-amber-500' : 'text-neutral-500 group-hover:text-white'}
                    `}>
                        {zone.label}
                    </span>
                    
                    {activeZone === zone.id && (
                        <motion.div 
                            layoutId="nav-indicator"
                            className="absolute -bottom-2 left-0 right-0 h-[2px] bg-amber-500"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>
            ))}
            
            {/* Minimal Decorative Ring - now just part of the dock decoration */}
            <div className="w-[1px] h-4 bg-neutral-800 mx-2" />
            <div className="w-8 h-8 rounded-full border border-amber-500/20 flex items-center justify-center animate-spin-slow">
                <div className="w-1 h-1 bg-amber-500 rounded-full" />
            </div>
        </div>
    )
}
