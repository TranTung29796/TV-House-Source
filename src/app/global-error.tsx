"use client";

import { useEffect, useMemo } from "react";

import { ProductTemplateErrorState } from "@/components/states/product-template-error-state";
import { reportClientError, serializeError } from "@datbuilds/logging";
import { defaultLocale, isAppLocale, localeCookieName } from "@/i18n/config";
import enMessages from "../../messages/en.json";
import deMessages from "../../messages/de.json";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const copy = useMemo(() => {
    if (typeof document === "undefined") return enMessages.errors;

    const localeValue = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${localeCookieName}=`))
      ?.split("=")[1];
    const locale = isAppLocale(localeValue) ? localeValue : defaultLocale;

    return locale === "de" ? deMessages.errors : enMessages.errors;
  }, []);

  useEffect(() => {
    void reportClientError(
      serializeError(error, {
        boundary: "global",
        digest: error.digest,
      }),
    );
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ProductTemplateErrorState
          code="500"
          title={copy.globalTitle}
          description={copy.globalDescription}
          retryLabel={copy.tryAgain}
          onRetry={reset}
          secondaryHref="/"
          secondaryLabel={copy.backHome}
        />
      </body>
    </html>
  );
}
