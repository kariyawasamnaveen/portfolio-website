'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiCpu, FiCommand } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function AiSearch({ projects }: { projects: any[] }) {
    const [query, setQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const [showResults, setShowResults] = useState(false)
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setIsSearching(true)
        setShowResults(true)

        // Simulate AI "Thinking"
        setTimeout(() => {
            // Simple keyword matching for demo (in production, use embeddings/LLM)
            const lowerQuery = query.toLowerCase()
            const matches = projects.filter(p =>
                p.title.toLowerCase().includes(lowerQuery) ||
                p.description?.toLowerCase().includes(lowerQuery) ||
                p.technologies?.some((t: string) => t.toLowerCase().includes(lowerQuery)) ||
                (lowerQuery.includes('mobile') && p.category === 'Flutter') ||
                (lowerQuery.includes('web') && p.category === 'Web') ||
                (lowerQuery.includes('intelligence') && p.category === 'AI/ML')
            )

            setResults(matches)
            setIsSearching(false)
        }, 1500)
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 relative z-20">
            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl">
                    <div className="pl-4 pr-3 text-[#26D4C4]">
                        {isSearching ? <FiCpu className="animate-spin" size={24} /> : <FiSearch size={24} />}
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask anything... e.g. 'Show me mobile apps with real-time tracking'"
                        className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none px-2 py-3 text-lg"
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="px-6 py-2 bg-[#26D4C4] text-black font-bold rounded-xl hover:bg-[#20b2a5] transition-colors disabled:opacity-50"
                    >
                        {isSearching ? 'Thinking...' : 'Ask AI'}
                    </button>
                </div>
            </form>

            {/* Results Dropdown */}
            <AnimatePresence>
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4"
                    >
                        <div className="flex justify-between items-center mb-4 px-2">
                            <span className="text-sm text-gray-400">
                                {isSearching ? 'Analyzing portfolio...' : `Found ${results.length} matches`}
                            </span>
                            <button
                                onClick={() => setShowResults(false)}
                                className="text-gray-500 hover:text-white"
                            >
                                Close
                            </button>
                        </div>

                        {isSearching ? (
                            <div className="space-y-3">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : results.length > 0 ? (
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {results.map(project => (
                                    <div
                                        key={project.id}
                                        onClick={() => router.push(`/projects/${project.id}`)}
                                        className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors group"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                                            {project.title.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {project.title}
                                            </h4>
                                            <p className="text-sm text-gray-400 line-clamp-1">
                                                {project.short_description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No matching projects found. Try different keywords.
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
