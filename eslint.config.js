import { nextConfig } from "@datbuilds/eslint-config/next";

export default [
  ...nextConfig,
  {
    files: ["scripts/**/*.mjs", "tests/**/*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        structuredClone: "readonly",
        URL: "readonly",
      },
    },
  },
];
