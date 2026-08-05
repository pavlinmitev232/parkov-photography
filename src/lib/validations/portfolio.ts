import { z } from "zod";

const localPortfolioImagePath = /^\/uploads\/portfolio\/[A-Za-z0-9._-]+\.(avif|jpg|jpeg|png|webp)$/;

export const maxPortfolioBatchImages = 20;

const optionalPortfolioTitle = z.string().trim().max(160).optional().default("");

export const portfolioImageUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => z.string().url().safeParse(value).success || localPortfolioImagePath.test(value),
  );

export const portfolioItemMetadataSchema = z.object({
  titleBg: optionalPortfolioTitle,
  titleEn: optionalPortfolioTitle,
  category: z.string().trim().min(1),
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

export const portfolioItemFormSchema = portfolioItemMetadataSchema.extend({
  imageUrl: portfolioImageUrlSchema.or(z.literal("")),
});

export const portfolioItemSchema = portfolioItemMetadataSchema.extend({
  imageUrl: portfolioImageUrlSchema,
});

export const portfolioItemBatchSchema = portfolioItemMetadataSchema.extend({
  imageUrls: z
    .array(portfolioImageUrlSchema)
    .min(1)
    .max(maxPortfolioBatchImages),
});

export type PortfolioItemFormValues = z.input<typeof portfolioItemFormSchema>;
export type PortfolioItemValues = z.output<typeof portfolioItemSchema>;
