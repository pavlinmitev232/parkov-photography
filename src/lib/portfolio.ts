import { connection } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { portfolio } from "@/lib/site-data";

export type PublicPortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string | null;
  shootYear: number | null;
  clientType: string | null;
  featured: boolean;
  showOnHome: boolean;
};

function getMockPortfolio(): PublicPortfolioItem[] {
  return portfolio.map((item) => ({
    ...item,
    location: null,
    shootYear: null,
    clientType: null,
    featured: false,
    showOnHome: true,
  }));
}

export async function getPublicPortfolioItems(
  locale: string,
): Promise<PublicPortfolioItem[]> {
  await connection();

  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: [
        { featured: "desc" },
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
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

    if (items.length === 0) {
      return getMockPortfolio();
    }

    return items.map((item) => ({
      id: item.id,
      title: locale === "bg" ? item.titleBg : item.titleEn,
      category: item.category,
      image: item.imageUrl,
      location: item.location,
      shootYear: item.shootYear,
      clientType: item.clientType,
      featured: item.featured,
      showOnHome: item.showOnHome,
    }));
  } catch (error) {
    console.warn("Falling back to mock portfolio items.", error);
    return getMockPortfolio();
  }
}
