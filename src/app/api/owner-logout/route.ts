import { NextResponse } from "next/server";
import { clearOwnerSession } from "@/lib/auth/owner-session";

export const runtime = "nodejs";

export async function POST() {
  await clearOwnerSession();
  return NextResponse.json({ ok: true });
}
