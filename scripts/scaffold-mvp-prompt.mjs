import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildIndustryProductContent, industryPresets } from "./industry-presets.mjs";

function readArg(flag) {
  let index = -1;
  for (let cursor = 0; cursor < process.argv.length; cursor += 1) {
    if (process.argv[cursor] === flag) index = cursor;
  }
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function fail(message) {
  throw new Error(`[scaffold-mvp-prompt] ${message}`);
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function titleCaseFromSlug(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function defaultDomain(productId) {
  return `${productId}.xsolt.io`;
}

const productName = readArg("--product-name");
const productIdArg = readArg("--product-id");
const outputArg = readArg("--output");
const industry = readArg("--industry")?.trim() || null;

if (!productName && !productIdArg) {
  fail(
    "Usage: node scripts/scaffold-mvp-prompt.mjs --product-name \"Ghost Recovery\" [--product-id ghost-recovery] [--output examples/my-product.json]",
  );
}

const templatePath = resolve(process.cwd(), "examples/mvp-prompt-file.web.example.json");
const outputPath = resolve(process.cwd(), outputArg ?? "examples/mvp-prompt-file.generated.json");
const template = JSON.parse(readFileSync(templatePath, "utf8"));
const preset = industry ? industryPresets[industry] : null;

if (industry && !preset) {
  fail(`Unknown industry preset: ${industry}. Available: ${Object.keys(industryPresets).join(", ")}`);
}

const productId = slugify(productIdArg ?? productName);
if (!productId) {
  fail("Could not derive a valid product-id.");
}

const resolvedProductName = productName?.trim() || titleCaseFromSlug(productId);
const companyName = readArg("--company-name")?.trim() || `${resolvedProductName} Labs`;
const domain = readArg("--domain")?.trim() || defaultDomain(productId);
const websiteUrl = readArg("--website-url")?.trim() || `https://${domain}`;
const supportEmail = readArg("--support-email")?.trim() || `support@${domain}`;
const legalEntity = readArg("--legal-entity")?.trim() || `${companyName} Pte. Ltd.`;
const governingLaw = readArg("--governing-law")?.trim() || "Singapore";
const targetUser = readArg("--target-user")?.trim() || preset?.targetUser || template.target_user;
const problem = readArg("--problem")?.trim() || preset?.problem || template.problem;
const prompt = readArg("--prompt")?.trim()
  || `Build a web MVP for ${targetUser.toLowerCase()} to solve: ${problem}`;
const monetization = readArg("--monetization")?.trim() || template.monetization;
const paymentProvider = readArg("--payment-provider")?.trim() || template.payment_provider;
const launchTarget = readArg("--launch-target")?.trim() || template.launch_target;
const pipelineDbEnv = readArg("--pipeline-db-env")?.trim() || template.pipeline_db_env;

const next = structuredClone(template);
next.prompt = prompt;
next.product_name = resolvedProductName;
next.product_id = productId;
next.idea_id = readArg("--idea-id")?.trim() || productId;
next.company_name = companyName;
next.support_email = supportEmail;
next.website_url = websiteUrl;
next.legal_entity = legalEntity;
next.governing_law = governingLaw;
next.refund_policy = readArg("--refund-policy")?.trim()
  || `Refund requests are reviewed within 14 days of the initial charge under the billing terms shown at checkout for ${resolvedProductName}.`;
next.data_retention_policy = readArg("--data-retention-policy")?.trim()
  || `Account, billing, and operational records for ${resolvedProductName} are retained only as long as needed to run the service, meet legal obligations, resolve disputes, and enforce platform agreements.`;
next.target_user = targetUser;
next.problem = problem;
next.monetization = monetization;
next.payment_provider = paymentProvider;
next.launch_target = launchTarget;
next.pipeline_db_env = pipelineDbEnv;
if (preset) {
  next.product_content_source = buildIndustryProductContent(preset);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");

console.log(`scaffolded prompt: ${outputPath}`);
