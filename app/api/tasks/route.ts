import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-helpers"

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all tasks for user's projects
    const tasks = await prisma.task.findMany({
      where: {
        project: {
          userId: user.id,
        },
      },
      include: {
        project: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
