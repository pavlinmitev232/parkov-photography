"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { adminPath } from "@/lib/admin-path";

export function OwnerLogoutButton() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/owner-logout", { method: "POST" });
    router.push(`${adminPath}/login`);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={logout}
      className="inline-flex items-center gap-2 rounded-md border border-line bg-background px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
    >
      <LogOut size={16} />
      {loading ? t("loggingOut") : t("logout")}
    </button>
  );
}
