import { z } from "zod";

const shortText = z.string().trim().min(1).max(180);
const longText = z.string().trim().min(1).max(1000);
const optionalUrl = z.union([z.literal(""), z.string().trim().url().max(500)]);
const imageValue = z.string().trim().min(1).max(1000);

export const siteSettingsSchema = z.object({
  brandName: shortText,
  phone: z.string().trim().min(3).max(40),
  email: z.string().trim().email().max(200),
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  heroImageUrl: imageValue,
  aboutImageUrl: imageValue,
  logoImageUrl: z.string().trim().max(1000),
  seoTitleBg: shortText,
  seoTitleEn: shortText,
  seoDescriptionBg: longText,
  seoDescriptionEn: longText,
  heroEyebrowBg: shortText,
  heroEyebrowEn: shortText,
  heroTitleBg: shortText,
  heroTitleEn: shortText,
  heroCopyBg: longText,
  heroCopyEn: longText,
  aboutEyebrowBg: shortText,
  aboutEyebrowEn: shortText,
  aboutTitleBg: shortText,
  aboutTitleEn: shortText,
  aboutCopyBg: longText,
  aboutCopyEn: longText,
  servicesEyebrowBg: shortText,
  servicesEyebrowEn: shortText,
  servicesTitleBg: shortText,
  servicesTitleEn: shortText,
  packagesEyebrowBg: shortText,
  packagesEyebrowEn: shortText,
  packagesTitleBg: shortText,
  packagesTitleEn: shortText,
  packagesCopyBg: longText,
  packagesCopyEn: longText,
  testimonialsEyebrowBg: shortText,
  testimonialsEyebrowEn: shortText,
  testimonialsTitleBg: shortText,
  testimonialsTitleEn: shortText,
  faqEyebrowBg: shortText,
  faqEyebrowEn: shortText,
  faqTitleBg: shortText,
  faqTitleEn: shortText,
  contactEyebrowBg: shortText,
  contactEyebrowEn: shortText,
  contactTitleBg: shortText,
  contactTitleEn: shortText,
  contactCopyBg: longText,
  contactCopyEn: longText,
  locationBg: shortText,
  locationEn: shortText,
  footerCopyBg: longText,
  footerCopyEn: longText,
  showAbout: z.boolean(),
  showServices: z.boolean(),
  showProcess: z.boolean(),
  showPricing: z.boolean(),
  showTestimonials: z.boolean(),
  showFaq: z.boolean(),
  showContact: z.boolean(),
});

export const testimonialSchema = z.object({
  nameBg: shortText,
  nameEn: shortText,
  roleBg: shortText,
  roleEn: shortText,
  quoteBg: longText,
  quoteEn: longText,
  visible: z.boolean().optional(),
});

export const testimonialUpdateSchema = testimonialSchema
  .partial()
  .extend({ direction: z.enum(["up", "down"]).optional() });

export const faqItemSchema = z.object({
  questionBg: shortText,
  questionEn: shortText,
  answerBg: longText,
  answerEn: longText,
  visible: z.boolean().optional(),
});

export const faqItemUpdateSchema = faqItemSchema
  .partial()
  .extend({ direction: z.enum(["up", "down"]).optional() });

export type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;
export type TestimonialValues = z.infer<typeof testimonialSchema>;
export type FaqItemValues = z.infer<typeof faqItemSchema>;
