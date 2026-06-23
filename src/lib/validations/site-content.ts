import { z } from "zod";

const contentKey = z
  .string()
  .trim()
  .min(2)
  .max(40)
  .regex(/^[a-z][a-zA-Z0-9-]*$/);

export const serviceIconKeys = [
  "heart",
  "camera",
  "party",
  "gem",
  "building",
  "home",
  "users",
  "sparkles",
] as const;

export const serviceItemSchema = z.object({
  key: contentKey,
  titleBg: z.string().trim().min(2).max(100),
  titleEn: z.string().trim().min(2).max(100),
  copyBg: z.string().trim().min(10).max(500),
  copyEn: z.string().trim().min(10).max(500),
  icon: z.enum(serviceIconKeys),
  visible: z.boolean().optional(),
});

export const serviceItemUpdateSchema = serviceItemSchema
  .omit({ key: true })
  .partial()
  .extend({ direction: z.enum(["up", "down"]).optional() });

export const pricingPackageSchema = z.object({
  key: contentKey,
  titleBg: z.string().trim().min(2).max(100),
  titleEn: z.string().trim().min(2).max(100),
  copyBg: z.string().trim().min(10).max(500),
  copyEn: z.string().trim().min(10).max(500),
  priceBg: z.string().trim().min(2).max(100),
  priceEn: z.string().trim().min(2).max(100),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
});

export const pricingPackageUpdateSchema = pricingPackageSchema
  .omit({ key: true })
  .partial()
  .extend({ direction: z.enum(["up", "down"]).optional() });

export type ServiceItemValues = z.infer<typeof serviceItemSchema>;
export type PricingPackageValues = z.infer<typeof pricingPackageSchema>;
