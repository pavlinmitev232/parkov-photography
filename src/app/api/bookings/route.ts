import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth/owner-session";
import { prisma } from "@/lib/db/prisma";
import { bookingSchema } from "@/lib/validations/booking";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getOwnerSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bookingSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid booking" },
      { status: 400 },
    );
  }

  const booking = await prisma.$transaction(async (database) => {
    const created = await database.booking.create({
      data: {
        ...parsed.data,
        inquiryId: parsed.data.inquiryId || null,
        endAt: parsed.data.endAt || null,
        notes: parsed.data.notes || null,
      },
    });

    if (created.inquiryId) {
      await database.inquiry.update({
        where: { id: created.inquiryId },
        data: { status: "booked" },
      });
    }

    return created;
  });

  return NextResponse.json({ ok: true, booking }, { status: 201 });
}
