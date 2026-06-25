import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BookingManager } from "@/components/booking-manager";
import { Link } from "@/i18n/routing";
import { adminPath } from "@/lib/admin-path";
import { requireOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireOwnerSession(locale);
  const t = await getTranslations("adminBookings");
  const [bookings, inquiries] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { startAt: "asc" },
      take: 250,
    }),
    prisma.inquiry.findMany({
      where: { booking: null },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <main className="min-h-screen bg-surface px-5 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href={adminPath}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4 shrink-0" />
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
        <BookingManager
          locale={locale}
          bookings={bookings.map((booking) => ({
            ...booking,
            startAt: booking.startAt.toISOString(),
            endAt: booking.endAt?.toISOString() ?? null,
            createdAt: booking.createdAt.toISOString(),
            updatedAt: booking.updatedAt.toISOString(),
          }))}
          inquiries={inquiries.map((inquiry) => ({
            id: inquiry.id,
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            service: inquiry.service,
            preferredDate: inquiry.preferredDate?.toISOString() ?? null,
            location: inquiry.location,
          }))}
        />
      </div>
    </main>
  );
}
