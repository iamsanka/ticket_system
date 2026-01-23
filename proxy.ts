import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // -----------------------------
  // 1. GLOBAL MAINTENANCE MODE
  // -----------------------------
  const maintenance = process.env.MAINTENANCE_MODE === "true";

  // Allow admin to bypass maintenance (optional)
  const isAdminRoute = path.startsWith("/admin");

  if (maintenance && !isAdminRoute) {
    return new NextResponse(
      `
        <html>
          <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center;">
            <div>
              <h1 style="font-size:32px;margin-bottom:16px;">Server Busy</h1>
              <p>We are performing updates. Please try again shortly.</p>
            </div>
          </body>
        </html>
      `,
      {
        status: 503,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  // -----------------------------
  // 2. ADMIN AUTH LOGIC (unchanged)
  // -----------------------------

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

// -----------------------------
// 3. MATCH ALL ROUTES
// -----------------------------
export const config = {
  matcher: ["/:path*"], // apply proxy to the entire site
};
