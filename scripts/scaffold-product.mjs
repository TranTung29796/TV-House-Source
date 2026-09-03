import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function readArg(flag) {
  let index = -1;
  for (let cursor = 0; cursor < process.argv.length; cursor += 1) {
    if (process.argv[cursor] === flag) index = cursor;
  }
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function fail(message) {
  throw new Error(`[scaffold-product] ${message}`);
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

function pushFlag(args, flag, value) {
  if (value == null || value === "") return;
  args.push(flag, value);
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..");
const systemRoot = resolve(projectRoot, "..", "..", "..");
const scaffoldPromptScript = resolve(projectRoot, "scripts", "scaffold-mvp-prompt.mjs");
const pipelineScript = resolve(systemRoot, "Product-Registry", "scripts", "web_pipeline.py");

const productName = readArg("--product-name");
const productId = readArg("--product-id") || slugify(productName);

if (!productName && !productId) {
  fail(
    "Usage: pnpm run scaffold:product -- --product-name \"Ghost Recovery\" [--target-user ...] [--problem ...] [--output examples/ghost-recovery.prompt.json]",
  );
}

const promptOutput = resolve(
  projectRoot,
  readArg("--output") || `examples/${productId}.prompt.json`,
);

const scaffoldArgs = [scaffoldPromptScript];
pushFlag(scaffoldArgs, "--product-name", productName);
pushFlag(scaffoldArgs, "--product-id", productId);
pushFlag(scaffoldArgs, "--industry", readArg("--industry"));
pushFlag(scaffoldArgs, "--idea-id", readArg("--idea-id"));
pushFlag(scaffoldArgs, "--company-name", readArg("--company-name"));
pushFlag(scaffoldArgs, "--support-email", readArg("--support-email"));
pushFlag(scaffoldArgs, "--website-url", readArg("--website-url"));
pushFlag(scaffoldArgs, "--domain", readArg("--domain"));
pushFlag(scaffoldArgs, "--legal-entity", readArg("--legal-entity"));
pushFlag(scaffoldArgs, "--governing-law", readArg("--governing-law"));
pushFlag(scaffoldArgs, "--refund-policy", readArg("--refund-policy"));
pushFlag(scaffoldArgs, "--data-retention-policy", readArg("--data-retention-policy"));
pushFlag(scaffoldArgs, "--target-user", readArg("--target-user"));
pushFlag(scaffoldArgs, "--problem", readArg("--problem"));
pushFlag(scaffoldArgs, "--prompt", readArg("--prompt"));
pushFlag(scaffoldArgs, "--monetization", readArg("--monetization"));
pushFlag(scaffoldArgs, "--payment-provider", readArg("--payment-provider"));
pushFlag(scaffoldArgs, "--launch-target", readArg("--launch-target"));
pushFlag(scaffoldArgs, "--pipeline-db-env", readArg("--pipeline-db-env"));
pushFlag(scaffoldArgs, "--output", promptOutput);

const scaffoldResult = spawnSync("node", scaffoldArgs, {
  cwd: projectRoot,
  stdio: "inherit",
});

if (scaffoldResult.status !== 0) {
  process.exit(scaffoldResult.status ?? 1);
}

if (hasFlag("--skip-pipeline")) {
  console.log(`scaffold-only complete: ${promptOutput}`);
  process.exit(0);
}

const pipelineArgs = [
  pipelineScript,
  "--prompt-file",
  promptOutput,
  "--generate-product-code",
];

if (hasFlag("--run-build")) pipelineArgs.push("--run-build");
if (hasFlag("--install-deps")) pipelineArgs.push("--install-deps");
if (hasFlag("--skip-install-deps")) pipelineArgs.push("--skip-install-deps");
if (hasFlag("--fail-on-build-error")) pipelineArgs.push("--fail-on-build-error");
if (hasFlag("--strict-production")) pipelineArgs.push("--strict-production");
if (hasFlag("--update-registry")) pipelineArgs.push("--update-registry");
if (hasFlag("--include-source-snapshot")) pipelineArgs.push("--include-source-snapshot");

const pipelineResult = spawnSync("python3", pipelineArgs, {
  cwd: projectRoot,
  stdio: "inherit",
});

process.exit(pipelineResult.status ?? 1);
