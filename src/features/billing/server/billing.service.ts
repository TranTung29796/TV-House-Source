import { getUser } from "@datbuilds/auth/client/server";
import type { BillingSummary, PortalResult } from "../shared/types";
import { appRoutes } from "@/config/routes";
import { backendRequest } from "@/features/core/server/backend-api";
import { productConfig } from "@/config/product";

function normalizeSubscription(value: unknown): BillingSummary["subscription"] {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  return {
    status: typeof row.status === "string" ? row.status : "inactive",
    cancelAtPeriodEnd: Boolean(row.cancelAtPeriodEnd ?? row.cancel_at_period_end),
    currentPeriodEnd:
      typeof row.currentPeriodEnd === "string"
        ? row.currentPeriodEnd
        : typeof row.current_period_end === "string"
          ? row.current_period_end
          : null,
    providerSubscriptionId:
      typeof row.providerSubscriptionId === "string"
        ? row.providerSubscriptionId
        : typeof row.provider_subscription_id === "string"
          ? row.provider_subscription_id
          : null,
    planCode:
      typeof row.planCode === "string"
        ? row.planCode
        : typeof row.plan_code === "string"
          ? row.plan_code
          : "free",
    pricingPlanId:
      typeof row.pricingPlanId === "string"
        ? row.pricingPlanId
        : typeof row.pricing_plan_id === "string"
          ? row.pricing_plan_id
          : null,
    pricingPlanName:
      typeof row.pricingPlanName === "string"
        ? row.pricingPlanName
        : typeof row.pricing_plan_name === "string"
          ? row.pricing_plan_name
          : null,
  };
}

export async function getBillingSummary(): Promise<BillingSummary | null> {
  const user = await getUser();
  if (!user) return null;
  const query = new URLSearchParams({ product_code: productConfig.code });
  const result = await backendRequest<{ plan?: string; subscription?: BillingSummary["subscription"] | null } | BillingSummary["subscription"]>(
    `/api/v1/payments/subscription?${query.toString()}`
  );
  if (!result.ok) return null;
  const subscription =
    result.data && typeof result.data === "object" && "subscription" in result.data
      ? normalizeSubscription(result.data.subscription ?? null)
      : normalizeSubscription(result.data);
  return {
    subscription,
    status: subscription?.status ?? undefined,
    isActive: Boolean(subscription),
    currentPeriodEnd: subscription?.currentPeriodEnd ? String(subscription.currentPeriodEnd) : null,
    cancelAtPeriodEnd: Boolean(subscription?.cancelAtPeriodEnd),
  };
}

export async function getCustomerPortalForCurrentUser(): Promise<PortalResult> {
  const user = await getUser();
  if (!user) {
    return {
      success: false,
      status: 401,
      code: "UNAUTHENTICATED",
      error: "Authentication required.",
      redirectTo: appRoutes.auth.login,
    };
  }

  const result = await backendRequest<{ portal_url: string }>("/api/v1/payments/portal", {
    method: "POST",
    body: JSON.stringify({
      product_code: productConfig.code,
      return_url: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}${appRoutes.product.account}` : "",
    }),
  });

  if (!result.ok) {
    return {
      success: false,
      status: result.status,
      code: "BILLING_PORTAL_UNAVAILABLE",
      error: result.message,
      redirectTo: `${appRoutes.product.account}?error=portal_unavailable`,
    };
  }

  return { success: true, url: result.data.portal_url };
}
