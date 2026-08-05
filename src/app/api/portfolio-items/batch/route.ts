import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { revalidatePublicHomeData } from "@/lib/public-home-data";
import { deleteManagedImage } from "@/lib/storage/image-storage";
import { portfolioItemBatchSchema } from "@/lib/validations/portfolio";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getOwnerSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = portfolioItemBatchSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid portfolio batch" },
      { status: 400 },
    );
  }

  const { imageUrls, ...metadata } = parsed.data;

  try {
    const lastItem = await prisma.portfolioItem.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    const firstSortOrder = (lastItem?.sortOrder ?? 0) + 1;
    const data = {
      ...metadata,
      description: metadata.description || null,
      location: metadata.location || null,
      shootYear: metadata.shootYear || null,
      clientType: metadata.clientType || null,
      featured: metadata.featured ?? false,
      showOnHome: metadata.showOnHome ?? true,
    };
    const items = await prisma.$transaction(
      imageUrls.map((imageUrl, index) =>
        prisma.portfolioItem.create({
          data: {
            ...data,
            imageUrl,
            sortOrder: firstSortOrder + index,
          },
        }),
      ),
    );

    revalidatePublicHomeData();
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    await Promise.all(
      imageUrls.map((url) => deleteManagedImage(url, "portfolio")),
    );
    console.error("Portfolio batch creation failed.", { error });
    return NextResponse.json(
      { ok: false, error: "Portfolio batch creation failed" },
      { status: 500 },
    );
  }
}
