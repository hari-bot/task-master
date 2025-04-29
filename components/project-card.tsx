import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Layers } from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progressPercentage = project.totalTasks > 0 ? (project.completedTasks / project.totalTasks) * 100 : 0

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
            {project.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm text-muted-foreground h-10">
          {project.description || "No description provided"}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" />
          <span>{project.totalTasks || 0} tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
