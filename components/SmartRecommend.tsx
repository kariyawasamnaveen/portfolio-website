'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { getViewedProjects, getSimilarProjects } from '@/lib/analytics'
import projectsData from '@/lib/projects.json'

export default function SmartRecommend() {
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    const viewedIds = getViewedProjects()
    if (viewedIds.length === 0) return

    const lastViewedId = viewedIds[viewedIds.length - 1]
    const lastViewed = projectsData.find(p => p.id === lastViewedId)
    
    if (lastViewed) {
      const similar = getSimilarProjects(lastViewed, projectsData)
      setRecommendations(similar)
    }
  }, [])

  if (recommendations.length === 0) return null

  return (
    <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          You Might Also Like
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Based on your viewing history
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}