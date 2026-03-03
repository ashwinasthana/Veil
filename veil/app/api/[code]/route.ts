/**
 * GET /api/[code]
 * Resolves a short code and redirects to the original URL.
 *
 * POST /api/[code]
 * Handles password-protected links — accepts { password } in body.
 *
 * Checks: expiry, click limits, password protection.
 * Increments click count on successful redirect.
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: { code: string };
}

/** Handle non-password-protected redirects */
export async function GET(request: NextRequest, { params }: RouteParams) {
  return handleRedirect(request, params.code, null);
}

/** Handle password-protected redirects */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };
    return handleRedirect(request, params.code, password ?? null);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

/**
 * Core redirect logic:
 * 1. Lookup by short code
 * 2. Check if expired
 * 3. Check if click limit exceeded
 * 4. If password-protected, verify password
 * 5. Increment click count
 * 6. Redirect with 302
 */
async function handleRedirect(request: NextRequest, code: string, password: string | null) {
  try {
    // ─── Sanitize code ───
    if (!code || code.length > 12 || !/^[A-Za-z0-9_-]+$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid short code" },
        { status: 400 }
      );
    }

    // ─── Lookup ───
    const link = await prisma.shortenedUrl.findUnique({
      where: { shortCode: code },
    });

    if (!link) {
      // For GET requests (browser), redirect to expired page
      if (request.method === "GET") {
        const baseUrl = request.nextUrl.origin;
        return NextResponse.redirect(`${baseUrl}/expired?reason=notfound`, 302);
      }
      return NextResponse.json(
        { error: "Link not found or has been deleted" },
        { status: 404 }
      );
    }

    // ─── Check expiry ───
    if (link.expiresAt && new Date() > link.expiresAt) {
      // Clean up expired link
      await prisma.shortenedUrl.delete({ where: { id: link.id } });
      // For GET requests (browser), redirect to expired page
      if (request.method === "GET") {
        const baseUrl = request.nextUrl.origin;
        return NextResponse.redirect(`${baseUrl}/expired?reason=expired`, 302);
      }
      return NextResponse.json(
        { error: "This link has expired" },
        { status: 410 }
      );
    }

    // ─── Check click limit ───
    if (link.clickLimit && link.clickCount >= link.clickLimit) {
      // Self-destruct: delete the link
      await prisma.shortenedUrl.delete({ where: { id: link.id } });
      // For GET requests (browser), redirect to expired page
      if (request.method === "GET") {
        const baseUrl = request.nextUrl.origin;
        return NextResponse.redirect(`${baseUrl}/expired?reason=destroyed`, 302);
      }
      return NextResponse.json(
        { error: "This link has reached its click limit and has been destroyed" },
        { status: 410 }
      );
    }

    // ─── Check password protection ───
    if (link.passwordHash) {
      if (!password) {
        // For GET requests (browser navigation), redirect to password page
        if (request.method === "GET") {
          const baseUrl = request.nextUrl.origin;
          return NextResponse.redirect(
            `${baseUrl}/password?code=${encodeURIComponent(code)}`,
            302
          );
        }
        // For POST requests (API calls), return JSON
        return NextResponse.json(
          {
            error: "This link is password protected",
            passwordRequired: true,
          },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, link.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Incorrect password", passwordRequired: true },
          { status: 403 }
        );
      }
    }

    // ─── Increment click count ───
    await prisma.shortenedUrl.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } },
    });

    // ─── Redirect ───
    // For POST requests (password form), return JSON with redirect URL
    // so the client can handle the redirect (fetch can't follow 302 properly)
    if (request.method === "POST") {
      return NextResponse.json({ redirectUrl: link.originalUrl }, { status: 200 });
    }
    // For GET requests (browser navigation), use 302 redirect
    return NextResponse.redirect(link.originalUrl, 302);
  } catch (error) {
    console.error("[Veil] Redirect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
