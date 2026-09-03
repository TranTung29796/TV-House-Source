import { getTranslations } from "next-intl/server";

import { LegalShowcasePage } from "@/components/legal/legal-showcase-page";
import { ProductTemplateSampleShell } from "@/components/shell/product-template-sample-shell";
import { appRoutes } from "@/config/routes";
import { productSiteConfig } from "@/config/product-site";

function SectionIcon({
  type,
}: {
  type: "scope" | "account" | "billing" | "content" | "availability" | "contact";
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "scope":
      return <svg viewBox="0 0 20 20"><path {...common} d="M4.8 5.2h10.4v9.6H4.8Z" /><path {...common} d="M7.2 8.2h5.6" /><path {...common} d="M7.2 11.2h4" /></svg>;
    case "account":
      return <svg viewBox="0 0 20 20"><circle {...common} cx="10" cy="6.5" r="3" /><path {...common} d="M4.5 15.5a6.5 6.5 0 0 1 11 0" /></svg>;
    case "billing":
      return <svg viewBox="0 0 20 20"><path {...common} d="M4 6.5h12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path {...common} d="M4 8.5h12" /><path {...common} d="M7.5 12h2.5" /></svg>;
    case "content":
      return <svg viewBox="0 0 20 20"><path {...common} d="M6 4.5h6l3 3v8H6Z" /><path {...common} d="M12 4.5v3h3" /></svg>;
    case "availability":
      return <svg viewBox="0 0 20 20"><path {...common} d="M10 3.8v6.4l4 2.3" /><circle {...common} cx="10" cy="10" r="6.2" /></svg>;
    default:
      return <svg viewBox="0 0 20 20"><path {...common} d="M4.5 6.5h11v7h-11Z" /><path {...common} d="m5.5 7.5 4.5 4 4.5-4" /></svg>;
  }
}

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const { company, billing, product } = productSiteConfig;

  return (
    <ProductTemplateSampleShell>
      <LegalShowcasePage
        titleLead={t("heroTitleLead")}
        accentTitle={t("heroTitleAccent")}
        lastUpdatedLabel={t("lastUpdated")}
        lastUpdated={productSiteConfig.lastUpdated}
        illustration="terms"
        cards={[
          {
            id: "scope",
            step: "1",
            title: t("sections.scope"),
            body: <p>{t("sections.scopeBody", { productName: product.name })}</p>,
            icon: <SectionIcon type="scope" />,
          },
          {
            id: "account",
            step: "2",
            title: t("sections.account"),
            body: <p>{t("sections.accountBody")}</p>,
            icon: <SectionIcon type="account" />,
          },
          {
            id: "billing",
            step: "3",
            title: t("sections.billing"),
            body: (
              <p>
                {t("sections.billingLead", { provider: billing.provider })}{" "}
                <a href={appRoutes.marketing.pricing}>{t("sections.billingLink")}</a>{" "}
                {t("sections.billingTail")}
              </p>
            ),
            icon: <SectionIcon type="billing" />,
          },
          {
            id: "content",
            step: "4",
            title: t("sections.content"),
            body: <p>{t("sections.contentBody", { companyName: company.name })}</p>,
            icon: <SectionIcon type="content" />,
          },
          {
            id: "availability",
            step: "5",
            title: t("sections.availability"),
            body: <p>{t("sections.availabilityBody")}</p>,
            icon: <SectionIcon type="availability" />,
          },
          {
            id: "contact",
            step: "6",
            title: t("sections.contact"),
            body: <p>{t("sections.contactBody", { email: company.contactEmail, law: company.governingLaw })}</p>,
            icon: <SectionIcon type="contact" />,
          },
        ]}
      />
    </ProductTemplateSampleShell>
  );
}
