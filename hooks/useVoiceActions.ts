'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRoomContext } from '@livekit/components-react'
import { DataPacket_Kind } from 'livekit-client'

export function useVoiceActions() {
  const router = useRouter()
  const room = useRoomContext()

  useEffect(() => {
    if (!room) return

    const handleDataMessage = (payload: Uint8Array, participant: any, kind: DataPacket_Kind) => {
      const decoder = new TextDecoder()
      const str = decoder.decode(payload)
      
      try {
        const data = JSON.parse(str)
        
        if (data.action === 'navigate') {
          console.log('🚀 AI Navigation Command:', data.page)
          router.push(data.page)
        }
        
        if (data.action === 'scroll') {
          const element = document.getElementById(data.target)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
      } catch (e) {
        // Not a JSON message, ignore
      }
    }

    room.on('dataReceived', handleDataMessage)
    return () => {
      room.off('dataReceived', handleDataMessage)
    }
  }, [room, router])

  return null
}
