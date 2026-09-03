"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@datbuilds/ui/components/button";
import { useProductTemplateStatus } from "@/components/status/product-template-status-provider";
import { appRoutes } from "@/config/routes";

type LevelCheckoutButtonProps = {
  levelId: string;
  label?: string;
  className?: string;
};

export function LevelCheckoutButton({
  levelId,
  label = "Choose plan",
  className,
}: LevelCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("pricing");
  const { pushToast } = useProductTemplateStatus();

  async function startCheckout() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ levelId }),
      });

      if (response.status === 401) {
        const redirectTarget = `${window.location.pathname}${window.location.search}`;
        window.location.href =
          `${appRoutes.auth.login}?redirect=${encodeURIComponent(redirectTarget)}` +
          `&level=${encodeURIComponent(levelId)}`;
        return;
      }

      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Checkout is unavailable.");
      }

      window.location.href = payload.url;
    } catch (error) {
      pushToast({
        tone: "error",
        message:
          error instanceof Error && error.message
            ? error.message
            : t("checkoutUnavailable"),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={startCheckout}
      disabled={isLoading}
      className={`${className ?? "w-full"} ${isLoading ? "xsolt-button-loading" : ""}`}
    >
      {isLoading ? (
          <span className="xsolt-button-loading__content">
          <span className="xsolt-button-loading__shimmer" aria-hidden="true" />
          <span>{t("startingCheckout")}</span>
        </span>
      ) : (
        label
      )}
    </Button>
  );
}
