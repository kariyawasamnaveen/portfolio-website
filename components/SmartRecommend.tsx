'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ProjectCard from './ProjectCard'

export default function SmartRecommend() {
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const viewedProjects = JSON.parse(localStorage.getItem('viewedProjects') || '[]')
    
    if (viewedProjects.length > 0) {
      fetchRecommendations(viewedProjects)
    }
  }, [])

  const fetchRecommendations = async (viewedIds: number[]) => {
    try {
      const res = await fetch('/api/projects')
      const allProjects = await res.json()
      
      const recommended = allProjects
        .filter((p: any) => !viewedIds.includes(p.id))
        .slice(0, 3)
      
      setRecommendations(recommended)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  if (recommendations.length === 0) return null

  return (
    <section className="mt-32 pt-16 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
          You Might Also Like
        </h2>
        <p className="text-gray-400">
          Based on your viewing history
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((project: any, index: number) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}