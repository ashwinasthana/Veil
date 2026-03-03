/**
 * POST /api/shorten
 * Creates a shortened URL with optional privacy features:
 * - Optional expiry date
 * - Optional password protection (hashed with bcrypt)
 * - Optional click limit (self-destruct)
 * Rate limited: 10 creations/min per IP
 */
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateUrl } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // ─── Rate Limiting ───
    // Use IP only transiently for rate limiting — never stored
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ??
               request.headers.get("x-real-ip") ??
               "anonymous";

    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": rateLimit.reset.toString(),
            "Retry-After": Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // ─── Parse request body ───
    const body = await request.json();
    const { url, password, expiresAt, clickLimit } = body as {
      url: string;
      password?: string;
      expiresAt?: string;
      clickLimit?: number;
    };

    // ─── Validate URL ───
    const validation = validateUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // ─── Validate optional fields ───
    if (expiresAt) {
      const expiry = new Date(expiresAt);
      if (isNaN(expiry.getTime())) {
        return NextResponse.json(
          { error: "Invalid expiry date" },
          { status: 400 }
        );
      }
      if (expiry <= new Date()) {
        return NextResponse.json(
          { error: "Expiry date must be in the future" },
          { status: 400 }
        );
      }
    }

    if (clickLimit !== undefined) {
      if (!Number.isInteger(clickLimit) || clickLimit < 1 || clickLimit > 1000000) {
        return NextResponse.json(
          { error: "Click limit must be between 1 and 1,000,000" },
          { status: 400 }
        );
      }
    }

    // ─── Hash password if provided ───
    let passwordHash: string | null = null;
    if (password && password.length > 0) {
      if (password.length > 128) {
        return NextResponse.json(
          { error: "Password too long (max 128 characters)" },
          { status: 400 }
        );
      }
      passwordHash = await bcrypt.hash(password, 12);
    }

    // ─── Generate unique short code ───
    const shortCode = nanoid(8);

    // ─── Store in database ───
    const shortened = await prisma.shortenedUrl.create({
      data: {
        originalUrl: url,
        shortCode,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        passwordHash,
        clickLimit: clickLimit ?? null,
        clickCount: 0,
      },
    });

    // ─── Build the short URL ───
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || getBaseUrl(request);
    const shortUrl = `${baseUrl}/${shortened.shortCode}`;

    return NextResponse.json(
      {
        shortUrl,
        shortCode: shortened.shortCode,
        expiresAt: shortened.expiresAt,
        hasPassword: !!passwordHash,
        clickLimit: shortened.clickLimit,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("[Veil] Error creating short URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/** Extract base URL from the request */
function getBaseUrl(request: NextRequest): string {
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host") || "localhost:3000";
  return `${protocol}://${host}`;
}
