"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { useAuth } from "@datbuilds/auth/provider";
import { ProductTemplateAuthShowcase } from "@/components/auth/product-template-auth-showcase";
import { ProductTemplateLogoMark } from "@/components/branding/product-template-logo-mark";
import { ProductTemplateHeaderAuth } from "@/components/navigation/product-template-header-auth";
import { ProductTemplateScrollIndicator } from "@/components/navigation/product-template-scroll-indicator";
import { ProductTemplateSiteFooter } from "@/components/navigation/product-template-site-footer";
import { ProductTemplateStatusDemoButton } from "@/components/status/product-template-status-demo-button";
import { productConfig } from "@/config/product";
import { appRoutes } from "@/config/routes";

const navRoutes = [
  { href: appRoutes.marketing.product, labelKey: "product", icon: "grid" },
  { href: appRoutes.marketing.howItWorks, labelKey: "howItWorks", icon: "card" },
  { href: appRoutes.marketing.pricing, labelKey: "pricing", icon: "coins" },
  { href: appRoutes.legal.faq, labelKey: "faq", icon: "grid" },
] as const;

const legalRoutes = [appRoutes.legal.terms, appRoutes.legal.privacy];
const footerRoutes = new Set<string>([
  appRoutes.marketing.product,
  appRoutes.marketing.howItWorks,
  appRoutes.marketing.pricing,
  appRoutes.legal.faq,
  ...legalRoutes,
]);

const workspaceRoutes = new Set<string>([
  ...navRoutes.map((route) => route.href),
  ...legalRoutes,
  appRoutes.auth.login,
  appRoutes.product.account,
]);

export function ProductTemplateWorkspaceChrome({ children }: { children: ReactNode }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [isClosingAuthPanel, setIsClosingAuthPanel] = useState(false);
  const [renderedAuthPanelMode, setRenderedAuthPanelMode] = useState<"login" | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const authParam = searchParams.get("auth");
  const authPanelMode = authParam === "login" ? "login" : null;

  useEffect(() => {
    if (authPanelMode) {
      setRenderedAuthPanelMode(authPanelMode);
      setIsClosingAuthPanel(false);
    }
  }, [authPanelMode]);

  useEffect(() => {
    for (const route of navRoutes) {
      router.prefetch(route.href);
    }
    router.prefetch(appRoutes.product.account);
  }, [router]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (!workspaceRoutes.has(pathname)) {
    return <>{children}</>;
  }

  const showFooter = footerRoutes.has(pathname);

  function updateAuthPanel(nextMode: "login" | null) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextMode) {
      nextParams.set("auth", nextMode);
      nextParams.set("redirect", pathname);
    } else {
      nextParams.delete("auth");
      nextParams.delete("redirect");
    }

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function closeAuthPanel() {
    if (isClosingAuthPanel) {
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    setIsClosingAuthPanel(true);
    closeTimerRef.current = setTimeout(() => {
      setRenderedAuthPanelMode(null);
      updateAuthPanel(null);
      setIsClosingAuthPanel(false);
    }, 240);
  }

  return (
    <div className="xsolt-workspace">
      <div className="xsolt-workspace__frame">
        <ProductTemplateScrollIndicator />
        <div className="xsolt-sidebar xsolt-sidebar--horizontal">
          <div className="xsolt-sidebar__brand">
            <div className="xsolt-sidebar__brand-row">
              <ProductTemplateLogoMark className="xsolt-brand__mark xsolt-brand__mark--logo" />
              <span className="xsolt-sidebar__brand-text">{productConfig.name}</span>
            </div>
          </div>

          <nav className="xsolt-sidebar__nav" aria-label="Primary">
            {navRoutes.map((route) => {
              const active = pathname === route.href;

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`xsolt-sidebar__link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => router.prefetch(route.href)}
                >
                  <SidebarGlyph type={route.icon} />
                  <span>{t(route.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="xsolt-sidebar__footer">
            <ProductTemplateHeaderAuth onOpenLogin={() => updateAuthPanel("login")} />
          </div>
        </div>

        <div className="xsolt-workspace__content-shell">
          <main className="xsolt-workspace__content">{children}</main>
          {showFooter ? <ProductTemplateSiteFooter /> : null}
        </div>
      </div>

      {!user && !loading && renderedAuthPanelMode ? (
        <ProductTemplateAuthShowcase
          presentation="drawer"
          initialMode={renderedAuthPanelMode}
          redirectTo={pathname}
          onClose={closeAuthPanel}
          isClosing={isClosingAuthPanel}
        />
      ) : null}

      <ProductTemplateStatusDemoButton />
    </div>
  );
}

function SidebarGlyph({ type }: { type: string }) {
  return (
    <span
      className={`xsolt-sidebar__glyph xsolt-sidebar__glyph--${type}`}
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
