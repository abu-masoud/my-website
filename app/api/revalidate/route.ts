import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { secureCompare } from "@/lib/security";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const headerSecret = req.headers.get("x-revalidate-secret") ?? undefined;
  const querySecret = req.nextUrl.searchParams.get("secret") ?? undefined;
  const suppliedSecret = bearerSecret || headerSecret || querySecret;

  if (!secureCompare(suppliedSecret, process.env.SANITY_REVALIDATE_SECRET)) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json(
    { revalidated: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
