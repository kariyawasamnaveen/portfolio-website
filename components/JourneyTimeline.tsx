'use client'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { FiBriefcase, FiAward, FiBook } from 'react-icons/fi'

interface Milestone {
    year: string
    title: string
    subtitle: string
    description: string
    icon: any
    type: 'work' | 'education' | 'award'
}

const milestones: Milestone[] = [
    {
        year: '2024 - Present',
        title: 'Senior Full Stack Engineer',
        subtitle: 'TechCorp Solutions',
        description: 'Leading a team of 5 developers building scalable microservices. Optimized database queries reducing load times by 40%.',
        icon: FiBriefcase,
        type: 'work'
    },
    {
        year: '2023',
        title: 'B.Sc. Computer Science',
        subtitle: 'University of Kelaniya',
        description: 'First Class Honours. Specialized in Artificial Intelligence and Machine Learning. Research focused on NLP for local languages.',
        icon: FiBook,
        type: 'education'
    },
    {
        year: '2022 - 2023',
        title: 'Mobile App Developer Intern',
        subtitle: 'AppStudio',
        description: 'Developed 3 cross-platform mobile applications using Flutter. Implemented complex UI designs and real-time chat features.',
        icon: FiBriefcase,
        type: 'work'
    },
    {
        year: '2022',
        title: 'Best Innovation Award',
        subtitle: 'HackX 2022',
        description: 'Won 1st place for "SmartAgro", an IoT based solution for monitoring crop health using drone imagery.',
        icon: FiAward,
        type: 'award'
    },
    {
        year: '2020',
        title: 'Started Coding Journey',
        subtitle: 'Self-Taught',
        description: 'Began learning Python and JavaScript. Built first portfolio website and several CLI tools.',
        icon: FiBook,
        type: 'education'
    }
]

export default function JourneyTimeline() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    return (
        <section className="relative py-20 overflow-hidden" ref={containerRef}>
            <div className="max-w-7xl mx-auto px-6 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        My Journey
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A timeline of my professional growth, key milestones, and the path that led me here.
                    </p>
                </motion.div>

                {/* Central Line */}
                <div className="absolute left-9 md:left-1/2 top-40 bottom-40 w-1 bg-white/10 -translate-x-1/2 rounded-full hidden md:block" />
                <motion.div
                    className="absolute left-9 md:left-1/2 top-40 bottom-40 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 -translate-x-1/2 origin-top rounded-full hidden md:block"
                    style={{ scaleY }}
                />

                {/* Mobile Line */}
                <div className="absolute left-6 top-40 bottom-20 w-1 bg-white/10 rounded-full md:hidden" />
                <motion.div
                    className="absolute left-6 top-40 bottom-20 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 origin-top rounded-full md:hidden"
                    style={{ scaleY }}
                />

                <div className="space-y-12 md:space-y-24 relative z-10">
                    {milestones.map((item, index) => (
                        <TimelineItem key={index} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function TimelineItem({ item, index }: { item: Milestone, index: number }) {
    const isEven = index % 2 === 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 relative ${isEven ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Date (Desktop) */}
            <div className={`hidden md:block flex-1 text-right ${isEven ? 'text-left' : ''}`}>
                <div className="text-2xl font-bold text-white/20 mb-1">{item.year}</div>
            </div>

            {/* Icon Node */}
            <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center group hover:border-blue-500/50 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <item.icon className="w-5 h-5 md:w-8 md:h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>

            {/* Content Card */}
            <div className="flex-1 w-full pl-12 md:pl-0">
                <div className={`relative bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/10 transition-colors group ${isEven ? 'md:text-right' : ''}`}>
                    {/* Date (Mobile) */}
                    <div className="md:hidden text-sm font-bold text-blue-400 mb-2">{item.year}</div>

                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {item.title}
                    </h3>
                    <div className="text-blue-300 font-medium mb-4">{item.subtitle}</div>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                        {item.description}
                    </p>

                    {/* Mobile Arrow */}
                    <div className="absolute left-[-6px] top-8 w-3 h-3 bg-[#1a1a1a] border-l border-b border-white/10 rotate-45 md:hidden" />

                    {/* Desktop Arrows */}
                    <div className={`hidden md:block absolute top-[28px] w-4 h-4 bg-[#1a1a1a] border-t border-r border-white/10 rotate-45 ${isEven ? 'right-[-8px]' : 'left-[-8px] rotate-[-135deg] border-t-0 border-r-0 border-b border-l'}`} />
                </div>
            </div>
        </motion.div>
    )
}
