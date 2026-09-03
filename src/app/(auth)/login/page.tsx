import { Suspense } from "react";

import { ProductTemplateAuthShowcase } from "@/components/auth/product-template-auth-showcase";
import { ProductTemplateSampleShell } from "@/components/shell/product-template-sample-shell";
import { ProductTemplateAuthLoadingState } from "@/components/states/product-template-auth-loading-state";

export default function LoginPage() {
  return (
    <ProductTemplateSampleShell>
      <Suspense fallback={<ProductTemplateAuthLoadingState />}>
        <ProductTemplateAuthShowcase initialMode="login" />
      </Suspense>
    </ProductTemplateSampleShell>
  );
}
