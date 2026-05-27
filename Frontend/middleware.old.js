// middleware.js — place at the root of your Next.js project
// Runs on every request BEFORE the page renders

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // or your own session utility

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── Skip public routes ──────────────────────────────────────────────────
  const PUBLIC_PATHS = ["/login", "/register", "/pending-approval", "/api"];
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── Resolve session ─────────────────────────────────────────────────────
  // Using next-auth. Swap for your own token/session logic if needed.
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not logged in → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { role, status } = token; // make sure your JWT callback includes these

  // ── Pending vendor → pending-approval page ──────────────────────────────
  if (role === "vendor" && status === "pending") {
    // Allow them to stay on /pending-approval itself (already skipped above)
    return NextResponse.redirect(new URL("/pending-approval", request.url));
  }

  // ── Rejected vendor → cannot access dashboard ───────────────────────────
  if (role === "vendor" && status === "rejected") {
    return NextResponse.redirect(new URL("/account-rejected", request.url));
  }

  // ── Admin-only routes ───────────────────────────────────────────────────
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to everything except _next internals & static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
