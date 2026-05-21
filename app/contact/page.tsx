'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiSend } from 'react-icons/fi'


export default function ContactPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState('')

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    
    // Simulate sending (replace with actual EmailJS or API)
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus(''), 3000)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'naveen@example.com',
      href: 'mailto:naveen@example.com'
    },
    {
      icon: FiPhone,
      label: 'Phone',
      value: '+94 77 123 4567',
      href: 'tel:+94771234567'
    },
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/naveen',
      href: 'https://linkedin.com/in/naveen'
    },
    {
      icon: FiGithub,
      label: 'GitHub',
      value: 'github.com/kariyawasamnaveen',
      href: 'https://github.com/kariyawasamnaveen'
    }
  ]

  return (
    <>

      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Background with Mouse Glow */}
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
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16 space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white">
                Get In Touch
              </h1>
              <p className="text-lg text-gray-400">
                Let's discuss your next project
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Contact Information
                </h2>
                
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    target={info.label === 'LinkedIn' || info.label === 'GitHub' ? '_blank' : undefined}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-[#26D4C4]/50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-[#26D4C4]/10 rounded-lg flex items-center justify-center group-hover:bg-[#26D4C4]/20 transition-colors">
                      <info.icon className="text-[#26D4C4]" size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{info.label}</div>
                      <div className="text-white font-medium">{info.value}</div>
                    </div>
                  </motion.a>
                ))}

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                >
                  <h3 className="text-lg font-bold text-white mb-3">
                    Response Time
                  </h3>
                  <p className="text-gray-400 text-sm">
                    I typically respond within 24 hours. For urgent inquiries, feel free to call directly.
                  </p>
                </motion.div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#26D4C4] transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#26D4C4] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#26D4C4] transition-colors resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(38,212,196,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 bg-[#26D4C4] text-black rounded-lg font-bold shadow-lg shadow-[#26D4C4]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'sending' ? (
                      'Sending...'
                    ) : status === 'success' ? (
                      '✓ Message Sent!'
                    ) : (
                      <>
                        <FiSend size={18} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}