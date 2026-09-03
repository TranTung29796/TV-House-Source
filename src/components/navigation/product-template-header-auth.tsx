"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useAuth } from "@datbuilds/auth/provider";

import { appRoutes } from "@/config/routes";
import { ProductTemplateLanguageSwitcher } from "@/components/navigation/product-template-language-switcher";
import { ProductTemplateThemeToggle } from "@/components/navigation/product-template-theme-toggle";

export function ProductTemplateHeaderAuth({
  onOpenLogin,
}: {
  onOpenLogin: () => void;
}) {
  const { user, loading } = useAuth();
  const t = useTranslations("nav");

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Alex Mercer";
  const avatarLabel = displayName.slice(0, 1).toUpperCase();
  const isProPlan = Boolean(user);

  if (loading && !user) {
    return (
      <div className="xsolt-header-auth xsolt-header-auth--loading" aria-hidden="true">
        <ProductTemplateLanguageSwitcher />
        <ProductTemplateThemeToggle />
      </div>
    );
  }

  if (user) {
    return (
      <div className="xsolt-header-auth xsolt-header-auth--authenticated">
        <ProductTemplateLanguageSwitcher />
        <ProductTemplateThemeToggle />
        <Link
          href={appRoutes.product.account}
          className="xsolt-sidebar__account"
          aria-label={`${displayName}${isProPlan ? `, ${t("proPlan")}` : ""}`}
          title={`${displayName}${isProPlan ? ` · ${t("proPlan")}` : ""}`}
        >
          <span className="xsolt-sidebar__account-avatar">{avatarLabel}</span>
          {isProPlan ? (
            <span className="xsolt-sidebar__account-vip" aria-hidden="true">
              <svg viewBox="0 0 16 16" focusable="false">
                <path d="M3.2 11.8h9.6l1-5.2-3.3 2-2.5-4-2.5 4-3.3-2 1 5.2Z" />
                <path d="M4 13.5h8" />
              </svg>
            </span>
          ) : null}
        </Link>
      </div>
    );
  }

  return (
    <div className="xsolt-header-auth">
      <ProductTemplateLanguageSwitcher />
      <ProductTemplateThemeToggle />
      <button type="button" className="xsolt-sidebar__auth-link" onClick={onOpenLogin}>
        {t("login")}
      </button>
    </div>
  );
}
