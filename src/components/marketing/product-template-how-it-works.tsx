import Link from "next/link";
import { useLocale } from "next-intl";

import {
  getLocalizedProductContent,
  type HowItWorksIcon,
  type HowItWorksPreview,
  type HowItWorksStep,
} from "@/config/product";
import { appRoutes } from "@/config/routes";

export function ProductTemplateHowItWorks() {
  const locale = useLocale();
  const marketing = getLocalizedProductContent(locale).marketing;
  const howItWorks = marketing.howItWorks;
  const overview = marketing.overview;

  return (
    <section className="xsolt-how-it-works">
      <header className="xsolt-how-it-works__hero">
        <span className="xsolt-how-it-works__eyebrow">{howItWorks.eyebrow}</span>
        <h1 className="xsolt-how-it-works__headline">{howItWorks.title}</h1>
        <p className="xsolt-how-it-works__summary">{howItWorks.description}</p>
      </header>

      <div className="xsolt-how-it-works__rail">
        {howItWorks.steps.map((item, index) => (
          <article key={item.step} className="xsolt-how-it-works__row">
            <div className="xsolt-how-it-works__row-copy">
              <div className="xsolt-how-it-works__row-icon" aria-hidden="true">
                <HowItWorksGlyph type={item.icon} />
              </div>

              <div className="xsolt-how-it-works__row-text">
                <span className="xsolt-how-it-works__step">{item.step}</span>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
                <ul className="xsolt-how-it-works__points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="xsolt-how-it-works__preview">
              <HowItWorksPreviewCard preview={resolvePreview(item, index)} />
            </div>

            {index < howItWorks.steps.length - 1 ? (
              <div className="xsolt-how-it-works__connector" aria-hidden="true">
                <span>↓</span>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="xsolt-how-it-works__cta">
        <Link href={appRoutes.auth.login} className="xsolt-how-it-works__cta-button">
          <span>{overview.primaryCta}</span>
          <span aria-hidden="true">→</span>
        </Link>
        <p>Magic-link access. Same account, billing, and workspace flow as the core template.</p>
      </div>
    </section>
  );
}

function resolvePreview(item: HowItWorksStep, index: number): HowItWorksPreview {
  if (item.preview) {
    return item.preview;
  }

  if (index === 0) {
    return {
      type: "form",
      title: item.title,
      label: item.points[0] ?? "Entry",
      value: item.points[1] ?? item.body,
      status: item.points[2] ?? "Ready",
      action: "Continue",
    };
  }

  if (index === 1) {
    return {
      type: "bars",
      title: item.title,
      metrics: item.points.map((point, pointIndex) => ({
        label: point,
        value: `${92 - pointIndex * 19}%`,
        fill: Math.max(28, 92 - pointIndex * 19),
      })),
    };
  }

  if (index === 2) {
    return {
      type: "table",
      title: item.title,
      rows: item.points.map((point, pointIndex) => ({
        label: point,
        value: pointIndex === 0 ? "High" : pointIndex === 1 ? "Medium" : "Queued",
      })),
    };
  }

  return {
    type: "line",
    title: item.title,
    beforeLabel: `Before ${item.points[0] ?? "slow"}`,
    afterLabel: `After ${item.points[item.points.length - 1] ?? "clear"}`,
  };
}

function HowItWorksPreviewCard({ preview }: { preview: HowItWorksPreview }) {
  if (preview.type === "form") {
    return (
      <div className="xsolt-how-it-works__preview-card xsolt-how-it-works__preview-card--form">
        <div className="xsolt-how-it-works__preview-dots">
          <span />
          <span />
          <span />
        </div>
        <strong>{preview.title}</strong>
        <label>
          <span>{preview.label}</span>
          <div>{preview.value}</div>
        </label>
        <div className="xsolt-how-it-works__preview-action">
          <span className="is-live">{preview.status}</span>
          <button type="button">{preview.action}</button>
        </div>
      </div>
    );
  }

  if (preview.type === "bars") {
    return (
      <div className="xsolt-how-it-works__preview-card xsolt-how-it-works__preview-card--bars">
        <strong>{preview.title}</strong>
        {preview.metrics.map((metric) => (
          <div key={metric.label} className="xsolt-how-it-works__metric">
            <span>{metric.label}</span>
            <div>
              <em>{metric.value}</em>
              <i style={{ width: `${metric.fill}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (preview.type === "table") {
    return (
      <div className="xsolt-how-it-works__preview-card xsolt-how-it-works__preview-card--table">
        <strong>{preview.title}</strong>
        <div className="xsolt-how-it-works__table">
          {preview.rows.map((row) => (
            <div key={row.label}>
              <span>{row.label}</span>
              <em>{row.value}</em>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="xsolt-how-it-works__preview-card xsolt-how-it-works__preview-card--line">
      <strong>{preview.title}</strong>
      <div className="xsolt-how-it-works__line-chart">
        <span className="xsolt-how-it-works__line-label xsolt-how-it-works__line-label--left">
          {preview.beforeLabel}
        </span>
        <span className="xsolt-how-it-works__line-label xsolt-how-it-works__line-label--right">
          {preview.afterLabel}
        </span>
        <svg viewBox="0 0 280 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M16 92 C74 82, 118 74, 156 56 S232 26 264 18" />
          <circle cx="16" cy="92" r="5" />
          <circle cx="264" cy="18" r="5" />
        </svg>
      </div>
    </div>
  );
}

function HowItWorksGlyph({ type }: { type: HowItWorksIcon }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "capture") {
    return (
      <svg viewBox="0 0 20 20" focusable="false">
        <path {...common} d="M5 10h10" />
        <path {...common} d="M10 5v10" />
        <rect {...common} x="3.5" y="3.5" width="13" height="13" rx="3.2" />
      </svg>
    );
  }

  if (type === "detect") {
    return (
      <svg viewBox="0 0 20 20" focusable="false">
        <circle {...common} cx="8.5" cy="8.5" r="4.3" />
        <path {...common} d="m12 12 3.1 3.1" />
      </svg>
    );
  }

  if (type === "impact") {
    return (
      <svg viewBox="0 0 20 20" focusable="false">
        <path {...common} d="M4.5 14.5h11" />
        <path {...common} d="M6.8 12.8V9.2" />
        <path {...common} d="M10 12.8V6.4" />
        <path {...common} d="M13.2 12.8V8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" focusable="false">
      <path {...common} d="M5.4 10.4 8.6 13.4l6-6.8" />
      <circle {...common} cx="10" cy="10" r="7" />
    </svg>
  );
}
