import { NextResponse } from "next/server";
import { clearOwnerSessionCookie } from "@/lib/auth/owner-session";

export const runtime = "nodejs";

export async function POST() {
  await clearOwnerSessionCookie();
  return NextResponse.json({ ok: true });
}
