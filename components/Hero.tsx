'use client'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowDown } from 'react-icons/fi'
import { useState, useEffect } from 'react'

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentSkill, setCurrentSkill] = useState(0)
  const skills = ['AI/ML Engineer', 'Flutter Developer', 'Web Developer', 'Chatbot Specialist']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skills.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Spotlight Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(38, 212, 196, 0.1), transparent 40%)`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Profile Photo */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <div className="relative w-80 h-80 mx-auto">
            {/* Animated Border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #26D4C4, transparent, #26D4C4)',
                padding: '4px'
              }}
            />
            
            {/* Inner Glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#26D4C4]/20 to-black blur-xl" />
            
            {/* Photo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute inset-2 rounded-full overflow-hidden border-4 border-black"
            >
              <img 
                src="/naveen.png" 
                alt="Naveen Kariyawasam"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Status Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#26D4C4] text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Available for Hire
            </motion.div>
          </div>

          {/* Floating Tech Icons */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-10 -left-10 w-16 h-16 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center"
          >
            <span className="text-3xl">🤖</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute bottom-10 -right-10 w-16 h-16 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center"
          >
            <span className="text-3xl">📱</span>
          </motion.div>
        </motion.div>

        {/* Right: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center md:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-[#26D4C4]/20 text-[#26D4C4] rounded-full text-sm font-semibold border border-[#26D4C4]/50">
              👋 Welcome to my portfolio
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Hi, I'm </span>
            <span className="bg-gradient-to-r from-[#26D4C4] to-white bg-clip-text text-transparent">
              Naveen
            </span>
          </h1>

          <div className="h-16 mb-6">
            <motion.h2
              key={currentSkill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-2xl md:text-3xl text-white font-semibold"
            >
              {skills[currentSkill]}
            </motion.h2>
          </div>

          <p className="text-gray-400 text-lg mb-8 max-w-xl">
            Building intelligent solutions with <span className="text-[#26D4C4]">AI/ML</span>, 
            creating beautiful mobile apps with <span className="text-[#26D4C4]">Flutter</span>, 
            and developing interactive web experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(38, 212, 196, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="px-8 py-4 bg-[#26D4C4] text-black rounded-lg font-bold hover:bg-[#26D4C4]/90 transition-all"
            >
              View My Work
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#calculator"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-bold border-2 border-white/20 hover:border-[#26D4C4] transition-all"
            >
              Calculate ROI
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/resume.pdf"
              download
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-bold border-2 border-white/20 hover:border-[#26D4C4] transition-all flex items-center gap-2"
            >
              <FiDownload />
              Resume
            </motion.a>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 justify-center md:justify-start">
            <motion.a
              whileHover={{ scale: 1.2, color: '#26D4C4' }}
              href="https://github.com/kariyawasamnaveen"
              target="_blank"
              className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <FiGithub size={24} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, color: '#26D4C4' }}
              href="https://linkedin.com"
              target="_blank"
              className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <FiLinkedin size={24} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, color: '#26D4C4' }}
              href="mailto:naveen@example.com"
              className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <FiMail size={24} />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#26D4C4] cursor-pointer"
      >
        <FiArrowDown size={32} />
      </motion.div>
    </section>
  )
}