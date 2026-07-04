import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { revalidatePublicHomeData } from "@/lib/public-home-data";
import { serviceItemUpdateSchema } from "@/lib/validations/site-content";

export const runtime = "nodejs";

async function swapOrder(id: string, direction: "up" | "down") {
  const current = await prisma.serviceItem.findUnique({
    where: { id },
    select: { id: true, sortOrder: true },
  });
  if (!current) return;

  const sibling = await prisma.serviceItem.findFirst({
    where:
      direction === "up"
        ? { sortOrder: { lt: current.sortOrder } }
        : { sortOrder: { gt: current.sortOrder } },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
    select: { id: true, sortOrder: true },
  });
  if (!sibling) return;

  await prisma.$transaction([
    prisma.serviceItem.update({
      where: { id: current.id },
      data: { sortOrder: sibling.sortOrder },
    }),
    prisma.serviceItem.update({
      where: { id: sibling.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);
}

async function normalizeOrder() {
  const items = await prisma.serviceItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  await prisma.$transaction(
    items.map((item, index) =>
      prisma.serviceItem.update({
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
  const parsed = serviceItemUpdateSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid service update" },
      { status: 400 },
    );
  }

  if (parsed.data.direction) {
    await swapOrder(id, parsed.data.direction);
  } else {
    const data = { ...parsed.data };
    delete data.direction;
    await prisma.serviceItem.update({ where: { id }, data });
  }
  revalidatePublicHomeData();

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
  await prisma.serviceItem.delete({ where: { id } }).catch(() => null);
  await normalizeOrder();
  revalidatePublicHomeData();
  return NextResponse.json({ ok: true });
}
