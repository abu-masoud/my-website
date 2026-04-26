import { NextRequest, NextResponse } from "next/server";

// ── Blocked user-agent patterns (scrapers / scanners) ────────────────────────
const BLOCKED_UA = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i,
  /dirbuster/i, /gobuster/i, /nuclei/i, /python-requests\/[01]\./i,
];

// ── Paths that should never be publicly accessible ───────────────────────────
const BLOCKED_PATHS = [
  /\/\.env/,
  /\/\.git/,
  /\/wp-admin/,
  /\/phpMyAdmin/i,
  /\/etc\/passwd/,
  /\/admin\.php/i,
];

// ── Simple in-memory rate limiter (resets on edge cold-start) ─────────────────
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT  = 120;   // requests
const RATE_WINDOW = 60_000; // 1 minute in ms

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent") ?? "";

  // 0 — Protect /studio behind password cookie
  if (pathname.startsWith("/studio") && !pathname.startsWith("/studio-login")) {
    const cookie = request.cookies.get("studio_access");
    if (!cookie || cookie.value !== "1") {
      return NextResponse.redirect(new URL("/studio-login", request.url));
    }
  }

  // 1 — Block known scanner user-agents
  if (BLOCKED_UA.some((re) => re.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2 — Block path scanning attempts
  if (BLOCKED_PATHS.some((re) => re.test(pathname))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 3 — Rate limit (skip for static assets)
  if (!pathname.startsWith("/_next/") && !pathname.match(/\.(ico|png|jpg|svg|webp|avif|woff2?)$/)) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }
  }

  // 4 — Force HTTPS redirect (handled by HSTS header in prod, but belt + braces)
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get("host")}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
