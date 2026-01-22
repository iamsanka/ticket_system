import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow API routes to pass through (critical for login to work)
  if (path.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Read the correct cookie (only ONE cookie name)
  const session = req.cookies.get("admin_session_v2")?.value;
  const isLoggedIn = session === "true";

  // Define protected routes
  const isLoginPage = path === "/admin/login";
  const isAdminPage = path === "/admin" || path.startsWith("/admin/");

  // Redirect unauthenticated users away from admin pages
  if (!isLoggedIn && isAdminPage && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Redirect logged-in users away from login page
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Debug
  console.log("PROXY RUNNING:", path, "SESSION:", session);

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
