"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { useToast } from "@/hooks/use-toast"
import { getProjects } from "@/lib/projects"
import type { Project } from "@/lib/types"

export default function ProjectsPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your projects and track their progress</p>
        </div>
        {projects.length < 4 && (
          <Link href="/dashboard/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.length > 0 ? (
          <>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {projects.length < 4 && (
              <Link href="/dashboard/projects/new" className="block h-full">
                <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center hover:border-primary hover:bg-muted">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-3 font-medium">Create Project</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Add a new project to your workspace</p>
                </div>
              </Link>
            )}
          </>
        ) : (
          <div className="col-span-full flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
            <div className="rounded-full bg-primary/10 p-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-3 font-medium">No projects yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Create your first project to get started</p>
            <Link href="/dashboard/projects/new" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
