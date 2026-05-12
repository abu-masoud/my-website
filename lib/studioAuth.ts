import { secureCompare, signValue } from "@/lib/security";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const STUDIO_COOKIE = "studio_access";
export const STUDIO_COOKIE_MAX_AGE = COOKIE_MAX_AGE_SECONDS;

function getStudioSecret(): string | null {
  return process.env.STUDIO_COOKIE_SECRET || process.env.STUDIO_PASSWORD || null;
}

export function createStudioToken(now = Date.now()): string {
  const secret = getStudioSecret();
  if (!secret) {
    throw new Error("Missing STUDIO_PASSWORD or STUDIO_COOKIE_SECRET.");
  }

  const expires = now + COOKIE_MAX_AGE_SECONDS * 1000;
  const payload = String(expires);
  return `${payload}.${signValue(payload, secret)}`;
}

export function isValidStudioToken(token: string | undefined): boolean {
  const secret = getStudioSecret();
  if (!token || !secret) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expires = Number(payload);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  return secureCompare(signature, signValue(payload, secret));
}
