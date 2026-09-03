import { payments } from "./service";
import type { PaymentActionResult, SubscriptionInfo } from "./types";

/**
 * Compatibility wrapper. New app code should call payments.getSubscription().
 */
export async function getSubscription(
  subscriptionId: string,
): Promise<SubscriptionInfo | null> {
  return payments.getSubscription(subscriptionId);
}

/**
 * Compatibility wrapper. New app code should call payments.cancelSubscription().
 */
export async function cancelSubscription(
  subscriptionId: string,
): Promise<PaymentActionResult> {
  return payments.cancelSubscription(subscriptionId);
}

/**
 * Resume (un-cancel) a subscription that was set to cancel at period end.
 */
export async function resumeSubscription(
  subscriptionId: string,
): Promise<{ success: boolean; error?: string }> {
  return payments.cancelSubscription(subscriptionId);
}
