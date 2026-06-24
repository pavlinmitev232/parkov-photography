"use client";

import { ImageUp, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import type { SiteSettingsValues } from "@/lib/validations/site-settings";

export function SiteSettingsForm({
  initialSettings,
}: {
  initialSettings: SiteSettingsValues;
}) {
  const t = useTranslations("adminSettings");
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [tab, setTab] = useState<"brand" | "stats" | "copy" | "visibility">("brand");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputClass =
    "min-h-11 w-full rounded-md border border-line bg-background px-3 text-sm outline-none transition focus:border-accent max-sm:text-base";
  const textareaClass = `${inputClass} min-h-28 py-3`;

  function update<K extends keyof SiteSettingsValues>(
    key: K,
    value: SiteSettingsValues[K],
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setBusy(true);
    setMessage(null);
    const response = await fetch("/api/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setBusy(false);
    setMessage(response.ok ? t("saved") : t("error"));
    if (response.ok) router.refresh();
  }

  async function upload(
    event: React.ChangeEvent<HTMLInputElement>,
    field: "heroImageUrl" | "aboutImageUrl" | "logoImageUrl",
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const body = new FormData();
    body.set("image", file);
    const response = await fetch("/api/site-assets", { method: "POST", body });
    const result = (await response.json().catch(() => null)) as
      | { url?: string }
      | null;
    setBusy(false);
    if (response.ok && result?.url) {
      update(field, result.url);
      setMessage(t("uploadReady"));
    } else {
      setMessage(t("uploadError"));
    }
  }

  const copyGroups = [
    ["seo", ["seoTitle", "seoDescription"]],
    ["hero", ["heroEyebrow", "heroTitle", "heroCopy"]],
    ["about", ["aboutEyebrow", "aboutTitle", "aboutCopy"]],
    ["services", ["servicesEyebrow", "servicesTitle"]],
    ["packages", ["packagesEyebrow", "packagesTitle", "packagesCopy"]],
    ["testimonials", ["testimonialsEyebrow", "testimonialsTitle"]],
    ["faq", ["faqEyebrow", "faqTitle"]],
    ["contact", ["contactEyebrow", "contactTitle", "contactCopy", "location"]],
    ["footer", ["footerCopy"]],
  ] as const;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-1 rounded-md border border-line bg-background p-1">
        {(["brand", "stats", "copy", "visibility"] as const).map((item) => (
          <button
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-sm px-4 py-2 text-sm font-bold ${
              tab === item ? "bg-foreground text-background" : "text-muted"
            }`}
            key={item}
          >
            {t(`tabs.${item}`)}
          </button>
        ))}
      </div>

      {tab === "brand" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-md border border-line bg-background p-5">
            <h2 className="text-2xl font-bold">{t("brandTitle")}</h2>
            <div className="mt-5 grid gap-4">
              {(["brandName", "phone", "email"] as const).map((field) => (
                <Field label={t(field)} key={field}>
                  <input
                    className={inputClass}
                    value={settings[field]}
                    onChange={(event) => update(field, event.target.value)}
                  />
                </Field>
              ))}
              {(["instagramUrl", "facebookUrl", "tiktokUrl"] as const).map(
                (field) => (
                  <Field label={t(field)} key={field}>
                    <input
                      className={inputClass}
                      value={settings[field]}
                      onChange={(event) => update(field, event.target.value)}
                    />
                  </Field>
                ),
              )}
            </div>
          </section>
          <section className="rounded-md border border-line bg-background p-5">
            <h2 className="text-2xl font-bold">{t("imagesTitle")}</h2>
            <div className="mt-5 grid gap-4">
              {(
                [
                  ["heroImageUrl", "heroImage"],
                  ["aboutImageUrl", "aboutImage"],
                  ["logoImageUrl", "logoImage"],
                ] as const
              ).map(([field, label]) => (
                <div className="rounded-md border border-line p-4" key={field}>
                  <span className="mb-3 block text-sm font-bold">{t(label)}</span>
                  <input
                    className={inputClass}
                    value={settings[field]}
                    placeholder="/uploads/site/image.jpg"
                    onChange={(event) => update(field, event.target.value)}
                  />
                  <label className="mt-3 inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-line px-4 text-sm font-bold hover:border-accent">
                    <ImageUp size={16} />
                    {t("upload")}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="sr-only"
                      onChange={(event) => upload(event, field)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "stats" && (
        <section className="rounded-md border border-line bg-background p-5">
          <h2 className="text-2xl font-bold">{t("statsTitle")}</h2>
          <p className="mt-2 text-base/7 text-muted sm:text-sm/6">
            {t("statsHelp")}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(
              [
                ["statYears", "statYears"],
                ["statProjects", "statProjects"],
                ["statRating", "statRating"],
                ["statReply", "statReply"],
              ] as const
            ).map(([field, label]) => (
              <Field label={t(label)} key={field}>
                <input
                  name={field}
                  className={inputClass}
                  value={settings[field]}
                  onChange={(event) => update(field, event.target.value)}
                />
              </Field>
            ))}
          </div>
        </section>
      )}

      {tab === "copy" && (
        <div className="grid gap-5">
          {copyGroups.map(([group, fields]) => (
            <section
              className="rounded-md border border-line bg-background p-5"
              key={group}
            >
              <h2 className="text-xl font-bold">{t(`groups.${group}`)}</h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {fields.flatMap((base) =>
                  (["Bg", "En"] as const).map((suffix) => {
                    const field =
                      `${base}${suffix}` as keyof SiteSettingsValues;
                    const isLong =
                      base.includes("Copy") ||
                      base.includes("Description") ||
                      base === "footerCopy";
                    return (
                      <Field
                        label={`${t(`fields.${base}`)} · ${suffix.toUpperCase()}`}
                        key={field}
                      >
                        {isLong ? (
                          <textarea
                            className={textareaClass}
                            value={settings[field] as string}
                            onChange={(event) =>
                              update(field, event.target.value)
                            }
                          />
                        ) : (
                          <input
                            className={inputClass}
                            value={settings[field] as string}
                            onChange={(event) =>
                              update(field, event.target.value)
                            }
                          />
                        )}
                      </Field>
                    );
                  }),
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {tab === "visibility" && (
        <section className="rounded-md border border-line bg-background p-5">
          <h2 className="text-2xl font-bold">{t("visibilityTitle")}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(
              [
                "showAbout",
                "showServices",
                "showProcess",
                "showPricing",
                "showTestimonials",
                "showFaq",
                "showContact",
              ] as const
            ).map((field) => (
              <label
                className="flex min-h-14 items-center gap-3 rounded-md border border-line px-4 text-sm font-bold"
                key={field}
              >
                <input
                  type="checkbox"
                  checked={settings[field]}
                  onChange={(event) => update(field, event.target.checked)}
                />
                {t(field)}
              </label>
            ))}
          </div>
        </section>
      )}

      <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-md border border-line bg-background/95 p-4 shadow-xl backdrop-blur">
        <p className="text-sm text-muted">{message}</p>
        <button
          type="button"
          disabled={busy}
          onClick={save}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-bold text-accent-foreground disabled:opacity-60"
        >
          <Save size={16} />
          {busy ? t("saving") : t("save")}
        </button>
      </div>
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
