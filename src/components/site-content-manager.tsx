"use client";

import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Package,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { serviceIconKeys } from "@/lib/validations/site-content";

type ServiceItem = {
  id: string;
  key: string;
  titleBg: string;
  titleEn: string;
  copyBg: string;
  copyEn: string;
  icon: string;
  visible: boolean;
};

type PricingItem = {
  id: string;
  key: string;
  titleBg: string;
  titleEn: string;
  copyBg: string;
  copyEn: string;
  priceBg: string;
  priceEn: string;
  featured: boolean;
  visible: boolean;
};

type Props = {
  services: ServiceItem[];
  packages: PricingItem[];
};

const emptyService = {
  key: "",
  titleBg: "",
  titleEn: "",
  copyBg: "",
  copyEn: "",
  icon: "camera",
  visible: true,
};

const emptyPackage = {
  key: "",
  titleBg: "",
  titleEn: "",
  copyBg: "",
  copyEn: "",
  priceBg: "",
  priceEn: "",
  featured: false,
  visible: true,
};

export function SiteContentManager({ services, packages }: Props) {
  const t = useTranslations("adminContent");
  const router = useRouter();
  const [tab, setTab] = useState<"services" | "packages">("services");
  const [serviceDraft, setServiceDraft] = useState(emptyService);
  const [packageDraft, setPackageDraft] = useState(emptyPackage);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const inputClass =
    "min-h-11 w-full rounded-md border border-line bg-background px-3 text-sm outline-none transition focus:border-accent max-sm:text-base";
  const textareaClass = `${inputClass} min-h-24 py-3`;

  async function request(url: string, method: string, body?: object) {
    setMessage(null);
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      setMessage(response.status === 409 ? t("duplicateError") : t("error"));
      return false;
    }

    router.refresh();
    return true;
  }

  async function createService(event: React.FormEvent) {
    event.preventDefault();
    setBusyId("new-service");
    const ok = await request("/api/services", "POST", serviceDraft);
    setBusyId(null);
    if (ok) setServiceDraft(emptyService);
  }

  async function createPackage(event: React.FormEvent) {
    event.preventDefault();
    setBusyId("new-package");
    const ok = await request("/api/pricing-packages", "POST", packageDraft);
    setBusyId(null);
    if (ok) setPackageDraft(emptyPackage);
  }

  return (
    <div>
      <div className="mb-6 inline-flex rounded-md border border-line bg-background p-1">
        <button
          type="button"
          onClick={() => setTab("services")}
          className={`rounded-sm px-4 py-2 text-sm font-bold ${
            tab === "services" ? "bg-foreground text-background" : "text-muted"
          }`}
        >
          {t("servicesTab")}
        </button>
        <button
          type="button"
          onClick={() => setTab("packages")}
          className={`rounded-sm px-4 py-2 text-sm font-bold ${
            tab === "packages" ? "bg-foreground text-background" : "text-muted"
          }`}
        >
          {t("packagesTab")}
        </button>
      </div>

      {message && (
        <p className="mb-5 rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {message}
        </p>
      )}

      {tab === "services" ? (
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <form
            onSubmit={createService}
            className="h-fit rounded-md border border-line bg-background p-5 lg:sticky lg:top-5"
          >
            <h2 className="text-2xl font-bold">{t("addService")}</h2>
            <div className="mt-5 grid gap-4">
              <input
                required
                className={inputClass}
                placeholder={t("key")}
                value={serviceDraft.key}
                onChange={(event) =>
                  setServiceDraft({ ...serviceDraft, key: event.target.value })
                }
              />
              <input
                required
                className={inputClass}
                placeholder={t("titleBg")}
                value={serviceDraft.titleBg}
                onChange={(event) =>
                  setServiceDraft({ ...serviceDraft, titleBg: event.target.value })
                }
              />
              <input
                required
                className={inputClass}
                placeholder={t("titleEn")}
                value={serviceDraft.titleEn}
                onChange={(event) =>
                  setServiceDraft({ ...serviceDraft, titleEn: event.target.value })
                }
              />
              <textarea
                required
                className={textareaClass}
                placeholder={t("copyBg")}
                value={serviceDraft.copyBg}
                onChange={(event) =>
                  setServiceDraft({ ...serviceDraft, copyBg: event.target.value })
                }
              />
              <textarea
                required
                className={textareaClass}
                placeholder={t("copyEn")}
                value={serviceDraft.copyEn}
                onChange={(event) =>
                  setServiceDraft({ ...serviceDraft, copyEn: event.target.value })
                }
              />
              <select
                className={inputClass}
                value={serviceDraft.icon}
                onChange={(event) =>
                  setServiceDraft({ ...serviceDraft, icon: event.target.value })
                }
              >
                {serviceIconKeys.map((icon) => (
                  <option value={icon} key={icon}>
                    {t(`icons.${icon}`)}
                  </option>
                ))}
              </select>
              <button
                disabled={busyId === "new-service"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-bold text-accent-foreground disabled:opacity-60"
              >
                <Sparkles size={17} />
                {t("add")}
              </button>
            </div>
          </form>
          <div className="grid gap-4">
            {services.map((item, index) => (
              <ServiceEditor
                key={item.id}
                item={item}
                index={index}
                count={services.length}
                busy={busyId === item.id}
                inputClass={inputClass}
                textareaClass={textareaClass}
                setBusyId={setBusyId}
                request={request}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <form
            onSubmit={createPackage}
            className="h-fit rounded-md border border-line bg-background p-5 lg:sticky lg:top-5"
          >
            <h2 className="text-2xl font-bold">{t("addPackage")}</h2>
            <div className="mt-5 grid gap-4">
              {(["key", "titleBg", "titleEn", "priceBg", "priceEn"] as const).map(
                (field) => (
                  <input
                    required
                    className={inputClass}
                    placeholder={t(field)}
                    value={packageDraft[field]}
                    onChange={(event) =>
                      setPackageDraft({
                        ...packageDraft,
                        [field]: event.target.value,
                      })
                    }
                    key={field}
                  />
                ),
              )}
              <textarea
                required
                className={textareaClass}
                placeholder={t("copyBg")}
                value={packageDraft.copyBg}
                onChange={(event) =>
                  setPackageDraft({ ...packageDraft, copyBg: event.target.value })
                }
              />
              <textarea
                required
                className={textareaClass}
                placeholder={t("copyEn")}
                value={packageDraft.copyEn}
                onChange={(event) =>
                  setPackageDraft({ ...packageDraft, copyEn: event.target.value })
                }
              />
              <label className="flex items-center gap-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={packageDraft.featured}
                  onChange={(event) =>
                    setPackageDraft({
                      ...packageDraft,
                      featured: event.target.checked,
                    })
                  }
                />
                {t("featured")}
              </label>
              <button
                disabled={busyId === "new-package"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-bold text-accent-foreground disabled:opacity-60"
              >
                <Package size={17} />
                {t("add")}
              </button>
            </div>
          </form>
          <div className="grid gap-4">
            {packages.map((item, index) => (
              <PackageEditor
                key={item.id}
                item={item}
                index={index}
                count={packages.length}
                busy={busyId === item.id}
                inputClass={inputClass}
                textareaClass={textareaClass}
                setBusyId={setBusyId}
                request={request}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type EditorShared = {
  index: number;
  count: number;
  busy: boolean;
  inputClass: string;
  textareaClass: string;
  setBusyId: (id: string | null) => void;
  request: (url: string, method: string, body?: object) => Promise<boolean>;
};

function EditorActions({
  id,
  index,
  count,
  visible,
  endpoint,
  busy,
  setBusyId,
  request,
}: {
  id: string;
  visible: boolean;
  endpoint: string;
} & Pick<EditorShared, "index" | "count" | "busy" | "setBusyId" | "request">) {
  const t = useTranslations("adminContent");

  async function act(method: string, body?: object) {
    setBusyId(id);
    await request(`${endpoint}/${id}`, method, body);
    setBusyId(null);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <IconButton
        label={t("moveUp")}
        disabled={busy || index === 0}
        onClick={() => act("PATCH", { direction: "up" })}
      >
        <ArrowUp size={16} />
      </IconButton>
      <IconButton
        label={t("moveDown")}
        disabled={busy || index === count - 1}
        onClick={() => act("PATCH", { direction: "down" })}
      >
        <ArrowDown size={16} />
      </IconButton>
      <IconButton
        label={visible ? t("hide") : t("show")}
        disabled={busy}
        onClick={() => act("PATCH", { visible: !visible })}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </IconButton>
      <IconButton
        label={t("delete")}
        danger
        disabled={busy}
        onClick={() => act("DELETE")}
      >
        <Trash2 size={16} />
      </IconButton>
    </div>
  );
}

function ServiceEditor({
  item,
  ...shared
}: { item: ServiceItem } & EditorShared) {
  const t = useTranslations("adminContent");
  const [draft, setDraft] = useState(item);

  async function save() {
    shared.setBusyId(item.id);
    await shared.request(`/api/services/${item.id}`, "PATCH", {
      titleBg: draft.titleBg,
      titleEn: draft.titleEn,
      copyBg: draft.copyBg,
      copyEn: draft.copyEn,
      icon: draft.icon,
    });
    shared.setBusyId(null);
  }

  return (
    <article className="rounded-md border border-line bg-background p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
          {item.key}
        </span>
        <EditorActions
          id={item.id}
          visible={item.visible}
          endpoint="/api/services"
          {...shared}
        />
      </div>
      <div className="grid gap-3">
        {(["titleBg", "titleEn"] as const).map((field) => (
          <input
            className={shared.inputClass}
            value={draft[field]}
            aria-label={t(field)}
            onChange={(event) =>
              setDraft({ ...draft, [field]: event.target.value })
            }
            key={field}
          />
        ))}
        {(["copyBg", "copyEn"] as const).map((field) => (
          <textarea
            className={shared.textareaClass}
            value={draft[field]}
            aria-label={t(field)}
            onChange={(event) =>
              setDraft({ ...draft, [field]: event.target.value })
            }
            key={field}
          />
        ))}
        <select
          className={shared.inputClass}
          value={draft.icon}
          aria-label={t("icon")}
          onChange={(event) => setDraft({ ...draft, icon: event.target.value })}
        >
          {serviceIconKeys.map((icon) => (
            <option value={icon} key={icon}>
              {t(`icons.${icon}`)}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={shared.busy}
          onClick={save}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line text-sm font-bold hover:border-accent disabled:opacity-60"
        >
          <Save size={16} />
          {t("save")}
        </button>
      </div>
    </article>
  );
}

function PackageEditor({
  item,
  ...shared
}: { item: PricingItem } & EditorShared) {
  const t = useTranslations("adminContent");
  const [draft, setDraft] = useState(item);

  async function save() {
    shared.setBusyId(item.id);
    await shared.request(`/api/pricing-packages/${item.id}`, "PATCH", {
      titleBg: draft.titleBg,
      titleEn: draft.titleEn,
      copyBg: draft.copyBg,
      copyEn: draft.copyEn,
      priceBg: draft.priceBg,
      priceEn: draft.priceEn,
      featured: draft.featured,
    });
    shared.setBusyId(null);
  }

  return (
    <article className="rounded-md border border-line bg-background p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
          {item.key}
        </span>
        <EditorActions
          id={item.id}
          visible={item.visible}
          endpoint="/api/pricing-packages"
          {...shared}
        />
      </div>
      <div className="grid gap-3">
        {(["titleBg", "titleEn", "priceBg", "priceEn"] as const).map((field) => (
          <input
            className={shared.inputClass}
            value={draft[field]}
            aria-label={t(field)}
            onChange={(event) =>
              setDraft({ ...draft, [field]: event.target.value })
            }
            key={field}
          />
        ))}
        {(["copyBg", "copyEn"] as const).map((field) => (
          <textarea
            className={shared.textareaClass}
            value={draft[field]}
            aria-label={t(field)}
            onChange={(event) =>
              setDraft({ ...draft, [field]: event.target.value })
            }
            key={field}
          />
        ))}
        <label className="flex items-center gap-3 text-sm font-bold">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(event) =>
              setDraft({ ...draft, featured: event.target.checked })
            }
          />
          {t("featured")}
        </label>
        <button
          type="button"
          disabled={shared.busy}
          onClick={save}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line text-sm font-bold hover:border-accent disabled:opacity-60"
        >
          <Save size={16} />
          {t("save")}
        </button>
      </div>
    </article>
  );
}

function IconButton({
  label,
  danger = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex size-10 items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "border-line text-error hover:border-error"
          : "border-line hover:border-accent"
      }`}
      {...props}
    />
  );
}
