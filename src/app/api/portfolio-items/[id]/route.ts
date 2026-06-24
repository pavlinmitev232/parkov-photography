import { unlink } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { portfolioItemSchema } from "@/lib/validations/portfolio";

export const runtime = "nodejs";

const localPortfolioUploadPrefix = "/uploads/portfolio/";

async function deleteLocalPortfolioImage(imageUrl: string) {
  if (!imageUrl.startsWith(localPortfolioUploadPrefix)) {
    return;
  }

  const fileName = path.basename(imageUrl);
  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "portfolio",
    fileName,
  );

  await unlink(filePath).catch(() => undefined);
}

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
    await deleteLocalPortfolioImage(current.imageUrl);
  }

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
  await deleteLocalPortfolioImage(item.imageUrl);

  return NextResponse.json({ ok: true });
}
