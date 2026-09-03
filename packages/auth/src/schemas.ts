import { z } from "zod";

export const magicLinkLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const magicLinkSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  fullName: z.string().min(2, "Name must be at least 2 characters.").max(100),
});

export type MagicLinkLoginInput = z.infer<typeof magicLinkLoginSchema>;
export type MagicLinkSignupInput = z.infer<typeof magicLinkSignupSchema>;
