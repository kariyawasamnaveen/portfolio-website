'use client'
import Image from 'next/image';

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiArrowLeft, FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Link from 'next/link'
import CodeSpotlight from '@/components/CodeSpotlight'

export default function ProjectDetailsClient({ project }: { project: any }) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isVideo, setIsVideo] = useState(false)

    // Handle images and video
    const images = Array.isArray(project.images) ? project.images : []
    const hasVideo = project.video_url && project.video_url !== '' && project.video_url !== '#'
    const totalMedia = images.length + (hasVideo ? 1 : 0)

    const handlePrevious = () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1)
            setIsVideo(false)
        } else {
            setSelectedIndex(totalMedia - 1)
            setIsVideo(hasVideo && selectedIndex === 0)
        }
    }

    const handleNext = () => {
        if (selectedIndex < totalMedia - 1) {
            const nextIndex = selectedIndex + 1
            setSelectedIndex(nextIndex)
            setIsVideo(hasVideo && nextIndex === images.length)
        } else {
            setSelectedIndex(0)
            setIsVideo(false)
        }
    }

    useEffect(() => {
        const onNext = () => handleNext();
        const onPrev = () => handlePrevious();
        window.addEventListener('ai-gallery-next', onNext);
        window.addEventListener('ai-gallery-previous', onPrev);
        return () => {
            window.removeEventListener('ai-gallery-next', onNext);
            window.removeEventListener('ai-gallery-previous', onPrev);
        };
    }, [handleNext, handlePrevious]);

    const selectMedia = (index: number, isVideoClick: boolean = false) => {
        setSelectedIndex(index)
        setIsVideo(isVideoClick)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link href="/projects">
                    <motion.button
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 font-semibold"
                    >
                        <FiArrowLeft size={20} />
                        <span>Back to Projects</span>
                    </motion.button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Media Gallery */}
                    <div className="space-y-4">
                        {/* Main Display */}
                        <div className="relative h-[500px] bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-2xl group">
                            <AnimatePresence mode="wait">
                                {isVideo && hasVideo ? (
                                    <motion.div
                                        key="video"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full"
                                    >
                                        <video
                                            controls
                                            autoPlay
                                            className="w-full h-full object-cover"
                                            src={project.video_url}
                                        >
                                            Your browser does not support video.
                                        </video>
                                    </motion.div>
                                ) : images[selectedIndex] ? (
                                    <motion.img
                                        key={`img-${selectedIndex}`}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        src={images[selectedIndex]}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white text-8xl font-bold opacity-20">
                                        {project.title.charAt(0)}
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            {totalMedia > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevious}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <FiChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <FiChevronRight size={24} />
                                    </button>
                                </>
                            )}

                            {/* Counter */}
                            {totalMedia > 0 && (
                                <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                                    {selectedIndex + 1} / {totalMedia}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {totalMedia > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={`thumb-${idx}`}
                                        onClick={() => selectMedia(idx, false)}
                                        className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-3 transition-all ${selectedIndex === idx && !isVideo
                                            ? 'border-blue-600 scale-105 shadow-lg'
                                            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
                                            }`}
                                    >
                                        <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}

                                {hasVideo && (
                                    <button
                                        onClick={() => selectMedia(images.length, true)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-3 transition-all relative ${isVideo
                                            ? 'border-blue-600 scale-105 shadow-lg'
                                            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
                                            }`}
                                    >
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <FiPlay size={28} className="text-white" />
                                        </div>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Project Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        {/* Title & Category */}
                        <div>
                            <div className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-semibold mb-4">
                                {project.category}
                            </div>
                            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {project.title}
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                {project.short_description}
                            </p>
                        </div>

                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {project.technologies.map((tech: string) => (
                                    <span
                                        key={tech}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-semibold border border-blue-200 dark:border-blue-800"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            {project.github_url && project.github_url !== '#' && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105"
                                >
                                    <FiGithub size={20} />
                                    <span>View Code</span>
                                </a>
                            )}
                            {project.demo_url && project.demo_url !== '#' && (
                                <a
                                    href={project.demo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105"
                                >
                                    <FiExternalLink size={20} />
                                    <span>Live Demo</span>
                                </a>
                            )}
                        </div>

                        {/* Problem → Solution → Results */}
                        <div className="space-y-6">
                            {project.problem && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border-l-4 border-red-500"
                                >
                                    <h3 className="text-xl font-bold mb-2 text-red-700 dark:text-red-400 flex items-center gap-2">
                                        <span>⚠️</span> The Problem
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {project.problem}
                                    </p>
                                </motion.div>
                            )}

                            {project.solution && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-l-4 border-green-500"
                                >
                                    <h3 className="text-xl font-bold mb-2 text-green-700 dark:text-green-400 flex items-center gap-2">
                                        <span>💡</span> The Solution
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {project.solution}
                                    </p>
                                </motion.div>
                            )}

                            {project.results && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500"
                                >
                                    <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                        <span>📈</span> Results & Impact
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                        {project.results}
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Full Description */}
                        {project.full_description && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                            >
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                    About This Project
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                    {project.full_description}
                                </p>
                            </motion.div>
                        )}

                        {/* Interactive Case Study */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12"
                        >
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                <span>⚡</span> Engineering Spotlight
                            </h3>
                            <CodeSpotlight
                                title={project.technologies?.includes('Python') ? "AI Model Inference" : "Real-time State Management"}
                                language={project.technologies?.includes('Python') ? 'python' : 'javascript'}
                                code={project.technologies?.includes('Python') ?
                                    `# Example: Processing data stream
def process_stream(data):
    results = []
    for item in data:
        if item['score'] > 0.8:
            results.append({
                'id': item['id'],
                'status': 'verified'
            })
    return results

print("Processing complete.")` :
                                    `// Example: Custom Hook for WebSocket
const useSocket = (url) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (e) => setData(e.data);
    return () => ws.close();
  }, [url]);

  return data;
}
console.log("Hook initialized");`}
                                description={project.technologies?.includes('Python') ?
                                    "Efficiently filtering high-confidence predictions from the raw model output stream." :
                                    "Handling persistent real-time connections with automatic cleanup and state synchronization."}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
