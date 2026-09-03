export type PaymentProviderId = "lemon_squeezy" | "stripe" | "paddle";

export interface CreateCheckoutInput {
  variantId: number;
  userId: string;
  userEmail: string;
  userName?: string;
  workspaceId?: string;
  productId?: string;
  levelId?: string;
}

export interface CheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface SubscriptionInfo {
  id: string;
  status: string;
  variantId: number;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  customerPortalUrl: string | null;
}

export interface PaymentActionResult {
  success: boolean;
  error?: string;
}

export interface PaymentProvider {
  id: PaymentProviderId;
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult>;
  getSubscription(subscriptionId: string): Promise<SubscriptionInfo | null>;
  cancelSubscription(subscriptionId: string): Promise<PaymentActionResult>;
}
