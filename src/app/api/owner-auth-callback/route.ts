import { NextResponse } from "next/server";
import { adminPath } from "@/lib/admin-path";
import { getOwnerAuthProvider } from "@/lib/auth/owner-auth-provider";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = `/bg${adminPath}/update-password`;

  if (getOwnerAuthProvider() !== "supabase") {
    return NextResponse.redirect(new URL(`/bg${adminPath}/login`, url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } =
    tokenHash && type === "recovery"
      ? await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        })
      : code
        ? await supabase.auth.exchangeCodeForSession(code)
        : { error: new Error("Missing owner recovery token") };

  return NextResponse.redirect(
    new URL(error ? `/bg${adminPath}/login` : next, url.origin),
  );
}
