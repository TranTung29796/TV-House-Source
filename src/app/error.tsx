"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { ProductTemplateErrorState } from "@/components/states/product-template-error-state";
import { reportClientError, serializeError } from "@datbuilds/logging";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    void reportClientError(
      serializeError(error, {
        boundary: "app",
        digest: error.digest,
      }),
    );
  }, [error]);

  return (
    <ProductTemplateErrorState
      code="500"
      title={t("globalTitle")}
      description={t("globalDescription")}
      retryLabel={t("tryAgain")}
      onRetry={reset}
      secondaryHref="/"
      secondaryLabel={t("backHome")}
    />
  );
}
