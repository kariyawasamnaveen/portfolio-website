'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowRight, FiDownload } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HeroSection() {
    const { scrollYProgress } = useScroll()
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    const skills = [
        'AI/ML Engineer',
        'Flutter Expert',
        'Full Stack Developer',
        'Data Scientist'
    ]

    const [skillIndex, setSkillIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    // Advanced typing effect
    useEffect(() => {
        const currentSkill = skills[skillIndex]
        const timeout = setTimeout(() => {
            if (!isDeleting && displayText.length < currentSkill.length) {
                setDisplayText(currentSkill.substring(0, displayText.length + 1))
            } else if (!isDeleting && displayText.length === currentSkill.length) {
                setTimeout(() => setIsDeleting(true), 2000)
            } else if (isDeleting && displayText.length > 0) {
                setDisplayText(currentSkill.substring(0, displayText.length - 1))
            } else if (isDeleting && displayText.length === 0) {
                setIsDeleting(false)
                setSkillIndex((prev) => (prev + 1) % skills.length)
            }
        }, isDeleting ? 50 : 100)

        return () => clearTimeout(timeout)
    }, [displayText, isDeleting, skillIndex])

    return (
        <section className="relative min-h-screen flex items-center px-6 lg:px-20">
            <div className="max-w-[1400px] mx-auto w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 max-w-xl"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-[#26D4C4]/30"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#26D4C4] animate-pulse" />
                            <span className="text-xs font-medium text-[#26D4C4]">Available for Work</span>
                        </motion.div>

                        {/* Main Heading */}
                        <div className="space-y-2">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl lg:text-6xl font-bold leading-tight"
                            >
                                <span className="text-white/90">Hi, I'm</span>
                                <br />
                                <span className="bg-gradient-to-r from-[#26D4C4] via-white to-[#26D4C4] bg-clip-text text-transparent">
                                    Naveen
                                </span>
                                <br />
                                <span className="text-2xl lg:text-3xl text-gray-400 font-normal">
                                    Kariyawasam
                                </span>
                            </motion.h1>

                            {/* Typing Animation */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-xl lg:text-2xl font-semibold text-[#26D4C4] h-10 flex items-center"
                            >
                                {displayText}
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="ml-1"
                                >
                                    |
                                </motion.span>
                            </motion.div>
                        </div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-base text-gray-400 leading-relaxed max-w-lg"
                        >
                            Final-year Computer Science undergraduate at <span className="text-white">University of Kelaniya</span>.
                            Specializing in <span className="text-[#26D4C4]">AI/ML</span> and <span className="text-[#26D4C4]">Flutter</span>.
                            I build intelligent mobile apps and scalable web solutions.
                        </motion.p>

                        {/* Stats - Compact Inline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex gap-6 py-4"
                        >
                            {[
                                { num: '50+', label: 'Projects' },
                                { num: '4.9', label: 'Rating' },
                                { num: '100%', label: 'Delivery' }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-2xl font-bold text-[#26D4C4] mb-0.5">{stat.num}</div>
                                    <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons - Compact */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-wrap gap-3"
                        >
                            <Link href="/projects">
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(38,212,196,0.4)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group px-6 py-3 bg-[#26D4C4] text-black rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-[#26D4C4]/20 text-sm"
                                >
                                    View Projects
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                </motion.button>
                            </Link>

                            <Link href="/calculator">
                                <motion.button
                                    whileHover={{ scale: 1.02, borderColor: '#26D4C4' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-3 bg-transparent border-2 border-white/20 text-white rounded-lg font-bold hover:bg-white/5 transition-all text-sm"
                                >
                                    Calculate ROI
                                </motion.button>
                            </Link>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
                            >
                                <FiDownload size={16} />
                                Resume
                            </motion.button>
                        </motion.div>

                        {/* Social Links - Compact */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="flex items-center gap-3 pt-2"
                        >
                            <span className="text-xs text-gray-500">Connect:</span>
                            {[
                                { Icon: FiGithub, href: 'https://github.com/kariyawasamnaveen' },
                                { Icon: FiLinkedin, href: 'https://linkedin.com' },
                                { Icon: FiMail, href: 'mailto:naveen@example.com' }
                            ].map(({ Icon, href }, i) => (
                                <motion.a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#26D4C4] hover:text-black hover:border-[#26D4C4] transition-all"
                                >
                                    <Icon size={16} />
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right - Profile Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 4, repeat: Infinity }
                                }}
                                className="w-[500px] h-[500px] rounded-full border border-[#26D4C4]/20"
                            />
                            <motion.div
                                animate={{
                                    rotate: -360,
                                    scale: [1, 0.9, 1]
                                }}
                                transition={{
                                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 5, repeat: Infinity }
                                }}
                                className="absolute w-[550px] h-[550px] rounded-full border border-[#26D4C4]/10"
                            />
                        </div>

                        {/* Main Image Container */}
                        <div className="relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative w-[400px] h-[400px] rounded-[3rem] overflow-hidden"
                            >
                                {/* Gradient Border */}
                                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-[#26D4C4] via-white/20 to-[#26D4C4] p-[3px]">
                                    <div className="w-full h-full rounded-[3rem] bg-black" />
                                </div>

                                {/* Image */}
                                <img
                                    src="/naveen.png"
                                    alt="Naveen"
                                    className="absolute inset-[3px] rounded-[3rem] object-cover"
                                />

                                {/* Overlay Glow */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[3rem]" />
                            </motion.div>

                            {/* Floating Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#26D4C4] text-black rounded-2xl font-bold shadow-2xl shadow-[#26D4C4]/40 whitespace-nowrap"
                            >
                                ✨ Open to Opportunities
                            </motion.div>

                            {/* Floating Tech Stack Icons - Scattered */}
                            {/* Top Area */}
                            <motion.div
                                animate={{
                                    y: [-8, 8, -8],
                                    rotate: [-2, 2, -2]
                                }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-0 top-10 w-16 h-16 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all"
                            >
                                <img src="/icons/flutter.jpg" alt="Flutter" className="w-full h-full object-contain" />
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [8, -8, 8],
                                    rotate: [2, -2, 2]
                                }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute right-20 top-0 w-16 h-16 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all"
                            >
                                <img src="/icons/python.png" alt="Python" className="w-full h-full object-contain" />
                            </motion.div>

                            {/* Left Side */}
                            <motion.div
                                animate={{
                                    y: [-6, 6, -6],
                                    rotate: [-1, 1, -1]
                                }}
                                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -left-20 top-1/3 w-16 h-16 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all"
                            >
                                <img src="/icons/react.png" alt="React" className="w-full h-full object-contain" />
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [-5, 5, -5],
                                    rotate: [0, 2, 0]
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -left-16 bottom-32 w-14 h-14 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all"
                            >
                                <img src="/icons/ai.png" alt="AI/ML" className="w-full h-full object-contain" />
                            </motion.div>

                            {/* Right Side */}
                            <motion.div
                                animate={{
                                    y: [6, -6, 6],
                                    rotate: [1, -1, 1]
                                }}
                                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-20 top-1/3 w-16 h-16 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all"
                            >
                                <img src="/icons/javascript.jpg" alt="JavaScript" className="w-full h-full object-contain" />
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [7, -7, 7],
                                    rotate: [-1, 1, -1]
                                }}
                                transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-16 bottom-28 w-14 h-14 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all"
                            >
                                <img src="/icons/dart.png" alt="Dart" className="w-full h-full object-contain" />
                            </motion.div>

                            {/* Bottom Area */}
                            <motion.div
                                animate={{
                                    y: [-4, 4, -4],
                                    rotate: [1, -1, 1]
                                }}
                                transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-8 -bottom-16 w-14 h-14 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all"
                            >
                                <img src="/icons/langchain.webp" alt="LangChain" className="w-full h-full object-contain" />
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [5, -5, 5],
                                    rotate: [-2, 2, -2]
                                }}
                                transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute right-4 -bottom-14 w-14 h-14 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all"
                            >
                                <img src="/icons/r.png" alt="R" className="w-full h-full object-contain" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
                <span className="text-xs text-gray-500 uppercase tracking-wider">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-[#26D4C4]/30 flex items-start justify-center p-2"
                >
                    <motion.div className="w-1 h-2 bg-[#26D4C4] rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    )
}
