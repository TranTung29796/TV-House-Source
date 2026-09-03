import { lemonSqueezyProvider } from "./providers/lemon-squeezy";
import type { CreateCheckoutInput, PaymentProvider, PaymentProviderId } from "./types";

function resolveProvider(): PaymentProvider {
  const provider = (process.env.PAYMENT_PROVIDER || "lemon_squeezy") as PaymentProviderId;

  switch (provider) {
    case "lemon_squeezy":
      return lemonSqueezyProvider;
    case "stripe":
    case "paddle":
      throw new Error(`Payment provider "${provider}" is not implemented yet.`);
    default:
      return lemonSqueezyProvider;
  }
}

export const payments = {
  createCheckout(input: CreateCheckoutInput) {
    return resolveProvider().createCheckout(input);
  },

  getSubscription(subscriptionId: string) {
    return resolveProvider().getSubscription(subscriptionId);
  },

  cancelSubscription(subscriptionId: string) {
    return resolveProvider().cancelSubscription(subscriptionId);
  },
};

export type { CreateCheckoutInput, PaymentProvider, PaymentProviderId };
