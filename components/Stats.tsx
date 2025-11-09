'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Stats() {
  const [counts, setCounts] = useState({ projects: 0, years: 0, satisfaction: 0 })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      setCounts({
        projects: Math.floor((50 * step) / steps),
        years: Math.floor((5 * step) / steps),
        satisfaction: Math.floor((100 * step) / steps)
      })
      if (step === steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    { label: 'Projects', value: counts.projects, suffix: '+', color: '#26D4C4', icon: '🚀' },
    { label: 'Years Exp', value: counts.years, suffix: '+', color: '#26D4C4', icon: '⭐' },
    { label: 'Satisfaction', value: counts.satisfaction, suffix: '%', color: '#26D4C4', icon: '❤️' }
  ]

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 group"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#26D4C4]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              
              <div className="relative text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-5xl font-bold mb-2" style={{ color: stat.color }}>
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}