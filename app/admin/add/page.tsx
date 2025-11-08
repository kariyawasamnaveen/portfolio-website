'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiUpload } from 'react-icons/fi'

export default function AddProject() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    problem: '',
    solution: '',
    results: '',
    technologies: '',
    category: 'AI/ML',
    github_url: '',
    demo_url: '',
  })

  const [images, setImages] = useState<File[]>([])
  const [video, setVideo] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0])
    }
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploadingFiles(true)

    try {
      // Upload images
      const imageUrls = await Promise.all(images.map(img => uploadFile(img)))
      
      // Upload video
      let videoUrl = ''
      if (video) {
        videoUrl = await uploadFile(video)
      }

      setUploadingFiles(false)

      // Save to database
      const techArray = formData.technologies.split(',').map(t => t.trim())
      
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: techArray,
          images: imageUrls,
          video_url: videoUrl,
        }),
      })

      if (res.ok) {
        alert('Project added successfully!')
        router.push('/admin/dashboard')
      } else {
        alert('Error adding project')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error adding project')
    } finally {
      setLoading(false)
      setUploadingFiles(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Add New Project
        </motion.h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Project Title *
            </label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="AI Chatbot Platform"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Short Description * (for card)
            </label>
            <input
              required
              value={formData.short_description}
              onChange={(e) => setFormData({...formData, short_description: e.target.value})}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="Intelligent chatbot with NLP capabilities"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Full Description
            </label>
            <textarea
              value={formData.full_description}
              onChange={(e) => setFormData({...formData, full_description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="Detailed project description..."
            />
          </div>

          {/* Problem */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Problem Statement
            </label>
            <textarea
              value={formData.problem}
              onChange={(e) => setFormData({...formData, problem: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="What problem did this solve?"
            />
          </div>

          {/* Solution */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Solution Approach
            </label>
            <textarea
              value={formData.solution}
              onChange={(e) => setFormData({...formData, solution: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="How did you solve it?"
            />
          </div>

          {/* Results */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Results & Impact
            </label>
            <textarea
              value={formData.results}
              onChange={(e) => setFormData({...formData, results: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="50% faster response time, 500+ active users, etc."
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Technologies * (comma separated)
            </label>
            <input
              required
              value={formData.technologies}
              onChange={(e) => setFormData({...formData, technologies: e.target.value})}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="Python, TensorFlow, React, Firebase"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="AI/ML">AI/ML</option>
              <option value="Flutter">Flutter</option>
              <option value="Web">Web</option>
            </select>
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              GitHub URL
            </label>
            <input
              value={formData.github_url}
              onChange={(e) => setFormData({...formData, github_url: e.target.value})}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* Demo URL */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Demo URL
            </label>
            <input
              value={formData.demo_url}
              onChange={(e) => setFormData({...formData, demo_url: e.target.value})}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="https://demo.com"
            />
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Project Images (3-4 recommended)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
            />
            {images.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {images.length} image(s) selected
              </p>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Demo Video (optional, max 50MB)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
            />
            {video && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Video selected: {video.name}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploadingFiles ? (
                <>Uploading Files...</>
              ) : loading ? (
                <>Saving...</>
              ) : (
                <><FiUpload /> Add Project</>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}