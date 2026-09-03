export const localeCookieName = "xsolt-locale";

export const locales = ["en", "de"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return Boolean(value && locales.includes(value as AppLocale));
}

export function resolveLocaleFromHeader(header: string | null | undefined): AppLocale {
  if (!header) return defaultLocale;

  const normalized = header.toLowerCase();
  if (normalized.includes("de")) return "de";
  return defaultLocale;
}
