'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import SmartRecommend from '@/components/SmartRecommend'
import AiSearch from '@/components/AiSearch'
import { PROJECTS_DATA } from '@/data/projects'

export default function ProjectsPage() {
  const [filter, setFilter] = useState('All')
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const categories = ['All', 'AI/ML', 'Flutter', 'Web']

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (Array.isArray(data)) {
        setProjects(data.length > 0 ? data : PROJECTS_DATA)
      } else {
        console.error('API returned non-array data:', data)
        setProjects(PROJECTS_DATA)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects(PROJECTS_DATA)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p: any) => p.category === filter)

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-xl text-white/40">Loading projects...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background text-white overflow-hidden">
        {/* Same Grid Background as Home */}
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
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16 space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white">
                My Projects
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Explore my latest work in AI/ML, Flutter, and Web Development
              </p>
            </motion.div>



            {/* AI Search */}
            <AiSearch projects={projects} />

            {/* Filter Buttons - Matching Home Style */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${filter === cat
                    ? 'bg-[#26D4C4] text-black shadow-lg shadow-[#26D4C4]/20'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:border-[#26D4C4]/30'
                    }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            {/* Projects Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project: any) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center text-gray-500 py-20">
                No projects found in this category.
              </div>
            )}

            {/* Smart Recommendations */}
            <SmartRecommend />
          </div>
        </div >
      </div >
    </>
  )
}