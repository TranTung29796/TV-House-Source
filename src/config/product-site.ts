import { appRoutes } from "@/config/routes";
import { productConfig } from "@/config/product";
import type { BillingInterval } from "@/features/billing/shared/pricing-levels";
import { getProductPricingLevels } from "@/features/billing/server/pricing-catalog";

type ThirdPartyServiceCategory =
  | "Payment"
  | "Authentication"
  | "Database"
  | "Analytics"
  | "AI processing"
  | "Email";

type ThirdPartyService = {
  name: string;
  category: ThirdPartyServiceCategory;
  description: string;
};

function readEnv(name: string) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : null;
}

const productName = productConfig.name;
const supportEmail = productConfig.supportEmail;
const paymentEnabled = Boolean(readEnv("LEMON_SQUEEZY_API_KEY") || readEnv("LEMON_SQUEEZY_STORE_ID"));
const supabaseEnabled = Boolean(readEnv("NEXT_PUBLIC_SUPABASE_URL"));
const analyticsEnabled = Boolean(readEnv("NEXT_PUBLIC_POSTHOG_KEY") || readEnv("POSTHOG_API_KEY"));
const emailEnabled = Boolean(readEnv("RESEND_API_KEY"));
const aiEnabled = false;

const thirdPartyServices: ThirdPartyService[] = [
  ...(paymentEnabled
    ? [
        {
          name: "Lemon Squeezy",
          category: "Payment" as const,
          description: "Handles checkout, subscriptions, renewals, and billing portal actions.",
        },
      ]
    : []),
  ...(supabaseEnabled
    ? [
        {
          name: "Supabase",
          category: "Authentication" as const,
          description: "Handles sign-in, sessions, and configured account identity flows.",
        },
      ]
    : []),
  ...(supabaseEnabled
    ? [
        {
          name: "Supabase",
          category: "Database" as const,
          description: "Supports configured hosted database and account-related records.",
        },
      ]
    : []),
  ...(analyticsEnabled
    ? [
        {
          name: "PostHog",
          category: "Analytics" as const,
          description: "Collects configured product analytics and usage events.",
        },
      ]
    : []),
  ...(emailEnabled
    ? [
        {
          name: "Resend",
          category: "Email" as const,
          description: "Delivers configured transactional email flows.",
        },
      ]
    : []),
];

export const productSiteConfig = {
  lastUpdated: "August 22, 2026",
  product: {
    name: productName,
    description:
      "Web Template Copy Smoke helps small SaaS teams solve: launching a new product shell repeatedly creates drift between web, backend, and database runtime",
    corePurpose:
      "help small saas teams complete the core workflow with less friction and clearer outcomes",
    problemStatement:
      "launching a new product shell repeatedly creates drift between web, backend, and database runtime Web Template Copy Smoke is designed to keep the primary workflow, customer access, pricing, and follow-up in one focused product.",
    website: productConfig.websiteUrl,
    support: supportEmail
      ? {
          label: "Contact Support",
          href: `mailto:${supportEmail}`,
          kind: "email" as const,
        }
      : {
          label: "Contact Support",
          href: appRoutes.product.account,
          kind: "in_app" as const,
        },
  },
  company: {
    name: productConfig.companyName,
    legalEntity: productConfig.legalEntity,
    contactEmail: supportEmail ?? "[SUPPORT_EMAIL]",
    governingLaw: productConfig.governingLaw,
  },
  billing: {
    provider: paymentEnabled ? "Lemon Squeezy" : "[PAYMENT_PROVIDER]",
    refundPolicy: productConfig.refundPolicy,
  },
  privacy: {
    dataRetention: productConfig.dataRetentionPolicy,
    thirdPartyServices,
  },
  ai: {
    enabled: aiEnabled,
    providers: [] as string[],
  },
} as const;

type PricingInterval = BillingInterval | "year" | "lifetime";

export function formatPricingInterval(interval: PricingInterval) {
  switch (interval) {
    case "month":
      return "/month";
    case "year":
      return "/year";
    case "lifetime":
      return " lifetime";
    default:
      return "";
  }
}

export async function pricingPlanSummary() {
  const pricingLevels = await getProductPricingLevels();
  return pricingLevels
    .map((plan) => `${plan.name} (${plan.priceLabel}${formatPricingInterval(plan.interval)})`)
    .join(", ");
}
