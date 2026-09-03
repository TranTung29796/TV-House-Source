import Link from "next/link";
import { useTranslations } from "next-intl";

import { ProductTemplateLogoMark } from "@/components/branding/product-template-logo-mark";
import { appRoutes } from "@/config/routes";
import { productSiteConfig } from "@/config/product-site";

export function ProductTemplateSiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  return (
    <footer className="xsolt-footer">
      <div className="xsolt-view xsolt-footer__inner">
        <div className="xsolt-footer__brand">
          <div className="xsolt-sidebar__brand-row">
            <ProductTemplateLogoMark className="xsolt-brand__mark xsolt-brand__mark--logo" />
            <span className="xsolt-sidebar__brand-text">{productSiteConfig.product.name}</span>
          </div>
          <p>{t("description", { productName: productSiteConfig.product.name })}</p>
        </div>

        <div className="xsolt-footer__columns">
          <div>
            <h3>{t("product")}</h3>
            <ul>
              <li><Link href={appRoutes.marketing.product}>{t("product")}</Link></li>
              <li><Link href={appRoutes.marketing.howItWorks}>{nav("howItWorks")}</Link></li>
              <li><Link href={appRoutes.marketing.pricing}>{nav("pricing")}</Link></li>
              <li><Link href={appRoutes.legal.faq}>{t("faq")}</Link></li>
            </ul>
          </div>
          <div>
            <h3>{t("legal")}</h3>
            <ul>
              <li><Link href={appRoutes.legal.privacy}>{t("privacy")}</Link></li>
              <li><Link href={appRoutes.legal.terms}>{t("terms")}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="xsolt-view xsolt-footer__bottom">
        <span>{productSiteConfig.company.name}</span>
      </div>
    </footer>
  );
}
