import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getOwnerSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await prisma.inquiry.deleteMany({ where: { id } });

  if (result.count === 0) {
    return NextResponse.json(
      { ok: false, error: "Inquiry not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
