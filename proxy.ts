import { NextRequest, NextResponse } from "next/server";
import { isValidStudioToken, STUDIO_COOKIE } from "@/lib/studioAuth";

const BLOCKED_UA = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /dirbuster/i,
  /gobuster/i,
  /nuclei/i,
  /python-requests\/[01]\./i,
];

const BLOCKED_PATHS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/wp-admin/i,
  /\/phpmyadmin/i,
  /\/etc\/passwd/i,
  /\/admin\.php/i,
];

const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 120;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

function plainResponse(body: string, status: number, headers?: HeadersInit) {
  return new NextResponse(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent") ?? "";

  if (pathname.startsWith("/studio") && !pathname.startsWith("/studio-login")) {
    const cookie = request.cookies.get(STUDIO_COOKIE);
    if (!isValidStudioToken(cookie?.value)) {
      return NextResponse.redirect(new URL("/studio-login", request.url));
    }
  }

  if (BLOCKED_UA.some((re) => re.test(ua))) {
    return plainResponse("Forbidden", 403);
  }

  if (BLOCKED_PATHS.some((re) => re.test(pathname))) {
    return plainResponse("Not Found", 404);
  }

  if (!pathname.startsWith("/_next/") && !/\.(ico|png|jpg|svg|webp|avif|woff2?)$/i.test(pathname)) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return plainResponse("Too Many Requests", 429, { "Retry-After": "60" });
    }
  }

  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
