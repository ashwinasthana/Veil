/**
 * Middleware
 * Routes short code requests (e.g., /x7Kp2mQ) to the API handler.
 * Passes through all other routes to Next.js pages.
 */
import { NextRequest, NextResponse } from "next/server";

/** Routes that should NOT be treated as short codes */
const RESERVED_PATHS = new Set([
  "",
  "dashboard",
  "password",
  "api",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract the first path segment
  const segment = pathname.split("/")[1] || "";

  // Only intercept if it looks like a short code (not a reserved path)
  if (
    segment &&
    !RESERVED_PATHS.has(segment) &&
    !segment.startsWith("_") &&
    !segment.includes(".") &&
    /^[A-Za-z0-9_-]+$/.test(segment) &&
    segment.length <= 12
  ) {
    // Rewrite to the API route handler
    const url = request.nextUrl.clone();
    url.pathname = `/api/${segment}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
