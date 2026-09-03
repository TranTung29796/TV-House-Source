"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@datbuilds/ui/components/button";

import { useProductTemplateStatus } from "@/components/status/product-template-status-provider";
import { appRoutes } from "@/config/routes";

export function BillingPortalButton() {
  const t = useTranslations("account");
  const { pushToast } = useProductTemplateStatus();
  const [isLoading, setIsLoading] = useState(false);

  async function openBillingPortal() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/billing/portal", {
        headers: {
          "x-xsolt-client": "1",
        },
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; url?: string; error?: string; code?: string }
        | null;

      if (response.ok && payload?.success && payload.url) {
        window.location.href = payload.url;
        return;
      }

      if (payload?.code === "UNAUTHENTICATED") {
        const redirectTarget = `${window.location.pathname}${window.location.search}`;
        window.location.href = `${appRoutes.auth.login}?redirect=${encodeURIComponent(redirectTarget)}`;
        return;
      }

      const message =
        payload?.code === "BILLING_PORTAL_UNAVAILABLE"
          ? t("portalUnavailable")
          : payload?.error ?? t("portalUnavailable");

      pushToast({ tone: "warning", message });
    } catch {
      pushToast({ tone: "error", message: t("portalUnavailable") });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={openBillingPortal}
      disabled={isLoading}
      className={`xsolt-account-button xsolt-account-button--gradient${isLoading ? " xsolt-button-loading" : ""}`}
    >
      {isLoading ? t("openingBillingPortal") : t("manageSubscription")}
    </Button>
  );
}
