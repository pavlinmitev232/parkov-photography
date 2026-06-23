import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "name"),
  email: z.string().trim().email("email"),
  phone: z.string().trim().min(6, "phone"),
  service: z.string().trim().min(1, "service"),
  preferredContact: z.string().trim().optional(),
  date: z.string().optional(),
  location: z.string().trim().min(2, "location"),
  message: z.string().trim().min(10, "message"),
  companyWebsite: z.string().optional(),
  startedAt: z.number().optional(),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["new", "contacted", "booked", "closed"]),
});

export type InquiryValues = z.infer<typeof inquirySchema>;
export type InquiryStatusValues = z.infer<typeof inquiryStatusSchema>;
