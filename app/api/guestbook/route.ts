import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

// Ensure table exists
async function initDB() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
    } catch (error) {
        console.error('Failed to init DB:', error)
    }
}

export async function GET() {
    try {
        // Attempt init on read (naive check to ensure it works for first load)
        await initDB()

        const { rows } = await sql`SELECT * FROM guestbook ORDER BY created_at DESC LIMIT 50;`
        return NextResponse.json(rows)
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await initDB()
        const { name, message } = await request.json()

        if (!name || !message) {
            return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })
        }

        const { rows } = await sql`
      INSERT INTO guestbook (name, message) 
      VALUES (${name}, ${message}) 
      RETURNING *;
    `

        return NextResponse.json(rows[0])
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}
