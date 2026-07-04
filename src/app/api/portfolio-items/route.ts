import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { revalidatePublicHomeData } from "@/lib/public-home-data";
import { portfolioItemSchema } from "@/lib/validations/portfolio";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getOwnerSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = portfolioItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid portfolio item" },
      { status: 400 },
    );
  }

  const lastItem = await prisma.portfolioItem.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const item = await prisma.portfolioItem.create({
    data: {
      ...parsed.data,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      shootYear: parsed.data.shootYear || null,
      clientType: parsed.data.clientType || null,
      featured: parsed.data.featured ?? false,
      showOnHome: parsed.data.showOnHome ?? true,
      sortOrder: (lastItem?.sortOrder ?? 0) + 1,
    },
  });
  revalidatePublicHomeData();

  return NextResponse.json({ ok: true, item });
}
