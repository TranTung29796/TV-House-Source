import { cookies, headers } from "next/headers";

import {
  defaultLocale,
  isAppLocale,
  localeCookieName,
  resolveLocaleFromHeader,
  type AppLocale,
} from "@/i18n/config";

export async function getServerLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;

  if (isAppLocale(cookieLocale)) {
    return cookieLocale;
  }

  return resolveLocaleFromHeader(headerStore.get("accept-language")) ?? defaultLocale;
}
