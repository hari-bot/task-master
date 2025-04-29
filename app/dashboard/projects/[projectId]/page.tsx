"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Edit, Plus, Trash } from "lucide-react"
import { TaskList } from "@/components/task-list"
import { DeleteProjectDialog } from "@/components/delete-project-dialog"
import { useToast } from "@/hooks/use-toast"
import { getProject } from "@/lib/projects"
import { getProjectTasks } from "@/lib/tasks"
import type { Project, Task } from "@/lib/types"

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProject(params.projectId)
        setProject(projectData)

        const tasksData = await getProjectTasks(params.projectId)
        setTasks(tasksData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        })
        router.push("/dashboard/projects")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.projectId, router, toast])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <p className="text-muted-foreground">The project you are looking for does not exist or has been deleted.</p>
        <Link href="/dashboard/projects" className="mt-4">
          <Button>Go back to projects</Button>
        </Link>
      </div>
    )
  }

  const completedTasks = tasks.filter((task) => task.status === "COMPLETED").length
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{project.title}</h2>
          <p className="text-muted-foreground">{project.description || "No description provided"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/projects/${params.projectId}/edit`}>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit project</span>
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={() => setShowDeleteDialog(true)}>
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete project</span>
          </Button>
          <Link href={`/dashboard/projects/${params.projectId}/tasks/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>Track the progress of your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Progress</p>
              <div className="text-sm text-muted-foreground">
                {completedTasks} of {tasks.length} tasks completed
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Progress value={progressPercentage} />
        </CardContent>
      </Card>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <TaskList
            tasks={tasks}
            projectId={params.projectId}
            emptyState={
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="font-medium">No tasks yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create your first task to get started</p>
                <Link href={`/dashboard/projects/${params.projectId}/tasks/new`} className="mt-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                </Link>
              </div>
            }
          />
        </TabsContent>
        <TabsContent value="todo" className="space-y-4">
          <TaskList
            tasks={tasks.filter((task) => task.status === "TODO")}
            projectId={params.projectId}
            emptyState={
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="font-medium">No to-do tasks</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  All caught up! Create a new task or check other categories.
                </p>
              </div>
            }
          />
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-4">
          <TaskList
            tasks={tasks.filter((task) => task.status === "IN_PROGRESS")}
            projectId={params.projectId}
            emptyState={
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="font-medium">No in-progress tasks</h3>
                <p className="mt-1 text-sm text-muted-foreground">Start working on a task to see it here.</p>
              </div>
            }
          />
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <TaskList
            tasks={tasks.filter((task) => task.status === "COMPLETED")}
            projectId={params.projectId}
            emptyState={
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="font-medium">No completed tasks</h3>
                <p className="mt-1 text-sm text-muted-foreground">Complete a task to see it here.</p>
              </div>
            }
          />
        </TabsContent>
      </Tabs>
      <DeleteProjectDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} projectId={params.projectId} />
    </div>
  )
}
