import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { InquiryValues } from "@/lib/validations/inquiry";

type SavedInquiry = {
  id: string;
  createdAt: Date;
};

function hasSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.INQUIRY_TO_EMAIL,
  );
}

function hasResendConfig() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.INQUIRY_TO_EMAIL,
  );
}

function getReplyTo(inquiry: InquiryValues) {
  return inquiry.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)
    ? inquiry.email
    : undefined;
}

function formatOptional(value: string | undefined | null) {
  return value?.trim() ? value : "Not specified";
}

function buildTextEmail(inquiry: InquiryValues, savedInquiry: SavedInquiry) {
  return [
    "New Parkov photography inquiry",
    "",
    `Inquiry ID: ${savedInquiry.id}`,
    `Created: ${savedInquiry.createdAt.toISOString()}`,
    "",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    `Preferred contact: ${formatOptional(inquiry.preferredContact)}`,
    `Service: ${inquiry.service}`,
    `Preferred date: ${formatOptional(inquiry.date)}`,
    `Location: ${inquiry.location}`,
    "",
    "Message:",
    inquiry.message,
  ].join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildHtmlEmail(inquiry: InquiryValues, savedInquiry: SavedInquiry) {
  const rows = [
    ["Inquiry ID", savedInquiry.id],
    ["Created", savedInquiry.createdAt.toISOString()],
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Preferred contact", formatOptional(inquiry.preferredContact)],
    ["Service", inquiry.service],
    ["Preferred date", formatOptional(inquiry.date)],
    ["Location", inquiry.location],
  ];

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.55; color: #181512;">
      <h1 style="margin: 0 0 16px;">New Parkov photography inquiry</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 180px; background: #f8f6f1;">${escapeHtml(label)}</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
      <h2 style="margin: 24px 0 8px;">Message</h2>
      <p style="white-space: pre-wrap;">${escapeHtml(inquiry.message)}</p>
    </div>
  `;
}

export async function sendInquiryNotification(
  inquiry: InquiryValues,
  savedInquiry: SavedInquiry,
) {
  if (hasResendConfig()) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send(
      {
        from: `Parkov <${process.env.RESEND_FROM_EMAIL}>`,
        to: [process.env.INQUIRY_TO_EMAIL as string],
        replyTo: getReplyTo(inquiry),
        subject: `New Parkov inquiry: ${inquiry.service} from ${inquiry.name}`,
        text: buildTextEmail(inquiry, savedInquiry),
        html: buildHtmlEmail(inquiry, savedInquiry),
        tags: [
          { name: "email_type", value: "inquiry_notification" },
          { name: "inquiry_id", value: savedInquiry.id },
        ],
      },
      {
        idempotencyKey: `inquiry-notification/${savedInquiry.id}`,
      },
    );

    if (error) {
      throw new Error(`Resend notification failed: ${error.message}`);
    }

    return { skipped: false, provider: "resend" as const, id: data?.id };
  }

  if (!hasSmtpConfig()) {
    console.info(
      `Skipping inquiry email notification for ${savedInquiry.id}: Resend and SMTP are not configured.`,
    );
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    to: process.env.INQUIRY_TO_EMAIL,
    replyTo: getReplyTo(inquiry),
    subject: `New Parkov inquiry: ${inquiry.service} from ${inquiry.name}`,
    text: buildTextEmail(inquiry, savedInquiry),
    html: buildHtmlEmail(inquiry, savedInquiry),
  });

  return { skipped: false, provider: "smtp" as const };
}
