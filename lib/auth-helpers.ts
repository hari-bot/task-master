import { verify } from "jsonwebtoken";
import type { User } from "@/lib/types";
import { prisma } from "./db";

export async function getUserFromRequest(req: Request): Promise<User | null> {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { id: string };

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}
