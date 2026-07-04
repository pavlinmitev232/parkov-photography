import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { revalidatePublicHomeData } from "@/lib/public-home-data";
import { testimonialUpdateSchema } from "@/lib/validations/site-settings";

async function reorder(id: string, direction: "up" | "down") {
  const current = await prisma.testimonial.findUnique({ where: { id } });
  if (!current) return;
  const sibling = await prisma.testimonial.findFirst({
    where:
      direction === "up"
        ? { sortOrder: { lt: current.sortOrder } }
        : { sortOrder: { gt: current.sortOrder } },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });
  if (!sibling) return;
  await prisma.$transaction([
    prisma.testimonial.update({
      where: { id },
      data: { sortOrder: sibling.sortOrder },
    }),
    prisma.testimonial.update({
      where: { id: sibling.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const parsed = testimonialUpdateSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { id } = await params;
  if (parsed.data.direction) {
    await reorder(id, parsed.data.direction);
  } else {
    const data = { ...parsed.data };
    delete data.direction;
    await prisma.testimonial.update({ where: { id }, data });
  }
  revalidatePublicHomeData();
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } }).catch(() => null);
  revalidatePublicHomeData();
  return NextResponse.json({ ok: true });
}
