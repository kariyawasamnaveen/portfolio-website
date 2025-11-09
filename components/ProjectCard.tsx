'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FiGithub, FiExternalLink, FiX, FiZoomIn, FiPlay, FiPause } from 'react-icons/fi'
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  const description = project.short_description || project.description || ''
  const tags = project.technologies || project.tags || []
  const githubUrl = project.github_url || project.github || '#'
  const demoUrl = project.demo_url || project.demo || '#'

  const allMedia = [
    ...(project.images || (project.image ? [project.image] : [])).map(img => ({ type: 'image' as const, src: img })),
    ...(project.video_url ? [{ type: 'video' as const, src: project.video_url }] : [])
  ]

  const currentMedia = allMedia[selectedIndex]

  const nextMedia = () => {
    setSelectedIndex((prev) => (prev + 1) % allMedia.length)
    setIsVideoPlaying(false)
  }

  const prevMedia = () => {
    setSelectedIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)
    setIsVideoPlaying(false)
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group"
        onClick={() => trackProjectView(project.id)}
      >
        {/* Main Display with Hover Effect */}
        <div className="relative h-64 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          {currentMedia?.type === 'image' && (
            <motion.img 
              key={selectedIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={currentMedia.src} 
              alt={project.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
          )}

          {currentMedia?.type === 'video' && (
            <div className="relative w-full h-full">
              {!isVideoPlaying ? (
                <div className="relative w-full h-full">
                  <video src={currentMedia.src} className="w-full h-full object-contain bg-black" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setIsVideoPlaying(true) }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 backdrop-blur-sm transition-all"
                  >
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                      <FiPlay className="w-10 h-10 text-blue-600 ml-1" />
                    </div>
                  </motion.button>
                </div>
              ) : (
                <video
                  src={currentMedia.src}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                  onEnded={() => setIsVideoPlaying(false)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          )}

          {!currentMedia && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-7xl font-bold opacity-20">
                {project.title.charAt(0)}
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true) }}
              className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full font-semibold text-gray-900 flex items-center gap-2 shadow-xl"
            >
              <FiZoomIn size={20} />
              View Gallery
            </motion.button>
          </div>

          {/* Media Counter */}
          {allMedia.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              {selectedIndex + 1} / {allMedia.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {allMedia.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); prevMedia() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); nextMedia() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                →
              </motion.button>
            </>
          )}

          {/* Progress Bar */}
          {allMedia.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${((selectedIndex + 1) / allMedia.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {allMedia.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50 dark:bg-gray-900 scrollbar-hide">
            {allMedia.map((media, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx); setIsVideoPlaying(false) }}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                  selectedIndex === idx 
                    ? 'ring-3 ring-blue-500 shadow-lg scale-105' 
                    : 'ring-1 ring-gray-300 opacity-60 hover:opacity-100 hover:ring-blue-300'
                }`}
              >
                {media.type === 'image' ? (
                  <img src={media.src} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <video src={media.src} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <FiPlay className="w-5 h-5 text-white" />
                    </div>
                  </>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((tag, idx) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <div className="flex gap-3">
            {githubUrl && githubUrl !== '#' && (
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-all shadow-md hover:shadow-lg font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <FiGithub size={20} />
                Code
              </motion.a>
            )}
            {demoUrl && demoUrl !== '#' && (
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={demoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink size={20} />
                Live Demo
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10"
            >
              <FiX size={24} />
            </motion.button>

            <div className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              >
                {currentMedia?.type === 'image' ? (
                  <img 
                    src={currentMedia.src} 
                    alt={project.title} 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <video
                    src={currentMedia?.src}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}

                {allMedia.length > 1 && (
                  <>
                    <button
                      onClick={prevMedia}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextMedia}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl"
                    >
                      →
                    </button>
                  </>
                )}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold">
                  {selectedIndex + 1} / {allMedia.length}
                </div>
              </motion.div>

              {/* Thumbnail Strip */}
              <div className="flex gap-3 mt-6 justify-center overflow-x-auto pb-2">
                {allMedia.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedIndex(idx); setIsVideoPlaying(false) }}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                      selectedIndex === idx ? 'ring-4 ring-blue-500 scale-110' : 'ring-2 ring-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img src={media.src} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <video src={media.src} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <FiPlay className="w-6 h-6 text-white" />
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}