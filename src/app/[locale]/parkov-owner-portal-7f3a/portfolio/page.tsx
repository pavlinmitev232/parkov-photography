import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PortfolioManager } from "@/components/portfolio-manager";
import { Link } from "@/i18n/routing";
import { adminPath } from "@/lib/admin-path";
import { requireOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import {
  ensureDefaultPortfolioCategories,
  getPublicPortfolioCategories,
} from "@/lib/portfolio-categories";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireOwnerSession(locale);
  await ensureDefaultPortfolioCategories();
  const t = await getTranslations("adminPortfolio");
  const categories = await getPublicPortfolioCategories(locale);
  const items = await prisma.portfolioItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      titleBg: true,
      titleEn: true,
      category: true,
      imageUrl: true,
      location: true,
      shootYear: true,
      clientType: true,
      featured: true,
      showOnHome: true,
    },
  });

  return (
    <main className="min-h-screen bg-surface px-5 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href={adminPath}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-foreground"
        >
          <ArrowLeft size={16} />
          {t("back")}
        </Link>
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">{t("eyebrow")}</p>
            <h1 className="font-serif text-4xl font-bold md:text-6xl">
              {t("title")}
            </h1>
          </div>
          <p className="max-w-xl text-muted">{t("copy")}</p>
        </div>
        <PortfolioManager items={items} categories={categories} />
      </div>
    </main>
  );
}
