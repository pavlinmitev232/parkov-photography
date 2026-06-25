"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type InquiryReplyActionProps = {
  inquiryId: string;
  customerName: string;
  email: string;
  service: string;
  preferredDate: string | null;
};

const templateKeys = [
  "availability",
  "moreInformation",
  "quotation",
  "unavailable",
  "confirmation",
] as const;

export function InquiryReplyAction({
  inquiryId,
  customerName,
  email,
  service,
  preferredDate,
}: InquiryReplyActionProps) {
  const t = useTranslations("adminRequests.reply");
  const [template, setTemplate] =
    useState<(typeof templateKeys)[number]>("availability");
  const mailto = useMemo(() => {
    const subject = t("subject", { service });
    const body = t(`templates.${template}.body`, {
      name: customerName,
      service,
      date: preferredDate || t("dateToConfirm"),
    });
    return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }, [customerName, email, preferredDate, service, t, template]);

  return (
    <div className="grid gap-2">
      <label className="sr-only" htmlFor={`reply-template-${inquiryId}`}>
        {t("templateLabel")}
      </label>
      <select
        id={`reply-template-${inquiryId}`}
        name="replyTemplate"
        value={template}
        onChange={(event) =>
          setTemplate(event.target.value as (typeof templateKeys)[number])
        }
        className="min-h-10 rounded-md border border-line bg-background px-3 text-base outline-none focus:border-accent sm:text-sm"
      >
        {templateKeys.map((key) => (
          <option value={key} key={key}>
            {t(`templates.${key}.label`)}
          </option>
        ))}
      </select>
      <a
        href={mailto}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line px-3 text-base font-bold hover:border-accent hover:text-accent sm:text-sm"
      >
        <Mail className="size-4 shrink-0" aria-hidden="true" />
        {t("action")}
      </a>
      <p className="text-base/7 text-muted sm:text-sm/6">{t("help")}</p>
    </div>
  );
}
