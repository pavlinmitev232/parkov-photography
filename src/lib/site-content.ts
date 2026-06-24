import { connection } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { shouldSeedDefaultContent } from "@/lib/default-content";

export type PublicServiceItem = {
  id: string;
  key: string;
  title: string;
  copy: string;
  icon: string;
};

export type PublicPricingPackage = {
  id: string;
  key: string;
  title: string;
  copy: string;
  price: string;
  featured: boolean;
};

export const fallbackServices = [
  {
    key: "weddings",
    titleBg: "Сватби",
    titleEn: "Weddings",
    copyBg: "Цялостно заснемане на деня, детайлите, емоцията и празника.",
    copyEn: "Full-day coverage of the details, emotion, people, and celebration.",
    icon: "heart",
  },
  {
    key: "portraits",
    titleBg: "Портрети",
    titleEn: "Portraits",
    copyBg: "Лични, артистични и професионални портрети за профил или кампания.",
    copyEn: "Personal, artistic, and professional portraits for profiles or campaigns.",
    icon: "camera",
  },
  {
    key: "events",
    titleBg: "Събития",
    titleEn: "Events",
    copyBg: "Корпоративни събития, рождени дни, балове, кръщенета и концерти.",
    copyEn: "Corporate events, birthdays, proms, baptisms, concerts, and private moments.",
    icon: "party",
  },
  {
    key: "products",
    titleBg: "Продукти",
    titleEn: "Products",
    copyBg: "Чисти продуктови кадри за онлайн магазини, менюта и рекламни материали.",
    copyEn: "Clean product images for online stores, menus, catalogs, and ads.",
    icon: "gem",
  },
  {
    key: "business",
    titleBg: "Бизнес",
    titleEn: "Business",
    copyBg: "Екипни снимки, LinkedIn портрети, офис атмосфера и employer branding.",
    copyEn: "Team photos, LinkedIn portraits, office atmosphere, and employer branding.",
    icon: "building",
  },
  {
    key: "realEstate",
    titleBg: "Имоти",
    titleEn: "Real estate",
    copyBg: "Интериорна и екстериорна фотография за имоти, хотели и пространства.",
    copyEn: "Interior and exterior photography for properties, hotels, and venues.",
    icon: "home",
  },
  {
    key: "family",
    titleBg: "Семейни сесии",
    titleEn: "Family sessions",
    copyBg: "Спокойни кадри у дома, навън или в студио, с естествено усещане.",
    copyEn: "Relaxed photographs at home, outdoors, or in studio with a natural feel.",
    icon: "users",
  },
  {
    key: "creative",
    titleBg: "Креативни проекти",
    titleEn: "Creative projects",
    copyBg: "Мода, артистични идеи, кампании, ретуш и визуална концепция.",
    copyEn: "Fashion, concepts, campaigns, retouching, and visual direction.",
    icon: "sparkles",
  },
];

export const fallbackPackages = [
  {
    key: "portrait",
    titleBg: "Портретна сесия",
    titleEn: "Portrait session",
    copyBg: "За лични портрети, бизнес профили, двойки, семейни моменти и по-малки креативни сесии.",
    copyEn: "For personal portraits, business profiles, couples, family moments, and smaller creative sessions.",
    priceBg: "от 180 лв.",
    priceEn: "from 180 BGN",
    featured: false,
  },
  {
    key: "event",
    titleBg: "Събитийно заснемане",
    titleEn: "Event coverage",
    copyBg: "За сватби, балове, кръщенета, корпоративни събития, рождени дни и празници в България.",
    copyEn: "For weddings, proms, baptisms, corporate events, birthdays, and celebrations across Bulgaria.",
    priceBg: "индивидуална оферта",
    priceEn: "custom quote",
    featured: true,
  },
  {
    key: "commercial",
    titleBg: "Комерсиално заснемане",
    titleEn: "Commercial shoot",
    copyBg: "За продукти, пространства, ресторанти, имоти, бранд кампании и бизнес съдържание.",
    copyEn: "For products, spaces, restaurants, real estate, brand campaigns, and business content.",
    priceBg: "от 320 лв.",
    priceEn: "from 320 BGN",
    featured: false,
  },
];

export async function ensureDefaultSiteContent() {
  if (!shouldSeedDefaultContent()) {
    return;
  }

  const [serviceCount, packageCount] = await Promise.all([
    prisma.serviceItem.count(),
    prisma.pricingPackage.count(),
  ]);

  await Promise.all([
    serviceCount === 0
      ? prisma.serviceItem.createMany({
          data: fallbackServices.map((item, index) => ({
            ...item,
            visible: true,
            sortOrder: index + 1,
          })),
          skipDuplicates: true,
        })
      : Promise.resolve(),
    packageCount === 0
      ? prisma.pricingPackage.createMany({
          data: fallbackPackages.map((item, index) => ({
            ...item,
            visible: true,
            sortOrder: index + 1,
          })),
          skipDuplicates: true,
        })
      : Promise.resolve(),
  ]);
}

export async function getPublicServices(locale: string): Promise<PublicServiceItem[]> {
  await connection();

  try {
    const items = await prisma.serviceItem.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (items.length > 0) {
      return items.map((item) => ({
        id: item.id,
        key: item.key,
        title: locale === "bg" ? item.titleBg : item.titleEn,
        copy: locale === "bg" ? item.copyBg : item.copyEn,
        icon: item.icon,
      }));
    }

    return fallbackServices.map((item) => ({
      id: item.key,
      key: item.key,
      title: locale === "bg" ? item.titleBg : item.titleEn,
      copy: locale === "bg" ? item.copyBg : item.copyEn,
      icon: item.icon,
    }));
  } catch (error) {
    console.warn("Falling back to default services.", error);
    return fallbackServices.map((item) => ({
      id: item.key,
      key: item.key,
      title: locale === "bg" ? item.titleBg : item.titleEn,
      copy: locale === "bg" ? item.copyBg : item.copyEn,
      icon: item.icon,
    }));
  }
}

export async function getPublicPricingPackages(
  locale: string,
): Promise<PublicPricingPackage[]> {
  await connection();

  try {
    const items = await prisma.pricingPackage.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (items.length > 0) {
      return items.map((item) => ({
        id: item.id,
        key: item.key,
        title: locale === "bg" ? item.titleBg : item.titleEn,
        copy: locale === "bg" ? item.copyBg : item.copyEn,
        price: locale === "bg" ? item.priceBg : item.priceEn,
        featured: item.featured,
      }));
    }

    return fallbackPackages.map((item) => ({
      id: item.key,
      key: item.key,
      title: locale === "bg" ? item.titleBg : item.titleEn,
      copy: locale === "bg" ? item.copyBg : item.copyEn,
      price: locale === "bg" ? item.priceBg : item.priceEn,
      featured: item.featured,
    }));
  } catch (error) {
    console.warn("Falling back to default pricing packages.", error);
    return fallbackPackages.map((item) => ({
      id: item.key,
      key: item.key,
      title: locale === "bg" ? item.titleBg : item.titleEn,
      copy: locale === "bg" ? item.copyBg : item.copyEn,
      price: locale === "bg" ? item.priceBg : item.priceEn,
      featured: item.featured,
    }));
  }
}

export async function getOwnerSiteContent() {
  const [services, packages] = await Promise.all([
    prisma.serviceItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.pricingPackage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  return { services, packages };
}
