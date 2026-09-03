import { payments } from "./service";
import type { CheckoutResult, CreateCheckoutInput } from "./types";

/**
 * Compatibility wrapper. New app code should call payments.createCheckout().
 */
export async function createCheckoutUrl(
  input: CreateCheckoutInput,
): Promise<CheckoutResult> {
  return payments.createCheckout(input);
}
