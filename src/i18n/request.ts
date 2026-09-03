import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import {
  defaultLocale,
  isAppLocale,
  localeCookieName,
  resolveLocaleFromHeader,
} from "@/i18n/config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isAppLocale(cookieLocale)
    ? cookieLocale
    : resolveLocaleFromHeader(headerStore.get("accept-language"));

  return {
    locale: locale ?? defaultLocale,
    messages: (await import(`../../messages/${locale ?? defaultLocale}.json`)).default,
  };
});
