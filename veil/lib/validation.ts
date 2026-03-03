/**
 * URL validation utilities
 * Prevents open redirect abuse and validates URL format
 */

/** Blocked protocols that could be used for attacks */
const BLOCKED_PROTOCOLS = ["javascript:", "data:", "vbscript:", "file:"];

/** Blocked hostnames to prevent redirect loops */
const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"];

/**
 * Validates a URL string for safety and correctness.
 * Returns { valid, error } object.
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  // Basic length check
  if (!url || url.length === 0) {
    return { valid: false, error: "URL is required" };
  }

  if (url.length > 2048) {
    return { valid: false, error: "URL is too long (max 2048 characters)" };
  }

  // Check for blocked protocols
  const lowerUrl = url.toLowerCase().trim();
  for (const protocol of BLOCKED_PROTOCOLS) {
    if (lowerUrl.startsWith(protocol)) {
      return { valid: false, error: "Invalid URL protocol" };
    }
  }

  // Try parsing the URL
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }

  // Only allow http and https
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { valid: false, error: "Only HTTP and HTTPS URLs are allowed" };
  }

  // Block local/internal hostnames
  if (BLOCKED_HOSTS.includes(parsed.hostname)) {
    return { valid: false, error: "Internal URLs are not allowed" };
  }

  // Block private IP ranges
  if (isPrivateIP(parsed.hostname)) {
    return { valid: false, error: "Private IP addresses are not allowed" };
  }

  return { valid: true };
}

/**
 * Checks if a hostname is a private/internal IP address
 */
function isPrivateIP(hostname: string): boolean {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return false;

  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 169.254.0.0/16 (link-local)
  if (parts[0] === 169 && parts[1] === 254) return true;

  return false;
}
