"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  inquirySchema,
  type InquiryValues,
} from "@/lib/validations/inquiry";

export function RequestForm() {
  const t = useTranslations("request");
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [formCycle, setFormCycle] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
  });

  useEffect(() => {
    setValue("startedAt", Date.now());
  }, [formCycle, setValue]);

  async function onSubmit(values: InquiryValues) {
    setSent(false);
    setSubmitError(false);

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setSubmitError(true);
      return;
    }

    setSent(true);
    reset();
    setFormCycle((value) => value + 1);
  }

  const inputClass =
    "min-h-12 w-full rounded-md border border-line bg-background px-4 text-sm outline-none transition placeholder:text-muted focus:border-accent";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <label className="hidden" aria-hidden="true">
        <span>Company website</span>
        <input
          tabIndex={-1}
          autoComplete="off"
          {...register("companyWebsite")}
        />
      </label>
      <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="sr-only">{t("name")}</span>
          <input className={inputClass} placeholder={t("name")} {...register("name")} />
          {errors.name && <small className="text-error">{t("error")}</small>}
        </label>
        <label>
          <span className="sr-only">{t("email")}</span>
          <input className={inputClass} placeholder={t("email")} {...register("email")} />
          {errors.email && <small className="text-error">{t("error")}</small>}
        </label>
        <label>
          <span className="sr-only">{t("phone")}</span>
          <input className={inputClass} placeholder={t("phone")} {...register("phone")} />
          {errors.phone && <small className="text-error">{t("error")}</small>}
        </label>
        <label>
          <span className="sr-only">{t("service")}</span>
          <select className={inputClass} defaultValue="" {...register("service")}>
            <option value="" disabled>
              {t("service")}
            </option>
            {["wedding", "portrait", "event", "product", "business", "realEstate", "family", "other"].map(
              (item) => (
                <option value={item} key={item}>
                  {t(`services.${item}`)}
                </option>
              ),
            )}
          </select>
          {errors.service && <small className="text-error">{t("error")}</small>}
        </label>
        <label>
          <span className="sr-only">{t("preferredContact")}</span>
          <select className={inputClass} defaultValue="" {...register("preferredContact")}>
            <option value="">{t("preferredContact")}</option>
            {["phone", "viber", "whatsapp", "email"].map((item) => (
              <option value={item} key={item}>
                {t(`contactMethods.${item}`)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">{t("date")}</span>
          <input className={inputClass} type="date" {...register("date")} />
        </label>
        <label>
          <span className="sr-only">{t("location")}</span>
          <input className={inputClass} placeholder={t("location")} {...register("location")} />
          {errors.location && <small className="text-error">{t("error")}</small>}
        </label>
      </div>
      <label>
        <span className="sr-only">{t("message")}</span>
        <textarea
          className={`${inputClass} min-h-32 resize-none py-3`}
          placeholder={t("message")}
          {...register("message")}
        />
        {errors.message && <small className="text-error">{t("error")}</small>}
      </label>
      <button
        disabled={isSubmitting}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send size={17} />
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
      {submitError && (
        <p className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {t("submitError")}
        </p>
      )}
      {sent && (
        <p className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {t("success")}
        </p>
      )}
    </form>
  );
}
