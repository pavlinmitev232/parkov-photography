import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { portfolioCategoryUpdateSchema } from "@/lib/validations/portfolio-category";

export const runtime = "nodejs";

async function swapCategoryOrder(id: string, direction: "up" | "down") {
  const current = await prisma.portfolioCategory.findUnique({
    where: { id },
    select: { id: true, sortOrder: true },
  });

  if (!current) {
    return null;
  }

  const sibling = await prisma.portfolioCategory.findFirst({
    where:
      direction === "up"
        ? { sortOrder: { lt: current.sortOrder } }
        : { sortOrder: { gt: current.sortOrder } },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
    select: { id: true, sortOrder: true },
  });

  if (!sibling) {
    return current;
  }

  await prisma.$transaction([
    prisma.portfolioCategory.update({
      where: { id: current.id },
      data: { sortOrder: sibling.sortOrder },
    }),
    prisma.portfolioCategory.update({
      where: { id: sibling.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);

  return current;
}

async function normalizeCategoryOrder() {
  const categories = await prisma.portfolioCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });

  await prisma.$transaction(
    categories.map((category, index) =>
      prisma.portfolioCategory.update({
        where: { id: category.id },
        data: { sortOrder: index + 1 },
      }),
    ),
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getOwnerSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = portfolioCategoryUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid portfolio category update" },
      { status: 400 },
    );
  }

  if (parsed.data.direction) {
    await swapCategoryOrder(id, parsed.data.direction);
    return NextResponse.json({ ok: true });
  }

  const { labelBg, labelEn, visible } = parsed.data;

  await prisma.portfolioCategory.update({
    where: { id },
    data: {
      ...(labelBg ? { labelBg } : {}),
      ...(labelEn ? { labelEn } : {}),
      ...(typeof visible === "boolean" ? { visible } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getOwnerSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const category = await prisma.portfolioCategory.findUnique({
    where: { id },
    select: { key: true },
  });

  if (!category) {
    return NextResponse.json({ ok: true });
  }

  const usedCount = await prisma.portfolioItem.count({
    where: { category: category.key },
  });

  if (usedCount > 0) {
    return NextResponse.json(
      { ok: false, error: "Category is used by portfolio items" },
      { status: 409 },
    );
  }

  await prisma.portfolioCategory.delete({ where: { id } });
  await normalizeCategoryOrder();

  return NextResponse.json({ ok: true });
}
