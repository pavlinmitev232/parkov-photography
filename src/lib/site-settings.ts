import { connection } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  siteSettingsSchema,
  type SiteSettingsValues,
} from "@/lib/validations/site-settings";

const settingsKey = "site-profile";

export const defaultSiteSettings: SiteSettingsValues = {
  brandName: "Parkov",
  statYears: "12+",
  statProjects: "480+",
  statRating: "4.9",
  statReply: "24h",
  phone: "+359888000000",
  email: "hello@parkov.photo",
  instagramUrl: "https://instagram.com/parkov.photo",
  facebookUrl: "https://facebook.com/parkov.photo",
  tiktokUrl: "https://tiktok.com/@parkov.photo",
  heroImageUrl:
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=2200&q=85",
  aboutImageUrl:
    "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1300&q=82",
  logoImageUrl: "",
  seoTitleBg: "Parkov Photography | Фотограф в България",
  seoTitleEn: "Parkov Photography | Photographer in Bulgaria",
  seoDescriptionBg:
    "Премиум двуезичен сайт за сватбена, портретна, събитийна, продуктова, бизнес, семейна и имотна фотография в България.",
  seoDescriptionEn:
    "Premium bilingual photography website for weddings, portraits, events, products, business, family sessions, and real estate across Bulgaria.",
  heroEyebrowBg: "Фотография в цяла България",
  heroEyebrowEn: "Photography across Bulgaria",
  heroTitleBg: "Кадри, които остават.",
  heroTitleEn: "Frames that stay with you.",
  heroCopyBg:
    "Parkov създава сватбена, портретна, събитийна и комерсиална фотография с чист стил, спокойна комуникация и внимание към момента.",
  heroCopyEn:
    "Parkov creates wedding, portrait, event, and commercial photography with a clean visual style, calm communication, and attention to real moments.",
  aboutEyebrowBg: "За Parkov",
  aboutEyebrowEn: "About Parkov",
  aboutTitleBg:
    "Спокойна насока, точен момент и кадри с лично усещане.",
  aboutTitleEn:
    "Calm direction, sharp timing, and photographs made to feel personal.",
  aboutCopyBg:
    "Parkov работи с различни видове заснемане, като запазва естествено усещане, ясна комуникация и внимание към хората, детайлите и атмосферата.",
  aboutCopyEn:
    "Parkov works across different kinds of photography while keeping a natural feel, clear communication, and careful attention to people, details, and atmosphere.",
  servicesEyebrowBg: "Услуги",
  servicesEyebrowEn: "Services",
  servicesTitleBg:
    "Всичко от лична сесия до пълно събитийно заснемане.",
  servicesTitleEn: "Everything from personal sessions to full event coverage.",
  packagesEyebrowBg: "Пакети",
  packagesEyebrowEn: "Packages",
  packagesTitleBg:
    "Ясни начални варианти, персонализирани след запитване.",
  packagesTitleEn: "Simple starting points, customized after the request.",
  packagesCopyBg:
    "Цените са начални насоки. Точната оферта се потвърждава след информация за проекта.",
  packagesCopyEn:
    "Prices are starting points. The exact quote is confirmed after learning about the project.",
  testimonialsEyebrowBg: "Отзиви",
  testimonialsEyebrowEn: "Client words",
  testimonialsTitleBg: "Истории от хора, застанали пред обектива.",
  testimonialsTitleEn: "Stories from people who stepped in front of the lens.",
  faqEyebrowBg: "Въпроси",
  faqEyebrowEn: "FAQ",
  faqTitleBg: "Важното преди да запазите дата.",
  faqTitleEn: "What matters before reserving a date.",
  contactEyebrowBg: "Резервации",
  contactEyebrowEn: "Bookings",
  contactTitleBg: "Разкажете какво искате да заснемем.",
  contactTitleEn: "Tell us what you want photographed.",
  contactCopyBg:
    "Изпратете дата, място и идея. Ще получите отговор с възможности и следващи стъпки.",
  contactCopyEn:
    "Send the date, location, and idea. You will receive availability and clear next steps.",
  locationBg: "Базирано в България. Възможно пътуване според проекта.",
  locationEn: "Based in Bulgaria. Travel available depending on the project.",
  addressBg: "",
  addressEn: "",
  mapQuery: "",
  showMap: false,
  announcementEnabled: false,
  announcementTextBg: "",
  announcementTextEn: "",
  footerCopyBg: "Фотография за хора, събития, бизнеси и пространства.",
  footerCopyEn: "Photography for people, events, businesses, and spaces.",
  showAbout: true,
  showServices: true,
  showProcess: true,
  showPricing: true,
  showTestimonials: true,
  showFaq: true,
  showContact: true,
};

export async function getSiteSettings() {
  await connection();

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
}

export async function saveSiteSettings(values: SiteSettingsValues) {
  return prisma.siteSetting.upsert({
    where: { key: settingsKey },
    create: { key: settingsKey, value: values },
    update: { value: values },
  });
}

export function localizedSettings(settings: SiteSettingsValues, locale: string) {
  const suffix = locale === "bg" ? "Bg" : "En";
  const pick = (base: string) =>
    settings[`${base}${suffix}` as keyof SiteSettingsValues] as string;

  return {
    brandName: settings.brandName,
    heroEyebrow: pick("heroEyebrow"),
    heroTitle: pick("heroTitle"),
    heroCopy: pick("heroCopy"),
    aboutEyebrow: pick("aboutEyebrow"),
    aboutTitle: pick("aboutTitle"),
    aboutCopy: pick("aboutCopy"),
    servicesEyebrow: pick("servicesEyebrow"),
    servicesTitle: pick("servicesTitle"),
    packagesEyebrow: pick("packagesEyebrow"),
    packagesTitle: pick("packagesTitle"),
    packagesCopy: pick("packagesCopy"),
    testimonialsEyebrow: pick("testimonialsEyebrow"),
    testimonialsTitle: pick("testimonialsTitle"),
    faqEyebrow: pick("faqEyebrow"),
    faqTitle: pick("faqTitle"),
    contactEyebrow: pick("contactEyebrow"),
    contactTitle: pick("contactTitle"),
    contactCopy: pick("contactCopy"),
    location: pick("location"),
    address: pick("address"),
    announcementText: pick("announcementText"),
    footerCopy: pick("footerCopy"),
  };
}

export function getMapEmbedUrl(settings: SiteSettingsValues) {
  return settings.showMap && settings.mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&output=embed`
    : null;
}

export function getContactMethods(settings: SiteSettingsValues) {
  const number = settings.phone.replace(/[^\d+]/g, "");
  const whatsapp = settings.phone.replace(/\D/g, "");

  return [
    { key: "phone", href: `tel:${number}` },
    { key: "viber", href: `viber://chat?number=${encodeURIComponent(number)}` },
    { key: "whatsapp", href: `https://wa.me/${whatsapp}` },
    { key: "email", href: `mailto:${settings.email}` },
  ];
}

export function getSocialLinks(settings: SiteSettingsValues) {
  return [
    { key: "instagram", href: settings.instagramUrl },
    { key: "facebook", href: settings.facebookUrl },
    { key: "tiktok", href: settings.tiktokUrl },
  ].filter((item) => item.href);
}
