// /proxy.ts
import { NextResponse } from "next/server";

export default function proxy(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // -----------------------------
  // 0. IGNORE NEXT.JS INTERNAL ROUTES
  // -----------------------------
  if (
    path.startsWith("/_next") ||
    path.startsWith("/favicon") ||
    path.startsWith("/assets") ||
    path.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // -----------------------------
  // 0.5 ALLOW LOGIN PAGE BEFORE ANY COOKIE OR ROLE LOGIC
  // -----------------------------
  if (path.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // -----------------------------
  // DEBUG LOG (ADMIN ROUTES ONLY)
  // -----------------------------
  if (path.startsWith("/admin")) {
    console.log("PATH CHECK:", {
      path,
      isAdminPage: true,
    });
  }

  // -----------------------------
  // 1. GLOBAL MAINTENANCE MODE
  // -----------------------------
  const maintenance = process.env.MAINTENANCE_MODE === "true";
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
  // 2. ALLOW ALL API ROUTES (BUT HANDLE /api/admin/orders BELOW)
  // -----------------------------
  if (path.startsWith("/api")) {
    // continue to cookie logic
  }

  // -----------------------------
  // 3. READ AUTH SESSION COOKIE
  // -----------------------------
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/admin_session=([^;]+)/);

  let role: string | null = null;

  if (match) {
    try {
      const parsed = JSON.parse(decodeURIComponent(match[1]));
      role = parsed.role;
    } catch {
      // Invalid cookie → clear it and continue
      const res = NextResponse.next();
      res.headers.append("Set-Cookie", "admin_session=; Path=/; Max-Age=0;");
      return res;
    }
  }

  const isAdminPage = path.startsWith("/admin");

  // -----------------------------
  // 4. IF NOT LOGGED IN → REDIRECT
  // -----------------------------
  if (!role && isAdminPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // -----------------------------
  // 5. ROLE-BASED ACCESS CONTROL
  // -----------------------------

  // ⭐ Admin-only pages (AUDIT should NOT access these)
  const adminOnly = [
    "/admin/users",
    "/admin/events",
    "/admin/checkin",
  ];

  if (adminOnly.some((r) => path.startsWith(r)) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // ⭐ Allow AUDIT + ADMIN to access /admin/orders
  if (path.startsWith("/admin/orders")) {
    if (!["ADMIN", "AUDIT"].includes(role || "")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // ⭐ Allow AUDIT + ADMIN to access /api/admin/orders
  if (path.startsWith("/api/admin/orders")) {
    if (!["ADMIN", "AUDIT"].includes(role || "")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // ⭐ Staff + Admin can access scanner
  if (path.startsWith("/admin/scanner")) {
    if (!["ADMIN", "STAFF"].includes(role || "")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // ⭐ Audit + Admin can access audit pages
  if (path.startsWith("/admin/audit")) {
    if (!["ADMIN", "AUDIT"].includes(role || "")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // -----------------------------
  // 6. DEFAULT → ALLOW
  // -----------------------------
  return NextResponse.next();
}
