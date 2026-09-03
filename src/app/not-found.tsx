import { getTranslations } from "next-intl/server";

import { ProductTemplateErrorState } from "@/components/states/product-template-error-state";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <ProductTemplateErrorState
      code="404"
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      primaryHref="/"
      primaryLabel={t("backHome")}
      secondaryHref="/account"
      secondaryLabel={t("openAccount")}
    />
  );
}
