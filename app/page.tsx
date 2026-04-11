'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
// import AnimatedBackground from '@/components/AnimatedBackground'; // Replaced by NeuralNetwork
import HeroSection from '@/components/HeroSection';
import JourneyTimeline from '@/components/JourneyTimeline';
import TrustedCompanies from '@/components/TrustedCompanies';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';
import { SimplifiedFallback } from '@/components/neural-network/SimplifiedFallback';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { FeatureToggles } from '@/components/ui/FeatureToggles';


const GestureCtrl = dynamic(() => import('@/components/gesture-control/GestureController').then(m => m.GestureController), { ssr: false });
const GestureCursor = dynamic(() => import('@/components/gesture-control/GestureCursor').then(m => m.GestureCursor), { ssr: false });

export default function Home() {
  const is3DEnabled = usePortfolioStore(s => s.is3DNetworkEnabled);

  return (
    <ErrorBoundary>
      {/* Navigation */}
      <Navbar />

      <main className="min-h-screen bg-transparent text-white overflow-x-hidden relative">

        {/* Background Layer */}


        {/* Interaction Layer */}
        <Suspense fallback={null}>
          <GestureCtrl />
          <GestureCursor />
        </Suspense>

        {/* UI Overlay */}
        <PerformanceMonitor />
        <FeatureToggles />
        <Toaster position="top-right" />

        {/* Content Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <HeroSection />

          {/* Journey Timeline */}
          <JourneyTimeline />

          {/* Trusted Companies */}
          <TrustedCompanies />
        </div>
      </main>
    </ErrorBoundary>
  )
}