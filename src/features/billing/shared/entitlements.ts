import pricingSeed from "../../../../pricing/product-pricing-plans.json";

type PricingLevelId = string;

const pricingLevels = pricingSeed.plans.map((plan) => ({
  id: plan.code,
  entitlements: plan.entitlements,
}));

export function normalizeLevelId(levelId: string | null | undefined): PricingLevelId {
  const match = pricingLevels.find((level) => level.id === levelId);
  return match?.id ?? "free";
}

export function hasEntitlement(
  levelId: string | null | undefined,
  entitlement: string,
): boolean {
  const normalized = normalizeLevelId(levelId);
  const level = pricingLevels.find((item) => item.id === normalized);
  return Boolean(level?.entitlements?.includes(entitlement));
}
