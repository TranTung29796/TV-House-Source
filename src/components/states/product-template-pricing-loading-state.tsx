import type { CSSProperties } from "react";

export function ProductTemplatePricingLoadingState() {
  return (
    <section
      className="xsolt-chatgpt-pricing-page xsolt-chatgpt-pricing-page--loading"
      aria-live="polite"
      aria-busy="true"
    >
      <header className="xsolt-chatgpt-pricing-hero">
        <div className="xsolt-loading-line xsolt-loading-line--pricing-title" />
        <div className="xsolt-loading-line xsolt-loading-line--pricing-copy" />
      </header>

      <div className="xsolt-chatgpt-pricing-tabs xsolt-chatgpt-pricing-tabs--loading">
        <div className="xsolt-loading-pill xsolt-loading-pill--tab" />
        <div className="xsolt-loading-pill xsolt-loading-pill--tab" />
        <div className="xsolt-loading-line xsolt-loading-line--pricing-discount" />
      </div>

      <div
        className="xsolt-chatgpt-pricing-grid"
        style={{ "--xsolt-pricing-plan-count": 3 } as CSSProperties}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <section
            key={index}
            className={`xsolt-chatgpt-pricing-card xsolt-chatgpt-pricing-card--loading${
              index === 1 ? " is-featured" : ""
            }`}
          >
            {index === 1 ? <span className="xsolt-loading-badge" /> : null}

            <div className="xsolt-chatgpt-pricing-card__intro">
              <div className="xsolt-loading-line xsolt-loading-line--pricing-plan" />
            </div>

            <div className="xsolt-chatgpt-pricing-card__price xsolt-chatgpt-pricing-card__price--loading">
              <div className="xsolt-loading-line xsolt-loading-line--pricing-price" />
              <div className="xsolt-loading-line xsolt-loading-line--pricing-interval" />
            </div>

            <div className="xsolt-chatgpt-pricing-card__features xsolt-chatgpt-pricing-card__features--loading">
              {Array.from({ length: 5 }).map((__, featureIndex) => (
                <div key={featureIndex} className="xsolt-loading-feature-row">
                  <span className="xsolt-loading-feature-dot" />
                  <div className="xsolt-loading-line xsolt-loading-line--pricing-feature" />
                </div>
              ))}
            </div>

            <div className="xsolt-chatgpt-pricing-action">
              <div className="xsolt-loading-button xsolt-loading-button--pricing" />
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
