'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiCode, FiSmartphone, FiGlobe, FiTool } from 'react-icons/fi'

export default function ResumePage() {
  const [filter, setFilter] = useState('All')
  const [viewMode, setViewMode] = useState('grid')

  const skills = [
    { name: 'Python', level: 90, category: 'AI/ML', icon: '🐍' },
    { name: 'TensorFlow', level: 85, category: 'AI/ML', icon: '🧠' },
    { name: 'PyTorch', level: 80, category: 'AI/ML', icon: '🔥' },
    { name: 'NLP', level: 85, category: 'AI/ML', icon: '💬' },
    { name: 'Flutter', level: 90, category: 'Mobile', icon: '📱' },
    { name: 'Dart', level: 85, category: 'Mobile', icon: '🎯' },
    { name: 'Firebase', level: 80, category: 'Mobile', icon: '🔥' },
    { name: 'React', level: 85, category: 'Web', icon: '⚛️' },
    { name: 'Next.js', level: 80, category: 'Web', icon: '▲' },
    { name: 'TypeScript', level: 85, category: 'Web', icon: '📘' },
    { name: 'Git', level: 90, category: 'Tools', icon: '🔧' },
    { name: 'Docker', level: 75, category: 'Tools', icon: '🐳' },
  ]

  const experience = [
    {
      title: 'AI/ML Developer',
      company: 'Freelance',
      period: '2020 - Present',
      description: 'Building intelligent chatbots and ML solutions for businesses',
    },
    {
      title: 'Flutter Developer',
      company: 'Freelance',
      period: '2019 - Present',
      description: 'Creating beautiful cross-platform mobile applications',
    },
  ]

  const categories = ['All', 'AI/ML', 'Mobile', 'Web', 'Tools']
  const filteredSkills = filter === 'All' ? skills : skills.filter(s => s.category === filter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Interactive Resume
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Filter by technology to see relevant skills
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2 mx-auto">
            <FiDownload size={20} />
            Download PDF
          </button>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                filter === cat
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Section */}
        <motion.div layout className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{skill.icon}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {skill.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {skill.name}
                </h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 block">
                  {skill.level}%
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {exp.title}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 mb-2">
                  {exp.company} • {exp.period}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}