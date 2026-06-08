import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userIdCookie = request.cookies.get("user_id");

  // Allow public assets used by the quiz UI.
  if (pathname.startsWith("/media/")) {
    return NextResponse.next();
  }

  // Allow access to login page
  if (pathname.startsWith("/login")) {
    // If user is already logged in, redirect to dashboard
    if (userIdCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Require authentication for all other routes
  if (!userIdCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|media).*)"],
};
