'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { name: 'About', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Resume', href: '/resume' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">N</div>
          <span className="font-bold text-white tracking-tight">Naveen K.</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link key={link.name} href={link.href}>
                <div className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? 'text-white bg-[#1a1a1a]' : 'text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]'}
                `}>
                  {link.name}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:block">
           <Link href="/contact">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all">
                Hire Me
              </button>
           </Link>
        </div>
      </div>
    </header>
  )
}