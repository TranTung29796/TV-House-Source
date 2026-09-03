import Link from "next/link";
import type { ReactNode } from "react";

type LegalAnchor = {
  id: string;
  label: string;
};

type LegalPageLayoutProps = {
  title: string;
  className?: string;
  description?: string;
  lastUpdated: string;
  showMeta?: boolean;
  anchors?: LegalAnchor[];
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  className,
  description,
  lastUpdated,
  showMeta = true,
  anchors = [],
  children,
}: LegalPageLayoutProps) {
  const hasAnchors = anchors.length > 0;

  return (
    <section
      className={`xsolt-view xsolt-view--marketing xsolt-legal-page${
        className ? ` ${className}` : ""
      }`}
    >
      <header className="xsolt-legal-page__header">
        <h1>{title}</h1>
        {showMeta ? <LastUpdated value={lastUpdated} /> : null}
        {showMeta && description ? <p className="xsolt-legal-page__description">{description}</p> : null}
      </header>

      <div className={`xsolt-legal-page__body${hasAnchors ? "" : " xsolt-legal-page__body--full"}`}>
        {hasAnchors ? (
          <aside className="xsolt-legal-page__toc" aria-label="Table of contents">
            <div className="xsolt-legal-page__toc-title">On this page</div>
            <nav>
              {anchors.map((anchor) => (
                <Link key={anchor.id} href={`#${anchor.id}`}>
                  {anchor.label}
                </Link>
              ))}
            </nav>
          </aside>
        ) : null}

        <article className="xsolt-legal-page__content">{children}</article>
      </div>
    </section>
  );
}

export function LegalSection({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="xsolt-legal-section">
      <div className="xsolt-legal-section__title-row">
        {icon ? <span className="xsolt-legal-section__icon" aria-hidden="true">{icon}</span> : null}
        <h2>{title}</h2>
      </div>
      <div className="xsolt-legal-section__content">{children}</div>
    </section>
  );
}

export function LastUpdated({ value }: { value: string }) {
  return <p className="xsolt-legal-page__updated">Last updated: {value}</p>;
}
