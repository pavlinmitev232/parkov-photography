import { z } from "zod";

export const portfolioCategorySchema = z.object({
  key: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[a-z][a-zA-Z0-9-]*$/),
  labelBg: z.string().trim().min(2).max(80),
  labelEn: z.string().trim().min(2).max(80),
  visible: z.boolean().optional(),
});

export const portfolioCategoryUpdateSchema = z.object({
  labelBg: z.string().trim().min(2).max(80).optional(),
  labelEn: z.string().trim().min(2).max(80).optional(),
  visible: z.boolean().optional(),
  direction: z.enum(["up", "down"]).optional(),
});

export type PortfolioCategoryValues = z.infer<typeof portfolioCategorySchema>;
