export type OwnerAuthProvider = "legacy" | "supabase";

export function getOwnerAuthProvider(): OwnerAuthProvider {
  return process.env.OWNER_AUTH_PROVIDER === "supabase" ? "supabase" : "legacy";
}

export function getSupabaseAuthConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase owner auth requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, publishableKey };
}

export function isOwnerUser(user: {
  app_metadata?: Record<string, unknown>;
}) {
  const role = user.app_metadata?.role;
  const roles = user.app_metadata?.roles;

  return (
    role === "owner" ||
    (Array.isArray(roles) && roles.some((candidate) => candidate === "owner"))
  );
}
