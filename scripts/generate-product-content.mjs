import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  createLocalizedProductContent,
  readJsonFile,
  supportedLocales,
} from "./lib/product-content-tools.mjs";

function readArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function fail(message) {
  throw new Error(`[generate-product-content] ${message}`);
}

function resolveMarketingBlock(candidate, label) {
  if (!candidate || typeof candidate !== "object") {
    fail(`${label} must be an object.`);
  }

  if (candidate.marketing) return candidate.marketing;
  return candidate;
}

function pickOverrides(input) {
  const overrides = {};

  if (input.translations && typeof input.translations === "object") {
    for (const locale of supportedLocales) {
      if (input.translations[locale]) {
        overrides[locale] = resolveMarketingBlock(input.translations[locale], `translations.${locale}`);
      }
    }
  }

  if (input.locales && typeof input.locales === "object") {
    for (const locale of supportedLocales) {
      if (input.locales[locale]) {
        overrides[locale] = resolveMarketingBlock(input.locales[locale], `locales.${locale}`);
      }
    }
  }

  return overrides;
}

function resolveSourceMarketing(input, sourceLocale) {
  if (input.marketing) {
    return resolveMarketingBlock(input, "marketing");
  }

  if (input.locales?.[sourceLocale]) {
    return resolveMarketingBlock(input.locales[sourceLocale], `locales.${sourceLocale}`);
  }

  if (input.translations?.[sourceLocale]) {
    return resolveMarketingBlock(input.translations[sourceLocale], `translations.${sourceLocale}`);
  }

  fail(
    `Cannot find source marketing content for locale ${sourceLocale}. Expected marketing, locales.${sourceLocale}, or translations.${sourceLocale}.`,
  );
}

const inputArg = process.argv[2];
const outputArg = process.argv[3] ?? "product/product-content.generated.json";
const sourceLocale = readArg("--source-locale") ?? "en";
const copySourceToMissing = !hasFlag("--strict-locales");

if (!inputArg || inputArg.startsWith("--")) {
  fail(
    "Usage: node scripts/generate-product-content.mjs <input-json> [output-json] [--source-locale en|de] [--strict-locales]",
  );
}

const inputPath = resolve(process.cwd(), inputArg);
const outputPath = resolve(process.cwd(), outputArg);
const input = readJsonFile(inputPath);

const sourceMarketing = resolveSourceMarketing(input, sourceLocale);
const localeOverrides = pickOverrides(input);

const productContent = createLocalizedProductContent({
  sourceLocale,
  sourceMarketing,
  localeOverrides,
  copySourceToMissing,
});

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(productContent, null, 2)}\n`, "utf8");

console.log(`generated product content: ${outputPath}`);
