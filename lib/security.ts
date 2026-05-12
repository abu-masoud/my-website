import { createHash, createHmac, timingSafeEqual } from "crypto";

const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizeHeaderValue(value: string, maxLength = 160): string {
  return value.replace(/[\r\n]/g, " ").trim().slice(0, maxLength);
}

export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (trimmed.startsWith("/")) return trimmed.startsWith("//") ? null : trimmed;

  try {
    const url = new URL(trimmed);
    return SAFE_URL_PROTOCOLS.has(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function safeMailto(email: string | null | undefined, subject?: string): string | null {
  if (!email) return null;

  const cleanEmail = email.replace(/[\r\n]/g, "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return null;

  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${cleanEmail}${query}`;
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

export function secureCompare(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false;

  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;

  return timingSafeEqual(left, right);
}

export function signValue(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}
