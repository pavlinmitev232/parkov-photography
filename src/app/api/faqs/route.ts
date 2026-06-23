import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { faqItemSchema } from "@/lib/validations/site-settings";

export async function POST(request: Request) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const parsed = faqItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const last = await prisma.faqItem.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  const faq = await prisma.faqItem.create({
    data: {
      ...parsed.data,
      visible: parsed.data.visible ?? true,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    },
  });
  return NextResponse.json({ ok: true, faq });
}
