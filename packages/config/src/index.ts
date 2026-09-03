export * from "./env";

/**
 * Shared, non-secret application constants.
 */
export const APP_CONFIG = {
  name: "XSolution",
  description: "The XSolution web platform.",
  locale: "en",
  themeColor: "#0f172a",
} as const;

export type AppConfig = typeof APP_CONFIG;
