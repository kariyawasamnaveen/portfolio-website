import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log('=== UPLOAD DEBUG START ===')
  
  try {
    console.log('Token exists?', !!process.env.BLOB_READ_WRITE_TOKEN)
    console.log('Token value:', process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20) + '...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    console.log('File received:', file?.name, file?.size)

    if (!file) {
      console.log('ERROR: No file')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('ERROR: No token')
      return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not found' }, { status: 500 })
    }

    console.log('Starting upload...')
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log('Upload success:', blob.url)
    return NextResponse.json({ url: blob.url })
    
  } catch (error: any) {
    console.error('=== UPLOAD ERROR ===')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}