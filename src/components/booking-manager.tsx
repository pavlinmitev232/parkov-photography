"use client";

import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useRouter } from "@/i18n/routing";

type BookingItem = {
  id: string;
  inquiryId: string | null;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  startAt: string;
  endAt: string | null;
  location: string;
  notes: string | null;
  status: string;
};

type InquiryOption = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string | null;
  location: string;
};

type Draft = {
  inquiryId: string;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  startAt: string;
  endAt: string;
  location: string;
  notes: string;
  status: "tentative" | "confirmed" | "completed" | "cancelled";
};

const statuses = ["tentative", "confirmed", "completed", "cancelled"] as const;

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function emptyDraft(): Draft {
  const now = new Date();
  now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0);
  return {
    inquiryId: "",
    customerName: "",
    email: "",
    phone: "",
    service: "",
    startAt: toDateTimeLocal(now.toISOString()),
    endAt: "",
    location: "",
    notes: "",
    status: "tentative",
  };
}

export function BookingManager({
  bookings,
  inquiries,
  locale,
}: {
  bookings: BookingItem[];
  inquiries: InquiryOption[];
  locale: string;
}) {
  const t = useTranslations("adminBookings");
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );
  const calendarDays = useMemo(() => {
    const grouped = new Map<string, BookingItem[]>();
    bookings.forEach((booking) => {
      const key = new Date(booking.startAt).toISOString().slice(0, 10);
      grouped.set(key, [...(grouped.get(key) ?? []), booking]);
    });
    return [...grouped.entries()].sort(([left], [right]) =>
      left.localeCompare(right),
    );
  }, [bookings]);
  const inputClass =
    "min-h-11 w-full rounded-md border border-line bg-background px-3 text-base outline-none focus:border-accent sm:text-sm";

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function selectInquiry(inquiryId: string) {
    const inquiry = inquiries.find((item) => item.id === inquiryId);
    if (!inquiry) {
      update("inquiryId", "");
      return;
    }
    setDraft((current) => ({
      ...current,
      inquiryId,
      customerName: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      service: inquiry.service,
      startAt: toDateTimeLocal(inquiry.preferredDate) || current.startAt,
      location: inquiry.location,
    }));
  }

  async function createBooking(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        inquiryId: draft.inquiryId || null,
        startAt: new Date(draft.startAt).toISOString(),
        endAt: draft.endAt ? new Date(draft.endAt).toISOString() : null,
      }),
    });
    setBusy(false);
    if (!response.ok) {
      setMessage(t("createError"));
      return;
    }
    setDraft(emptyDraft());
    setMessage(t("created"));
    router.refresh();
  }

  async function updateStatus(id: string, status: string) {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMessage(response.ok ? t("updated") : t("updateError"));
    if (response.ok) router.refresh();
  }

  async function removeBooking(id: string) {
    setDeleteBusy(true);
    const response = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    setDeleteBusy(false);
    setBookingToDelete(null);
    setMessage(response.ok ? t("deleted") : t("deleteError"));
    if (response.ok) router.refresh();
  }

  return (
    <div className="grid gap-10">
      <ConfirmDialog
        open={bookingToDelete !== null}
        title={t("deleteDialogTitle")}
        description={t("deleteDialogDescription")}
        confirmLabel={deleteBusy ? t("deleting") : t("deleteDialogConfirm")}
        cancelLabel={t("deleteDialogCancel")}
        busy={deleteBusy}
        onConfirm={() => {
          if (bookingToDelete) void removeBooking(bookingToDelete);
        }}
        onCancel={() => setBookingToDelete(null)}
      />
      <form
        onSubmit={createBooking}
        className="rounded-md border border-line bg-background p-5"
      >
        <div className="flex items-start gap-3">
          <CalendarDays className="size-4 shrink-0 stroke-accent" />
          <div>
            <h2 className="text-2xl font-bold">{t("formTitle")}</h2>
            <p className="mt-2 text-base/7 text-muted sm:text-sm/6">
              {t("formCopy")}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label={t("sourceInquiry")}>
            <select
              name="inquiryId"
              className={inputClass}
              value={draft.inquiryId}
              onChange={(event) => selectInquiry(event.target.value)}
            >
              <option value="">{t("noInquiry")}</option>
              {inquiries.map((inquiry) => (
                <option value={inquiry.id} key={inquiry.id}>
                  {inquiry.name} · {inquiry.service}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("customerName")}>
            <input
              name="customerName"
              required
              className={inputClass}
              value={draft.customerName}
              onChange={(event) => update("customerName", event.target.value)}
            />
          </Field>
          <Field label={t("email")}>
            <input
              name="email"
              type="email"
              className={inputClass}
              value={draft.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </Field>
          <Field label={t("phone")}>
            <input
              name="phone"
              type="tel"
              className={inputClass}
              value={draft.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </Field>
          <Field label={t("service")}>
            <input
              name="service"
              required
              className={inputClass}
              value={draft.service}
              onChange={(event) => update("service", event.target.value)}
            />
          </Field>
          <Field label={t("status")}>
            <select
              name="status"
              className={inputClass}
              value={draft.status}
              onChange={(event) =>
                update("status", event.target.value as Draft["status"])
              }
            >
              {statuses.map((status) => (
                <option value={status} key={status}>
                  {t(`statuses.${status}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("startAt")}>
            <input
              name="startAt"
              type="datetime-local"
              required
              className={inputClass}
              value={draft.startAt}
              onChange={(event) => update("startAt", event.target.value)}
            />
          </Field>
          <Field label={t("endAt")}>
            <input
              name="endAt"
              type="datetime-local"
              className={inputClass}
              value={draft.endAt}
              onChange={(event) => update("endAt", event.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label={t("location")}>
              <input
                name="location"
                required
                className={inputClass}
                value={draft.location}
                onChange={(event) => update("location", event.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label={t("notes")}>
              <textarea
                name="notes"
                className={`${inputClass} min-h-28 py-3`}
                value={draft.notes}
                onChange={(event) => update("notes", event.target.value)}
              />
            </Field>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-base/7 text-muted sm:text-sm/6">{message}</p>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-accent py-2 pl-2 pr-3 text-sm font-bold text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          >
            <Plus className="size-4 shrink-0" />
            {busy ? t("creating") : t("create")}
          </button>
        </div>
      </form>

      <section>
        <div>
          <h2 className="text-2xl font-bold">{t("agendaTitle")}</h2>
          <p className="mt-2 text-base/7 text-muted sm:text-sm/6">
            {t("agendaCopy")}
          </p>
        </div>
        {calendarDays.length === 0 ? (
          <p className="mt-6 border-t border-line pt-6 text-muted">{t("empty")}</p>
        ) : (
          <div className="mt-6 grid gap-8">
            {calendarDays.map(([day, dayBookings]) => (
              <div className="grid gap-4 lg:grid-cols-[12rem_1fr]" key={day}>
                <h3 className="text-lg font-bold">
                  {new Intl.DateTimeFormat(
                    locale === "bg" ? "bg-BG" : "en-GB",
                    { weekday: "long", day: "numeric", month: "long" },
                  ).format(new Date(`${day}T12:00:00`))}
                </h3>
                <div className="divide-y divide-line border-y border-line">
                  {dayBookings.map((booking) => (
                    <article
                      className="grid gap-4 py-5 md:grid-cols-[1fr_auto] md:items-start"
                      key={booking.id}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h4 className="text-lg font-bold">
                            {booking.customerName}
                          </h4>
                          <p className="text-base text-muted sm:text-sm">
                            {booking.service}
                          </p>
                        </div>
                        <p className="mt-2 tabular-nums">
                          {formatter.format(new Date(booking.startAt))}
                          {booking.endAt
                            ? ` – ${new Intl.DateTimeFormat(
                                locale === "bg" ? "bg-BG" : "en-GB",
                                { hour: "2-digit", minute: "2-digit" },
                              ).format(new Date(booking.endAt))}`
                            : ""}
                        </p>
                        <p className="mt-2 text-base/7 text-muted sm:text-sm/6">
                          {booking.location}
                        </p>
                        {booking.notes && (
                          <p className="mt-2 text-base/7 text-muted sm:text-sm/6">
                            {booking.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          name={`status-${booking.id}`}
                          aria-label={t("status")}
                          value={booking.status}
                          onChange={(event) =>
                            updateStatus(booking.id, event.target.value)
                          }
                          className="min-h-10 rounded-md border border-line bg-background px-3 text-base outline-none focus:border-accent sm:text-sm"
                        >
                          {statuses.map((status) => (
                            <option value={status} key={status}>
                              {t(`statuses.${status}`)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          aria-label={t("delete")}
                          onClick={() => setBookingToDelete(booking.id)}
                          className="relative inline-flex size-10 items-center justify-center rounded-md border border-line hover:border-error hover:text-error"
                        >
                          <Trash2 className="size-4 shrink-0" />
                          <span
                            className="absolute left-1/2 top-1/2 size-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold">{label}</span>
      {children}
    </label>
  );
}
