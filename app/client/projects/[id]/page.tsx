"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Layout from "@/components/layout/Layout"
import type { Project, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getProjectById } from "@/lib/firebase/project-service"
import ProjectDetailCard from "@/components/client components/dashboard/ProjectDetailCard"
import ProjectTimeline from "@/components/client components/dashboard/ProjectTimeline"

// Mock user data - in a real app, this would come from authentication
const mockUser: User = {
  id: "client123",
  name: "John Doe",
  email: "tusharbhowal4211@gmail.com",
  role: "client",
  avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProject() {
      try {
        if (typeof id !== "string") {
          throw new Error("Invalid project ID")
        }

        const projectData = await getProjectById(id)
        setProject(projectData)
      } catch (err) {
        console.error("Error fetching project:", err)
        setError("Failed to load project details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) {
    return (
      <Layout user={mockUser} title="Project Details" description="Loading...">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </Layout>
    )
  }

  if (error || !project) {
    return (
      <Layout user={mockUser} title="Project Details" description="Error">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-destructive font-medium">{error || "Project not found"}</p>
          <Link href="/client" className="mt-4">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={mockUser} title="Project Details" description={`View details for ${project.projectName}`}>
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectDetailCard project={project} />
        </div>
        <div>
          <ProjectTimeline project={project} />
        </div>
      </div>
    </Layout>
  )
}

