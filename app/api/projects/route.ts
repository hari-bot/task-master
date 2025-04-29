import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-helpers"

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
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
    const projectsWithCounts = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      totalTasks: project._count.tasks,
      completedTasks: project.tasks.length,
    }))

    return NextResponse.json(projectsWithCounts)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description } = await req.json()

    // Check if user already has 4 projects
    const projectCount = await prisma.project.count({
      where: { userId: user.id },
    })

    if (projectCount >= 4) {
      return NextResponse.json({ error: "Maximum number of projects (4) reached" }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: user.id,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
