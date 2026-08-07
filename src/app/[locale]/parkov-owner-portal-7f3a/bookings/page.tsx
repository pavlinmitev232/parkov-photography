import { ArrowLeft } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AdminPagination } from "@/components/admin-pagination";
import { BookingManager } from "@/components/booking-manager";
import { Link } from "@/i18n/routing";
import { adminPath } from "@/lib/admin-path";
import {
  decodeDateCursor,
  encodeDateCursor,
  getSearchParam,
} from "@/lib/admin-pagination";
import { requireOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    cursor?: string | string[];
    direction?: string | string[];
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  await requireOwnerSession(locale);
  const t = await getTranslations("adminBookings");
  const pageSize = 50;
  const cursor = decodeDateCursor(getSearchParam(query.cursor));
  const direction =
    getSearchParam(query.direction) === "previous" ? "previous" : "next";
  const cursorWhere: Prisma.BookingWhereInput | undefined = cursor
    ? direction === "previous"
      ? {
          OR: [
            { startAt: { lt: cursor.date } },
            { startAt: cursor.date, id: { lt: cursor.id } },
          ],
        }
      : {
          OR: [
            { startAt: { gt: cursor.date } },
            { startAt: cursor.date, id: { gt: cursor.id } },
          ],
        }
    : undefined;
  const [totalBookings, pageBookings, inquiries] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.findMany({
      where: cursorWhere,
      orderBy:
        cursor && direction === "previous"
          ? [{ startAt: "desc" }, { id: "desc" }]
          : [{ startAt: "asc" }, { id: "asc" }],
      take: pageSize,
    }),
    prisma.inquiry.findMany({
      where: { booking: null },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);
  const bookings =
    cursor && direction === "previous" ? pageBookings.reverse() : pageBookings;

  if (cursor && bookings.length === 0 && totalBookings > 0) {
    redirect(`/${locale}${adminPath}/bookings`);
  }

  const firstBooking = bookings[0];
  const lastBooking = bookings.at(-1);
  const [hasEarlierBookings, hasLaterBookings] = await Promise.all([
    firstBooking
      ? prisma.booking.findFirst({
          where: {
            OR: [
              { startAt: { lt: firstBooking.startAt } },
              { startAt: firstBooking.startAt, id: { lt: firstBooking.id } },
            ],
          },
          select: { id: true },
        })
      : null,
    lastBooking
      ? prisma.booking.findFirst({
          where: {
            OR: [
              { startAt: { gt: lastBooking.startAt } },
              { startAt: lastBooking.startAt, id: { gt: lastBooking.id } },
            ],
          },
          select: { id: true },
        })
      : null,
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
        <div className="mt-8 overflow-hidden rounded-md border border-line">
          <AdminPagination
            basePath={`${adminPath}/bookings`}
            previousCursor={
              hasEarlierBookings && firstBooking
                ? encodeDateCursor(firstBooking.startAt, firstBooking.id)
                : null
            }
            nextCursor={
              hasLaterBookings && lastBooking
                ? encodeDateCursor(lastBooking.startAt, lastBooking.id)
                : null
            }
            previousLabel={t("pagination.earlier")}
            nextLabel={t("pagination.later")}
            summary={t("pagination.summary", {
              shown: bookings.length,
              total: totalBookings,
            })}
            ariaLabel={t("pagination.label")}
          />
        </div>
      </div>
    </main>
  );
}
