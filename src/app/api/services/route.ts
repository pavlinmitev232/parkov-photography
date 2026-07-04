import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { revalidatePublicHomeData } from "@/lib/public-home-data";
import { serviceItemSchema } from "@/lib/validations/site-content";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = serviceItemSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid service" }, { status: 400 });
  }

  const lastItem = await prisma.serviceItem.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  try {
    const service = await prisma.serviceItem.create({
      data: {
        ...parsed.data,
        visible: parsed.data.visible ?? true,
        sortOrder: (lastItem?.sortOrder ?? 0) + 1,
      },
    });
    revalidatePublicHomeData();
    return NextResponse.json({ ok: true, service });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Service key already exists" },
      { status: 409 },
    );
  }
}
