import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        short_description TEXT,
        full_description TEXT,
        problem TEXT,
        solution TEXT,
        results TEXT,
        technologies TEXT[],
        category VARCHAR(50),
        github_url TEXT,
        demo_url TEXT,
        images TEXT[],
        video_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    return NextResponse.json({ message: 'Database tables created successfully!' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}