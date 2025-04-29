import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        country: user.country,
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
