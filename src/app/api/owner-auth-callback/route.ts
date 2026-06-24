import { NextResponse } from "next/server";
import { adminPath } from "@/lib/admin-path";
import { getOwnerAuthProvider } from "@/lib/auth/owner-auth-provider";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = `/bg${adminPath}/update-password`;

  if (getOwnerAuthProvider() !== "supabase" || !code) {
    return NextResponse.redirect(new URL(`/bg${adminPath}/login`, url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(
    new URL(error ? `/bg${adminPath}/login` : next, url.origin),
  );
}
