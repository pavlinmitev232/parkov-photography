import { unlink } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";

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
