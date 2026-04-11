import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GlobalVoiceWidgetWrapper from "@/components/GlobalVoiceWidgetWrapper";
import NeuralBgWrapper from "@/components/NeuralBgWrapper";
import { VoiceCommandController } from "@/components/voice-control/VoiceCommandController";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naveen Kariyawasam - AI/ML & Flutter Developer",
  description: "Portfolio of Naveen Kariyawasam, a Computer Science undergraduate at University of Kelaniya specializing in AI, Flutter, and Full Stack Development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        <Navbar />
        {/* Persistent 3D Background for smooth navigation */}
        <NeuralBgWrapper />
        <main className="pt-16">
          {children}
        </main>
        <GlobalVoiceWidgetWrapper />
        <VoiceCommandController />
      </body>
    </html>
  );
}