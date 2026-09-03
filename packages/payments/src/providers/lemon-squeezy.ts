import {
  cancelSubscription as lsCancelSubscription,
  createCheckout as lsCreateCheckout,
  getSubscription as lsGetSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

import { configureLemonSqueezy } from "../client";
import { createCheckoutSchema } from "../schemas";
import type {
  CheckoutResult,
  CreateCheckoutInput,
  PaymentActionResult,
  PaymentProvider,
  SubscriptionInfo,
} from "../types";

async function createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult> {
  const parsed = createCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  configureLemonSqueezy();

  const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
  if (!storeId) {
    return { success: false, error: "Missing LEMON_SQUEEZY_STORE_ID." };
  }

  const { data, error } = await lsCreateCheckout(storeId, parsed.data.variantId, {
    checkoutData: {
      email: parsed.data.userEmail,
      name: parsed.data.userName,
      custom: {
        user_id: parsed.data.userId,
        workspace_id: parsed.data.workspaceId,
        product_id: parsed.data.productId,
        level_id: parsed.data.levelId,
      },
    },
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/account?success=billing#billing`,
      receiptButtonText: "Open Account",
      receiptThankYouNote: "Thank you for subscribing!",
    },
  });

  if (error || !data) {
    return {
      success: false,
      error: "Could not create checkout session. Please try again.",
    };
  }

  const url = data.data?.attributes?.url;
  if (!url) {
    return { success: false, error: "Checkout URL was empty." };
  }

  return { success: true, url };
}

async function getSubscription(subscriptionId: string): Promise<SubscriptionInfo | null> {
  configureLemonSqueezy();

  const { data, error } = await lsGetSubscription(subscriptionId);
  if (error || !data) return null;

  const attrs = data.data.attributes;
  return {
    id: data.data.id,
    status: attrs.status,
    variantId: attrs.variant_id,
    currentPeriodEnd: attrs.renews_at,
    cancelAtPeriodEnd: attrs.cancelled ?? false,
    customerPortalUrl: attrs.urls?.customer_portal ?? null,
  };
}

async function cancelSubscription(subscriptionId: string): Promise<PaymentActionResult> {
  configureLemonSqueezy();

  const { error } = await lsCancelSubscription(subscriptionId);
  if (error) {
    return { success: false, error: "Could not cancel subscription." };
  }
  return { success: true };
}

export const lemonSqueezyProvider: PaymentProvider = {
  id: "lemon_squeezy",
  createCheckout,
  getSubscription,
  cancelSubscription,
};
