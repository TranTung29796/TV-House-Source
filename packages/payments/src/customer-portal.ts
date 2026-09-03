import { payments } from "./service";

/**
 * Compatibility wrapper. New app code should call payments.getSubscription().
 */
export async function getCustomerPortalUrl(
  subscriptionId: string,
): Promise<string | null> {
  const subscription = await payments.getSubscription(subscriptionId);
  return subscription?.customerPortalUrl ?? null;
}
