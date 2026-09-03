import { productConfig } from "@/config/product";
import { emergencyPricingCatalog } from "@/features/billing/server/emergency-pricing";

type ReadinessCheck = {
  key: string;
  ok: boolean;
  required: boolean;
  message: string;
};

function hasValue(name: string) {
  const value = process.env[name];
  return Boolean(value && value.trim());
}

function hasBackendAuth() {
  return hasValue("BACKEND_API_BASE_URL") || hasValue("NEXT_PUBLIC_BACKEND_API_BASE_URL");
}

function hasBillingBase() {
  return hasValue("LEMON_SQUEEZY_API_KEY") && hasValue("LEMON_SQUEEZY_STORE_ID");
}

function paidPlansNeedVariants() {
  return emergencyPricingCatalog(productConfig.code).filter((plan) => plan.interval !== "free");
}

function missingPaidPlanVariants() {
  return paidPlansNeedVariants().filter((plan) => {
    if (plan.provider !== "lemon_squeezy") return false;
    return !plan.providerVariantId && !plan.variantEnv;
  });
}

export function getRuntimeReadiness() {
  const missingVariants = missingPaidPlanVariants();
  const checks: ReadinessCheck[] = [
    {
      key: "product_identity",
      ok: Boolean(productConfig.code && productConfig.name),
      required: true,
      message: `Product identity: ${productConfig.code} / ${productConfig.name}`,
    },
    {
      key: "public_app_url",
      ok: Boolean(productConfig.websiteUrl),
      required: true,
      message: `Public app URL: ${productConfig.websiteUrl}`,
    },
    {
      key: "backend_api",
      ok: hasBackendAuth(),
      required: true,
      message: hasBackendAuth()
        ? "Backend API configured."
        : "BACKEND_API_BASE_URL is missing.",
    },
    {
      key: "auth",
      ok: hasBackendAuth(),
      required: true,
      message: hasBackendAuth()
        ? "Authenticated product flows are routed through Backend API."
        : "Backend API is required for login and protected routes.",
    },
    {
      key: "billing_base",
      ok: hasBillingBase(),
      required: false,
      message: hasBillingBase()
        ? "Billing provider base keys configured."
        : "Lemon Squeezy API key or store id is missing.",
    },
    {
      key: "billing_variants",
      ok: missingVariants.length === 0,
      required: false,
      message:
        missingVariants.length === 0
          ? "Paid plan variant mapping is present in emergency pricing fallback."
          : `Paid plan variant mapping is incomplete for: ${missingVariants.map((plan) => plan.id).join(", ")}.`,
    },
  ];

  const requiredFailures = checks.filter((check) => check.required && !check.ok);
  const optionalFailures = checks.filter((check) => !check.required && !check.ok);

  return {
    ready: requiredFailures.length === 0 && optionalFailures.length === 0,
    requiredReady: requiredFailures.length === 0,
    checks,
  };
}
