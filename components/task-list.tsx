import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Edit } from "lucide-react";
import type { Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  projectId?: string;
  emptyState?: React.ReactNode;
}

export function TaskList({ tasks, projectId, emptyState }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return (
      emptyState || (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="font-medium">No tasks found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            There are no tasks to display.
          </p>
        </div>
      )
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <CardDescription className="line-clamp-1">
                  {task.description || "No description provided"}
                </CardDescription>
              </div>
              <div
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  task.status === "COMPLETED"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : task.status === "IN_PROGRESS"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                }`}
              >
                {task.status.replace("_", " ")}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {task.description || "No description provided"}
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Created {new Date(task.createdAt).toLocaleDateString()}
              </span>
              {task.completedAt && (
                <>
                  <span className="mx-1">•</span>
                  <span>
                    Completed {new Date(task.completedAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
            {projectId && (
              <Link href={`/dashboard/projects/${projectId}/tasks/${task.id}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
