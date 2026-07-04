import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { revalidatePublicHomeData } from "@/lib/public-home-data";
import { deleteManagedImage } from "@/lib/storage/image-storage";
import { portfolioItemSchema } from "@/lib/validations/portfolio";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getOwnerSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = portfolioItemSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid portfolio item" },
      { status: 400 },
    );
  }

  const { id } = await params;
  const current = await prisma.portfolioItem.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  if (!current) {
    return NextResponse.json(
      { ok: false, error: "Portfolio item not found" },
      { status: 404 },
    );
  }

  const item = await prisma.portfolioItem.update({
    where: { id },
    data: {
      ...parsed.data,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      shootYear: parsed.data.shootYear || null,
      clientType: parsed.data.clientType || null,
      featured: parsed.data.featured ?? false,
      showOnHome: parsed.data.showOnHome ?? true,
    },
  });

  if (current.imageUrl !== item.imageUrl) {
    await deleteManagedImage(current.imageUrl, "portfolio");
  }
  revalidatePublicHomeData();

  return NextResponse.json({ ok: true, item });
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

  const item = await prisma.portfolioItem.delete({
    where: { id },
    select: { imageUrl: true },
  });
  await deleteManagedImage(item.imageUrl, "portfolio");
  revalidatePublicHomeData();

  return NextResponse.json({ ok: true });
}
