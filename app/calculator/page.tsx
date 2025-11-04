'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CalculatorPage() {
  const [inputs, setInputs] = useState({
    projectType: 'chatbot',
    timeline: 40,
    features: 5,
    budget: 5000
  })

  const [result, setResult] = useState<any>(null)

  const projectMultipliers = {
    chatbot: 1.5,
    mobile: 1.3,
    web: 1.2,
    ml: 1.8
  }

  const calculateROI = () => {
    const multiplier = projectMultipliers[inputs.projectType as keyof typeof projectMultipliers]
    const timeValue = inputs.timeline * 50 // $50/hour
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ROI Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Estimate the value and ROI of your project
          </p>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
          <div className="space-y-6">
            {/* Project Type */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Project Type
              </label>
              <select
                value={inputs.projectType}
                onChange={(e) => setInputs({...inputs, projectType: e.target.value})}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 dark:text-white"
              >
                <option value="chatbot">AI Chatbot</option>
                <option value="mobile">Mobile App (Flutter)</option>
                <option value="web">Web Application</option>
                <option value="ml">ML Model</option>
              </select>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Development Hours: {inputs.timeline}
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={inputs.timeline}
                onChange={(e) => setInputs({...inputs, timeline: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Number of Features: {inputs.features}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={inputs.features}
                onChange={(e) => setInputs({...inputs, features: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Budget ($)
              </label>
              <input
                type="number"
                value={inputs.budget}
                onChange={(e) => setInputs({...inputs, budget: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <button
              onClick={calculateROI}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Calculate ROI
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${result.estimatedValue}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Estimated Value</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {result.timeSaved}h
                </div>
                <div className="text-gray-600 dark:text-gray-400">Time Investment</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {result.roi}%
                </div>
                <div className="text-gray-600 dark:text-gray-400">ROI</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Value Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={result.breakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}