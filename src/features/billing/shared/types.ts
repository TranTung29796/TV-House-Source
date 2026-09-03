export interface SubscriptionRow {
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | string | null;
  providerSubscriptionId: string | null;
  planCode: string;
  pricingPlanId?: string | null;
  pricingPlanName?: string | null;
}

export interface BillingSummary {
  subscription: SubscriptionRow | null;
  status: string | undefined;
  isActive: boolean;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export type CheckoutResult =
  | { success: true; url: string; userId: string; variantId: number }
  | { success: false; status: number; error: string };

export type PortalResult =
  | { success: true; url: string }
  | {
      success: false;
      status: number;
      error: string;
      code?: "UNAUTHENTICATED" | "BILLING_PORTAL_UNAVAILABLE";
      redirectTo?: string;
    };
