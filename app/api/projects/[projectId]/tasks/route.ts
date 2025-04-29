import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-helpers"

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
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

    // Get tasks for the project
    const tasks = await prisma.task.findMany({
      where: { projectId: params.projectId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { projectId: string } }) {
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

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "TODO",
        projectId: params.projectId,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
