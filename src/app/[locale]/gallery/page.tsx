import { ArrowLeft, Languages } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { GalleryBrowser } from "@/components/gallery-browser";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/routing";
import { getPublicPortfolioItems } from "@/lib/portfolio";
import { getPublicPortfolioCategories } from "@/lib/portfolio-categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });

  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("gallery");
  const home = await getTranslations("home");
  const common = await getTranslations("common");
  const alternateLocale = locale === "bg" ? "en" : "bg";
  const portfolioItems = await getPublicPortfolioItems(locale);
  const portfolioCategories = await getPublicPortfolioCategories(locale);
  const knownCategorySet = new Set(portfolioCategories.map((category) => category.key));
  const displayItems = portfolioItems.filter((item) =>
    knownCategorySet.has(item.category),
  );
  const visibleGalleryCategories = [
    "all",
    ...portfolioCategories
      .filter((category) => displayItems.some((item) => item.category === category.key))
      .map((category) => category.key),
  ];
  const galleryLabels = Object.fromEntries([
    ["all", home("portfolio.categories.all")],
    ...portfolioCategories.map((category) => [category.key, category.label]),
  ]);

  return (
    <main className="isolate min-h-dvh bg-background">
      <header className="border-b border-line bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <Link
            href="/"
            aria-label="Homepage"
            className="font-serif text-2xl font-bold tracking-wide"
          >
            Parkov
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface/80 py-2 pr-4 pl-3 text-sm font-bold backdrop-blur hover:border-foreground/30"
            >
              <ArrowLeft size={16} className="shrink-0" />
              {t("backHome")}
            </Link>
            <Link
              href="/gallery"
              locale={alternateLocale}
              aria-label={common("language")}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface/80 py-2 pr-4 pl-3 text-sm font-bold backdrop-blur hover:border-foreground/30"
            >
              <Languages size={16} className="shrink-0" />
              {alternateLocale.toUpperCase()}
            </Link>
            <ThemeToggle label={common("theme")} />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-line px-5 py-16 md:px-8 md:py-24">
        <div className="absolute inset-y-0 right-0 hidden w-[44vw] lg:block">
          <Image
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
            alt=""
            fill
            priority
            sizes="44vw"
            className="object-cover opacity-24"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/72 to-background/10" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <p className="section-kicker">{t("eyebrow")}</p>
          <h1 className="max-w-[20ch] font-serif text-5xl font-bold tracking-tight text-balance md:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-[56ch] text-base leading-7 text-muted text-pretty md:text-lg md:leading-8">
            {t("copy")}
          </p>
          <div className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
            {["curated", "categories", "database"].map((item) => (
              <div key={item}>
                <strong className="font-serif text-3xl tabular-nums">
                  {t(`stats.${item}.value`)}
                </strong>
                <p className="mt-2 text-base leading-7 text-muted sm:text-sm sm:leading-6">
                  {t(`stats.${item}.label`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GalleryBrowser
        categories={visibleGalleryCategories}
        items={displayItems}
        labels={galleryLabels}
        closeLabel={common("close")}
        itemCountLabel={t("itemCount")}
        emptyTitle={t("emptyTitle")}
        emptyCopy={t("emptyCopy")}
      />
    </main>
  );
}
