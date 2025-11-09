'use client'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowDown } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentSkill, setCurrentSkill] = useState(0)
  const [counts, setCounts] = useState({ projects: 0, years: 0, satisfaction: 0 })
  
  const skills = ['AI/ML Engineer', 'Flutter Developer', 'Chatbot Specialist', 'Web Developer']

  // Typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skills.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Counter animation
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      setCounts({
        projects: Math.floor((50 * step) / steps),
        years: Math.floor((5 * step) / steps),
        satisfaction: Math.floor((100 * step) / steps)
      })
      if (step === steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const clients = [
    { name: 'Google', logo: '🔍' },
    { name: 'Meta', logo: '📘' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Microsoft', logo: '🪟' },
    { name: 'Apple', logo: '🍎' },
    { name: 'Netflix', logo: '🎬' }
  ]

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Dot Grid Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #26D4C4 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Spotlight Effect */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(38, 212, 196, 0.15), transparent 40%)`
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left: Profile Photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group order-2 md:order-1"
          >
            <div className="relative w-80 h-80 mx-auto">
              {/* Rotating Border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #26D4C4, transparent, #26D4C4)',
                  padding: '4px'
                }}
              />
              
              {/* Glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#26D4C4]/30 to-black blur-2xl" />
              
              {/* Photo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute inset-2 rounded-full overflow-hidden border-4 border-black bg-gradient-to-br from-gray-800 to-gray-900"
              >
                <img 
                  src="/naveen.png" 
                  alt="Naveen"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Status Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#26D4C4] text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-xl"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Available for Hire
              </motion.div>
            </div>

            {/* Floating Icons */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-10 -left-10 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20"
            >
              <span className="text-4xl">🤖</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-10 -right-10 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20"
            >
              <span className="text-4xl">📱</span>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center md:text-left order-1 md:order-2"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block mb-6"
            >
              <span className="px-5 py-2 bg-[#26D4C4]/20 text-[#26D4C4] rounded-full text-sm font-semibold border border-[#26D4C4]/50 backdrop-blur-sm">
                👋 Welcome to my portfolio
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Hi, I'm </span>
              <span className="bg-gradient-to-r from-[#26D4C4] via-white to-[#26D4C4] bg-clip-text text-transparent">
                Naveen
              </span>
            </h1>

            {/* Typing Effect */}
            <div className="h-20 mb-6">
              <motion.h2
                key={currentSkill}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-2xl md:text-4xl font-semibold"
                style={{ color: '#26D4C4' }}
              >
                {skills[currentSkill]}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  |
                </motion.span>
              </motion.h2>
            </div>

            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
              Building intelligent solutions with <span className="text-[#26D4C4] font-semibold">AI/ML</span>, 
              creating beautiful mobile apps with <span className="text-[#26D4C4] font-semibold">Flutter</span>, 
              and developing interactive web experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start">
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(38, 212, 196, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#26D4C4] text-black rounded-xl font-bold hover:bg-[#26D4C4]/90 transition-all shadow-lg"
                >
                  View My Work
                </motion.button>
              </Link>
              <Link href="/calculator">
                <motion.button
                  whileHover={{ scale: 1.05, borderColor: '#26D4C4' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-xl font-bold border-2 border-white/20 hover:bg-white/10 transition-all"
                >
                  Calculate ROI
                </motion.button>
              </Link>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/resume.pdf"
                download
                className="px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-xl font-bold border-2 border-white/20 hover:border-[#26D4C4] transition-all flex items-center gap-2"
              >
                <FiDownload />
                Resume
              </motion.a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center md:justify-start">
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                href="https://github.com/kariyawasamnaveen"
                target="_blank"
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#26D4C4] hover:text-black transition-all border border-white/20"
              >
                <FiGithub size={22} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                href="https://linkedin.com"
                target="_blank"
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#26D4C4] hover:text-black transition-all border border-white/20"
              >
                <FiLinkedin size={22} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                href="mailto:naveen@example.com"
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#26D4C4] hover:text-black transition-all border border-white/20"
              >
                <FiMail size={22} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        >
          <span className="text-[#26D4C4] text-sm font-medium">Scroll Down</span>
          <FiArrowDown className="text-[#26D4C4]" size={28} />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Projects', value: counts.projects, suffix: '+', icon: '🚀' },
              { label: 'Years Exp', value: counts.years, suffix: '+', icon: '⭐' },
              { label: 'Satisfaction', value: counts.satisfaction, suffix: '%', icon: '❤️' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-10 border border-white/10 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#26D4C4]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative text-center">
                  <div className="text-5xl mb-4">{stat.icon}</div>
                  <div className="text-6xl font-bold mb-3 text-[#26D4C4]">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-white font-semibold text-lg">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="relative py-24 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm uppercase tracking-wider mb-16 font-semibold"
          >
            Trusted by Leading Companies
          </motion.h3>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-10">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.15, y: -8 }}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className="text-6xl grayscale group-hover:grayscale-0 transition-all duration-300">
                  {client.logo}
                </div>
                <div className="text-xs text-gray-600 group-hover:text-[#26D4C4] transition-colors font-medium">
                  {client.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}