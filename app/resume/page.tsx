'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'
import Navbar from '@/components/Navbar'

export default function ResumePage() {
  const [filter, setFilter] = useState('All')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const categories = ['All', 'AI/ML', 'Mobile', 'Web', 'Tools']

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const skills = [
    { name: 'Python', category: 'AI/ML', level: 90, icon: '🐍' },
    { name: 'TensorFlow', category: 'AI/ML', level: 85, icon: '🧠' },
    { name: 'PyTorch', category: 'AI/ML', level: 80, icon: '🔥' },
    { name: 'NLP', category: 'AI/ML', level: 85, icon: '💬' },
    { name: 'Flutter', category: 'Mobile', level: 90, icon: '📱' },
    { name: 'Dart', category: 'Mobile', level: 88, icon: '🎯' },
    { name: 'React', category: 'Web', level: 85, icon: '⚛️' },
    { name: 'Next.js', category: 'Web', level: 80, icon: '▲' },
    { name: 'TypeScript', category: 'Web', level: 85, icon: '📘' },
    { name: 'Node.js', category: 'Web', level: 80, icon: '🟢' },
    { name: 'Git', category: 'Tools', level: 90, icon: '🔧' },
    { name: 'Docker', category: 'Tools', level: 75, icon: '🐳' },
  ]

  const filteredSkills = filter === 'All' 
    ? skills 
    : skills.filter(s => s.category === filter)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Same Grid Background with Mouse Glow */}
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#26D4C410_1px,transparent_1px),linear-gradient(to_bottom,#26D4C410_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(38,212,196,0.15), transparent 50%)`
            }}
          />
        </div>

        {/* Content */}
        <div className="relative py-32 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white">
                Interactive Resume
              </h1>
              <p className="text-lg text-gray-400">
                Filter by technology to see relevant skills
              </p>
              
              {/* Download Button */}
              <motion.a
                href="/resume.pdf"
                download
                whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(38,212,196,0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#26D4C4] text-black rounded-lg font-bold shadow-lg shadow-[#26D4C4]/20"
              >
                <FiDownload size={18} />
                Download PDF
              </motion.a>
            </motion.div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    filter === cat
                      ? 'bg-[#26D4C4] text-black shadow-lg shadow-[#26D4C4]/20'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:border-[#26D4C4]/30'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            {/* Skills Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Technical Skills
              </h2>
              
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{skill.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                          <span className="text-xs text-gray-500">{skill.category}</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#26D4C4]">{skill.level}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className="h-full bg-gradient-to-r from-[#26D4C4] to-white rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Experience Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Experience
              </h2>
              
              <div className="space-y-6 max-w-3xl mx-auto">
                {[
                  {
                    role: 'AI/ML Engineer',
                    company: 'Tech Company',
                    period: '2022 - Present',
                    description: 'Developed AI solutions using Python, TensorFlow, and PyTorch'
                  },
                  {
                    role: 'Flutter Developer',
                    company: 'Mobile Solutions',
                    period: '2020 - 2022',
                    description: 'Built cross-platform mobile applications'
                  }
                ].map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      <span className="text-sm text-gray-500">{exp.period}</span>
                    </div>
                    <p className="text-[#26D4C4] font-semibold mb-2">{exp.company}</p>
                    <p className="text-gray-400">{exp.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}