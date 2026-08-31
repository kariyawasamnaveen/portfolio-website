import re

with open('app/resume/page.tsx', 'r') as f:
    content = f.read()

# 1. Wrapper
content = content.replace(
    'className="h-screen bg-[#020305] text-neutral-300 font-sans selection:bg-cyan-500/30 overflow-y-auto overflow-x-hidden relative flex flex-col items-center justify-center p-4 md:p-8"',
    'className="h-screen bg-[#020305] text-neutral-300 font-sans selection:bg-cyan-500/30 overflow-y-auto overflow-x-hidden relative flex items-center justify-center p-2 md:p-4"'
)

# 2. Container
content = content.replace(
    'className="relative z-10 max-w-[900px] w-full bg-[#050914]/80 backdrop-blur-2xl border border-white/5 rounded-sm p-6 md:p-10 shadow-[0_0_50px_rgba(0,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.02)] my-auto"',
    'className="relative z-10 max-w-[1000px] w-full bg-[#050914]/80 backdrop-blur-2xl border border-white/5 rounded-sm p-5 md:p-8 shadow-[0_0_50px_rgba(0,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.02)]"'
)

# 3. Header spacing & fonts
content = content.replace('pb-8 mb-10', 'pb-4 mb-6')
content = content.replace('text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 font-mono', 'text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1 font-mono')
content = content.replace('text-lg md:text-xl text-cyan-400 font-mono tracking-widest uppercase mb-6', 'text-xs md:text-sm text-cyan-400 font-mono tracking-widest uppercase mb-4')
content = content.replace('gap-4 text-xs font-mono text-neutral-400', 'gap-3 text-[10px] font-mono text-neutral-400')

# 4. Columns spacing
content = content.replace('gap-8 lg:gap-12', 'gap-6 lg:gap-10')
content = content.replace('lg:w-[40%] flex flex-col gap-8', 'lg:w-[35%] flex flex-col gap-5')
content = content.replace('lg:w-[60%]', 'lg:w-[65%]')

# 5. Section headings
content = content.replace('text-xs font-bold text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2', 'text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-2 flex items-center gap-2')
content = content.replace('text-xs font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2', 'text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2')
content = content.replace('text-xs font-bold text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2', 'text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2')

# 6. Typewriter for Summary (Change to simple fade in)
summary_old = """                                    <p className="text-neutral-400 leading-relaxed text-xs text-justify">
                                        <TypewriterText 
                                            text="Agile Full-Stack & AI Solutions Remote Contractor. I bridge the gap between high-velocity product execution and scalable cloud engineering. Leveraging deep hands-on expertise in mobile architecture, modern backend services, and autonomous agent orchestration to ship production-ready systems on tight turnaround sprints." 
                                            delay={1.5} 
                                        />
                                    </p>"""
summary_new = """                                    <motion.p 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        transition={{ delay: 1.5, duration: 1 }}
                                        className="text-neutral-400 leading-relaxed text-[11px] text-justify"
                                    >
                                        Agile Full-Stack & AI Solutions Remote Contractor. I bridge the gap between high-velocity product execution and scalable cloud engineering. Leveraging deep hands-on expertise in mobile architecture, modern backend services, and autonomous agent orchestration to ship production-ready systems on tight turnaround sprints.
                                    </motion.p>"""
content = content.replace(summary_old, summary_new)

# 7. Experience Card tweaks
content = content.replace('space-y-6', 'space-y-4')
content = content.replace('p-3 rounded-lg border', 'p-2.5 rounded-lg border')
content = content.replace('text-sm">{job.role}', 'text-[13px]">{job.role}')
content = content.replace('text-[9px] font-mono text-cyan-500 tracking-widest uppercase border border-cyan-500/30 px-1.5 py-0.5 rounded-sm bg-cyan-500/10', 'text-[8px] font-mono text-cyan-500 tracking-widest uppercase border border-cyan-500/30 px-1 py-0.5 rounded-sm bg-cyan-500/10')
content = content.replace('text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2', 'text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5')
content = content.replace('space-y-1.5', 'space-y-1')
content = content.replace('text-xs text-neutral-400 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1', 'text-[11px] text-neutral-400 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1')

# 8. Edu tweaks
content = content.replace('p-3 rounded-lg border border-white/5', 'p-2 rounded-lg border border-white/5')
content = content.replace('text-xs mb-1">BSc', 'text-[11px] mb-1">BSc')
content = content.replace('text-xs mb-1">Software', 'text-[11px] mb-1">Software')

with open('app/resume/page.tsx', 'w') as f:
    f.write(content)
