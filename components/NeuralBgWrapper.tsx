'use client';

import dynamic from 'next/dynamic';
import { SimplifiedFallback } from '@/components/neural-network/SimplifiedFallback';
import { usePathname } from 'next/navigation';

// Dynamic import with SSR false to avoid hydration mismatch
const NeuralBg = dynamic(() => import('@/components/neural-network/NeuralNetworkBackground').then(m => m.NeuralNetworkBackground), {
    ssr: false,
    loading: () => <SimplifiedFallback />
});

export default function NeuralBgWrapper() {
    const pathname = usePathname();
    // We can condition visibility here if needed, but for smoothness we keep it.
    // Maybe dim it on non-home pages?
    // For now, keep it everywhere as requested for "smooth navigation".

    return <NeuralBg />;
}
