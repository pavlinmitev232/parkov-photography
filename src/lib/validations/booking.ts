import { z } from "zod";

const optionalContact = z.string().trim().max(200).default("");

const bookingBaseSchema = z.object({
  inquiryId: z.string().trim().min(1).nullable().optional(),
  customerName: z.string().trim().min(2).max(160),
  email: optionalContact.refine(
    (value) => !value || z.email().safeParse(value).success,
    "email",
  ),
  phone: z.string().trim().max(60).default(""),
  service: z.string().trim().min(1).max(120),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().nullable().optional(),
  location: z.string().trim().min(2).max(300),
  notes: z.string().trim().max(2000).default(""),
  status: z.enum(["tentative", "confirmed", "completed", "cancelled"]),
});

export const bookingSchema = bookingBaseSchema
  .refine(
    ({ startAt, endAt }) => !endAt || endAt.getTime() > startAt.getTime(),
    { path: ["endAt"], message: "endAt" },
  );

export const bookingUpdateSchema = bookingBaseSchema.partial().refine(
  ({ startAt, endAt }) =>
    !startAt || !endAt || endAt.getTime() > startAt.getTime(),
  { path: ["endAt"], message: "endAt" },
);

export type BookingValues = z.input<typeof bookingSchema>;
