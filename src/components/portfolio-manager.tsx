"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Pencil, Save, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type ChangeEvent, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "@/i18n/routing";
import {
  type PortfolioItemFormValues,
  portfolioItemSchema,
} from "@/lib/validations/portfolio";

type PortfolioManagerItem = {
  id: string;
  titleBg: string;
  titleEn: string;
  category: string;
  imageUrl: string;
  description: string | null;
  location: string | null;
  shootYear: number | null;
  clientType: string | null;
  featured: boolean;
  showOnHome: boolean;
};

type PortfolioManagerProps = {
  items: PortfolioManagerItem[];
  categories: {
    key: string;
    label: string;
  }[];
};

export function PortfolioManager({ items, categories }: PortfolioManagerProps) {
  const t = useTranslations("adminPortfolio");
  const router = useRouter();
  const defaultCategory = categories[0]?.key ?? "weddings";
  const categoryLabels = new Map(categories.map((category) => [category.key, category.label]));
  const [submitError, setSubmitError] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PortfolioItemFormValues>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: {
      category: defaultCategory,
      featured: false,
      showOnHome: true,
    },
  });
  const imageUrl = useWatch({ control, name: "imageUrl" });

  function resetForm() {
    reset({
      titleBg: "",
      titleEn: "",
      category: defaultCategory,
      imageUrl: "",
      description: "",
      location: "",
      shootYear: undefined,
      clientType: "",
      featured: false,
      showOnHome: true,
    });
    setEditingId(null);
    setSubmitError(false);
    setUploadError(false);
  }

  async function onSubmit(values: PortfolioItemFormValues) {
    setSubmitError(false);
    const response = await fetch(
      editingId ? `/api/portfolio-items/${editingId}` : "/api/portfolio-items",
      {
      method: editingId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
      },
    );

    if (!response.ok) {
      setSubmitError(true);
      return;
    }

    resetForm();
    router.refresh();
  }

  function editItem(item: PortfolioManagerItem) {
    setEditingId(item.id);
    setSubmitError(false);
    setUploadError(false);
    reset({
      titleBg: item.titleBg,
      titleEn: item.titleEn,
      category: item.category,
      imageUrl: item.imageUrl,
      description: item.description ?? "",
      location: item.location ?? "",
      shootYear: item.shootYear ?? undefined,
      clientType: item.clientType ?? "",
      featured: item.featured,
      showOnHome: item.showOnHome,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError(false);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/portfolio-images", {
      method: "POST",
      body: formData,
    });

    setIsUploading(false);
    event.target.value = "";

    if (!response.ok) {
      setUploadError(true);
      return;
    }

    const result = (await response.json()) as { url?: string };

    if (!result.url) {
      setUploadError(true);
      return;
    }

    setValue("imageUrl", result.url, { shouldDirty: true, shouldValidate: true });
  }

  async function deleteItem(id: string) {
    setDeletingId(id);
    const response = await fetch(`/api/portfolio-items/${id}`, {
      method: "DELETE",
    });
    setDeletingId(null);

    if (response.ok) {
      router.refresh();
    }
  }

  const inputClass =
    "min-h-12 w-full rounded-md border border-line bg-background px-4 text-sm outline-none transition placeholder:text-muted focus:border-accent";

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="scroll-mt-6 rounded-md border border-line bg-background p-5 md:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">
            {editingId ? t("editFormTitle") : t("formTitle")}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="relative inline-flex h-9 items-center gap-2 rounded-md border border-line py-2 pr-3 pl-2 text-sm font-bold hover:border-accent"
            >
              <span
                className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                aria-hidden="true"
              />
              <X size={16} className="shrink-0" />
              {t("cancelEdit")}
            </button>
          )}
        </div>
        <div className="mt-6 grid gap-4">
          <label>
            <span className="mb-2 block text-sm font-bold">{t("titleBg")}</span>
            <input className={inputClass} {...register("titleBg")} />
            {errors.titleBg && <small className="text-error">{t("error")}</small>}
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">{t("titleEn")}</span>
            <input className={inputClass} {...register("titleEn")} />
            {errors.titleEn && <small className="text-error">{t("error")}</small>}
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">{t("category")}</span>
            <select className={inputClass} {...register("category")}>
              {categories.map((category) => (
                <option value={category.key} key={category.key}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">{t("imageUrl")}</span>
            <input className={inputClass} placeholder="https://..." {...register("imageUrl")} />
            {errors.imageUrl && <small className="text-error">{t("urlError")}</small>}
          </label>
          <div className="rounded-md border border-line bg-surface p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative min-h-32 overflow-hidden rounded-md bg-background outline-1 -outline-offset-1 outline-black/5 sm:w-40">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="160px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid min-h-32 place-items-center text-muted">
                    <ImagePlus size={24} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="portfolio-image-upload"
                  className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-line bg-background py-2 pr-3 pl-2 text-sm font-bold hover:border-accent"
                >
                  <Upload size={16} />
                  {isUploading ? t("uploadingImage") : t("uploadImage")}
                </label>
                <input
                  id="portfolio-image-upload"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="sr-only"
                  disabled={isUploading}
                  onChange={uploadImage}
                />
                <p className="mt-3 text-base leading-7 text-muted sm:text-sm sm:leading-6">
                  {t("uploadHelp")}
                </p>
                {uploadError && (
                  <p className="mt-3 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                    {t("uploadError")}
                  </p>
                )}
              </div>
            </div>
          </div>
          <label>
            <span className="mb-2 block text-sm font-bold">{t("description")}</span>
            <textarea
              className={`${inputClass} min-h-24 resize-none py-3`}
              {...register("description")}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label>
              <span className="mb-2 block text-sm font-bold">{t("location")}</span>
              <input className={inputClass} {...register("location")} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">{t("shootYear")}</span>
              <input
                className={inputClass}
                type="number"
                min="2000"
                max="2100"
                {...register("shootYear")}
              />
              {errors.shootYear && <small className="text-error">{t("yearError")}</small>}
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">{t("clientType")}</span>
              <input className={inputClass} {...register("clientType")} />
            </label>
          </div>
          <label className="flex items-center gap-3 text-sm font-bold">
            <input type="checkbox" className="size-4 accent-[var(--accent)]" {...register("featured")} />
            {t("featured")}
          </label>
          <label className="flex items-center gap-3 text-sm font-bold">
            <input type="checkbox" className="size-4 accent-[var(--accent)]" {...register("showOnHome")} />
            {t("showOnHome")}
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {editingId ? <Save size={17} /> : <Upload size={17} />}
            {isSubmitting
              ? t("saving")
              : editingId
                ? t("saveChanges")
                : t("submit")}
          </button>
          {submitError && (
            <p className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {t("submitError")}
            </p>
          )}
        </div>
      </form>

      <div className="grid gap-4">
        {items.length === 0 ? (
          <div className="rounded-md border border-line bg-background p-8 text-center text-muted">
            {t("empty")}
          </div>
        ) : (
          items.map((item) => (
            <div
              className="grid gap-4 rounded-md border border-line bg-background p-4 sm:grid-cols-[180px_1fr_auto]"
              key={item.id}
            >
              <div className="relative min-h-36 overflow-hidden rounded-md bg-surface">
                <Image
                  src={item.imageUrl}
                  alt={item.titleEn}
                  fill
                  unoptimized
                  sizes="180px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                  {categoryLabels.get(item.category) ?? item.category}
                </span>
                <h3 className="mt-2 text-xl font-bold">{item.titleBg}</h3>
                <p className="text-sm text-muted">{item.titleEn}</p>
                {item.featured && (
                  <span className="mt-3 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                    {t("featured")}
                  </span>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
                  {item.location && <span>{item.location}</span>}
                  {item.shootYear && <span>{item.shootYear}</span>}
                  {item.clientType && <span>{item.clientType}</span>}
                  {!item.showOnHome && <span>{t("hiddenFromHome")}</span>}
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col">
                <button
                  type="button"
                  onClick={() => editItem(item)}
                  className="relative inline-flex size-11 items-center justify-center rounded-md border border-line hover:border-accent"
                  aria-label={t("edit")}
                  title={t("edit")}
                >
                  <span
                    className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                    aria-hidden="true"
                  />
                  <Pencil size={17} />
                </button>
                <button
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={() => deleteItem(item.id)}
                  className="relative inline-flex size-11 items-center justify-center rounded-md border border-line text-error hover:border-error disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={t("delete")}
                  title={t("delete")}
                >
                  <span
                    className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                    aria-hidden="true"
                  />
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
