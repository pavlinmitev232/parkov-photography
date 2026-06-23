"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { adminPath } from "@/lib/admin-path";

export function OwnerLoginForm() {
  const t = useTranslations("ownerLogin");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(false);

    const response = await fetch("/api/owner-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      setError(true);
      return;
    }

    router.push(adminPath);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label>
        <span className="mb-2 block text-sm font-bold">{t("email")}</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="username"
          className="min-h-12 w-full rounded-md border border-line bg-background px-4 text-sm outline-none transition focus:border-accent"
        />
      </label>
      <label>
        <span className="mb-2 block text-sm font-bold">{t("password")}</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          className="min-h-12 w-full rounded-md border border-line bg-background px-4 text-sm outline-none transition focus:border-accent"
        />
      </label>
      <button
        disabled={loading}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Lock size={17} />
        {loading ? t("loading") : t("submit")}
      </button>
      {error && (
        <p className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {t("error")}
        </p>
      )}
    </form>
  );
}
