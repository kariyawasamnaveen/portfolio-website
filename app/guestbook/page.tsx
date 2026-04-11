'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi'
import Navbar from '@/components/Navbar'

interface GuestbookEntry {
    id: number
    name: string
    message: string
    created_at: string
}

export default function Guestbook() {
    const [entries, setEntries] = useState<GuestbookEntry[]>([])
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchEntries()
    }, [])

    const fetchEntries = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/guestbook')
            if (res.ok) {
                const data = await res.json()
                setEntries(data)
            }
        } catch (error) {
            console.error('Failed to fetch entries', error)
            // Fallback for demo if DB not connected
            setEntries([
                { id: 1, name: 'Alex Johnson', message: 'Amazing portfolio! The interactive animations are top-notch.', created_at: new Date().toISOString() },
                { id: 2, name: 'Sarah Lee', message: 'Really impressed with your Flutter projects. Keep it up!', created_at: new Date(Date.now() - 86400000).toISOString() }
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !message.trim()) return

        setSubmitting(true)
        try {
            const res = await fetch('/api/guestbook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message })
            })

            if (res.ok) {
                const newEntry = await res.json()
                setEntries([newEntry, ...entries])
                setName('')
                setMessage('')
            }
        } catch (error) {
            console.error('Failed to submit', error)
            // Demo fallback
            const fakeEntry = { id: Date.now(), name, message, created_at: new Date().toISOString() }
            setEntries([fakeEntry, ...entries])
            setName('')
            setMessage('')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white pt-24 px-6 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                            Guestbook
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            Leave a mark on my digital journey. Share your thoughts, feedback, or just say hello!
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-16 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <FiUser /> Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <FiMessageSquare /> Message
                                </label>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Anything on your mind..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={submitting}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-lg shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Signing...' : (
                                <>
                                    Sign Guestbook <FiSend />
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Entries Grid */}
                    <div className="grid gap-6">
                        <AnimatePresence>
                            {entries.map((entry, i) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white/5 border border-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg">
                                                {entry.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{entry.name}</h3>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(entry.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed pl-13">
                                        {entry.message}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    )
}
