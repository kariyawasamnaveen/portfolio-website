'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
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
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const handleClick = () => {
    trackProjectView(project.id)
  }

  const description = project.short_description || project.description || ''
  const tags = project.technologies || project.tags || []
  const githubUrl = project.github_url || project.github || '#'
  const demoUrl = project.demo_url || project.demo || '#'

  // Combine all media
  const allMedia = [
    ...(project.images || (project.image ? [project.image] : [])).map(img => ({ type: 'image' as const, src: img })),
    ...(project.video_url ? [{ type: 'video' as const, src: project.video_url }] : [])
  ]

  const currentMedia = allMedia[selectedIndex]

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      onClick={handleClick}
    >
      {/* Main Display */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
        {currentMedia?.type === 'image' && (
          <img src={currentMedia.src} alt={project.title} className="w-full h-full object-cover" />
        )}

        {currentMedia?.type === 'video' && (
          <div className="relative w-full h-full">
            {!isVideoPlaying ? (
              <div className="relative w-full h-full">
                <video src={currentMedia.src} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); setIsVideoPlaying(true) }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40"
                >
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            ) : (
              <video
                src={currentMedia.src}
                controls
                autoPlay
                className="w-full h-full object-cover"
                onEnded={() => setIsVideoPlaying(false)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        )}

        {!currentMedia && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold opacity-20">
            {project.title.charAt(0)}
          </div>
        )}

        {/* Counter */}
        {allMedia.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
            {selectedIndex + 1}/{allMedia.length}
          </div>
        )}

        {/* Arrows */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(prev => prev === 0 ? allMedia.length - 1 : prev - 1) }}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center"
            >
              ←
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(prev => prev === allMedia.length - 1 ? 0 : prev + 1) }}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex gap-1 p-2 overflow-x-auto bg-gray-50 dark:bg-gray-900">
          {allMedia.map((media, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx); setIsVideoPlaying(false) }}
              className={`relative flex-shrink-0 w-14 h-14 rounded overflow-hidden border ${
                selectedIndex === idx ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 opacity-60 hover:opacity-100'
              }`}
            >
              {media.type === 'image' ? (
                <img src={media.src} alt="" className="w-full h-full object-cover" />
              ) : (
                <>
                  <video src={media.src} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {githubUrl && githubUrl !== '#' && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600" onClick={(e) => e.stopPropagation()}>
              <FiGithub size={20} />
              Code
            </a>
          )}
          {demoUrl && demoUrl !== '#' && (
            <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600" onClick={(e) => e.stopPropagation()}>
              <FiExternalLink size={20} />
              Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}