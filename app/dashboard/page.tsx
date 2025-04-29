"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Plus } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { TaskList } from "@/components/task-list"
import { useToast } from "@/hooks/use-toast"
import { getProjects } from "@/lib/projects"
import { getRecentTasks } from "@/lib/tasks"
import type { Project, Task } from "@/lib/types"

export default function DashboardPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)

        const tasksData = await getRecentTasks()
        setRecentTasks(tasksData)
      } catch (error) {
        console.error("Dashboard error:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try refreshing the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
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
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your projects and tasks.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">
                  {projects.length === 4 ? "Maximum limit reached" : `${4 - projects.length} more available`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {recentTasks.filter((task) => task.status === "IN_PROGRESS").length}
                </div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {recentTasks.filter((task) => task.status === "COMPLETED").length}
                </div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your most recent projects and their progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.length > 0 ? (
                  projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Link href={`/dashboard/projects/${project.id}`} className="font-medium hover:underline">
                            {project.title}
                          </Link>
                          <div className="text-xs text-muted-foreground">
                            {project.completedTasks} of {project.totalTasks} tasks completed
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Progress value={(project.completedTasks / Math.max(project.totalTasks, 1)) * 100} />
                    </div>
                  ))
                ) : (
                  <div className="flex h-[140px] flex-col items-center justify-center rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">No projects yet</p>
                    <Link href="/dashboard/projects/new" className="mt-2">
                      <Button size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
              {projects.length > 0 && (
                <CardFooter>
                  <Link href="/dashboard/projects" className="text-sm text-primary hover:underline">
                    View all projects
                  </Link>
                </CardFooter>
              )}
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Your most recent tasks across all projects</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTasks.length > 0 ? (
                  <div className="space-y-4">
                    {recentTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Link
                            href={`/dashboard/projects/${task.projectId}/tasks/${task.id}`}
                            className="font-medium hover:underline"
                          >
                            {task.title}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                task.status === "COMPLETED"
                                  ? "bg-green-500"
                                  : task.status === "IN_PROGRESS"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                              }`}
                            />
                            <span>{task.status.replace("_", " ")}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">No tasks yet</p>
                    {projects.length > 0 && (
                      <Link href={`/dashboard/projects/${projects[0].id}/tasks/new`} className="mt-2">
                        <Button size="sm" variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Task
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
              {recentTasks.length > 0 && (
                <CardFooter>
                  <Link href="/dashboard/tasks" className="text-sm text-primary hover:underline">
                    View all tasks
                  </Link>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
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
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4">
          <TaskList tasks={recentTasks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
