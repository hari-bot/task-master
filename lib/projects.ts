"use client"

import { getAuthToken } from "@/lib/auth"
import type { Project } from "@/lib/types"

// Get all projects for the current user
export async function getProjects(): Promise<Project[]> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch("/api/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch projects")
  }

  return response.json()
}

// Get a single project by ID
export async function getProject(projectId: string): Promise<Project> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(`/api/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch project")
  }

  return response.json()
}

// Create a new project
export async function createProject(data: {
  title: string
  description: string
}): Promise<Project> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create project")
  }

  return response.json()
}

// Update an existing project
export async function updateProject(
  projectId: string,
  data: {
    title: string
    description: string
  },
): Promise<Project> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(`/api/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update project")
  }

  return response.json()
}

// Delete a project
export async function deleteProject(projectId: string): Promise<void> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete project")
  }

  return Promise.resolve()
}
