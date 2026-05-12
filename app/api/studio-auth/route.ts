import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createStudioToken, STUDIO_COOKIE, STUDIO_COOKIE_MAX_AGE } from "@/lib/studioAuth";
import { secureCompare } from "@/lib/security";

const MAX_PASSWORD_LENGTH = 256;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password =
    body && typeof body === "object" && "password" in body
      ? String(body.password).slice(0, MAX_PASSWORD_LENGTH)
      : "";
  const configuredPassword = process.env.STUDIO_PASSWORD;

  if (!secureCompare(password, configuredPassword)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(STUDIO_COOKIE, createStudioToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STUDIO_COOKIE_MAX_AGE,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(STUDIO_COOKIE);
  return NextResponse.json({ ok: true });
}
