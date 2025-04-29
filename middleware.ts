import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect /api/auth/verify and /api routes except for login and signup
  const isVerifyRoute = request.nextUrl.pathname === "/api/auth/verify";
  const isProtectedApiRoute =
    request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/api/auth/login") &&
    !request.nextUrl.pathname.startsWith("/api/auth/signup");

  if (!isVerifyRoute && !isProtectedApiRoute) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Add the token to the request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Authorization", authHeader);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
