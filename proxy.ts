import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ✅ Skip API routes — do NOT protect them
  if (path.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // ✅ Read cookie
  const adminsession = req.cookies.get("admin_session")?.value;
  const isLoggedIn = adminsession === "true";

  // ✅ Define protected routes
  const isLoginPage = path === "/admin/login";
  const isAdminPage = path === "/admin" || path.startsWith("/admin/");

  // ✅ Redirect if not logged in
  if (!isLoggedIn && isAdminPage && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // ✅ Prevent access to login page if already logged in
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  console.log("PROXY RUNNING:", req.nextUrl.pathname);
  const session = req.cookies.get("admin_session_v2")?.value;


  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
