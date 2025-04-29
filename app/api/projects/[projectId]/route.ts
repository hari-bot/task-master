import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-helpers"

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: user.id,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
        tasks: {
          where: { status: "COMPLETED" },
          select: { id: true },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Transform data to include task counts
    const projectWithCounts = {
      id: project.id,
      title: project.title,
      description: project.description,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      totalTasks: project._count.tasks,
      completedTasks: project.tasks.length,
    }

    return NextResponse.json(projectWithCounts)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { projectId: string } }) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description } = await req.json()

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: user.id,
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: params.projectId },
      data: {
        title,
        description,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
        tasks: {
          where: { status: "COMPLETED" },
          select: { id: true },
        },
      },
    })

    // Transform data to include task counts
    const projectWithCounts = {
      id: updatedProject.id,
      title: updatedProject.title,
      description: updatedProject.description,
      userId: updatedProject.userId,
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt,
      totalTasks: updatedProject._count.tasks,
      completedTasks: updatedProject.tasks.length,
    }

    return NextResponse.json(projectWithCounts)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { projectId: string } }) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: user.id,
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Delete project (tasks will be deleted due to cascade)
    await prisma.project.delete({
      where: { id: params.projectId },
    })

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
