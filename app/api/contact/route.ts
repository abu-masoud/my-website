import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL ?? "hello@example.com";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";

// Rate limit: max 2 submissions per IP per hour
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
  if (!TURNSTILE_SECRET) return true; // skip if not configured
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
  });
  const data = await res.json();
  return data.success === true;
}

function containsSpam(text: string): boolean {
  const spamPatterns = [
    /https?:\/\//gi,           // URLs in message
    /\b(viagra|cialis|casino|crypto|bitcoin|nft|seo\s+service)\b/gi,
    /(.)\1{6,}/,               // repeated characters e.g. aaaaaaa
  ];
  return spamPatterns.some((p) => p.test(text));
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { name, email, subject, message, turnstileToken } = await req.json();

  // Field validation
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Spam content check
  if (containsSpam(message) || containsSpam(name)) {
    return NextResponse.json({ error: "Message flagged as spam" }, { status: 400 });
  }

  // Cloudflare Turnstile verification — only runs when token was provided
  if (TURNSTILE_SECRET && turnstileToken) {
    const valid = await verifyTurnstile(turnstileToken, ip);
    if (!valid) {
      return NextResponse.json({ error: "Verification failed" }, { status: 403 });
    }
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#111;color:#f0ede8;">
          <h2 style="color:#c9956a;font-size:18px;margin-bottom:4px;">New message from ${name}</h2>
          <p style="color:#6b6b6b;font-size:13px;margin-bottom:24px;">${email}</p>
          <hr style="border:none;border-top:1px solid #222;margin-bottom:24px;" />
          <p style="font-size:15px;line-height:1.8;color:#c0bdb8;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          <hr style="border:none;border-top:1px solid #222;margin-top:24px;margin-bottom:16px;" />
          <p style="font-size:11px;color:#444;">Sent from your portfolio contact form · IP: ${ip}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
