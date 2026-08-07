"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";

type InquiryDeleteActionProps = {
  inquiryId: string;
  customerName: string;
};

export function InquiryDeleteAction({
  inquiryId,
  customerName,
}: InquiryDeleteActionProps) {
  const t = useTranslations("adminRequests.delete");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function deleteInquiry() {
    setBusy(true);
    setError("");

    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setOpen(false);
      router.refresh();
    } catch {
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 text-sm font-bold text-muted transition hover:border-error hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
        aria-label={t("action")}
        title={t("action")}
      >
        <Trash2 className="size-4" aria-hidden="true" />
        <span>{t("shortAction")}</span>
      </button>
      {error ? (
        <p className="mt-2 max-w-48 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
      <ConfirmDialog
        open={open}
        title={t("title")}
        description={t("description", { name: customerName })}
        confirmLabel={busy ? t("busy") : t("confirm")}
        cancelLabel={t("cancel")}
        busy={busy}
        onConfirm={deleteInquiry}
        onCancel={() => {
          if (!busy) setOpen(false);
        }}
      />
    </>
  );
}
