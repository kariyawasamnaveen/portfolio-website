'use client'

import dynamic from 'next/dynamic'

const GlobalVoiceWidget = dynamic(() => import('@/components/GlobalVoiceWidget'), {
    ssr: false,
})

export default function GlobalVoiceWidgetWrapper() {
    return <GlobalVoiceWidget />
}
