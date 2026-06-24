"use client";

import { Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { adminPath } from "@/lib/admin-path";

export function OwnerForgotPasswordForm() {
  const t = useTranslations("ownerLogin");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<"rateLimit" | "delivery" | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/owner-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    });

    setLoading(false);

    if (response.ok) {
      setSent(true);
      return;
    }

    setSent(false);
    setError(response.status === 429 ? "rateLimit" : "delivery");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label>
        <span className="mb-2 block text-sm font-bold">{t("email")}</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          required
          className="min-h-12 w-full rounded-md border border-line bg-background px-4 text-base outline-none transition focus:border-accent sm:text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Mail size={17} />
        {loading ? t("resetLoading") : t("resetSubmit")}
      </button>
      {sent && (
        <p className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {t("resetSent")}
        </p>
      )}
      {error && (
        <p className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {t(error === "rateLimit" ? "resetRateLimit" : "resetError")}
        </p>
      )}
      <Link
        href={`${adminPath}/login`}
        className="text-center text-sm font-bold text-muted hover:text-foreground"
      >
        {t("backToLogin")}
      </Link>
    </form>
  );
}
