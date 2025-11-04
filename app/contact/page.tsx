'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Sending...')
    
    // Simulate send (Replace with EmailJS later)
    setTimeout(() => {
      setStatus('Message sent! ✓')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus(''), 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Let's discuss your next project
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
              <FiUser /> Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
              <FiMail /> Email
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
              <FiMessageSquare /> Message
            </label>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              rows={5}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <FiSend /> Send Message
          </button>

          {status && (
            <div className="text-center text-green-600 font-semibold">
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}