import { z } from "zod";

import { analytics } from "@datbuilds/analytics";

import { resolveVariantId } from "../shared/pricing-levels";
import { getProductPricingLevel } from "./pricing-catalog";
import { backendRequest } from "@/features/core/server/backend-api";
import { productConfig } from "@/config/product";

const checkoutSchema = z.object({
  levelId: z.string().min(1),
});

export type LevelCheckoutResult =
  | { success: true; url: string }
  | { success: false; status: number; error: string; issues?: unknown };

export async function createLevelCheckout(input: unknown): Promise<LevelCheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, status: 400, error: "invalid_request", issues: parsed.error.flatten() };
  }

  const level = await getProductPricingLevel(parsed.data.levelId);
  if (!level || level.interval === "free") {
    return { success: false, status: 400, error: "invalid_level" };
  }

  const variantId = resolveVariantId(level);
  const allowLocalDemoCheckout =
    process.env.NODE_ENV !== "production" &&
    (!level.providerVariantId || level.providerVariantId.startsWith("REPLACE_WITH_"));

  if (!variantId && !allowLocalDemoCheckout) {
    return { success: false, status: 503, error: `Missing payment variant for ${level.id}.` };
  }

  const successUrl = `${productConfig.websiteUrl.replace(/\/$/, "")}${productConfig.code === "" ? "/" : "/account"}?checkout=success`;
  const cancelUrl = `${productConfig.websiteUrl.replace(/\/$/, "")}/pricing?checkout=cancelled`;
  const result = await backendRequest<{ checkout_url?: string; url?: string }>("/api/v1/payments/checkout", {
    method: "POST",
    body: JSON.stringify({
      plan_id: level.id,
      product_code: productConfig.code,
      success_url: successUrl,
      cancel_url: cancelUrl,
    }),
    requireUser: true,
  });

  if (!result.ok) {
    return { success: false, status: result.status, error: result.message };
  }

  const url = result.data.checkout_url ?? result.data.url;
  if (!url) {
    return { success: false, status: 500, error: "Checkout URL was empty." };
  }

  analytics.track({
    name: "checkout_started",
    properties: {
      product_id: productConfig.analyticsProductId,
      level_id: level.id,
      variant_id: variantId,
    },
  });

  return { success: true, url };
}
