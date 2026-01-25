import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // -----------------------------
  // 1. GLOBAL MAINTENANCE MODE
  // -----------------------------
  const maintenance = process.env.MAINTENANCE_MODE === "true";

  // Allow admin routes to bypass maintenance
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
  // 2. ALLOW ALL API ROUTES TO PASS
  // -----------------------------
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  // -----------------------------
  // 3. READ AUTH SESSION COOKIE
  // -----------------------------
  const rawSession = req.cookies.get("admin_session")?.value;

  let role: string | null = null;

  if (rawSession) {
    try {
      const parsed = JSON.parse(rawSession);
      role = parsed.role;
    } catch {
      role = null;
    }
  }

  const isLoginPage = path === "/admin/login";
  const isAdminPage = path.startsWith("/admin");

  // -----------------------------
  // 4. IF NOT LOGGED IN → REDIRECT
  // -----------------------------
  if (!role && isAdminPage && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // -----------------------------
  // 5. IF LOGGED IN → REDIRECT AWAY FROM LOGIN
  // -----------------------------
  if (role && isLoginPage) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "STAFF") return NextResponse.redirect(new URL("/admin/scanner", req.url));
    if (role === "AUDIT") return NextResponse.redirect(new URL("/admin/audit", req.url));
  }

  // -----------------------------
  // 6. ROLE-BASED ACCESS CONTROL
  // -----------------------------

  // ADMIN ONLY
  const adminOnlyRoutes = ["/admin", "/admin/orders", "/admin/checkin"];
  if (adminOnlyRoutes.includes(path) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // STAFF + ADMIN
  if (path === "/admin/scanner" && !["ADMIN", "STAFF"].includes(role || "")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // AUDIT ONLY
  if (path === "/admin/audit" && role !== "AUDIT") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Debug
  console.log("PROXY:", path, "ROLE:", role);

  return NextResponse.next();
}

// -----------------------------
// 7. MATCH ALL ROUTES
// -----------------------------
export const config = {
  matcher: ["/:path*"],
};
