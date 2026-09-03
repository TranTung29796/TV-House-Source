import { resolve } from "node:path";
import { readJsonFile, validateProductContent } from "./lib/product-content-tools.mjs";

const targetPath = resolve(process.cwd(), process.argv[2] ?? "product/product-content.json");
const productContent = readJsonFile(targetPath);
validateProductContent(productContent);

console.log(`product content valid: ${targetPath}`);
