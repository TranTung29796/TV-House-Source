import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
const websiteRoot = resolve(scriptDir, "..", "..");
const outputRoot = resolve(websiteRoot, "output");

import { variants } from "./web-variants.config.mjs";

for (const variant of variants) {
  const root = resolve(outputRoot, variant.dir);
  const packageJsonPath = resolve(root, "package.json");
  const productPath = resolve(root, "src/config/product.ts");
  const sitePath = resolve(root, "src/config/product-site.ts");
  const contentPath = resolve(root, "product/product-content.json");
  const pricingPath = resolve(root, "pricing/product-pricing-plans.json");
  const messagesEnPath = resolve(root, "messages/en.json");
  const messagesDePath = resolve(root, "messages/de.json");
  const authShowcasePath = resolve(root, "src/components/auth/product-template-auth-showcase.tsx");
  const globalsCssPath = resolve(root, "src/app/globals.css");

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
  packageJson.name = variant.packageName;
  packageJson.scripts.dev = `next dev --port ${variant.port}`;
  packageJson.scripts.start = `next start --port ${variant.port}`;
  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

  const productContent = JSON.parse(await readFile(contentPath, "utf8"));
  productContent.locales.en.marketing.overview = variant.overview.en;
  productContent.locales.de.marketing.overview = variant.overview.de;
  productContent.locales.en.marketing.howItWorks = variant.howItWorks.en;
  productContent.locales.de.marketing.howItWorks = variant.howItWorks.de;
  productContent.locales.en.marketing.pricing = variant.pricingCopy.en;
  productContent.locales.de.marketing.pricing = variant.pricingCopy.de;
  await writeFile(contentPath, `${JSON.stringify(productContent, null, 2)}\n`);

  const pricingJson = {
    product: {
      code: variant.product.code,
      name: variant.product.name,
      platform: "web",
    },
    plans: variant.pricingPlans,
  };
  await writeFile(pricingPath, `${JSON.stringify(pricingJson, null, 2)}\n`);

  for (const [messagesPath, locale] of [
    [messagesEnPath, "en"],
    [messagesDePath, "de"],
  ]) {
    const messages = JSON.parse(await readFile(messagesPath, "utf8"));
    const localizedPricing = locale === "en" ? variant.pricingCopy.en : variant.pricingCopy.de;

    messages.common.productName = variant.messages.common.productName;
    messages.common.companyName = variant.messages.common.companyName;
    messages.nav.login = variant.messages.nav.login;
    messages.pricing.title = localizedPricing.title;
    messages.pricing.description = variant.messages.pricing.description;
    messages.pricing.monthlyLabel = localizedPricing.monthlyLabel;
    messages.pricing.yearlyLabel = localizedPricing.yearlyLabel;
    messages.pricing.yearlyDiscountLabel = localizedPricing.yearlyDiscountLabel;
    messages.pricing.featuredLabel = localizedPricing.featuredLabel;
    messages.pricing.startPlan = variant.messages.pricing.startPlan;
    messages.pricing.entitlements = variant.messages.pricing.entitlements;
    messages.auth.pageLoginSubtitle = variant.messages.auth.pageLoginSubtitle;
    messages.auth.drawerLoginSubtitle = variant.messages.auth.drawerLoginSubtitle;
    messages.faq.title = variant.messages.faq.title;
    messages.faq.quickActions = variant.messages.faq.quickActions;
    messages.faq.cards = variant.messages.faq.cards;
    messages.privacy.heroTitleLead = variant.messages.privacy?.heroTitleLead ?? messages.privacy.heroTitleLead;
    messages.privacy.heroTitleAccent = variant.messages.privacy?.heroTitleAccent ?? messages.privacy.heroTitleAccent;
    messages.terms.heroTitleLead = variant.messages.terms?.heroTitleLead ?? messages.terms.heroTitleLead;
    messages.terms.heroTitleAccent = variant.messages.terms?.heroTitleAccent ?? messages.terms.heroTitleAccent;
    messages.footer.about = variant.messages.footer.about;
    await writeFile(messagesPath, `${JSON.stringify(messages, null, 2)}\n`);
  }

  let productTs = await readFile(productPath, "utf8");
  productTs = productTs
    .replace('.default("product-template")', `.default("${variant.product.code}")`)
    .replace('.default("Product Template")', `.default("${variant.product.name}")`)
    .replace('.default("DatBuilds")', `.default("${variant.product.companyName}")`)
    .replace('.default("http://localhost:3003")', `.default("${variant.product.websiteUrl}")`)
    .replace('.default("[LEGAL_ENTITY]")', `.default("${variant.product.legalEntity}")`)
    .replace('.default("[GOVERNING_LAW]")', `.default("${variant.product.governingLaw}")`)
    .replace(
      /"Refund requests are reviewed according to \[REFUND_POLICY\] and any plan-specific billing terms shown at checkout\.",/g,
      `${JSON.stringify(variant.product.refundPolicy)},`,
    )
    .replace(
      /"Account and operational records are kept for as long as needed to provide the service, meet legal obligations, resolve disputes, and enforce agreements\.",/g,
      `${JSON.stringify(variant.product.dataRetentionPolicy)},`,
    );
  await writeFile(productPath, productTs);

  let siteTs = await readFile(sitePath, "utf8");
  siteTs = siteTs
    .replace(
      /description:\s*\n\s*`\$\{productName\} keeps roadmap context, launch execution, and team alignment in a quieter, more focused workspace\.`,/,
      `description:\n      ${JSON.stringify(variant.site.description)},`,
    )
    .replace(
      /corePurpose:\s*\n\s*"keep roadmap context, launch execution, and team alignment in one focused workspace",/,
      `corePurpose:\n      ${JSON.stringify(variant.site.corePurpose)},`,
    )
    .replace(
      /problemStatement:\s*\n\s*"Product work often gets split across too many disconnected pages, tools, and handoffs\. The product is designed to keep planning, execution, billing, and account flows in one calmer system\.",/,
      `problemStatement:\n      ${JSON.stringify(variant.site.problemStatement)},`,
    );
  await writeFile(sitePath, siteTs);

  let authTsx = await readFile(authShowcasePath, "utf8");
  authTsx = authTsx
    .replace(
      /const featureItems = \[[\s\S]*?\] as const;/,
      `const featureItems = ${JSON.stringify(variant.auth.features, null, 2)} as const;`,
    )
    .replace("<strong>NEXORA</strong>", `<strong>${variant.auth.brand}</strong>`)
    .replace("<span>Build. Launch. Scale.</span>", `<span>${variant.auth.tagline}</span>`)
    .replace(
      /<h2>\s*Build amazing\s*<br \/>\s*products, <em>faster<\/em>\s*<\/h2>/,
      `<h2>${variant.auth.titleHtml}</h2>`,
    )
    .replace(
      /<p>\s*The all-in-one platform to ship beautiful digital products and grow your\s*business\.\s*<\/p>/,
      `<p>${variant.auth.body}</p>`,
    )
    .replace(
      /<p>Sign in to continue to your account<\/p>/,
      `<p>${variant.auth.subtitle}</p>`,
    )
    .replace(
      /: "Continue with email"}/,
      `: ${JSON.stringify(variant.auth.cta)}}`,
    );
  await writeFile(authShowcasePath, authTsx);

  const cssOverride = `

/* Variant overrides: ${variant.dir} */
:root {
  --xsolt-bg: ${variant.css.light.bg};
  --xsolt-surface: ${variant.css.light.surface};
  --xsolt-surface-solid: ${variant.css.light.surfaceSolid};
  --xsolt-surface-soft: ${variant.css.light.surfaceSoft};
  --xsolt-text: ${variant.css.light.text};
  --xsolt-text-muted: ${variant.css.light.textMuted};
  --xsolt-border: ${variant.css.light.border};
  --xsolt-primary: ${variant.css.light.primary};
  --xsolt-primary-strong: ${variant.css.light.primaryStrong};
  --xsolt-shadow: ${variant.css.light.shadow};
  --xsolt-header-bg: ${variant.css.light.headerBg};
  --xsolt-panel-bg: ${variant.css.light.panelBg};
  --xsolt-input-bg: ${variant.css.light.inputBg};
  --xsolt-hero-bg: ${variant.css.light.heroBg};
}

:root[data-theme="dark"] {
  --xsolt-bg: ${variant.css.dark.bg};
  --xsolt-surface: ${variant.css.dark.surface};
  --xsolt-surface-solid: ${variant.css.dark.surfaceSolid};
  --xsolt-surface-soft: ${variant.css.dark.surfaceSoft};
  --xsolt-text: ${variant.css.dark.text};
  --xsolt-text-muted: ${variant.css.dark.textMuted};
  --xsolt-border: ${variant.css.dark.border};
  --xsolt-primary: ${variant.css.dark.primary};
  --xsolt-primary-strong: ${variant.css.dark.primaryStrong};
  --xsolt-shadow: ${variant.css.dark.shadow};
  --xsolt-header-bg: ${variant.css.dark.headerBg};
  --xsolt-panel-bg: ${variant.css.dark.panelBg};
  --xsolt-input-bg: ${variant.css.dark.inputBg};
  --xsolt-hero-bg: ${variant.css.dark.heroBg};
}

.xsolt-panel,
.xsolt-inline-card,
.xsolt-highlight-card,
.xsolt-plan-card,
.xsolt-about-block,
.xsolt-about-stat,
.xsolt-overview__stat,
.xsolt-auth-card,
.xsolt-auth-drawer__panel,
.xsolt-glass-card,
.xsolt-payment__section,
.xsolt-payment__summary,
.xsolt-chatgpt-pricing-card,
.xsolt-how-it-works__card,
.xsolt-how-it-works__intro,
.xsolt-legal-showcase__card,
.xsolt-legal-showcase__contact,
.xsolt-login-card,
.xsolt-login-shell__brand-mark,
.xsolt-login-shell__feature-icon,
.xsolt-faq-actions__item {
  backdrop-filter: blur(22px) saturate(1.18);
  -webkit-backdrop-filter: blur(22px) saturate(1.18);
}
`;
  const globalsCss = await readFile(globalsCssPath, "utf8");
  const marker = `/* Variant overrides: ${variant.dir} */`;
  const nextCss = globalsCss.includes(marker)
    ? globalsCss.replace(new RegExp(`${marker}[\\s\\S]*$`), cssOverride.trimStart())
    : `${globalsCss}${cssOverride}`;
  await writeFile(globalsCssPath, nextCss);
}
