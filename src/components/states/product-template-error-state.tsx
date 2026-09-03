import Link from "next/link";

type ProductTemplateErrorStateProps = {
  code: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ProductTemplateErrorState({
  code,
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Back Home",
  secondaryHref = "/account",
  secondaryLabel = "Open Account",
  retryLabel,
  onRetry,
}: ProductTemplateErrorStateProps) {
  return (
    <main className="xsolt-error-page">
      <div className="xsolt-error-page__frame">
        <div className="xsolt-error-page__card">
          <div className="xsolt-error-page__glyph" aria-hidden="true">
            <span />
            <span />
          </div>

          <div className="xsolt-error-page__content">
            <div className="xsolt-error-page__code">{code}</div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="xsolt-error-page__actions">
            {retryLabel && onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="xsolt-button xsolt-button--primary"
              >
                {retryLabel}
              </button>
            ) : primaryHref && primaryLabel ? (
              <Link href={primaryHref} className="xsolt-button xsolt-button--primary">
                {primaryLabel}
              </Link>
            ) : null}

            {secondaryHref && secondaryLabel ? (
              <Link href={secondaryHref} className="xsolt-button xsolt-button--outline">
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
