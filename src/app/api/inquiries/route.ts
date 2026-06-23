import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { sendInquiryNotification } from "@/lib/email/inquiry-notification";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { inquirySchema } from "@/lib/validations/inquiry";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);

  if (contentLength > 16_000) {
    return NextResponse.json(
      { ok: false, error: "Request is too large" },
      { status: 413 },
    );
  }

  const ip = getClientIp(request);
  const limit = rateLimit({
    key: `inquiry:${ip}`,
    limit: 5,
    windowMs: 1000 * 60 * 15,
  });

  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many inquiry attempts" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid inquiry data" },
      { status: 400 },
    );
  }

  if (parsed.data.companyWebsite) {
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.startedAt && Date.now() - parsed.data.startedAt < 2500) {
    return NextResponse.json(
      { ok: false, error: "Please try again" },
      { status: 400 },
    );
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      service: parsed.data.service,
      preferredDate: parsed.data.date ? new Date(parsed.data.date) : null,
      location: parsed.data.location,
      message: parsed.data.message,
      preferredContact: parsed.data.preferredContact || null,
    },
    select: {
      id: true,
      createdAt: true,
    },
  });

  await sendInquiryNotification(parsed.data, inquiry).catch((error) => {
    console.error("Failed to send inquiry notification", error);
  });

  return NextResponse.json({ ok: true, inquiry });
}
