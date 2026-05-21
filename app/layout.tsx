'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import VoiceAssistant from "@/components/VoiceAssistant";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} text-white selection:bg-blue-600/30`}>
        {!isHome && <Navbar />}
        <main>
          {children}
        </main>
        <VoiceAssistant />
      </body>
    </html>
  );
}