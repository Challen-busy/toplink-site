import { z } from "zod";

export const inquirySchema = z.object({
  source: z
    .enum(["product", "contact", "home-cta", "rfq"])
    .default("contact"),
  productId: z.string().optional().nullable(),
  name: z.string().min(2, "Please enter your name").max(120),
  company: z.string().max(200).optional().default(""),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().max(40).optional().default(""),
  country: z.string().max(100).optional().default(""),
  quantity: z.string().max(100).optional().default(""),
  message: z.string().min(10, "Please tell us a bit more about your project").max(4000),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
