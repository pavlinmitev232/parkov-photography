import { revalidateTag, unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { portfolio } from "@/lib/site-data";
import {
  getFallbackPortfolioCategories,
  type PublicPortfolioCategory,
} from "@/lib/portfolio-categories";
import {
  defaultSiteSettings,
} from "@/lib/site-settings";
import {
  fallbackPackages,
  fallbackServices,
  type PublicPricingPackage,
  type PublicServiceItem,
} from "@/lib/site-content";
import type { PublicPortfolioItem } from "@/lib/portfolio";
import {
  defaultFaqs,
  defaultTestimonials,
  type PublicFaqItem,
  type PublicTestimonial,
} from "@/lib/reviews-faq";
import {
  siteSettingsSchema,
  type SiteSettingsValues,
} from "@/lib/validations/site-settings";

export type PublicHomeData = {
  portfolioItems: PublicPortfolioItem[];
  portfolioCategories: PublicPortfolioCategory[];
  publicServices: PublicServiceItem[];
  publicPackages: PublicPricingPackage[];
  settings: SiteSettingsValues;
  publicTestimonials: PublicTestimonial[];
  publicFaqs: PublicFaqItem[];
};

const publicHomeCacheSeconds = 300;
const publicHomeDataTag = "public-home-data";
const publicSiteSettingsTag = "public-site-settings";
const settingsKey = "site-profile";

function localizePortfolioItems(
  locale: string,
  items: Array<{
    id: string;
    titleBg: string;
    titleEn: string;
    category: string;
    imageUrl: string;
    location: string | null;
    shootYear: number | null;
    clientType: string | null;
    featured: boolean;
    showOnHome: boolean;
  }>,
): PublicPortfolioItem[] {
  if (items.length === 0) {
    return portfolio.map((item) => ({
      ...item,
      location: null,
      shootYear: null,
      clientType: null,
      featured: false,
      showOnHome: true,
    }));
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
}

function localizeServices(
  locale: string,
  items: Array<{
    id: string;
    key: string;
    titleBg: string;
    titleEn: string;
    copyBg: string;
    copyEn: string;
    icon: string;
  }>,
): PublicServiceItem[] {
  const source = items.length > 0 ? items : fallbackServices;

  return source.map((item) => ({
    id: "id" in item ? String(item.id) : item.key,
    key: item.key,
    title: locale === "bg" ? item.titleBg : item.titleEn,
    copy: locale === "bg" ? item.copyBg : item.copyEn,
    icon: item.icon,
  }));
}

function localizePackages(
  locale: string,
  items: Array<{
    id: string;
    key: string;
    titleBg: string;
    titleEn: string;
    copyBg: string;
    copyEn: string;
    priceBg: string;
    priceEn: string;
    featured: boolean;
  }>,
): PublicPricingPackage[] {
  const source = items.length > 0 ? items : fallbackPackages;

  return source.map((item) => ({
    id: "id" in item ? String(item.id) : item.key,
    key: item.key,
    title: locale === "bg" ? item.titleBg : item.titleEn,
    copy: locale === "bg" ? item.copyBg : item.copyEn,
    price: locale === "bg" ? item.priceBg : item.priceEn,
    featured: item.featured,
  }));
}

function localizeTestimonials(
  locale: string,
  items: Array<{
    id: string;
    nameBg: string;
    nameEn: string;
    roleBg: string;
    roleEn: string;
    quoteBg: string;
    quoteEn: string;
  }>,
): PublicTestimonial[] {
  const source = items.length > 0 ? items : defaultTestimonials;

  return source.map((item, index) => ({
    id: "id" in item ? String(item.id) : `testimonial-${index}`,
    name: locale === "bg" ? item.nameBg : item.nameEn,
    role: locale === "bg" ? item.roleBg : item.roleEn,
    quote: locale === "bg" ? item.quoteBg : item.quoteEn,
  }));
}

function localizeFaqs(
  locale: string,
  items: Array<{
    id: string;
    questionBg: string;
    questionEn: string;
    answerBg: string;
    answerEn: string;
  }>,
): PublicFaqItem[] {
  const source = items.length > 0 ? items : defaultFaqs;

  return source.map((item, index) => ({
    id: "id" in item ? String(item.id) : `faq-${index}`,
    question: locale === "bg" ? item.questionBg : item.questionEn,
    answer: locale === "bg" ? item.answerBg : item.answerEn,
  }));
}

export const getCachedSiteSettings = unstable_cache(
  async () => {
    try {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: settingsKey },
        select: { value: true },
      });
      const parsed = siteSettingsSchema.safeParse(setting?.value);
      return parsed.success ? parsed.data : defaultSiteSettings;
    } catch (error) {
      console.warn("Falling back to default site settings.", error);
      return defaultSiteSettings;
    }
  },
  ["public-site-settings"],
  { revalidate: publicHomeCacheSeconds, tags: [publicSiteSettingsTag] },
);

export const getCachedPublicHomeData = unstable_cache(
  async (locale: string): Promise<PublicHomeData> => {
    const [
      portfolioItems,
      portfolioCategories,
      serviceItems,
      pricingPackages,
      settings,
      testimonials,
      faqs,
    ] = await Promise.all([
      prisma.portfolioItem.findMany({
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
      }),
      prisma.portfolioCategory.findMany({
        where: { visible: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          key: true,
          labelBg: true,
          labelEn: true,
          visible: true,
          sortOrder: true,
        },
      }),
      prisma.serviceItem.findMany({
        where: { visible: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          key: true,
          titleBg: true,
          titleEn: true,
          copyBg: true,
          copyEn: true,
          icon: true,
        },
      }),
      prisma.pricingPackage.findMany({
        where: { visible: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          key: true,
          titleBg: true,
          titleEn: true,
          copyBg: true,
          copyEn: true,
          priceBg: true,
          priceEn: true,
          featured: true,
        },
      }),
      getCachedSiteSettings(),
      prisma.testimonial.findMany({
        where: { visible: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          nameBg: true,
          nameEn: true,
          roleBg: true,
          roleEn: true,
          quoteBg: true,
          quoteEn: true,
        },
      }),
      prisma.faqItem.findMany({
        where: { visible: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          questionBg: true,
          questionEn: true,
          answerBg: true,
          answerEn: true,
        },
      }),
    ]);

    return {
      portfolioItems: localizePortfolioItems(locale, portfolioItems),
      portfolioCategories:
        portfolioCategories.length > 0
          ? portfolioCategories.map((category) => ({
              ...category,
              label: locale === "bg" ? category.labelBg : category.labelEn,
            }))
          : getFallbackPortfolioCategories(locale),
      publicServices: localizeServices(locale, serviceItems),
      publicPackages: localizePackages(locale, pricingPackages),
      settings,
      publicTestimonials: localizeTestimonials(locale, testimonials),
      publicFaqs: localizeFaqs(locale, faqs),
    };
  },
  ["public-home-data"],
  { revalidate: publicHomeCacheSeconds, tags: [publicHomeDataTag] },
);

export function revalidatePublicHomeData(options?: { includeSettings?: boolean }) {
  revalidateTag(publicHomeDataTag, { expire: 0 });

  if (options?.includeSettings) {
    revalidateTag(publicSiteSettingsTag, { expire: 0 });
  }
}
