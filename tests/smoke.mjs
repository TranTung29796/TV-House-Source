import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const requiredFiles = [
  "package.json",
  "next.config.mjs",
  "src/app/layout.tsx",
  "src/app/(marketing)/page.tsx",
  "src/app/cart/page.tsx",
  "src/app/admin/page.tsx",
  "src/app/api/products/route.ts",
  "src/app/api/orders/route.ts",
  "src/lib/store-db.ts",
  "src/lib/store-types.ts",
  "database/schema.sql",
  "public/images/tv-hero.png",
];

const missing = requiredFiles.filter((file) => !existsSync(resolve(root, file)));
if (missing.length) {
  throw new Error(`Missing required web-runtime files: ${missing.join(", ")}`);
}

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
for (const script of ["build", "start", "lint", "typecheck", "test"]) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`Missing package script: ${script}`);
  }
}

const databaseSource = readFileSync(resolve(root, "src/lib/store-db.ts"), "utf8");
for (const table of ["products", "orders", "order_items"]) {
  if (!databaseSource.includes(`CREATE TABLE IF NOT EXISTS ${table}`)) {
    throw new Error(`Missing SQLite table: ${table}`);
  }
}

console.log("TV House smoke test passed: routes, assets and 3 SQLite tables are present");
