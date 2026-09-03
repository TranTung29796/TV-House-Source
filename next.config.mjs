import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

const __dirname = dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: resolve(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.cache = false;
    return config;
  },
  transpilePackages: [
    "@datbuilds/ui",
    "@datbuilds/auth",
    "@datbuilds/seo",
    "@datbuilds/config",
    "@datbuilds/analytics",
    "@datbuilds/email",
    "@datbuilds/logging",
    "@datbuilds/payments",
    "@datbuilds/ai",
    "@datbuilds/support",
  ],
};

export default withNextIntl(nextConfig);
