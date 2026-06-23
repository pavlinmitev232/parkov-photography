import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ReviewsFaqManager } from "@/components/reviews-faq-manager";
import { SiteSettingsForm } from "@/components/site-settings-form";
import { Link } from "@/i18n/routing";
import { adminPath } from "@/lib/admin-path";
import { requireOwnerSession } from "@/lib/auth/owner-session";
import {
  ensureDefaultReviewsAndFaqs,
  getOwnerReviewsAndFaqs,
} from "@/lib/reviews-faq";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireOwnerSession(locale);
  await ensureDefaultReviewsAndFaqs();
  const t = await getTranslations("adminSettings");
  const [settings, repeated] = await Promise.all([
    getSiteSettings(),
    getOwnerReviewsAndFaqs(),
  ]);

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
        <SiteSettingsForm initialSettings={settings} />
        <div className="my-14 border-t border-line" />
        <div className="mb-6">
          <p className="section-kicker">{t("repeatedEyebrow")}</p>
          <h2 className="font-serif text-4xl font-bold">{t("repeatedTitle")}</h2>
        </div>
        <ReviewsFaqManager
          testimonials={repeated.testimonials}
          faqs={repeated.faqs}
        />
      </div>
    </main>
  );
}
