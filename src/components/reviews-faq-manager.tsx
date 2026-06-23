"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Save, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";

type Testimonial = {
  id: string;
  nameBg: string;
  nameEn: string;
  roleBg: string;
  roleEn: string;
  quoteBg: string;
  quoteEn: string;
  visible: boolean;
};

type Faq = {
  id: string;
  questionBg: string;
  questionEn: string;
  answerBg: string;
  answerEn: string;
  visible: boolean;
};

export function ReviewsFaqManager({
  testimonials,
  faqs,
}: {
  testimonials: Testimonial[];
  faqs: Faq[];
}) {
  const t = useTranslations("adminSettings");
  const router = useRouter();
  const [tab, setTab] = useState<"testimonials" | "faqs">("testimonials");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const inputClass =
    "min-h-11 w-full rounded-md border border-line bg-background px-3 text-sm outline-none focus:border-accent max-sm:text-base";

  async function request(url: string, method: string, body?: object) {
    setMessage(null);
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    setMessage(response.ok ? t("saved") : t("error"));
    if (response.ok) router.refresh();
    return response.ok;
  }

  return (
    <div>
      <div className="mb-6 inline-flex rounded-md border border-line bg-background p-1">
        {(["testimonials", "faqs"] as const).map((item) => (
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
      {message && <p className="mb-4 text-sm text-muted">{message}</p>}
      {tab === "testimonials" ? (
        <RepeatedEditor
          items={testimonials}
          endpoint="/api/testimonials"
          fields={["nameBg", "nameEn", "roleBg", "roleEn", "quoteBg", "quoteEn"]}
          longFields={["quoteBg", "quoteEn"]}
          empty={{
            nameBg: "",
            nameEn: "",
            roleBg: "",
            roleEn: "",
            quoteBg: "",
            quoteEn: "",
            visible: true,
          }}
          inputClass={inputClass}
          busy={busy}
          setBusy={setBusy}
          request={request}
        />
      ) : (
        <RepeatedEditor
          items={faqs}
          endpoint="/api/faqs"
          fields={["questionBg", "questionEn", "answerBg", "answerEn"]}
          longFields={["answerBg", "answerEn"]}
          empty={{
            questionBg: "",
            questionEn: "",
            answerBg: "",
            answerEn: "",
            visible: true,
          }}
          inputClass={inputClass}
          busy={busy}
          setBusy={setBusy}
          request={request}
        />
      )}
    </div>
  );
}

function RepeatedEditor({
  items,
  endpoint,
  fields,
  longFields,
  empty,
  inputClass,
  busy,
  setBusy,
  request,
}: {
  items: Array<Record<string, string | boolean> & { id: string; visible: boolean }>;
  endpoint: string;
  fields: string[];
  longFields: string[];
  empty: Record<string, string | boolean>;
  inputClass: string;
  busy: string | null;
  setBusy: (value: string | null) => void;
  request: (url: string, method: string, body?: object) => Promise<boolean>;
}) {
  const t = useTranslations("adminSettings");
  const [draft, setDraft] = useState(empty);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setBusy("new");
    if (await request(endpoint, "POST", draft)) setDraft(empty);
    setBusy(null);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <form
        onSubmit={create}
        className="h-fit rounded-md border border-line bg-background p-5 lg:sticky lg:top-5"
      >
        <h2 className="text-2xl font-bold">{t("addItem")}</h2>
        <div className="mt-5 grid gap-3">
          {fields.map((field) =>
            longFields.includes(field) ? (
              <textarea
                required
                className={`${inputClass} min-h-24 py-3`}
                placeholder={t(`repeated.${field}`)}
                value={draft[field] as string}
                onChange={(event) =>
                  setDraft({ ...draft, [field]: event.target.value })
                }
                key={field}
              />
            ) : (
              <input
                required
                className={inputClass}
                placeholder={t(`repeated.${field}`)}
                value={draft[field] as string}
                onChange={(event) =>
                  setDraft({ ...draft, [field]: event.target.value })
                }
                key={field}
              />
            ),
          )}
          <button
            disabled={busy === "new"}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent text-sm font-bold text-accent-foreground"
          >
            <Plus size={16} />
            {t("add")}
          </button>
        </div>
      </form>
      <div className="grid gap-4">
        {items.map((item, index) => (
          <RepeatedItem
            item={item}
            index={index}
            count={items.length}
            endpoint={endpoint}
            fields={fields}
            longFields={longFields}
            inputClass={inputClass}
            busy={busy === item.id}
            setBusy={setBusy}
            request={request}
            key={item.id}
          />
        ))}
      </div>
    </div>
  );
}

function RepeatedItem({
  item,
  index,
  count,
  endpoint,
  fields,
  longFields,
  inputClass,
  busy,
  setBusy,
  request,
}: {
  item: Record<string, string | boolean> & { id: string; visible: boolean };
  index: number;
  count: number;
  endpoint: string;
  fields: string[];
  longFields: string[];
  inputClass: string;
  busy: boolean;
  setBusy: (value: string | null) => void;
  request: (url: string, method: string, body?: object) => Promise<boolean>;
}) {
  const t = useTranslations("adminSettings");
  const [draft, setDraft] = useState(item);

  async function act(method: string, body?: object) {
    setBusy(item.id);
    await request(`${endpoint}/${item.id}`, method, body);
    setBusy(null);
  }

  return (
    <article className="rounded-md border border-line bg-background p-5">
      <div className="mb-4 flex justify-end gap-2">
        <SmallButton disabled={busy || index === 0} label={t("moveUp")} onClick={() => act("PATCH", { direction: "up" })}>
          <ArrowUp size={16} />
        </SmallButton>
        <SmallButton disabled={busy || index === count - 1} label={t("moveDown")} onClick={() => act("PATCH", { direction: "down" })}>
          <ArrowDown size={16} />
        </SmallButton>
        <SmallButton disabled={busy} label={item.visible ? t("hide") : t("show")} onClick={() => act("PATCH", { visible: !item.visible })}>
          {item.visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </SmallButton>
        <SmallButton danger disabled={busy} label={t("delete")} onClick={() => act("DELETE")}>
          <Trash2 size={16} />
        </SmallButton>
      </div>
      <div className="grid gap-3">
        {fields.map((field) =>
          longFields.includes(field) ? (
            <textarea
              className={`${inputClass} min-h-24 py-3`}
              aria-label={t(`repeated.${field}`)}
              value={draft[field] as string}
              onChange={(event) =>
                setDraft({ ...draft, [field]: event.target.value })
              }
              key={field}
            />
          ) : (
            <input
              className={inputClass}
              aria-label={t(`repeated.${field}`)}
              value={draft[field] as string}
              onChange={(event) =>
                setDraft({ ...draft, [field]: event.target.value })
              }
              key={field}
            />
          ),
        )}
        <button
          type="button"
          onClick={() =>
            act(
              "PATCH",
              Object.fromEntries(fields.map((field) => [field, draft[field]])),
            )
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line text-sm font-bold hover:border-accent"
        >
          <Save size={16} />
          {t("save")}
        </button>
      </div>
    </article>
  );
}

function SmallButton({
  label,
  danger,
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
      className={`grid size-10 place-items-center rounded-md border border-line ${
        danger ? "text-error hover:border-error" : "hover:border-accent"
      } disabled:opacity-40`}
      {...props}
    />
  );
}
