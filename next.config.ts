import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// ── CSP for main site ─────────────────────────────────────────────────────────
const siteCSP = [
  "default-src 'self'",
  // Allow unsafe-eval in dev (React needs it for error overlays / source maps)
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' https://cdn.sanity.io data: blob:",
  "media-src 'none'",
  "connect-src 'self' https://*.sanity.io https://api.sanity.io",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(!isDev ? ["upgrade-insecure-requests"] : []),
].join("; ");

// ── CSP for Sanity Studio ─────────────────────────────────────────────────────
const studioCSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' https://cdn.sanity.io data: blob: https:",
  "connect-src 'self' https://*.sanity.io https://api.sanity.io wss://*.sanity.io",
  "frame-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const sharedHeaders = [
  { key: "X-DNS-Prefetch-Control",  value: "on" },
  { key: "X-Content-Type-Options",  value: "nosniff" },
  { key: "X-Frame-Options",         value: "SAMEORIGIN" },
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },

  serverExternalPackages: ["@sanity/client", "sanity"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: sharedHeaders,
      },
      {
        source: "/((?!studio).*)",
        headers: [{ key: "Content-Security-Policy", value: siteCSP }],
      },
      {
        source: "/studio(.*)",
        headers: [{ key: "Content-Security-Policy", value: studioCSP }],
      },
      // Cache headers only in production (Next.js manages them in dev)
      ...(!isDev
        ? [
            {
              source: "/_next/static/(.*)",
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
            {
              source: "/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff2|woff)",
              headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
