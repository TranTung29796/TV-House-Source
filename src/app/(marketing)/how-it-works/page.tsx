import { ProductTemplateHowItWorks } from "@/components/marketing/product-template-how-it-works";
import { ProductTemplateSampleShell } from "@/components/shell/product-template-sample-shell";

export default function HowItWorksPage() {
  return (
    <ProductTemplateSampleShell>
      <section className="xsolt-view xsolt-view--marketing xsolt-how-it-works-page">
        <ProductTemplateHowItWorks />
      </section>
    </ProductTemplateSampleShell>
  );
}
