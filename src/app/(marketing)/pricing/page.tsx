import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";
import { ProductTemplateSampleShell } from "@/components/shell/product-template-sample-shell";
import { getLocalizedProductContent } from "@/config/product";
import { appRoutes } from "@/config/routes";
import { LevelCheckoutButton } from "@/features/billing/client/level-checkout-button";
import { getProductPricingLevels } from "@/features/billing/server/pricing-catalog";
import { formatEntitlementLabel } from "@/features/billing/shared/pricing-levels";
import type { CSSProperties } from "react";

type PricingPageProps = {
  searchParams?: Promise<{
    billing?: string;
  }>;
};

const pricingSearchParamsSchema = z.object({
  billing: z.enum(["month", "year"]).optional(),
});

function resolveVisiblePlans(plans: Awaited<ReturnType<typeof getProductPricingLevels>>, billing: "month" | "year") {
  const freePlans = plans.filter((plan) => plan.interval === "free");
  const paidPlans = plans.filter((plan) => plan.interval !== "free");
  const directMatches = paidPlans.filter((plan) => plan.interval === billing);
  const prioritized = directMatches.length ? directMatches : paidPlans.filter((plan) => plan.interval === "month");
  const fallbackPaid = paidPlans.filter((plan) => !prioritized.some((candidate) => candidate.id === plan.id));

  return [...freePlans, ...prioritized, ...fallbackPaid].slice(0, 3);
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const locale = await getLocale();
  const t = await getTranslations("pricing");
  const pricingCopy = getLocalizedProductContent(locale).marketing.pricing;
  const plans = await getProductPricingLevels();
  const rawSearchParams = await (searchParams ?? Promise.resolve({ billing: undefined }));
  const resolvedSearchParams = pricingSearchParamsSchema.safeParse(rawSearchParams);
  const billing = resolvedSearchParams.success && resolvedSearchParams.data.billing === "year" ? "year" : "month";
  const visiblePlans = resolveVisiblePlans(plans, billing);

  return (
    <ProductTemplateSampleShell>
      <section className="xsolt-chatgpt-pricing-page">
        <header className="xsolt-chatgpt-pricing-hero">
          <h1>{pricingCopy.title}</h1>
          <p>{pricingCopy.description}</p>
        </header>

        <nav className="xsolt-chatgpt-pricing-tabs" aria-label="Billing interval">
          <Link
            href={appRoutes.marketing.pricing}
            scroll={false}
            className={billing === "month" ? "is-active" : undefined}
          >
            {pricingCopy.monthlyLabel}
          </Link>
          <Link
            href={`${appRoutes.marketing.pricing}?billing=year`}
            scroll={false}
            className={billing === "year" ? "is-active" : undefined}
          >
            {pricingCopy.yearlyLabel}
          </Link>
          <span className="xsolt-chatgpt-pricing-tabs__discount">
            {pricingCopy.yearlyDiscountLabel}
          </span>
        </nav>

        <div
          className="xsolt-chatgpt-pricing-grid"
          style={{ "--xsolt-pricing-plan-count": visiblePlans.length } as CSSProperties}
        >
          {visiblePlans.map((plan) => (
            <section
              key={plan.id}
              className={`xsolt-chatgpt-pricing-card${plan.featured ? " is-featured" : ""}`}
            >
              {plan.featured ? (
                <span className="xsolt-chatgpt-pricing-card__badge">
                  {pricingCopy.featuredLabel}
                </span>
              ) : null}

              <div className="xsolt-chatgpt-pricing-card__intro">
                <h2>{plan.name}</h2>
              </div>

              <div className="xsolt-chatgpt-pricing-card__price">
                <strong>{plan.priceLabel}</strong>
                <span>{t(`intervals.${plan.interval}`)}</span>
              </div>

              <ul className="xsolt-chatgpt-pricing-card__features">
                {plan.entitlements.map((feature) => (
                  <li key={feature}>
                    <span aria-hidden="true" />
                    <span>
                      {feature === "core.workflow"
                        ? t("entitlements.coreWorkflow")
                        : feature === "analytics.standard"
                          ? t("entitlements.analyticsStandard")
                          : formatEntitlementLabel(feature)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="xsolt-chatgpt-pricing-action">
                {plan.interval === "free" ? (
                  <Link
                    href={appRoutes.auth.login}
                    className="xsolt-chatgpt-pricing-button xsolt-chatgpt-pricing-button--secondary"
                  >
                    {t("startPlan", { plan: plan.name })}
                  </Link>
                ) : (
                  <LevelCheckoutButton
                    levelId={plan.id}
                    label={t("startPlan", { plan: plan.name })}
                    className="w-full xsolt-chatgpt-pricing-button"
                  />
                )}
              </div>
            </section>
          ))}
        </div>
      </section>
    </ProductTemplateSampleShell>
  );
}
