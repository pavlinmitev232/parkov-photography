import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { revalidatePublicHomeData } from "@/lib/public-home-data";
import { pricingPackageSchema } from "@/lib/validations/site-content";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = pricingPackageSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid package" }, { status: 400 });
  }

  const lastItem = await prisma.pricingPackage.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  try {
    const pricingPackage = await prisma.pricingPackage.create({
      data: {
        ...parsed.data,
        featured: parsed.data.featured ?? false,
        visible: parsed.data.visible ?? true,
        sortOrder: (lastItem?.sortOrder ?? 0) + 1,
      },
    });
    revalidatePublicHomeData();
    return NextResponse.json({ ok: true, pricingPackage });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Package key already exists" },
      { status: 409 },
    );
  }
}
