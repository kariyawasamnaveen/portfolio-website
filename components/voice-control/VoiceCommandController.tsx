'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiMicOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function VoiceCommandController() {
    const router = useRouter();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [lastCommand, setLastCommand] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check browser support
        if (!('webkitSpeechRecognition' in window)) {
            console.warn('Voice API not supported in this browser.');
            return;
        }

        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            toast.success('Voice Command Active: Try "Go Home"');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript.toLowerCase().trim();
            setTranscript(transcriptText);

            if (event.results[current].isFinal) {
                handleCommand(transcriptText);
            }
        };

        const handleCommand = (cmd: string) => {
            setLastCommand(cmd);
            console.log('Voice Command:', cmd);

            // Navigation Commands
            if (cmd.includes('home') || cmd.includes('dashboard')) {
                router.push('/');
                toast.success('Navigating Home...');
            } else if (cmd.includes('project') || cmd.includes('work')) {
                router.push('/projects');
                toast.success('Opening Projects...');
            } else if (cmd.includes('resume') || cmd.includes('cv')) {
                router.push('/resume');
                toast.success('Opening Resume...');
            } else if (cmd.includes('contact') || cmd.includes('email')) {
                router.push('/contact');
                toast.success('Opening Contact...');
            }
            // Action Commands
            else if (cmd.includes('scroll down') || cmd.includes('down')) {
                window.scrollBy({ top: 500, behavior: 'smooth' });
            } else if (cmd.includes('scroll up') || cmd.includes('up')) {
                window.scrollBy({ top: -500, behavior: 'smooth' });
            } else if (cmd.includes('stop') || cmd.includes('off')) {
                recognition.stop();
                setIsListening(false);
                toast('Voice Control Stopped');
            }
        };

        if (isListening) {
            try { recognition.start(); } catch (e) { /* ignore if already started */ }
        } else {
            try { recognition.stop(); } catch (e) { /* ignore */ }
        }

        return () => {
            try { recognition.stop(); } catch (e) { }
        };
    }, [isListening, router]);

    return (
        <div className="fixed bottom-24 left-6 z-50 flex items-center gap-3 pointer-events-auto">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsListening(!isListening)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-white/10 transition-all ${isListening ? 'bg-red-500/80 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-black/80 text-gray-400 hover:bg-gray-700'
                    }`}
            >
                {isListening ? <FiMic size={20} /> : <FiMicOff size={20} />}
            </motion.button>

            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10"
                    >
                        <div className="text-xs text-green-400 font-mono mb-1">LISTENING...</div>
                        <div className="text-sm text-white font-medium whitespace-nowrap min-w-[100px]">
                            {transcript || "Say a command..."}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
