import { connection } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { galleryCategories } from "@/lib/site-data";

export type PublicPortfolioCategory = {
  key: string;
  label: string;
  labelBg: string;
  labelEn: string;
  visible: boolean;
  sortOrder: number;
};

export type OwnerPortfolioCategory = {
  id: string;
  key: string;
  labelBg: string;
  labelEn: string;
  visible: boolean;
  sortOrder: number;
  itemCount: number;
};

const fallbackLabels: Record<string, { labelBg: string; labelEn: string }> = {
  weddings: { labelBg: "Сватби", labelEn: "Weddings" },
  portraits: { labelBg: "Портрети", labelEn: "Portraits" },
  events: { labelBg: "Събития", labelEn: "Events" },
  commercial: { labelBg: "Комерсиални", labelEn: "Commercial" },
  business: { labelBg: "Бизнес", labelEn: "Business" },
  realEstate: { labelBg: "Имоти", labelEn: "Real estate" },
  family: { labelBg: "Семейни", labelEn: "Family" },
};

export async function ensureDefaultPortfolioCategories() {
  const count = await prisma.portfolioCategory.count();

  if (count > 0) {
    return;
  }

  await prisma.portfolioCategory.createMany({
    data: getFallbackPortfolioCategories("en").map((category) => ({
      key: category.key,
      labelBg: category.labelBg,
      labelEn: category.labelEn,
      visible: true,
      sortOrder: category.sortOrder,
    })),
    skipDuplicates: true,
  });
}

export function getFallbackPortfolioCategories(
  locale: string,
): PublicPortfolioCategory[] {
  return galleryCategories
    .filter((category) => category !== "all")
    .map((category, index) => {
      const labels = fallbackLabels[category] ?? {
        labelBg: category,
        labelEn: category,
      };

      return {
        key: category,
        label: locale === "bg" ? labels.labelBg : labels.labelEn,
        labelBg: labels.labelBg,
        labelEn: labels.labelEn,
        visible: true,
        sortOrder: index + 1,
      };
    });
}

export async function getPublicPortfolioCategories(
  locale: string,
): Promise<PublicPortfolioCategory[]> {
  await connection();

  try {
    const categories = await prisma.portfolioCategory.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        key: true,
        labelBg: true,
        labelEn: true,
        visible: true,
        sortOrder: true,
      },
    });

    if (categories.length === 0) {
      return getFallbackPortfolioCategories(locale);
    }

    return categories.map((category) => ({
      ...category,
      label: locale === "bg" ? category.labelBg : category.labelEn,
    }));
  } catch (error) {
    console.warn("Falling back to default portfolio categories.", error);
    return getFallbackPortfolioCategories(locale);
  }
}

export async function getOwnerPortfolioCategories(): Promise<OwnerPortfolioCategory[]> {
  const [categories, categoryCounts] = await Promise.all([
    prisma.portfolioCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.portfolioItem.groupBy({
      by: ["category"],
      _count: { category: true },
    }),
  ]);
  const countByCategory = new Map(
    categoryCounts.map((item) => [item.category, item._count.category]),
  );

  return categories.map((category) => ({
    id: category.id,
    key: category.key,
    labelBg: category.labelBg,
    labelEn: category.labelEn,
    visible: category.visible,
    sortOrder: category.sortOrder,
    itemCount: countByCategory.get(category.key) ?? 0,
  }));
}
