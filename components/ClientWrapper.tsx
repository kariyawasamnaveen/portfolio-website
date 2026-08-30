'use client'

import React from 'react'
import Navbar from "@/components/Navbar"
import VoiceAssistant from "@/components/VoiceAssistant"
import { usePathname } from "next/navigation"

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isResume = pathname === "/resume";

    return (
        <>
            {(!isHome && !isResume) && <Navbar />}
            <main>
                {children}
            </main>
        </>
    );
}
