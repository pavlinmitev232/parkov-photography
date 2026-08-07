"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { type FieldErrors, useForm, useWatch } from "react-hook-form";
import { Link } from "@/i18n/routing";
import {
  inquirySchema,
  type InquiryFormValues,
  type InquiryValues,
} from "@/lib/validations/inquiry";

export function RequestForm() {
  const t = useTranslations("request");
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [formCycle, setFormCycle] = useState(0);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues, unknown, InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredContact: undefined,
      date: "",
      location: "",
      message: "",
      companyWebsite: "",
    },
  });
  const preferredContact = useWatch({ control, name: "preferredContact" });
  const message = useWatch({ control, name: "message" }) ?? "";
  const messageLength = message.trim().length;
  const needsPhone = preferredContact
    ? ["phone", "viber", "whatsapp"].includes(preferredContact)
    : false;
  const needsEmail = preferredContact === "email";

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
    "min-h-12 w-full rounded-md border border-line bg-background px-4 text-base outline-none transition placeholder:text-muted focus:border-accent sm:text-sm";
  const invalidInputClass = "border-error focus:border-error";
  const errorClass = "text-base text-error sm:text-sm";
  const describedBy = (helpId: string, errorId: string, hasError: boolean) =>
    hasError ? `${helpId} ${errorId}` : helpId;

  function focusFirstInvalidField(invalidErrors: FieldErrors<InquiryFormValues>) {
    const fieldOrder: Array<keyof InquiryFormValues> = [
      "name",
      "service",
      "preferredContact",
      "email",
      "phone",
      "date",
      "location",
      "message",
    ];
    const firstInvalidField = fieldOrder.find((field) => invalidErrors[field]);

    if (firstInvalidField) {
      setFocus(firstInvalidField);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, focusFirstInvalidField)}
      className="grid gap-4"
      noValidate
    >
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
          <input
            aria-describedby={errors.name ? "request-name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            className={`${inputClass} ${errors.name ? invalidInputClass : ""}`}
            placeholder={t("name")}
            {...register("name")}
          />
          {errors.name && (
            <p id="request-name-error" className={errorClass}>
              {t("nameError")}
            </p>
          )}
        </label>
        <label>
          <span className="sr-only">{t("service")}</span>
          <select
            aria-label={t("service")}
            aria-describedby={errors.service ? "request-service-error" : undefined}
            aria-invalid={Boolean(errors.service)}
            className={`${inputClass} ${errors.service ? invalidInputClass : ""}`}
            defaultValue=""
            {...register("service")}
          >
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
          {errors.service && (
            <p id="request-service-error" className={errorClass}>
              {t("serviceError")}
            </p>
          )}
        </label>
        <label>
          <span className="sr-only">{t("preferredContact")}</span>
          <select
            aria-label={t("preferredContact")}
            aria-describedby={
              errors.preferredContact ? "request-contact-error" : undefined
            }
            aria-invalid={Boolean(errors.preferredContact)}
            className={`${inputClass} ${
              errors.preferredContact ? invalidInputClass : ""
            }`}
            defaultValue=""
            {...register("preferredContact")}
          >
            <option value="" disabled>{t("preferredContact")}</option>
            {["phone", "viber", "whatsapp", "email"].map((item) => (
              <option value={item} key={item}>
                {t(`contactMethods.${item}`)}
              </option>
            ))}
          </select>
          {errors.preferredContact && (
            <p id="request-contact-error" className={errorClass}>
              {t("contactChoiceRequired")}
            </p>
          )}
        </label>
        {needsEmail && (
          <label>
            <span className="sr-only">{t("email")}</span>
            <input
              aria-label={t("email")}
              aria-describedby={errors.email ? "request-email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
              className={`${inputClass} ${errors.email ? invalidInputClass : ""}`}
              type="email"
              placeholder={t("emailRequired")}
              {...register("email")}
            />
            {errors.email && (
              <p id="request-email-error" className={errorClass}>
                {t("emailError")}
              </p>
            )}
          </label>
        )}
        {needsPhone && (
          <label>
            <span className="sr-only">{t("phone")}</span>
            <input
              aria-label={t("phone")}
              aria-describedby={errors.phone ? "request-phone-error" : undefined}
              aria-invalid={Boolean(errors.phone)}
              className={`${inputClass} ${errors.phone ? invalidInputClass : ""}`}
              type="tel"
              placeholder={t("phoneRequired")}
              {...register("phone")}
            />
            {errors.phone && (
              <p id="request-phone-error" className={errorClass}>
                {t("phoneError")}
              </p>
            )}
          </label>
        )}
        <label>
          <span className="sr-only">{t("date")}</span>
          <input
            aria-describedby={errors.date ? "request-date-error" : undefined}
            aria-invalid={Boolean(errors.date)}
            className={`${inputClass} ${errors.date ? invalidInputClass : ""}`}
            type="date"
            {...register("date")}
          />
          {errors.date && (
            <p id="request-date-error" className={errorClass}>
              {t("dateError")}
            </p>
          )}
        </label>
        <label>
          <span className="sr-only">{t("location")}</span>
          <input
            aria-describedby={errors.location ? "request-location-error" : undefined}
            aria-invalid={Boolean(errors.location)}
            className={`${inputClass} ${errors.location ? invalidInputClass : ""}`}
            placeholder={t("location")}
            {...register("location")}
          />
          {errors.location && (
            <p id="request-location-error" className={errorClass}>
              {t("locationError")}
            </p>
          )}
        </label>
      </div>
      <label>
        <span className="sr-only">{t("message")}</span>
        <textarea
          aria-describedby={describedBy(
            "request-message-help",
            "request-message-error",
            Boolean(errors.message),
          )}
          aria-invalid={Boolean(errors.message)}
          className={`${inputClass} min-h-32 resize-none py-3 ${
            errors.message ? invalidInputClass : ""
          }`}
          placeholder={t("message")}
          {...register("message")}
        />
        <div
          id="request-message-help"
          className="flex items-start justify-between gap-4 text-base text-muted sm:text-sm"
        >
          <p>{t("messageHelp")}</p>
          <p className="shrink-0 tabular-nums">
            {t("messageCount", { count: messageLength })}
          </p>
        </div>
        {errors.message && (
          <p id="request-message-error" className={errorClass}>
            {t("messageError")}
          </p>
        )}
      </label>
      <p className="text-base leading-7 text-muted sm:text-sm sm:leading-6">
        {t("privacyNotice")}{" "}
        <Link
          href="/privacy"
          className="font-semibold text-foreground underline decoration-accent underline-offset-4"
        >
          {t("privacyLink")}
        </Link>
      </p>
      <button
        type="submit"
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
