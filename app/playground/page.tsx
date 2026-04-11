'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import CodeEditor from '@/components/CodeEditor'

export default function PlaygroundPage() {
  const [language, setLanguage] = useState<'python' | 'javascript'>('python')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Background with Mouse Glow */}
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
                Code Playground
              </h1>
              <p className="text-lg text-gray-400">
                Try Python and JavaScript code right in your browser
              </p>
            </motion.div>

            {/* Language Tabs */}
            <div className="flex justify-center gap-3 mb-8">
              <motion.button
                onClick={() => setLanguage('python')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  language === 'python'
                    ? 'bg-[#26D4C4] text-black shadow-lg shadow-[#26D4C4]/20'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                🐍 Python
              </motion.button>
              <motion.button
                onClick={() => setLanguage('javascript')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  language === 'javascript'
                    ? 'bg-[#26D4C4] text-black shadow-lg shadow-[#26D4C4]/20'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                ⚡ JavaScript
              </motion.button>
            </div>

            {/* Code Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CodeEditor language={language} />
            </motion.div>

            {/* Flutter Widget Previews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-32 pt-16 border-t border-white/5"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  Flutter Widget Previews
                </h2>
                <p className="text-gray-400">
                  Examples of Flutter widgets I've built
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Custom Button', image: '/flutter/button.png' },
                  { title: 'Card Widget', image: '/flutter/card.png' },
                  { title: 'Form Input', image: '/flutter/form.png' },
                  { title: 'Navigation Bar', image: '/flutter/navbar.png' },
                  { title: 'Chart Widget', image: '/flutter/chart.png' },
                  { title: 'Animation Demo', image: '/flutter/animation.gif' },
                ].map((widget, index) => (
                  <motion.div
                    key={widget.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#26D4C4]/30 transition-all"
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-4xl">📱</span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white">{widget.title}</h3>
                      <p className="text-sm text-gray-400">Flutter Widget Example</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}