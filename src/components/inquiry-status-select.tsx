"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";

type InquiryStatusSelectProps = {
  inquiryId: string;
  status: string;
};

const statuses = ["new", "contacted", "booked", "closed"];

export function InquiryStatusSelect({
  inquiryId,
  status,
}: InquiryStatusSelectProps) {
  const t = useTranslations("adminRequests");
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function updateStatus(nextStatus: string) {
    setValue(nextStatus);
    setSaving(true);
    setError(false);

    const response = await fetch(`/api/inquiries/${inquiryId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    setSaving(false);

    if (!response.ok) {
      setValue(status);
      setError(true);
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-2">
      <select
        value={value}
        disabled={saving}
        onChange={(event) => updateStatus(event.target.value)}
        className="min-h-10 rounded-md border border-line bg-background px-3 text-sm font-bold outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        {statuses.map((item) => (
          <option value={item} key={item}>
            {t(`statuses.${item}`)}
          </option>
        ))}
      </select>
      {saving && <span className="text-xs text-muted">{t("saving")}</span>}
      {error && <span className="text-xs text-error">{t("statusError")}</span>}
    </div>
  );
}
