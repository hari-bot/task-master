export interface User {
  id: string
  name: string
  email: string
  country: string
}

export interface Project {
  id: string
  title: string
  description: string
  userId: string
  createdAt: string
  updatedAt: string
  totalTasks: number
  completedTasks: number
}

export interface Task {
  id: string
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "COMPLETED"
  projectId: string
  createdAt: string
  updatedAt: string
  completedAt: string | null
}
