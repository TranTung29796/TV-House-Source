export type BillingInterval = "free" | "month" | "year" | "lifetime";

export type PricingLevel = {
  id: string;
  productId: string;
  name: string;
  description: string;
  priceLabel: string;
  interval: BillingInterval;
  variantEnv?: string;
  providerVariantId?: string;
  provider?: "lemon_squeezy" | "stripe" | "paddle" | "revenuecat" | "manual";
  entitlements: string[];
  featured?: boolean;
};

export function resolvePaymentPriceId(level: PricingLevel): string | null {
  const directVariant = level.providerVariantId?.trim();
  if (directVariant) {
    if (/^\d+$/.test(directVariant)) return directVariant;
    const envMapped = process.env[directVariant];
    if (envMapped?.trim()) return envMapped.trim();
  }
  if (!level.variantEnv) return null;
  const raw = process.env[level.variantEnv] ?? process.env.LEMON_SQUEEZY_VARIANT_ID;
  return raw && raw.trim() ? raw.trim() : null;
}

export function resolveVariantId(level: PricingLevel): number | null {
  const raw = resolvePaymentPriceId(level);
  const variantId = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(variantId) && variantId > 0 ? variantId : null;
}

export function resolvePriceId(level: PricingLevel): string | null {
  return resolvePaymentPriceId(level);
}

export function formatEntitlementLabel(value: string) {
  return value
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
