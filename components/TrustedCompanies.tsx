'use client'

import { motion } from 'framer-motion'

const companies = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix']

export default function TrustedCompanies() {
    return (
        <section className="relative py-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs uppercase tracking-[0.3em] text-gray-600 mb-16"
                >
                    Trusted by Industry Leaders
                </motion.p>

                <div className="grid grid-cols-3 lg:grid-cols-6 gap-12 items-center">
                    {companies.map((company, i) => (
                        <motion.div
                            key={company}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all cursor-pointer"
                        >
                            <div className="text-2xl font-bold text-center">{company}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
