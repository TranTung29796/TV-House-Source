import Link from "next/link";
import { FAQAccordion } from "@/components/legal/faq-accordion";
import { LegalPageLayout, LegalSection } from "@/components/legal/legal-page-layout";
import { ProductTemplateSampleShell } from "@/components/shell/product-template-sample-shell";
import { appRoutes } from "@/config/routes";
import { pricingPlanSummary, productSiteConfig } from "@/config/product-site";
import { getTranslations } from "next-intl/server";

function SectionIcon({
  type,
}: {
  type: "plans" | "billing" | "access" | "account" | "privacy" | "support";
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "plans":
      return <svg viewBox="0 0 20 20"><path {...common} d="M4.5 6h11v8h-11Z" /><path {...common} d="M4.5 9h11" /><path {...common} d="M7 12h3.5" /></svg>;
    case "billing":
      return <svg viewBox="0 0 20 20"><path {...common} d="M4 6.5h12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path {...common} d="M4 8.5h12" /><path {...common} d="M7.5 12h2.5" /></svg>;
    case "access":
      return <svg viewBox="0 0 20 20"><circle {...common} cx="10" cy="6.5" r="3" /><path {...common} d="M4.5 15.5a6.5 6.5 0 0 1 11 0" /></svg>;
    case "account":
      return <svg viewBox="0 0 20 20"><path {...common} d="M6 4.8h8" /><path {...common} d="M10 4.8v2.6" /><circle {...common} cx="10" cy="11.5" r="4.8" /></svg>;
    case "privacy":
      return <svg viewBox="0 0 20 20"><path {...common} d="M10 3.5 15 5.5v4.7c0 2.9-2 4.8-5 6.3-3-1.5-5-3.4-5-6.3V5.5Z" /><path {...common} d="m7.8 10 1.5 1.5 2.9-3.1" /></svg>;
    default:
      return <svg viewBox="0 0 20 20"><path {...common} d="M10 15.5h.01" /><path {...common} d="M8.5 8.2a1.8 1.8 0 1 1 2.9 1.4c-.8.6-1.4 1.1-1.4 2.1" /></svg>;
  }
}

export default async function FAQPage() {
  const t = await getTranslations("faq");
  const pricingAnswer = await pricingPlanSummary();
  const { billing, company } = productSiteConfig;
  const hasBackend = Boolean(
    process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
  );

  return (
    <ProductTemplateSampleShell>
      <LegalPageLayout
        title={t("title")}
        className="xsolt-legal-page--faq"
        lastUpdated={productSiteConfig.lastUpdated}
        showMeta={false}
      >
        <section className="xsolt-faq-actions" aria-label="FAQ quick actions">
          <Link href={`mailto:${company.contactEmail}`} className="xsolt-faq-actions__item">
            <span className="xsolt-faq-actions__icon" aria-hidden="true">
              <SectionIcon type="support" />
            </span>
            <span className="xsolt-faq-actions__copy">
              <strong>{t("quickActions.supportTitle")}</strong>
              <span>{t("quickActions.supportBody")}</span>
            </span>
          </Link>

          <Link href={appRoutes.marketing.pricing} className="xsolt-faq-actions__item">
            <span className="xsolt-faq-actions__icon" aria-hidden="true">
              <SectionIcon type="billing" />
            </span>
            <span className="xsolt-faq-actions__copy">
              <strong>{t("quickActions.pricingTitle")}</strong>
              <span>{t("quickActions.pricingBody")}</span>
            </span>
          </Link>
        </section>

        <LegalSection id="plans" title={t("cards.plans")} icon={<SectionIcon type="plans" />}>
          <FAQAccordion
            items={[
              {
                question: t("items.plansQuestion"),
                answer: <p>{t("items.plansAnswer", { plans: pricingAnswer })}</p>,
              },
              {
                question: t("items.switchQuestion"),
                answer: <p>{t("items.switchAnswer")}</p>,
              },
            ]}
            defaultOpen={0}
          />
        </LegalSection>

        <LegalSection id="billing" title={t("cards.billing")} icon={<SectionIcon type="billing" />}>
          <FAQAccordion
            items={[
              {
                question: t("items.billingQuestion"),
                answer: <p>{t("items.billingAnswer", { provider: billing.provider })}</p>,
              },
              {
                question: t("items.refundQuestion"),
                answer: <p>{billing.refundPolicy}</p>,
              },
            ]}
          />
        </LegalSection>

        <LegalSection id="access" title={t("cards.access")} icon={<SectionIcon type="access" />}>
          <FAQAccordion
            items={[
              {
                question: t("items.accountManageQuestion"),
                answer: <p>{t("items.accountManageAnswer")}</p>,
              },
              {
                question: t("items.recoverQuestion"),
                answer: <p>{t("items.recoverAnswer")}</p>,
              },
            ]}
          />
        </LegalSection>

        <LegalSection id="account" title={t("cards.account")} icon={<SectionIcon type="account" />}>
          <FAQAccordion
            items={[
              {
                question: t("items.deleteQuestion"),
                answer: <p>{t("items.deleteAnswer")}</p>,
              },
              {
                question: t("items.actionUnavailableQuestion"),
                answer: (
                  <p>
                    {hasBackend
                      ? t("items.actionUnavailableWithDb")
                      : t("items.actionUnavailableWithoutDb")}
                  </p>
                ),
              },
            ]}
          />
        </LegalSection>

        <LegalSection id="privacy" title={t("cards.privacy")} icon={<SectionIcon type="privacy" />}>
          <FAQAccordion
            items={[
              {
                question: t("items.dataStoredQuestion"),
                answer: <p>{t("items.dataStoredAnswer")}</p>,
              },
              {
                question: t("items.thirdPartyQuestion"),
                answer: <p>{t("items.thirdPartyAnswer")}</p>,
              },
              {
                question: t("items.retentionQuestion"),
                answer: <p>{productSiteConfig.privacy.dataRetention}</p>,
              },
            ]}
          />
        </LegalSection>

        <LegalSection id="support" title={t("cards.support")} icon={<SectionIcon type="support" />}>
          <FAQAccordion
            items={[
              {
                question: t("items.cantLoginQuestion"),
                answer: <p>{t("items.cantLoginAnswer")}</p>,
              },
              {
                question: t("items.paymentFailedQuestion"),
                answer: <p>{t("items.paymentFailedAnswer")}</p>,
              },
            ]}
          />
        </LegalSection>
      </LegalPageLayout>
    </ProductTemplateSampleShell>
  );
}
