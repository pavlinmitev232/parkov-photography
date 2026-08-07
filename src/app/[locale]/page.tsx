import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Languages,
  Mail,
  MapPin,
  Music2,
  Phone,
  Quote,
  Star,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { GalleryShowcase } from "@/components/gallery-showcase";
import { AnimatedStat } from "@/components/animated-stat";
import { AboutPoint } from "@/components/about-point";
import { MobileMenu } from "@/components/mobile-menu";
import {
  MotionDiv,
  MotionGroup,
  MotionHeader,
  MotionItem,
} from "@/components/motion";
import { RequestForm } from "@/components/request-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { serviceIcons } from "@/lib/site-data";
import {
  getCachedPublicHomeData,
  getCachedSiteSettings,
} from "@/lib/public-home-data";
import {
  getContactMethods,
  getMapEmbedUrl,
  getSocialLinks,
  localizedSettings,
} from "@/lib/site-settings";

export const dynamic = "force-static";
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getCachedSiteSettings();

  return {
    title: locale === "bg" ? settings.seoTitleBg : settings.seoTitleEn,
    description:
      locale === "bg"
        ? settings.seoDescriptionBg
        : settings.seoDescriptionEn,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const nav = await getTranslations("nav");
  const common = await getTranslations("common");
  const alternateLocale = locale === "bg" ? "en" : "bg";
  const {
    portfolioItems,
    portfolioCategories,
    publicServices,
    publicPackages,
    settings,
    publicTestimonials,
    publicFaqs,
  } = await getCachedPublicHomeData(locale);
  const content = localizedSettings(settings, locale);
  const announcementText = settings.announcementEnabled
    ? content.announcementText.trim()
    : "";
  const requestMethods = getContactMethods(settings);
  const publicContactDetails: Partial<Record<string, string>> = {
    phone: settings.phone,
    email: settings.email,
  };
  const publicContactIcons = {
    phone: Phone,
    email: Mail,
  };
  const socials = getSocialLinks(settings);
  const mapEmbedUrl = getMapEmbedUrl(settings);
  const socialIcons = {
    instagram: Camera,
    facebook: ThumbsUp,
    tiktok: Music2,
  };
  const stats = [
    { value: settings.statYears, key: "years" },
    { value: settings.statProjects, key: "projects" },
    { value: settings.statRating, key: "rating" },
    { value: settings.statReply, key: "reply" },
  ];
  const portfolioCategoryKeys = new Set(portfolioCategories.map((category) => category.key));
  const displayPortfolioItems = portfolioItems.filter((item) =>
    portfolioCategoryKeys.has(item.category) && item.showOnHome,
  );
  const visibleGalleryCategories = [
    "all",
    ...portfolioCategories
      .filter((category) =>
        displayPortfolioItems.some((item) => item.category === category.key),
      )
      .map((category) => category.key),
  ];
  const galleryLabels = Object.fromEntries([
    ["all", t("portfolio.categories.all")],
    ...portfolioCategories.map((category) => [
      category.key,
      category.label,
    ]),
  ]);
  const navLinks = [
    ...(settings.showAbout ? ["about"] : []),
    "work",
    ...(settings.showServices ? ["services"] : []),
    ...(settings.showPricing ? ["pricing"] : []),
    ...(settings.showContact ? ["contact"] : []),
  ].map((item) => ({
    href: `#${item}`,
    label: nav(item),
  }));

  return (
    <main className="min-h-screen overflow-hidden">
      <MotionHeader
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 border-b border-line bg-background/78 backdrop-blur-xl"
      >
        {announcementText && (
          <div className="border-b border-accent/25 bg-foreground px-5 py-2 text-center text-sm font-bold leading-6 text-background md:px-8">
            <p className="mx-auto max-w-5xl">{announcementText}</p>
          </div>
        )}
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="font-serif text-2xl font-bold tracking-wide">
            {settings.logoImageUrl ? (
              <Image
                src={settings.logoImageUrl}
                alt={content.brandName}
                width={150}
                height={44}
                className="h-10 w-auto object-contain"
              />
            ) : (
              content.brandName
            )}
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex">
            {navLinks.map((item) => (
              <a className="transition hover:text-foreground" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              locale={alternateLocale}
              aria-label={common("language")}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface/80 px-4 text-sm font-bold shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-foreground/30"
            >
              <Languages size={17} />
              {alternateLocale.toUpperCase()}
            </Link>
            <ThemeToggle label={common("theme")} />
            <MobileMenu
              label={common("menu")}
              closeLabel={common("closeMenu")}
              links={navLinks}
            />
          </div>
        </div>
      </MotionHeader>

      <section
        className={`relative flex min-h-screen items-end ${
          announcementText ? "pt-40" : "pt-28"
        }`}
      >
        <div className="absolute inset-0">
          <Image
            src={settings.heroImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-[58%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,5,3,.88),rgba(6,5,3,.34),rgba(6,5,3,.12))] dark:bg-[linear-gradient(90deg,rgba(4,4,5,.9),rgba(4,4,5,.42),rgba(4,4,5,.16))]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,5,3,.22),rgba(6,5,3,.58)_42%,rgba(6,5,3,.86))] md:hidden" />
        </div>
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-5 pb-12 text-white md:grid-cols-[1.05fr_.95fr] md:gap-10 md:px-8 md:pb-24">
          <MotionDiv
            initial={{ y: 38, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
              <Camera size={16} />
              {content.heroEyebrow}
            </p>
            <h1 className="font-serif text-5xl font-bold leading-[0.95] text-white drop-shadow-[0_3px_24px_rgba(0,0,0,.55)] md:text-7xl lg:text-8xl">
              {content.heroTitle}
            </h1>
            <p className="mt-7 max-w-2xl text-base font-medium leading-7 text-white/92 drop-shadow md:text-lg md:leading-8">
              {content.heroCopy}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent-strong"
              >
                {t("hero.primary")} <ArrowRight size={17} />
              </a>
              <a
                href="#work"
                className="inline-flex h-13 items-center justify-center rounded-md border border-white/35 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18"
              >
                {t("hero.secondary")}
              </a>
            </div>
          </MotionDiv>
          <MotionDiv
            initial={{ y: 44, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.9, ease: "easeOut" }}
            className="self-end border-l border-white/25 pl-6"
          >
            <MotionGroup
              className="grid grid-cols-2 gap-5"
              delayChildren={0.45}
              staggerChildren={0.1}
            >
              {stats.map((stat) => (
                <MotionItem key={stat.key}>
                  <div className="font-serif text-4xl font-bold">
                    <AnimatedStat
                      value={stat.value}
                      animate={stat.key !== "reply"}
                    />
                  </div>
                  <span className="text-sm text-white/72">{t(`stats.${stat.key}`)}</span>
                </MotionItem>
              ))}
            </MotionGroup>
          </MotionDiv>
        </div>
      </section>

      {settings.showAbout && <section id="about" className="border-b border-line bg-surface px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <MotionDiv
            initial={{ y: 32, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="relative min-h-[520px] overflow-hidden rounded-md"
          >
            <Image
              src={settings.aboutImageUrl}
              alt={content.brandName}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </MotionDiv>
          <MotionDiv
            initial={{ y: 32, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <p className="section-kicker">{content.aboutEyebrow}</p>
            <h2 className="section-title">{content.aboutTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-muted">{content.aboutCopy}</p>
            <MotionGroup
              className="mt-8 grid gap-3 sm:grid-cols-2"
              delayChildren={0.16}
              staggerChildren={0.12}
            >
              {["calm", "local", "edited", "flexible"].map((item) => (
                <AboutPoint key={item}>{t(`about.points.${item}`)}</AboutPoint>
              ))}
            </MotionGroup>
          </MotionDiv>
        </div>
      </section>}

      <section
        id="work"
        className="px-5 py-24 md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">{t("portfolio.eyebrow")}</p>
              <h2 className="section-title">{t("portfolio.title")}</h2>
            </div>
            <div className="max-w-xl">
              <p className="text-muted">{t("portfolio.copy")}</p>
              <Link
                href="/gallery"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-md border border-line px-4 text-sm font-bold transition hover:-translate-y-0.5 hover:border-accent"
              >
                {t("portfolio.cta")}
              </Link>
            </div>
          </div>
          <GalleryShowcase
            categories={visibleGalleryCategories}
            items={displayPortfolioItems}
            labels={galleryLabels}
            closeLabel={common("close")}
            previousLabel={common("previousImage")}
            nextLabel={common("nextImage")}
            swipeLabel={common("galleryNavigation")}
          />
        </div>
      </section>

      {settings.showServices && <section id="services" className="border-y border-line bg-surface px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="section-kicker">{content.servicesEyebrow}</p>
          <h2 className="section-title max-w-3xl">{content.servicesTitle}</h2>
          <MotionGroup
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            staggerChildren={0.07}
          >
            {publicServices.map((item) => {
              const Icon =
                serviceIcons[item.icon as keyof typeof serviceIcons] ??
                serviceIcons.camera;

              return (
              <MotionItem className="h-full" key={item.id} lift>
                <div className="h-full rounded-md border border-line bg-background p-6 transition-colors hover:border-accent/50">
                  <Icon className="mb-8 text-accent" size={30} />
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {item.copy}
                  </p>
                </div>
              </MotionItem>
              );
            })}
          </MotionGroup>
        </div>
      </section>}

      {settings.showProcess && <section id="process" className="px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="section-kicker">{t("process.eyebrow")}</p>
            <h2 className="section-title">{t("process.title")}</h2>
          </div>
          <MotionGroup className="grid gap-4 md:grid-cols-3" staggerChildren={0.12}>
            {["brief", "shoot", "delivery"].map((step, index) => (
              <MotionItem key={step}>
                <div className="border-l border-line pl-5">
                  <span className="font-serif text-5xl text-accent">0{index + 1}</span>
                  <h3 className="mt-4 text-xl font-bold">{t(`process.steps.${step}.title`)}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {t(`process.steps.${step}.copy`)}
                  </p>
                </div>
              </MotionItem>
            ))}
          </MotionGroup>
        </div>
      </section>}

      {settings.showPricing && <section id="pricing" className="border-y border-line bg-surface px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">{content.packagesEyebrow}</p>
              <h2 className="section-title">{content.packagesTitle}</h2>
            </div>
            <p className="max-w-xl text-muted">{content.packagesCopy}</p>
          </div>
          <MotionGroup className="grid gap-4 lg:grid-cols-3" staggerChildren={0.11}>
            {publicPackages.map((item) => (
              <MotionItem className="h-full" key={item.id} lift>
                <div
                  className={`h-full rounded-md border p-6 ${
                    item.featured
                      ? "border-accent bg-foreground text-background"
                      : "border-line bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    {item.featured && (
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                        {t("packages.featured")}
                      </span>
                    )}
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${item.featured ? "text-background/72" : "text-muted"}`}>
                    {item.copy}
                  </p>
                  <strong className="mt-8 block font-serif text-4xl">
                    {item.price}
                  </strong>
                  <a
                    href="#contact"
                    className={`mt-8 inline-flex h-12 w-full items-center justify-center rounded-md text-sm font-bold transition hover:-translate-y-0.5 ${
                      item.featured
                        ? "bg-accent text-accent-foreground hover:bg-accent-strong"
                        : "border border-line hover:border-accent"
                    }`}
                  >
                    {t("packages.cta")}
                  </a>
                </div>
              </MotionItem>
            ))}
          </MotionGroup>
        </div>
      </section>}

      {settings.showTestimonials && <section className="px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="section-kicker">{content.testimonialsEyebrow}</p>
          <h2 className="section-title max-w-4xl">{content.testimonialsTitle}</h2>
          <MotionGroup className="mt-12 grid gap-4 lg:grid-cols-3" staggerChildren={0.12}>
            {publicTestimonials.map((item) => (
              <MotionItem className="h-full" key={item.id} lift>
                <div className="h-full rounded-md border border-line bg-surface p-6 transition-colors hover:border-accent/45">
                  <Quote className="text-accent" size={30} />
                  <div className="mt-6 flex gap-1 text-accent">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star fill="currentColor" size={16} key={index} />
                    ))}
                  </div>
                  <p className="mt-5 leading-7 text-muted">{item.quote}</p>
                  <strong className="mt-6 block">{item.name}</strong>
                  <span className="text-sm text-muted">{item.role}</span>
                </div>
              </MotionItem>
            ))}
          </MotionGroup>
        </div>
      </section>}

      {settings.showFaq && <section className="border-y border-line bg-surface px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="section-kicker">{content.faqEyebrow}</p>
            <h2 className="section-title">{content.faqTitle}</h2>
          </div>
          <MotionGroup className="grid gap-3" staggerChildren={0.07}>
            {publicFaqs.map((item) => (
              <MotionItem key={item.id}>
                <details className="group rounded-md border border-line bg-background p-5">
                  <summary className="cursor-pointer list-none text-lg font-bold">
                    {item.question}
                  </summary>
                  <p className="mt-4 leading-7 text-muted">{item.answer}</p>
                </details>
              </MotionItem>
            ))}
          </MotionGroup>
        </div>
      </section>}

      {settings.showContact && <section id="contact" className="bg-foreground px-5 py-24 text-background md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="section-kicker text-accent">{content.contactEyebrow}</p>
            <h2 className="font-serif text-4xl font-bold md:text-6xl">{content.contactTitle}</h2>
            <p className="mt-6 leading-8 text-background/72">{content.contactCopy}</p>
            <div className="mt-8 grid gap-3">
              {requestMethods.map((method) => {
                const ContactIcon =
                  publicContactIcons[
                    method.key as keyof typeof publicContactIcons
                  ] ?? CheckCircle2;
                const detail = publicContactDetails[method.key];

                return (
                  <a
                    href={method.href}
                    className="flex min-h-12 items-start gap-3 rounded-md border border-background/18 px-4 py-3 font-bold transition hover:border-accent hover:text-accent"
                    key={method.key}
                  >
                    <ContactIcon
                      className="size-5 h-lh shrink-0"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-base/7 sm:text-sm/6">
                        {t(`contact.methods.${method.key}`)}
                      </p>
                      {detail && (
                        <p className="break-all text-base/7 font-normal text-background/68 sm:text-sm/6">
                          {detail}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
            <p className="mt-8 inline-flex items-center gap-2 text-sm text-background/62">
              <MapPin size={16} />
              {content.location}
            </p>
            {content.address && (
              <p className="mt-3 text-sm text-background/62">{content.address}</p>
            )}
            {mapEmbedUrl && (
              <div className="mt-6 overflow-hidden rounded-md border border-background/18">
                <iframe
                  title={content.address || content.location}
                  src={mapEmbedUrl}
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
          <div className="rounded-md bg-background p-5 text-foreground md:p-8">
            <RequestForm />
          </div>
        </div>
      </section>}

      <footer className="bg-background px-5 py-10 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 border-t border-line pt-8 md:grid-cols-[1fr_auto_auto] md:items-end">
          <div>
            <strong className="font-serif text-2xl">{content.brandName}</strong>
            <p className="mt-2 text-sm text-muted">{content.footerCopy}</p>
          </div>
          <address className="grid min-w-0 gap-2 not-italic">
            <a
              href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
              className="flex min-w-0 items-center gap-2 font-normal text-muted hover:text-foreground"
              aria-label={`${t("contact.methods.phone")}: ${settings.phone}`}
            >
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 break-all">{settings.phone}</span>
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="flex min-w-0 items-center gap-2 font-normal text-muted hover:text-foreground"
              aria-label={`${t("contact.methods.email")}: ${settings.email}`}
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 break-all">{settings.email}</span>
            </a>
          </address>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/privacy"
              className="flex min-h-11 items-center px-2 text-sm font-normal text-muted underline decoration-line underline-offset-4 hover:text-foreground"
            >
              {t("footer.privacy")}
            </Link>
            {socials.map((social) => (
              (() => {
                const Icon =
                  socialIcons[social.key as keyof typeof socialIcons];
                const label = t(`footer.socials.${social.key}`);

                return (
                  <a
                    aria-label={label}
                    title={label}
                    className="relative inline-flex size-11 items-center justify-center rounded-full border border-line hover:border-accent hover:text-accent"
                    href={social.href}
                    key={social.key}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon className="size-5 shrink-0" aria-hidden="true" />
                    <span
                      className="absolute left-1/2 top-1/2 size-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
                      aria-hidden="true"
                    />
                  </a>
                );
              })()
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
