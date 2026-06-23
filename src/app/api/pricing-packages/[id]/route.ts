import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { pricingPackageUpdateSchema } from "@/lib/validations/site-content";

export const runtime = "nodejs";

async function swapOrder(id: string, direction: "up" | "down") {
  const current = await prisma.pricingPackage.findUnique({
    where: { id },
    select: { id: true, sortOrder: true },
  });
  if (!current) return;

  const sibling = await prisma.pricingPackage.findFirst({
    where:
      direction === "up"
        ? { sortOrder: { lt: current.sortOrder } }
        : { sortOrder: { gt: current.sortOrder } },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
    select: { id: true, sortOrder: true },
  });
  if (!sibling) return;

  await prisma.$transaction([
    prisma.pricingPackage.update({
      where: { id: current.id },
      data: { sortOrder: sibling.sortOrder },
    }),
    prisma.pricingPackage.update({
      where: { id: sibling.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);
}

async function normalizeOrder() {
  const items = await prisma.pricingPackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  await prisma.$transaction(
    items.map((item, index) =>
      prisma.pricingPackage.update({
        where: { id: item.id },
        data: { sortOrder: index + 1 },
      }),
    ),
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = pricingPackageUpdateSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid package update" },
      { status: 400 },
    );
  }

  if (parsed.data.direction) {
    await swapOrder(id, parsed.data.direction);
  } else {
    const data = { ...parsed.data };
    delete data.direction;
    await prisma.pricingPackage.update({ where: { id }, data });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.pricingPackage.delete({ where: { id } }).catch(() => null);
  await normalizeOrder();
  return NextResponse.json({ ok: true });
}
