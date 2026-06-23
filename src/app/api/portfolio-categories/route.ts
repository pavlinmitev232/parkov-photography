import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { portfolioCategorySchema } from "@/lib/validations/portfolio-category";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getOwnerSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = portfolioCategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid portfolio category" },
      { status: 400 },
    );
  }

  const lastCategory = await prisma.portfolioCategory.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  try {
    const category = await prisma.portfolioCategory.create({
      data: {
        ...parsed.data,
        visible: parsed.data.visible ?? true,
        sortOrder: (lastCategory?.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json({ ok: true, category });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Category key already exists" },
      { status: 409 },
    );
  }
}
