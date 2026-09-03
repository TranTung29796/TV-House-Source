import nextPlugin from "@next/eslint-plugin-next";

import { reactConfig } from "./react.js";

/**
 * Shared ESLint config for Next.js apps.
 * @type {import("eslint").Linter.Config[]}
 */
export const nextConfig = [
  ...reactConfig,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    ignores: ["next-env.d.ts", ".next/**"],
  },
];

export default nextConfig;
