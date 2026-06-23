import { z } from "zod";

const localPortfolioImagePath = /^\/uploads\/portfolio\/[A-Za-z0-9._-]+\.(avif|jpg|jpeg|png|webp)$/;

export const portfolioItemSchema = z.object({
  titleBg: z.string().trim().min(2),
  titleEn: z.string().trim().min(2),
  category: z.string().trim().min(1),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (value) => z.string().url().safeParse(value).success || localPortfolioImagePath.test(value),
    ),
  description: z.string().trim().optional(),
  location: z.string().trim().optional(),
  shootYear: z.coerce
    .number()
    .int()
    .min(2000)
    .max(2100)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  clientType: z.string().trim().optional(),
  featured: z.boolean().optional(),
  showOnHome: z.boolean().optional(),
});

export type PortfolioItemFormValues = z.input<typeof portfolioItemSchema>;
export type PortfolioItemValues = z.output<typeof portfolioItemSchema>;
