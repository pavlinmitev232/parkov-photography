import { Lock, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { OwnerLogoutButton } from "@/components/owner-logout-button";
import { Link } from "@/i18n/routing";
import { requireOwnerSession } from "@/lib/auth/owner-session";
import { adminPath } from "@/lib/admin-path";
import { adminCards } from "@/lib/site-data";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireOwnerSession(locale);
  const t = await getTranslations("admin");
  const cardLinks: Record<string, string> = {
    photos: `${adminPath}/portfolio`,
    categories: `${adminPath}/categories`,
    services: `${adminPath}/content`,
    requests: `${adminPath}/requests`,
    bookings: `${adminPath}/bookings`,
    settings: `${adminPath}/settings`,
  };

  return (
    <main className="min-h-screen bg-surface px-5 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker">{t("eyebrow")}</p>
            <h1 className="font-serif text-4xl font-bold md:text-6xl">{t("title")}</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-md border border-line bg-background px-4 py-3 text-sm font-bold"
            >
              {t("viewSite")}
            </Link>
            <OwnerLogoutButton />
          </div>
        </div>
        <div className="mb-6 rounded-md border border-line bg-background p-5">
          <div className="flex items-start gap-3">
            <Lock className="mt-1 text-accent" size={20} />
            <p className="text-sm leading-6 text-muted">{t("authNote")}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {adminCards.map(({ key, icon: Icon }) => (
            <div className="rounded-md border border-line bg-background p-6" key={key}>
              <Icon className="mb-8 text-accent" size={30} />
              <h2 className="text-2xl font-bold">{t(`cards.${key}.title`)}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{t(`cards.${key}.copy`)}</p>
              <Link
                href={cardLinks[key] ?? adminPath}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-bold text-accent-foreground"
              >
                <Plus size={16} />
                {t("manage")}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
