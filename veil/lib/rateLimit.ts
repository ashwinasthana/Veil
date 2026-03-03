/**
 * Rate limiting via Upstash Redis
 * Limits URL creation to 10 requests per minute per IP
 * No IP data is persisted — only used transiently for rate limiting
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Creates and returns the rate limiter instance.
 * Falls back to a no-op limiter if Upstash credentials are missing.
 */
function createRateLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // If Upstash is not configured, return null (no rate limiting)
  if (!url || !token) {
    console.warn("[Veil] Upstash Redis not configured — rate limiting disabled");
    return null;
  }

  return new Ratelimit({
    redis: new Redis({ url, token }),
    // 10 requests per 60-second sliding window
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: false, // No analytics — privacy first
    prefix: "veil_rl",
  });
}

const rateLimiter = createRateLimiter();

/**
 * Check rate limit for a given identifier (IP hash or similar).
 * Returns { success, remaining, reset } or allows all if limiter is disabled.
 */
export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  if (!rateLimiter) {
    return { success: true, remaining: 10, reset: 0 };
  }

  const result = await rateLimiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
