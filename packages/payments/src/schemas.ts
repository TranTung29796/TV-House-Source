import { z } from "zod";

/**
 * Schema for creating a checkout session.
 */
export const createCheckoutSchema = z.object({
  variantId: z.number().int().positive(),
  userId: z.string().min(1),
  userEmail: z.string().email(),
  userName: z.string().optional(),
  workspaceId: z.string().min(1).optional(),
  productId: z.string().min(1).optional(),
  levelId: z.string().min(1).optional(),
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;

/**
 * Schema for the Lemon Squeezy webhook event payload meta.
 */
export const webhookMetaSchema = z.object({
  event_name: z.string(),
  custom_data: z
    .object({
      user_id: z.string(),
      workspace_id: z.string().optional(),
      product_id: z.string().optional(),
      level_id: z.string().optional(),
    })
    .optional(),
});

/**
 * Subscription status enum matching Lemon Squeezy statuses.
 */
export const subscriptionStatusSchema = z.enum([
  "active",
  "past_due",
  "paused",
  "cancelled",
  "expired",
  "on_trial",
  "unpaid",
]);

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
