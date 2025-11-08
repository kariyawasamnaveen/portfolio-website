'use client'
import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { trackProjectView } from '@/lib/analytics'

interface Project {
  id: number
  title: string
  short_description?: string
  description?: string
  image?: string
  images?: string[]
  tags?: string[]
  technologies?: string[]
  category: string
  github_url?: string
  github?: string
  demo_url?: string
  demo?: string
  video_url?: string
}

export default function ProjectCard({ project }: { project: Project }) {
  const handleClick = () => {
    trackProjectView(project.id)
  }

  // Handle both old JSON and new database format
  const description = project.short_description || project.description || ''
  const tags = project.technologies || project.tags || []
  const githubUrl = project.github_url || project.github || '#'
  const demoUrl = project.demo_url || project.demo || '#'
  const imageUrl = project.images?.[0] || project.image || ''

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      onClick={handleClick}
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
        {imageUrl ? (
          <img src={imageUrl} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold opacity-20">
            {project.title.charAt(0)}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {githubUrl && githubUrl !== '#' && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
              onClick={(e) => e.stopPropagation()}
            >
              <FiGithub size={20} />
              <span>Code</span>
            </a>
          )}
          {demoUrl && demoUrl !== '#' && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink size={20} />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}