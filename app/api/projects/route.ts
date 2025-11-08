import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

// GET all projects
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM projects ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST new project
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      short_description,
      full_description,
      problem,
      solution,
      results,
      technologies,
      category,
      github_url,
      demo_url,
      images,
      video_url
    } = body

    const result = await sql`
      INSERT INTO projects (
        title, short_description, full_description, problem, solution, results,
        technologies, category, github_url, demo_url, images, video_url
      ) VALUES (
        ${title}, ${short_description}, ${full_description}, ${problem}, 
        ${solution}, ${results}, ${technologies}, ${category}, 
        ${github_url}, ${demo_url}, ${images}, ${video_url}
      ) RETURNING *
    `

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}