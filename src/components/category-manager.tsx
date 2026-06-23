"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Eye, EyeOff, Tags, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/routing";
import {
  portfolioCategorySchema,
  type PortfolioCategoryValues,
} from "@/lib/validations/portfolio-category";

type CategoryManagerItem = {
  id: string;
  key: string;
  labelBg: string;
  labelEn: string;
  visible: boolean;
  sortOrder: number;
  itemCount: number;
};

type CategoryManagerProps = {
  categories: CategoryManagerItem[];
};

export function CategoryManager({ categories }: CategoryManagerProps) {
  const t = useTranslations("adminCategories");
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PortfolioCategoryValues>({
    resolver: zodResolver(portfolioCategorySchema),
    defaultValues: { visible: true },
  });

  async function onSubmit(values: PortfolioCategoryValues) {
    setSubmitError(null);
    const response = await fetch("/api/portfolio-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setSubmitError(response.status === 409 ? t("duplicateError") : t("submitError"));
      return;
    }

    reset({ key: "", labelBg: "", labelEn: "", visible: true });
    router.refresh();
  }

  async function updateCategory(
    id: string,
    body: { visible?: boolean; direction?: "up" | "down" },
  ) {
    setBusyId(id);
    await fetch(`/api/portfolio-categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusyId(null);
    router.refresh();
  }

  async function deleteCategory(id: string) {
    setBusyId(id);
    const response = await fetch(`/api/portfolio-categories/${id}`, {
      method: "DELETE",
    });
    setBusyId(null);

    if (!response.ok) {
      setSubmitError(t("deleteError"));
      return;
    }

    router.refresh();
  }

  const inputClass =
    "min-h-12 w-full rounded-md border border-line bg-background px-4 text-sm outline-none transition placeholder:text-muted focus:border-accent max-sm:text-base";

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-md border border-line bg-background p-5 md:p-6">
        <h2 className="text-2xl font-bold">{t("formTitle")}</h2>
        <div className="mt-6 grid gap-4">
          <label>
            <span className="mb-2 block text-sm font-bold">{t("key")}</span>
            <input className={inputClass} placeholder="editorial" {...register("key")} />
            {errors.key && <small className="text-error">{t("keyError")}</small>}
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">{t("labelBg")}</span>
            <input className={inputClass} {...register("labelBg")} />
            {errors.labelBg && <small className="text-error">{t("error")}</small>}
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">{t("labelEn")}</span>
            <input className={inputClass} {...register("labelEn")} />
            {errors.labelEn && <small className="text-error">{t("error")}</small>}
          </label>
          <label className="flex items-center gap-3 text-sm font-bold">
            <input type="checkbox" className="size-5 accent-[var(--accent)] sm:size-4" {...register("visible")} />
            {t("visible")}
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Tags size={17} />
            {isSubmitting ? t("saving") : t("submit")}
          </button>
          {submitError && (
            <p className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {submitError}
            </p>
          )}
        </div>
      </form>

      <div className="grid gap-4">
        {categories.length === 0 ? (
          <div className="rounded-md border border-line bg-background p-8 text-center text-muted">
            {t("empty")}
          </div>
        ) : (
          categories.map((category, index) => (
            <div
              className="grid gap-4 rounded-md border border-line bg-background p-4 md:grid-cols-[1fr_auto]"
              key={category.id}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                    {category.key}
                  </span>
                  <span className="text-sm text-muted">
                    {category.itemCount} {t("items")}
                  </span>
                  <span className="text-sm text-muted">
                    {category.visible ? t("shown") : t("hidden")}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold">{category.labelBg}</h3>
                <p className="text-base text-muted sm:text-sm">{category.labelEn}</p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <button
                  type="button"
                  disabled={busyId === category.id || index === 0}
                  onClick={() => updateCategory(category.id, { direction: "up" })}
                  className="inline-flex size-10 items-center justify-center rounded-md border border-line transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label={t("moveUp")}
                  title={t("moveUp")}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  disabled={busyId === category.id || index === categories.length - 1}
                  onClick={() => updateCategory(category.id, { direction: "down" })}
                  className="inline-flex size-10 items-center justify-center rounded-md border border-line transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label={t("moveDown")}
                  title={t("moveDown")}
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  disabled={busyId === category.id}
                  onClick={() => updateCategory(category.id, { visible: !category.visible })}
                  className="inline-flex size-10 items-center justify-center rounded-md border border-line transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label={category.visible ? t("hide") : t("show")}
                  title={category.visible ? t("hide") : t("show")}
                >
                  {category.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  type="button"
                  disabled={busyId === category.id || category.itemCount > 0}
                  onClick={() => deleteCategory(category.id)}
                  className="inline-flex size-10 items-center justify-center rounded-md border border-line text-error transition hover:border-error disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label={t("delete")}
                  title={category.itemCount > 0 ? t("deleteBlocked") : t("delete")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
