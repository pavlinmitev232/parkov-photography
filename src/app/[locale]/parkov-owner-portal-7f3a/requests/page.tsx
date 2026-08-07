import { ArrowLeft, Inbox } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AdminPagination } from "@/components/admin-pagination";
import { InquiryStatusSelect } from "@/components/inquiry-status-select";
import { InquiryReplyAction } from "@/components/inquiry-reply-action";
import { InquiryDeleteAction } from "@/components/inquiry-delete-action";
import { Link } from "@/i18n/routing";
import { requireOwnerSession } from "@/lib/auth/owner-session";
import { adminPath } from "@/lib/admin-path";
import {
  decodeDateCursor,
  encodeDateCursor,
  getSearchParam,
} from "@/lib/admin-pagination";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage({
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
  const t = await getTranslations("adminRequests");
  const requestT = await getTranslations("request");
  const serviceKeys = [
    "wedding",
    "portrait",
    "event",
    "product",
    "business",
    "realEstate",
    "family",
    "other",
  ];
  const pageSize = 50;
  const cursor = decodeDateCursor(getSearchParam(query.cursor));
  const direction =
    getSearchParam(query.direction) === "previous" ? "previous" : "next";
  const cursorWhere: Prisma.InquiryWhereInput | undefined = cursor
    ? direction === "previous"
      ? {
          OR: [
            { createdAt: { gt: cursor.date } },
            { createdAt: cursor.date, id: { gt: cursor.id } },
          ],
        }
      : {
          OR: [
            { createdAt: { lt: cursor.date } },
            { createdAt: cursor.date, id: { lt: cursor.id } },
          ],
        }
    : undefined;
  const [totalInquiries, pageInquiries] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.findMany({
      where: cursorWhere,
      orderBy:
        cursor && direction === "previous"
          ? [{ createdAt: "asc" }, { id: "asc" }]
          : [{ createdAt: "desc" }, { id: "desc" }],
      take: pageSize,
    }),
  ]);
  const inquiries =
    cursor && direction === "previous" ? pageInquiries.reverse() : pageInquiries;

  if (cursor && inquiries.length === 0 && totalInquiries > 0) {
    redirect(`/${locale}${adminPath}/requests`);
  }

  const firstInquiry = inquiries[0];
  const lastInquiry = inquiries.at(-1);
  const [hasNewerInquiries, hasOlderInquiries] = await Promise.all([
    firstInquiry
      ? prisma.inquiry.findFirst({
          where: {
            OR: [
              { createdAt: { gt: firstInquiry.createdAt } },
              {
                createdAt: firstInquiry.createdAt,
                id: { gt: firstInquiry.id },
              },
            ],
          },
          select: { id: true },
        })
      : null,
    lastInquiry
      ? prisma.inquiry.findFirst({
          where: {
            OR: [
              { createdAt: { lt: lastInquiry.createdAt } },
              {
                createdAt: lastInquiry.createdAt,
                id: { lt: lastInquiry.id },
              },
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

        {inquiries.length === 0 ? (
          <div className="rounded-md border border-line bg-background p-10 text-center">
            <Inbox className="mx-auto text-accent" size={36} />
            <h2 className="mt-5 text-2xl font-bold">{t("emptyTitle")}</h2>
            <p className="mt-3 text-muted">{t("emptyCopy")}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-line bg-background">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1020px] border-collapse text-left text-sm">
                <thead className="bg-surface text-xs uppercase tracking-[0.16em] text-muted">
                  <tr>
                    <th className="whitespace-nowrap px-5 py-4">
                      {t("table.actions")}
                    </th>
                    <th className="px-5 py-4">{t("table.client")}</th>
                    <th className="px-5 py-4">{t("table.service")}</th>
                    <th className="px-5 py-4">{t("table.contact")}</th>
                    <th className="px-5 py-4">{t("table.location")}</th>
                    <th className="px-5 py-4">{t("table.date")}</th>
                    <th className="px-5 py-4">{t("table.status")}</th>
                    <th className="px-5 py-4">{t("table.reply")}</th>
                    <th className="px-5 py-4">{t("table.message")}</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr className="border-t border-line align-top" key={inquiry.id}>
                      <td className="px-5 py-4">
                        <InquiryDeleteAction
                          inquiryId={inquiry.id}
                          customerName={inquiry.name}
                        />
                      </td>
                      <td className="px-5 py-4">
                        <strong className="block">{inquiry.name}</strong>
                        <a className="block text-muted hover:text-accent" href={`mailto:${inquiry.email}`}>
                          {inquiry.email}
                        </a>
                        <a className="block text-muted hover:text-accent" href={`tel:${inquiry.phone}`}>
                          {inquiry.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4 font-bold">
                        {serviceKeys.includes(inquiry.service)
                          ? requestT(`services.${inquiry.service}`)
                          : inquiry.service}
                      </td>
                      <td className="px-5 py-4">
                        {inquiry.preferredContact
                          ? t(`contactMethods.${inquiry.preferredContact}`)
                          : t("noContact")}
                      </td>
                      <td className="px-5 py-4">{inquiry.location}</td>
                      <td className="px-5 py-4">
                        {inquiry.preferredDate
                          ? new Intl.DateTimeFormat(
                              locale === "bg" ? "bg-BG" : "en-GB",
                            ).format(inquiry.preferredDate)
                          : t("noDate")}
                      </td>
                      <td className="px-5 py-4">
                        <InquiryStatusSelect
                          inquiryId={inquiry.id}
                          status={inquiry.status}
                        />
                      </td>
                      <td className="min-w-72 px-5 py-4">
                        {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) ? (
                          <InquiryReplyAction
                            inquiryId={inquiry.id}
                            customerName={inquiry.name}
                            email={inquiry.email}
                            service={
                              serviceKeys.includes(inquiry.service)
                                ? requestT(`services.${inquiry.service}`)
                                : inquiry.service
                            }
                            preferredDate={
                              inquiry.preferredDate
                                ? new Intl.DateTimeFormat(
                                    locale === "bg" ? "bg-BG" : "en-GB",
                                  ).format(inquiry.preferredDate)
                                : null
                            }
                          />
                        ) : (
                          <p className="text-muted">{t("reply.noEmail")}</p>
                        )}
                      </td>
                      <td className="max-w-md px-5 py-4 leading-6 text-muted">
                        {inquiry.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination
              basePath={`${adminPath}/requests`}
              previousCursor={
                hasNewerInquiries && firstInquiry
                  ? encodeDateCursor(firstInquiry.createdAt, firstInquiry.id)
                  : null
              }
              nextCursor={
                hasOlderInquiries && lastInquiry
                  ? encodeDateCursor(lastInquiry.createdAt, lastInquiry.id)
                  : null
              }
              previousLabel={t("pagination.newer")}
              nextLabel={t("pagination.older")}
              summary={t("pagination.summary", {
                shown: inquiries.length,
                total: totalInquiries,
              })}
              ariaLabel={t("pagination.label")}
            />
          </div>
        )}
      </div>
    </main>
  );
}
