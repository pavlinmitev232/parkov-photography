"use client";

import { KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { adminPath } from "@/lib/admin-path";

export function OwnerUpdatePasswordForm() {
  const t = useTranslations("ownerLogin");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8 || password !== confirmPassword) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    const response = await fetch("/api/owner-update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
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
        <span className="mb-2 block text-sm font-bold">
          {t("newPassword")}
        </span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="min-h-12 w-full rounded-md border border-line bg-background px-4 text-base outline-none transition focus:border-accent sm:text-sm"
        />
      </label>
      <label>
        <span className="mb-2 block text-sm font-bold">
          {t("confirmPassword")}
        </span>
        <input
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="min-h-12 w-full rounded-md border border-line bg-background px-4 text-base outline-none transition focus:border-accent sm:text-sm"
        />
      </label>
      <p className="text-sm text-muted">{t("passwordHelp")}</p>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        <KeyRound size={17} />
        {loading ? t("passwordLoading") : t("passwordSubmit")}
      </button>
      {error && (
        <p className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {t("passwordError")}
        </p>
      )}
    </form>
  );
}
