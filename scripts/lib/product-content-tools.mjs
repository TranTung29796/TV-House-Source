import { readFileSync } from "node:fs";

export const supportedLocales = ["en", "de"];
export const allowedIcons = ["capture", "detect", "impact", "action"];

function fail(message) {
  throw new Error(`[product-content] ${message}`);
}

function ensureNonEmptyString(value, path) {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(`${path} must be a non-empty string.`);
  }
}

function ensureArray(value, path, minItems = 0) {
  if (!Array.isArray(value) || value.length < minItems) {
    fail(`${path} must be an array with at least ${minItems} item(s).`);
  }
}

function ensureIcon(value, path) {
  if (!allowedIcons.includes(value)) {
    fail(`${path} must be one of ${allowedIcons.join(" | ")}.`);
  }
}

function validateLocaleContent(content, locale) {
  const base = `locales.${locale}.marketing`;
  const { overview, howItWorks, pricing } = content?.marketing ?? {};

  ensureNonEmptyString(overview?.heroTitle, `${base}.overview.heroTitle`);
  ensureNonEmptyString(overview?.heroDescription, `${base}.overview.heroDescription`);
  ensureNonEmptyString(overview?.primaryCta, `${base}.overview.primaryCta`);
  ensureNonEmptyString(overview?.secondaryCta, `${base}.overview.secondaryCta`);

  ensureNonEmptyString(howItWorks?.eyebrow, `${base}.howItWorks.eyebrow`);
  ensureNonEmptyString(howItWorks?.title, `${base}.howItWorks.title`);
  ensureNonEmptyString(howItWorks?.description, `${base}.howItWorks.description`);
  ensureArray(howItWorks?.signalChips, `${base}.howItWorks.signalChips`, 1);
  ensureArray(howItWorks?.steps, `${base}.howItWorks.steps`, 4);

  howItWorks.signalChips.forEach((chip, index) => {
    ensureNonEmptyString(chip?.label, `${base}.howItWorks.signalChips[${index}].label`);
    ensureIcon(chip?.icon, `${base}.howItWorks.signalChips[${index}].icon`);
  });

  howItWorks.steps.forEach((step, index) => {
    ensureNonEmptyString(step?.step, `${base}.howItWorks.steps[${index}].step`);
    ensureNonEmptyString(step?.title, `${base}.howItWorks.steps[${index}].title`);
    ensureNonEmptyString(step?.body, `${base}.howItWorks.steps[${index}].body`);
    ensureArray(step?.points, `${base}.howItWorks.steps[${index}].points`, 1);
    step.points.forEach((point, pointIndex) => {
      ensureNonEmptyString(
        point,
        `${base}.howItWorks.steps[${index}].points[${pointIndex}]`,
      );
    });
    ensureIcon(step?.icon, `${base}.howItWorks.steps[${index}].icon`);
  });

  ensureNonEmptyString(pricing?.title, `${base}.pricing.title`);
  ensureNonEmptyString(pricing?.description, `${base}.pricing.description`);
  ensureNonEmptyString(pricing?.monthlyLabel, `${base}.pricing.monthlyLabel`);
  ensureNonEmptyString(pricing?.yearlyLabel, `${base}.pricing.yearlyLabel`);
  ensureNonEmptyString(pricing?.yearlyDiscountLabel, `${base}.pricing.yearlyDiscountLabel`);
  ensureNonEmptyString(pricing?.featuredLabel, `${base}.pricing.featuredLabel`);
}

export function validateProductContent(productContent) {
  if (!productContent || typeof productContent !== "object") {
    fail("Root value must be an object.");
  }

  if (!productContent.locales || typeof productContent.locales !== "object") {
    fail("Root must contain locales.");
  }

  for (const locale of supportedLocales) {
    if (!productContent.locales[locale]) {
      fail(`Missing locales.${locale}.`);
    }

    validateLocaleContent(productContent.locales[locale], locale);
  }

  return productContent;
}

export function readJsonFile(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function createLocalizedProductContent({
  sourceLocale = "en",
  sourceMarketing,
  localeOverrides = {},
  copySourceToMissing = true,
}) {
  if (!supportedLocales.includes(sourceLocale)) {
    fail(`sourceLocale must be one of ${supportedLocales.join(", ")}.`);
  }

  const locales = {};

  for (const locale of supportedLocales) {
    const localeMarketing =
      locale === sourceLocale
        ? sourceMarketing
        : localeOverrides[locale] ?? (copySourceToMissing ? sourceMarketing : null);

    if (!localeMarketing) {
      fail(`Missing localized marketing content for locale ${locale}.`);
    }

    locales[locale] = { marketing: localeMarketing };
  }

  return validateProductContent({ locales });
}
