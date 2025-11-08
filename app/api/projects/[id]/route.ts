import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

// GET single project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { rows } = await sql`SELECT * FROM projects WHERE id = ${params.id}`
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// UPDATE project
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title, short_description, full_description, problem, solution, results,
      technologies, category, github_url, demo_url, images, video_url
    } = body

    const result = await sql`
      UPDATE projects SET
        title = ${title},
        short_description = ${short_description},
        full_description = ${full_description},
        problem = ${problem},
        solution = ${solution},
        results = ${results},
        technologies = ${technologies},
        category = ${category},
        github_url = ${github_url},
        demo_url = ${demo_url},
        images = ${images},
        video_url = ${video_url}
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM projects WHERE id = ${params.id}`
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}