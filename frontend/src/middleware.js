import { NextResponse } from "next/server";

/**
 * Next.js Edge Middleware — runs before every request hits a page.
 *
 * Strategy:
 * - We can only read cookies at the edge (no access to in-memory token).
 * - The presence of the "refreshToken" HttpOnly cookie is our auth signal.
 *   If it exists, the user has an active session. If not, they're logged out.
 *
 * Guards:
 * - GUEST_ONLY routes redirect logged-in users away (e.g. /login → /dashboard)
 * - PROTECTED routes redirect unauthenticated users to /login
 * - Role-based checks (tutor/admin) are handled in layout.jsx files on the
 *   client, because the cookie doesn't carry role information.
 */

// Routes only accessible when NOT logged in
const GUEST_ONLY = ["/login", "/signup"];

// Routes that require any authenticated user
const PROTECTED = [
  "/dashboard",
  "/checkout",
  "/tutor-dashboard",
  "/create-course",
  "/verification",
  "/admin",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Detect session via refresh token cookie (set as HttpOnly by backend)
  const hasSession = !!request.cookies.get("refreshToken")?.value;

  // Logged-in user tries to visit /login or /signup → send to dashboard
  if (GUEST_ONLY.some((route) => pathname.startsWith(route)) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user tries to visit a protected route → send to login
  if (PROTECTED.some((route) => pathname.startsWith(route)) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals, static files, and API routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
