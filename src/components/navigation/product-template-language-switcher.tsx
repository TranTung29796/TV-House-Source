"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { localeCookieName, locales, type AppLocale } from "@/i18n/config";

export function ProductTemplateLanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("nav");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) return;

    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="xsolt-language-switcher" aria-label={t("languageLabel")}>
      {locales.map((value) => (
        <button
          key={value}
          type="button"
          className={`xsolt-language-switcher__button${locale === value ? " is-active" : ""}`}
          aria-pressed={locale === value}
          disabled={isPending}
          onClick={() => setLocale(value)}
        >
          {value === "en" ? t("localeEnglish") : t("localeGerman")}
        </button>
      ))}
    </div>
  );
}
