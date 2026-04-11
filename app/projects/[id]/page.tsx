import { sql } from '@vercel/postgres'
import { notFound } from 'next/navigation'
import ProjectDetailsClient from '@/components/ProjectDetailsClient'

export default async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const { rows } = await sql`SELECT * FROM projects WHERE id = ${id}`

    if (rows.length === 0) {
      notFound()
    }

    return <ProjectDetailsClient project={rows[0]} />
  } catch (error) {
    console.error('Error fetching project:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Error loading project</div>
      </div>
    )
  }
}