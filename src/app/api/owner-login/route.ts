import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getOwnerAuthProvider,
  isOwnerUser,
} from "@/lib/auth/owner-auth-provider";
import { setOwnerSessionCookie } from "@/lib/auth/owner-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (getOwnerAuthProvider() === "supabase") {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !isOwnerUser(data.user)) {
      if (data.session) {
        await supabase.auth.signOut();
      }

      return NextResponse.json(
        { ok: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (
    !adminEmail ||
    !adminPassword ||
    !safeEqual(email, adminEmail) ||
    !safeEqual(password, adminPassword)
  ) {
    return NextResponse.json(
      { ok: false, error: "Invalid credentials" },
      { status: 401 },
    );
  }

  await setOwnerSessionCookie(email);

  return NextResponse.json({ ok: true });
}
