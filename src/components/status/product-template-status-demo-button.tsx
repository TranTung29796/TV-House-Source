"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { useProductTemplateStatus } from "@/components/status/product-template-status-provider";

export function ProductTemplateStatusDemoButton() {
  const t = useTranslations("status");
  const timeoutRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const { pushToast } = useProductTemplateStatus();

  function handleShowDemo() {
    for (const timer of timeoutRef.current) {
      clearTimeout(timer);
    }
    timeoutRef.current = [];

    pushToast({
      tone: "success",
      title: t("successTitle"),
      message: t("successMessage"),
    });

    timeoutRef.current.push(
      setTimeout(() => {
        pushToast({
          tone: "warning",
          title: t("warningTitle"),
          message: t("warningMessage"),
        });
      }, 220),
    );

    timeoutRef.current.push(
      setTimeout(() => {
        pushToast({
          tone: "error",
          title: t("errorTitle"),
          message: t("errorMessage"),
        });
      }, 440),
    );
  }

  return (
    <button
      type="button"
      className="xsolt-status-demo-button"
      onClick={handleShowDemo}
    >
      {t("demoButton")}
    </button>
  );
}
