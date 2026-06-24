import { z } from "zod";

const inquiryServices = [
  "wedding",
  "portrait",
  "event",
  "product",
  "business",
  "realEstate",
  "family",
  "other",
] as const;

const preferredContacts = ["phone", "viber", "whatsapp", "email"] as const;

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

const optionalDate = z
  .string()
  .refine((value) => value === "" || isValidDate(value), "date")
  .optional();

export const inquirySchema = z
  .object({
    name: z.string().trim().min(2, "name"),
    email: z.string().trim().max(200).default(""),
    phone: z.string().trim().max(40).default(""),
    service: z.enum(inquiryServices),
    preferredContact: z.enum(preferredContacts),
    date: optionalDate,
    location: z.string().trim().min(2, "location"),
    message: z.string().trim().min(10, "message"),
    companyWebsite: z.string().optional(),
    startedAt: z.number().optional(),
  })
  .superRefine((values, context) => {
    if (values.preferredContact === "email") {
      if (!values.email) {
        context.addIssue({
          code: "custom",
          path: ["email"],
          message: "emailRequired",
        });
      } else if (!z.string().email().safeParse(values.email).success) {
        context.addIssue({
          code: "custom",
          path: ["email"],
          message: "email",
        });
      }
    }

    if (
      ["phone", "viber", "whatsapp"].includes(values.preferredContact) &&
      values.phone.length < 6
    ) {
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message: "phoneRequired",
      });
    }
  });

export const inquiryStatusSchema = z.object({
  status: z.enum(["new", "contacted", "booked", "closed"]),
});

export type InquiryValues = z.infer<typeof inquirySchema>;
export type InquiryFormValues = z.input<typeof inquirySchema>;
export type InquiryStatusValues = z.infer<typeof inquiryStatusSchema>;
