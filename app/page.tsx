'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const [text, setText] = useState('')
  const skills = ['AI/ML Engineer', 'Flutter Developer', 'Chatbot Specialist', 'Web Developer']
  const [skillIndex, setSkillIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (charIndex < skills[skillIndex].length) {
      const timeout = setTimeout(() => {
        setText(skills[skillIndex].substring(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 100)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCharIndex(0)
        setText('')
        setSkillIndex((skillIndex + 1) % skills.length)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [charIndex, skillIndex])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Naveen
            </span>
          </h1>
          
          <div className="h-20 mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200">
              {text}
              <span className="animate-pulse">|</span>
            </h2>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Building intelligent solutions with AI/ML, creating beautiful mobile apps with Flutter, 
            and developing interactive web experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
              >
                View My Work
              </motion.button>
            </Link>
            <Link href="/calculator">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 transition"
              >
                Calculate ROI
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20"
        >
          <div className="flex justify-center gap-8 text-gray-600 dark:text-gray-400">
            <div>
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-sm">Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">5+</div>
              <div className="text-sm">Years Exp</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">100%</div>
              <div className="text-sm">Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}