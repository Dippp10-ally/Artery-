import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Routes that require a logged-in session ──────────────────────────────────
const PROTECTED_ROUTES = [
  "/patron-dashboard",
  "/orders",
  "/commissions/new",
];

// ── Routes only for guests (redirect logged-in users away) ───────────────────
const GUEST_ONLY_ROUTES = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for our session cookie (set by login page on successful auth)
  const session = request.cookies.get("artery_session")?.value;
  const isLoggedIn = !!session;

  // Protect auth-required routes
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-logged-in users away from /login
  const isGuestOnly = GUEST_ONLY_ROUTES.some((r) => pathname.startsWith(r));
  if (isGuestOnly && isLoggedIn) {
    return NextResponse.redirect(new URL("/patron-dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)).*)",
  ],
};
