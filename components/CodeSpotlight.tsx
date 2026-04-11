'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiCode, FiCpu, FiMonitor } from 'react-icons/fi'
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(() => import('./CodeEditor'), {
    ssr: false,
    loading: () => <div className="h-64 bg-[#0a0a0a] rounded-lg animate-pulse" />
})

interface CodeSpotlightProps {
    title?: string
    description?: string
    code?: string
    language?: 'python' | 'javascript'
}

export default function CodeSpotlight({
    title = "Core Algorithm",
    description = "This snippet demonstrates the core logic used in this project.",
    code = "print('Hello World')",
    language = 'python'
}: CodeSpotlightProps) {
    const [activeTab, setActiveTab] = useState<'code' | 'explanation'>('code')

    return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <FiCode size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">{title}</h3>
                        <p className="text-xs text-gray-400">Interactive Case Study</p>
                    </div>
                </div>

                <div className="flex gap-1 bg-black/50 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'code'
                            ? 'bg-white/10 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Code
                    </button>
                    <button
                        onClick={() => setActiveTab('explanation')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'explanation'
                            ? 'bg-white/10 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Logic
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'code' ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <CodeEditor initialCode={code} language={language} />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="prose prose-invert max-w-none"
                    >
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 text-purple-400">
                                    <FiCpu size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-2">The Challenge</h4>
                                    <p className="text-gray-400 leading-relaxed">
                                        We needed a way to process high-volume data streams in real-time without blocking the main thread.
                                        Traditional synchronous loops caused UI freezing.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-400">
                                    <FiMonitor size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-2">The Solution</h4>
                                    <p className="text-gray-400 leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
