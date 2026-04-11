'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Navbar from '@/components/Navbar'

export default function CalculatorPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [inputs, setInputs] = useState({
    projectType: 'chatbot',
    timeline: 40,
    features: 5,
    budget: 5000
  })
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const projectMultipliers = {
    chatbot: 1.5,
    mobile: 1.3,
    web: 1.2,
    ml: 1.8
  }

  const calculateROI = () => {
    const multiplier = projectMultipliers[inputs.projectType as keyof typeof projectMultipliers]
    const timeValue = inputs.timeline * 50
    const featureValue = inputs.features * 500
    const totalValue = (timeValue + featureValue) * multiplier
    const roi = ((totalValue - inputs.budget) / inputs.budget * 100).toFixed(2)

    setResult({
      estimatedValue: totalValue.toFixed(0),
      timeSaved: inputs.timeline,
      roi: roi,
      breakdown: [
        { name: 'Time Value', value: timeValue },
        { name: 'Features Value', value: featureValue },
        { name: 'Total Value', value: totalValue }
      ]
    })
  }

  return (
    <>
      <Navbar />
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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white">
                ROI Calculator
              </h1>
              <p className="text-lg text-gray-400">
                Estimate the value and ROI of your project
              </p>
            </motion.div>

            {/* Calculator Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8"
            >
              <div className="space-y-6">
                {/* Project Type */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Project Type
                  </label>
                  <select
                    value={inputs.projectType}
                    onChange={(e) => setInputs({...inputs, projectType: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#26D4C4] transition-colors"
                  >
                    <option value="chatbot" className="bg-gray-900">AI Chatbot</option>
                    <option value="mobile" className="bg-gray-900">Mobile App (Flutter)</option>
                    <option value="web" className="bg-gray-900">Web Application</option>
                    <option value="ml" className="bg-gray-900">ML Model</option>
                  </select>
                </div>

                {/* Timeline Slider */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Development Hours: <span className="text-[#26D4C4]">{inputs.timeline}</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={inputs.timeline}
                    onChange={(e) => setInputs({...inputs, timeline: parseInt(e.target.value)})}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#26D4C4]"
                  />
                </div>

                {/* Features Slider */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Number of Features: <span className="text-[#26D4C4]">{inputs.features}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={inputs.features}
                    onChange={(e) => setInputs({...inputs, features: parseInt(e.target.value)})}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#26D4C4]"
                  />
                </div>

                {/* Budget Input */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={inputs.budget}
                    onChange={(e) => setInputs({...inputs, budget: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#26D4C4] transition-colors"
                  />
                </div>

                {/* Calculate Button */}
                <motion.button
                  onClick={calculateROI}
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(38,212,196,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-[#26D4C4] text-black rounded-lg font-bold shadow-lg shadow-[#26D4C4]/20 transition-all"
                >
                  Calculate ROI
                </motion.button>
              </div>
            </motion.div>

            {/* Results */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center hover:border-[#26D4C4]/30 transition-all"
                  >
                    <div className="text-4xl font-bold text-[#26D4C4] mb-2">
                      ${result.estimatedValue}
                    </div>
                    <div className="text-gray-400">Estimated Value</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center hover:border-[#26D4C4]/30 transition-all"
                  >
                    <div className="text-4xl font-bold text-white mb-2">
                      {result.timeSaved}h
                    </div>
                    <div className="text-gray-400">Time Investment</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center hover:border-[#26D4C4]/30 transition-all"
                  >
                    <div className="text-4xl font-bold text-[#26D4C4] mb-2">
                      {result.roi}%
                    </div>
                    <div className="text-gray-400">ROI</div>
                  </motion.div>
                </div>

                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-6 text-white">
                    Value Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={result.breakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.9)', 
                          border: '1px solid rgba(38,212,196,0.3)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#26D4C4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}