import pricingSeed from "../../../../pricing/product-pricing-plans.json";

import type { BillingInterval, PricingLevel } from "../shared/pricing-levels";

type PricingSeedPlan = (typeof pricingSeed.plans)[number];

function resolveVariantEnv(plan: PricingSeedPlan) {
  const value = plan.metadata?.variant_env;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function emergencyPricingCatalog(productCode = pricingSeed.product.code): PricingLevel[] {
  return pricingSeed.plans
    .filter((plan) => plan.active)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((plan) => ({
      id: plan.code,
      productId: productCode,
      name: plan.name,
      description: plan.description,
      priceLabel: plan.priceLabel ?? "$0",
      interval: plan.interval as BillingInterval,
      variantEnv: resolveVariantEnv(plan),
      providerVariantId:
        plan.providerVariantId && !plan.providerVariantId.startsWith("REPLACE_WITH_")
          ? plan.providerVariantId
          : undefined,
      provider: plan.provider as PricingLevel["provider"],
      entitlements: [...plan.entitlements],
      featured: plan.featured,
    }));
}
