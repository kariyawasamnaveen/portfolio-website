import { AccessToken } from 'livekit-server-sdk'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const room = searchParams.get('room') || 'default-room'
  const username = searchParams.get('username') || `user-${Math.random().toString(36).substring(7)}`

  try {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      { identity: username }
    )

    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
    })

    return NextResponse.json({
      token: await at.toJwt(),
      serverUrl: process.env.LIVEKIT_URL
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const room = body.roomName || 'default-room'
    const username = body.participantName || `user-${Math.random().toString(36).substring(7)}`

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      { identity: username }
    )

    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true
    })

    return NextResponse.json({
      token: await at.toJwt(),
      serverUrl: process.env.LIVEKIT_URL
    })
  } catch (error: any) {
    console.error('❌ Token error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}