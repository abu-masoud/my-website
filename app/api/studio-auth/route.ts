import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const PASSWORD = process.env.STUDIO_PASSWORD!;
const COOKIE   = "studio_access";
const MAX_AGE  = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password !== PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
  return NextResponse.json({ ok: true });
}
