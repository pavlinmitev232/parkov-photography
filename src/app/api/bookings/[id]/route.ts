import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { bookingUpdateSchema } from "@/lib/validations/booking";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bookingUpdateSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid booking" },
      { status: 400 },
    );
  }

  const { id } = await params;
  const booking = await prisma.booking.update({
    where: { id },
    data: {
      ...parsed.data,
      inquiryId:
        parsed.data.inquiryId === undefined
          ? undefined
          : parsed.data.inquiryId || null,
      endAt:
        parsed.data.endAt === undefined ? undefined : parsed.data.endAt || null,
      notes:
        parsed.data.notes === undefined ? undefined : parsed.data.notes || null,
    },
  });

  return NextResponse.json({ ok: true, booking });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
