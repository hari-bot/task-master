"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { TaskList } from "@/components/task-list"
import { useToast } from "@/hooks/use-toast"
import { getRecentTasks } from "@/lib/tasks"
import type { Task } from "@/lib/types"

export default function TasksPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getRecentTasks()
        setTasks(data)
        setFilteredTasks(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [toast])

  useEffect(() => {
    // Apply filters
    let result = [...tasks]

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)),
      )
    }

    setFilteredTasks(result)
  }, [tasks, searchQuery, statusFilter])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
        <p className="text-muted-foreground">View and manage all your tasks across projects</p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-8" value={searchQuery} onChange={handleSearch} />
        </div>
        <Select onValueChange={handleStatusChange} value={statusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <TaskList
            tasks={filteredTasks}
            emptyState={
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="font-medium">No tasks found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "You don't have any tasks yet"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button className="mt-4" onClick={() => (window.location.href = "/dashboard/projects")}>
                    Go to Projects
                  </Button>
                )}
              </div>
            }
          />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <TaskList
            tasks={filteredTasks.slice(0, 5)}
            emptyState={
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="font-medium">No recent tasks</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "You don't have any recent tasks"}
                </p>
              </div>
            }
          />
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <TaskList
            tasks={filteredTasks.filter((task) => task.status === "COMPLETED")}
            emptyState={
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="font-medium">No completed tasks</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery ? "Try adjusting your search" : "You don't have any completed tasks yet"}
                </p>
              </div>
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
