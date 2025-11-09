'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowRight, FiDownload } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  
  const skills = [
    'AI/ML Engineer',
    'Flutter Developer', 
    'Chatbot Specialist',
    'Web Developer'
  ]
  
  const [skillIndex, setSkillIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Subtle Grid */}
      <div className="fixed inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Minimal Mouse Glow */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 70%)`
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm font-medium text-white/80">Available for Work</span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl lg:text-8xl font-bold"
                >
                  <span className="text-white/60">Hi, I'm</span>
                  <br />
                  <span className="text-white">Naveen</span>
                </motion.h1>

                {/* Typing Animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl lg:text-3xl font-medium text-white/50 h-14 flex items-center"
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
                className="text-lg text-white/40 leading-relaxed max-w-xl"
              >
                Crafting intelligent AI/ML solutions, building stunning Flutter apps, 
                and creating innovative web experiences that drive real business value.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-12 py-6"
              >
                {[
                  { num: '50+', label: 'Projects' },
                  { num: '5+', label: 'Years' },
                  { num: '100%', label: 'Satisfaction' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-4xl font-bold text-white mb-1">{stat.num}</div>
                    <div className="text-sm text-white/30 font-medium">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-8 py-4 bg-white text-black rounded-xl font-bold flex items-center gap-2"
                  >
                    View Projects
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                
                <Link href="/calculator">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-bold transition-colors"
                  >
                    Calculate ROI
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-4 border border-white/10 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                  <FiDownload size={18} />
                  Resume
                </motion.button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-4 pt-4"
              >
                <span className="text-sm text-white/30">Connect:</span>
                {[
                  { Icon: FiGithub, href: 'https://github.com/kariyawasamnaveen' },
                  { Icon: FiLinkedin, href: 'https://linkedin.com' },
                  { Icon: FiMail, href: 'mailto:naveen@example.com' }
                ].map(({ Icon, href }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    target="_blank"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Subtle Background Glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[550px] h-[550px] bg-white/[0.02] rounded-full blur-3xl" />
              </div>

              {/* Main Image Container */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-[480px] h-[580px] rounded-[2rem] overflow-hidden"
                >
                  {/* Image with Gradient Fade */}
                  <img 
                    src="/naveen.png"
                    alt="Naveen"
                    className="w-full h-full object-cover grayscale-[20%]"
                  />
                  
                  {/* Subtle Bottom Fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  
                  {/* Noise Texture Overlay */}
                  <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")'
                    }} />
                  </div>
                </motion.div>

                {/* Floating Minimalist Icons */}
                <motion.div
                  animate={{ 
                    y: [-8, 8, -8],
                    rotate: [-2, 2, -2]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-6 top-24 w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-3xl"
                >
                  🤖
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [8, -8, 8],
                    rotate: [2, -2, 2]
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-6 bottom-32 w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-3xl"
                >
                  📱
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [-6, 6, -6],
                    rotate: [-1, 1, -1]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-12 -bottom-6 w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-3xl"
                >
                  🌐
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
          <span className="text-xs text-white/20 uppercase tracking-wider">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border border-white/10 flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-white/30 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Trusted Companies - Ultra Minimal */}
      <section className="relative py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[10px] uppercase tracking-[0.4em] text-white/20 mb-20"
          >
            Trusted by Industry Leaders
          </motion.p>

          <div className="grid grid-cols-3 lg:grid-cols-6 gap-16 items-center opacity-30">
            {['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix'].map((company, i) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ opacity: 0.6, scale: 1.05 }}
                className="transition-all cursor-pointer"
              >
                <div className="text-lg font-semibold text-center text-white/50">{company}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}