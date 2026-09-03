import { type PricingLevel } from "../shared/pricing-levels";
import { emergencyPricingCatalog } from "./emergency-pricing";
import { getCurrentProductCode as getConfiguredProductCode } from "@/config/product";

function defaultProductCode() {
  return getConfiguredProductCode();
}

type BackendPricingPlan = {
  id: string;
  product_id: string;
  code: string;
  name: string;
  description: string;
  interval: PricingLevel["interval"];
  price_amount: number | null;
  currency: string | null;
  price_label: string | null;
  provider: PricingLevel["provider"] | string;
  provider_variant_id: string | null;
  entitlements: unknown;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | unknown;
};

function backendBaseUrl() {
  return process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
}

function normalizeEntitlements(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeProvider(value: string | undefined): PricingLevel["provider"] {
  switch (value) {
    case "lemon_squeezy":
    case "stripe":
    case "paddle":
    case "revenuecat":
    case "manual":
      return value;
    default:
      return "manual";
  }
}

function mapBackendPlan(plan: BackendPricingPlan): PricingLevel {
  const metadata = plan.metadata && typeof plan.metadata === "object" ? plan.metadata as Record<string, unknown> : {};
  const variantEnv = typeof metadata.variant_env === "string" ? metadata.variant_env : undefined;

  return {
    id: plan.code,
    productId: plan.product_id,
    name: plan.name,
    description: plan.description ?? "",
    priceLabel: plan.price_label?.trim() || (typeof plan.price_amount === "number" ? `$${(plan.price_amount / 100).toFixed(0)}` : "$0"),
    interval: plan.interval,
    variantEnv,
    providerVariantId: plan.provider_variant_id ?? undefined,
    provider: normalizeProvider(plan.provider),
    entitlements: normalizeEntitlements(plan.entitlements),
    featured: Boolean(plan.is_featured),
  };
}

async function fetchPricingLevelsFromBackend(productCode: string): Promise<PricingLevel[] | null> {
  const baseUrl = backendBaseUrl();
  if (!baseUrl) return null;

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/api/v1/products/code/${encodeURIComponent(productCode)}/pricing-plans`,
      { cache: "no-store" },
    );
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.success === false || !Array.isArray(payload?.data)) {
      return null;
    }

    const plans = payload.data
      .map((plan: BackendPricingPlan) => mapBackendPlan(plan))
      .filter((plan: PricingLevel) => Boolean(plan.id && plan.name));

    return plans.length > 0 ? plans : null;
  } catch {
    return null;
  }
}

export async function getProductPricingLevels(productCode = defaultProductCode()): Promise<PricingLevel[]> {
  const backendLevels = await fetchPricingLevelsFromBackend(productCode);
  const levels = backendLevels ?? emergencyPricingCatalog(productCode);

  return levels.map((level) => ({
    ...level,
    productId: level.productId || productCode,
  }));
}

export async function getProductPricingLevel(
  levelId: string,
  productCode = defaultProductCode(),
): Promise<PricingLevel | null> {
  const levels = await getProductPricingLevels(productCode);
  return levels.find((level) => level.id === levelId) ?? null;
}

export async function paidProductPricingLevels(productCode = defaultProductCode()) {
  const levels = await getProductPricingLevels(productCode);
  return levels.filter((level) => level.interval !== "free");
}

export function getCurrentProductCode() {
  return getConfiguredProductCode();
}
