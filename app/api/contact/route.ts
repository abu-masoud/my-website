import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml, hashIp, safeMailto, sanitizeHeaderValue } from "@/lib/security";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const TO_EMAIL = process.env.CONTACT_EMAIL ?? "hello@example.com";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";
const MAX_BODY_BYTES = 12_000;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 140;
const MAX_MESSAGE_LENGTH = 5_000;

const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 3_600_000 });
    return false;
  }
  entry.count++;
  return entry.count > 2;
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true;

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
  });

  if (!res.ok) return false;

  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

function containsSpam(text: string): boolean {
  const spamPatterns = [
    /https?:\/\//i,
    /\b(viagra|cialis|casino|crypto|bitcoin|nft|seo\s+service)\b/i,
    /(.)\1{6,}/,
  ];
  return spamPatterns.some((p) => p.test(text));
}

function normalizeField(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const name = normalizeField(payload.name, MAX_NAME_LENGTH);
  const email = normalizeField(payload.email, MAX_EMAIL_LENGTH);
  const subject = normalizeField(payload.subject, MAX_SUBJECT_LENGTH);
  const message = normalizeField(payload.message, MAX_MESSAGE_LENGTH);
  const turnstileToken = normalizeField(payload.turnstileToken, 2048);

  if (!name || !email || !message || message.length < 10) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!safeMailto(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (containsSpam(message) || containsSpam(name)) {
    return NextResponse.json({ error: "Message flagged as spam" }, { status: 400 });
  }

  if (TURNSTILE_SECRET) {
    if (!turnstileToken) {
      return NextResponse.json({ error: "Verification required" }, { status: 403 });
    }

    const valid = await verifyTurnstile(turnstileToken, ip);
    if (!valid) {
      return NextResponse.json({ error: "Verification failed" }, { status: 403 });
    }
  }

  try {
    if (!RESEND_API_KEY || RESEND_API_KEY.startsWith("re_your")) {
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(RESEND_API_KEY);
    const cleanName = escapeHtml(name);
    const cleanEmail = escapeHtml(email);
    const cleanMessage = escapeHtml(message);
    const cleanIp = escapeHtml(hashIp(ip));

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: subject
        ? `[Portfolio] ${sanitizeHeaderValue(subject, MAX_SUBJECT_LENGTH)}`
        : `[Portfolio] New message from ${sanitizeHeaderValue(name, MAX_NAME_LENGTH)}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#111;color:#f0ede8;">
          <h2 style="color:#c9956a;font-size:18px;margin-bottom:4px;">New message from ${cleanName}</h2>
          <p style="color:#6b6b6b;font-size:13px;margin-bottom:24px;">${cleanEmail}</p>
          <hr style="border:none;border-top:1px solid #222;margin-bottom:24px;" />
          <p style="font-size:15px;line-height:1.8;color:#c0bdb8;white-space:pre-wrap;">${cleanMessage}</p>
          <hr style="border:none;border-top:1px solid #222;margin-top:24px;margin-bottom:16px;" />
          <p style="font-size:11px;color:#444;">Sent from your portfolio contact form. IP hash: ${cleanIp}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
