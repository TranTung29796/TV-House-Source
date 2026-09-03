import { ProductTemplateSampleShell } from "@/components/shell/product-template-sample-shell";
import { ProductTemplatePricingLoadingState } from "@/components/states/product-template-pricing-loading-state";

export default function Loading() {
  return (
    <ProductTemplateSampleShell>
      <ProductTemplatePricingLoadingState />
    </ProductTemplateSampleShell>
  );
}
