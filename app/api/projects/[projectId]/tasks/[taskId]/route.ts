import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-helpers"

export async function GET(req: Request, { params }: { params: { projectId: string; taskId: string } }) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if project exists and belongs to user
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Get task
    const task = await prisma.task.findUnique({
      where: {
        id: params.taskId,
        projectId: params.projectId,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { projectId: string; taskId: string } }) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, status } = await req.json()

    // Check if project exists and belongs to user
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: {
        id: params.taskId,
        projectId: params.projectId,
      },
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if status is changing to COMPLETED
    const wasCompleted = existingTask.status === "COMPLETED"
    const isNowCompleted = status === "COMPLETED"
    const completedAt = isNowCompleted ? (wasCompleted ? existingTask.completedAt : new Date()) : null

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        title,
        description,
        status,
        completedAt,
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { projectId: string; taskId: string } }) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if project exists and belongs to user
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: {
        id: params.taskId,
        projectId: params.projectId,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Delete task
    await prisma.task.delete({
      where: { id: params.taskId },
    })

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
