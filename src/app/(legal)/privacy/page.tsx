import { getTranslations } from "next-intl/server";

import { LegalShowcasePage } from "@/components/legal/legal-showcase-page";
import { ProductTemplateSampleShell } from "@/components/shell/product-template-sample-shell";
import { productSiteConfig } from "@/config/product-site";

function SectionIcon({
  type,
}: {
  type: "collect" | "use" | "share" | "retain" | "rights" | "contact";
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "collect":
      return <svg viewBox="0 0 20 20"><path {...common} d="M4.5 5.5h11v9h-11Z" /><path {...common} d="M7.5 9h5" /><path {...common} d="M7.5 12h3.5" /></svg>;
    case "use":
      return <svg viewBox="0 0 20 20"><path {...common} d="M10 3.8v6.4l4 2.3" /><circle {...common} cx="10" cy="10" r="6.2" /></svg>;
    case "share":
      return <svg viewBox="0 0 20 20"><circle {...common} cx="5" cy="10" r="1.7" /><circle {...common} cx="15" cy="5.5" r="1.7" /><circle {...common} cx="15" cy="14.5" r="1.7" /><path {...common} d="m6.5 9.2 6.8-2.7" /><path {...common} d="m6.5 10.8 6.8 2.7" /></svg>;
    case "retain":
      return <svg viewBox="0 0 20 20"><path {...common} d="M6 4.8h8" /><path {...common} d="M10 4.8v2.6" /><circle {...common} cx="10" cy="11.5" r="4.8" /></svg>;
    case "rights":
      return <svg viewBox="0 0 20 20"><path {...common} d="M10 3.5 15 5.5v4.7c0 2.9-2 4.8-5 6.3-3-1.5-5-3.4-5-6.3V5.5Z" /><path {...common} d="m7.8 10 1.5 1.5 2.9-3.1" /></svg>;
    default:
      return <svg viewBox="0 0 20 20"><path {...common} d="M4.5 6.5h11v7h-11Z" /><path {...common} d="m5.5 7.5 4.5 4 4.5-4" /></svg>;
  }
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const { company, billing, privacy } = productSiteConfig;

  return (
    <ProductTemplateSampleShell>
      <LegalShowcasePage
        titleLead={t("heroTitleLead")}
        accentTitle={t("heroTitleAccent")}
        lastUpdatedLabel={t("lastUpdated")}
        lastUpdated={productSiteConfig.lastUpdated}
        illustration="privacy"
        cards={[
          {
            id: "collect",
            step: "1",
            title: t("sections.collect"),
            body: <p>{t("sections.collectBody")}</p>,
            icon: <SectionIcon type="collect" />,
          },
          {
            id: "use",
            step: "2",
            title: t("sections.use"),
            body: <p>{t("sections.useBody")}</p>,
            icon: <SectionIcon type="use" />,
          },
          {
            id: "share",
            step: "3",
            title: t("sections.share"),
            body: <p>{t("sections.shareBody", { provider: billing.provider })}</p>,
            icon: <SectionIcon type="share" />,
          },
          {
            id: "retain",
            step: "4",
            title: t("sections.retain"),
            body: <p>{privacy.dataRetention}</p>,
            icon: <SectionIcon type="retain" />,
          },
          {
            id: "rights",
            step: "5",
            title: t("sections.rights"),
            body: <p>{t("sections.rightsBody")}</p>,
            icon: <SectionIcon type="rights" />,
          },
          {
            id: "contact",
            step: "6",
            title: t("sections.contact"),
            body: <p>{t("sections.contactBody", { email: company.contactEmail })}</p>,
            icon: <SectionIcon type="contact" />,
          },
        ]}
        contactTitle={t("ctaTitle")}
        contactBody={t("ctaBody")}
        contactCtaLabel={t("ctaButton")}
        contactCtaHref={`mailto:${company.contactEmail}`}
      />
    </ProductTemplateSampleShell>
  );
}
