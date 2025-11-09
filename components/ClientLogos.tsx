'use client'
import { motion } from 'framer-motion'

export default function ClientLogos() {
  const clients = [
    { name: 'Google', logo: '🔍' },
    { name: 'Meta', logo: '📘' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Microsoft', logo: '🪟' },
    { name: 'Apple', logo: '🍎' },
    { name: 'Netflix', logo: '🎬' }
  ]

  return (
    <section className="relative py-20 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-gray-400 text-sm uppercase tracking-wider mb-12"
        >
          Trusted by Leading Companies
        </motion.h3>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer"
            >
              <div className="text-5xl">{client.logo}</div>
              <div className="text-xs text-gray-500">{client.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}