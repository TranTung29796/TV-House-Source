"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { productConfig } from "@/config/product";

type ThemeMode = "light" | "dark";

function getResolvedTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ProductTemplateThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [isAnimating, setIsAnimating] = useState(false);
  const t = useTranslations("nav");

  useEffect(() => {
    setTheme(getResolvedTheme());
  }, []);

  function toggleTheme() {
    setIsAnimating(true);
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    localStorage.setItem(productConfig.themeStorageKey, nextTheme);
    document.cookie = `${productConfig.themeCookieKey}=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    setTheme(nextTheme);
    window.setTimeout(() => setIsAnimating(false), 220);
  }

  return (
    <button
      type="button"
      className={`xsolt-theme-toggle${isAnimating ? " is-animating" : ""}`}
      onClick={toggleTheme}
      aria-label={theme === "dark" ? t("switchToLight") : t("switchToDark")}
      title={theme === "dark" ? t("switchToLight") : t("switchToDark")}
    >
      <span
        className={`xsolt-theme-toggle__icon xsolt-theme-toggle__icon--${theme}`}
        aria-hidden="true"
      >
        {theme === "dark" ? "☾" : "☼"}
      </span>
    </button>
  );
}
