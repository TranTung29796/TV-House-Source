import { z } from "zod";
import productContent from "../../product/product-content.json";
import { defaultLocale, isAppLocale } from "@/i18n/config";

const productCodeSchema = z.string().min(1).regex(/^[a-z][a-z0-9-]*$/);

function readEnv(name: string) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : undefined;
}

const productRuntimeSchema = z.object({
  code: productCodeSchema.default("web-template-copy-smoke"),
  name: z.string().min(1).max(120).default("Web Template Copy Smoke"),
  companyName: z.string().min(1).max(120).default("DatBuilds"),
  supportEmail: z.string().email().default("support@xsolt.io").optional(),
  websiteUrl: z.string().url().default("https://web-template-copy-smoke.xsolt.io"),
  legalEntity: z.string().min(1).max(160).default("[LEGAL_ENTITY]"),
  governingLaw: z.string().min(1).max(120).default("[GOVERNING_LAW]"),
  refundPolicy: z
    .string()
    .min(1)
    .default(
      "Refund requests are reviewed according to [REFUND_POLICY] and any plan-specific billing terms shown at checkout.",
    ),
  dataRetentionPolicy: z
    .string()
    .min(1)
    .default(
      "Account and operational records are kept for as long as needed to provide the service, meet legal obligations, resolve disputes, and enforce agreements.",
    ),
});

const productRuntime = productRuntimeSchema.parse({
  code: readEnv("PRODUCT_CODE"),
  name: readEnv("NEXT_PUBLIC_PRODUCT_NAME"),
  companyName: readEnv("COMPANY_NAME"),
  supportEmail: readEnv("SUPPORT_EMAIL") ?? readEnv("NEXT_PUBLIC_SUPPORT_EMAIL"),
  websiteUrl: readEnv("NEXT_PUBLIC_APP_URL"),
  legalEntity: readEnv("LEGAL_ENTITY"),
  governingLaw: readEnv("GOVERNING_LAW"),
  refundPolicy: readEnv("REFUND_POLICY"),
  dataRetentionPolicy: readEnv("DATA_RETENTION_POLICY"),
});

export type HowItWorksIcon = "capture" | "detect" | "impact" | "action";

export type HowItWorksPreview =
  | {
      type: "form";
      title: string;
      label: string;
      value: string;
      status: string;
      action: string;
    }
  | {
      type: "bars";
      title: string;
      metrics: Array<{
        label: string;
        value: string;
        fill: number;
      }>;
    }
  | {
      type: "table";
      title: string;
      rows: Array<{
        label: string;
        value: string;
      }>;
    }
  | {
      type: "line";
      title: string;
      beforeLabel: string;
      afterLabel: string;
    };

export type HowItWorksStep = {
  step: string;
  title: string;
  body: string;
  points: string[];
  icon: HowItWorksIcon;
  preview?: HowItWorksPreview;
};

const howItWorksIconSchema = z.enum(["capture", "detect", "impact", "action"]);
const howItWorksPreviewSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("form"),
    title: z.string().min(1),
    label: z.string().min(1),
    value: z.string().min(1),
    status: z.string().min(1),
    action: z.string().min(1),
  }),
  z.object({
    type: z.literal("bars"),
    title: z.string().min(1),
    metrics: z.array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
        fill: z.number().min(0).max(100),
      }),
    ).min(1),
  }),
  z.object({
    type: z.literal("table"),
    title: z.string().min(1),
    rows: z.array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      }),
    ).min(1),
  }),
  z.object({
    type: z.literal("line"),
    title: z.string().min(1),
    beforeLabel: z.string().min(1),
    afterLabel: z.string().min(1),
  }),
]);

const marketingContentSchema = z.object({
  marketing: z.object({
    overview: z.object({
      heroTitle: z.string().min(1),
      heroDescription: z.string().min(1),
      primaryCta: z.string().min(1),
      secondaryCta: z.string().min(1),
    }),
    howItWorks: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      signalChips: z.array(
        z.object({
          label: z.string().min(1),
          icon: howItWorksIconSchema,
        }),
      ).min(1),
      steps: z.array(
        z.object({
          step: z.string().min(1),
          title: z.string().min(1),
          body: z.string().min(1),
          points: z.array(z.string().min(1)).min(1),
          icon: howItWorksIconSchema,
          preview: howItWorksPreviewSchema.optional(),
        }),
      ).min(4),
    }),
    pricing: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      monthlyLabel: z.string().min(1),
      yearlyLabel: z.string().min(1),
      yearlyDiscountLabel: z.string().min(1),
      featuredLabel: z.string().min(1),
    }),
  }),
});

const localizedProductContentSchema = z.object({
  locales: z.object({
    en: marketingContentSchema,
    de: marketingContentSchema,
  }),
});

const validatedProductContent = localizedProductContentSchema.parse(productContent);

export type ProductMarketingContent = z.infer<typeof marketingContentSchema>;

export function getLocalizedProductContent(locale?: string | null): ProductMarketingContent {
  const resolvedLocale = isAppLocale(locale) ? locale : defaultLocale;
  return validatedProductContent.locales[resolvedLocale];
}

export const productConfig = {
  ...productRuntime,
  themeStorageKey: `${productRuntime.code}-theme`,
  themeCookieKey: `${productRuntime.code}-theme`,
  analyticsProductId: productRuntime.code,
  marketing: getLocalizedProductContent(defaultLocale).marketing,
} as const;

export function getCurrentProductCode() {
  return productConfig.code;
}

export function getCurrentProductName() {
  return productConfig.name;
}
