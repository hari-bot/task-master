"use client"

import { getAuthToken } from "@/lib/auth"
import type { Task } from "@/lib/types"

// Get all tasks for a specific project
export async function getProjectTasks(projectId: string): Promise<Task[]> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(`/api/projects/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch tasks")
  }

  return response.json()
}

// Get recent tasks across all projects
export async function getRecentTasks(): Promise<Task[]> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch("/api/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch tasks")
  }

  return response.json()
}

// Get a single task by ID
export async function getTask(projectId: string, taskId: string): Promise<Task> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch task")
  }

  return response.json()
}

// Create a new task
export async function createTask(
  projectId: string,
  data: {
    title: string
    description: string
    status: string
  },
): Promise<Task> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create task")
  }

  return response.json()
}

// Update an existing task
export async function updateTask(
  projectId: string,
  taskId: string,
  data: {
    title: string
    description: string
    status: string
  },
): Promise<Task> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update task")
  }

  return response.json()
}

// Delete a task
export async function deleteTask(projectId: string, taskId: string): Promise<void> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete task")
  }

  return Promise.resolve()
}
