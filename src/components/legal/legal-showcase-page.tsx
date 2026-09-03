import Link from "next/link";
import type { ReactNode } from "react";

type LegalShowcaseCard = {
  id: string;
  step: string;
  title: string;
  body: ReactNode;
  icon: ReactNode;
};

type LegalShowcasePageProps = {
  accentTitle: string;
  bodyClassName?: string;
  cards: LegalShowcaseCard[];
  contactBody?: string;
  contactCtaHref?: string;
  contactCtaLabel?: string;
  contactTitle?: string;
  description?: string;
  illustration: "privacy" | "terms" | "faq";
  lastUpdated: string;
  lastUpdatedLabel: string;
  titleLead: string;
};

export function LegalShowcasePage({
  accentTitle,
  bodyClassName,
  cards,
  contactBody,
  contactCtaHref,
  contactCtaLabel,
  contactTitle,
  description,
  illustration,
  lastUpdated,
  lastUpdatedLabel,
  titleLead,
}: LegalShowcasePageProps) {
  return (
    <section
      className={`xsolt-view xsolt-view--marketing xsolt-legal-showcase${
        bodyClassName ? ` ${bodyClassName}` : ""
      }`}
    >
      <div className="xsolt-legal-showcase__hero">
        <div className="xsolt-legal-showcase__hero-copy">
          {description ? <p>{description}</p> : null}
          <div className="xsolt-legal-showcase__updated">
            <CalendarIcon />
            <span>
              {lastUpdatedLabel}: {lastUpdated}
            </span>
          </div>
        </div>

      </div>

      <div className="xsolt-legal-showcase__grid">
        <svg
          className="xsolt-legal-showcase__network"
          viewBox="0 0 1200 680"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <path id="xsolt-legal-path-1" d="M600 340 C520 240, 330 154, 168 120" />
            <path id="xsolt-legal-path-2" d="M600 340 C680 240, 870 154, 1032 120" />
            <path id="xsolt-legal-path-3" d="M600 340 C490 320, 314 294, 152 332" />
            <path id="xsolt-legal-path-4" d="M600 340 C710 320, 886 294, 1048 332" />
            <path id="xsolt-legal-path-5" d="M600 340 C520 442, 330 530, 168 560" />
            <path id="xsolt-legal-path-6" d="M600 340 C680 442, 870 530, 1032 560" />
          </defs>

          <g className="xsolt-legal-showcase__network-lines">
            <use href="#xsolt-legal-path-1" />
            <use href="#xsolt-legal-path-2" />
            <use href="#xsolt-legal-path-3" />
            <use href="#xsolt-legal-path-4" />
            <use href="#xsolt-legal-path-5" />
            <use href="#xsolt-legal-path-6" />
          </g>

          <g className="xsolt-legal-showcase__network-pulses">
            <circle r="4">
              <animateMotion dur="4.2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#xsolt-legal-path-1" />
              </animateMotion>
            </circle>
            <circle r="4">
              <animateMotion dur="4.8s" begin="0.35s" repeatCount="indefinite" rotate="auto">
                <mpath href="#xsolt-legal-path-2" />
              </animateMotion>
            </circle>
            <circle r="4">
              <animateMotion dur="4.1s" begin="0.2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#xsolt-legal-path-3" />
              </animateMotion>
            </circle>
            <circle r="4">
              <animateMotion dur="4.6s" begin="0.55s" repeatCount="indefinite" rotate="auto">
                <mpath href="#xsolt-legal-path-4" />
              </animateMotion>
            </circle>
            <circle r="4">
              <animateMotion dur="4.9s" begin="0.15s" repeatCount="indefinite" rotate="auto">
                <mpath href="#xsolt-legal-path-5" />
              </animateMotion>
            </circle>
            <circle r="4">
              <animateMotion dur="4.4s" begin="0.7s" repeatCount="indefinite" rotate="auto">
                <mpath href="#xsolt-legal-path-6" />
              </animateMotion>
            </circle>
          </g>
        </svg>
        <div className="xsolt-legal-showcase__hub" aria-hidden="true">
          <div className="xsolt-legal-showcase__hub-ring xsolt-legal-showcase__hub-ring--outer" />
          <div className="xsolt-legal-showcase__hub-ring xsolt-legal-showcase__hub-ring--inner" />
          <div className="xsolt-legal-showcase__hub-core">
            {illustration === "privacy" ? (
              <ShieldLockIcon />
            ) : illustration === "faq" ? (
              <HelpCircleIcon />
            ) : (
              <DocumentSealIcon compact />
            )}
            <div className="xsolt-legal-showcase__hub-title">
              <span>{titleLead}</span>
              <strong>{accentTitle}</strong>
            </div>
          </div>
        </div>
        {cards.map((card) => (
          <section key={card.id} id={card.id} className="xsolt-legal-showcase__card">
            <div className="xsolt-legal-showcase__card-head">
              <div className="xsolt-legal-showcase__card-icon">{card.icon}</div>
              <span className="xsolt-legal-showcase__card-step">{card.step}</span>
            </div>
            <div className="xsolt-legal-showcase__card-copy">
              <h2>{card.title}</h2>
              <div>{card.body}</div>
            </div>
          </section>
        ))}
      </div>

      {contactTitle && contactBody && contactCtaHref && contactCtaLabel ? (
        <div className="xsolt-legal-showcase__contact">
          <div className="xsolt-legal-showcase__contact-icon">
            {illustration === "privacy" ? (
              <ShieldLockIcon />
            ) : illustration === "faq" ? (
              <HelpCircleIcon />
            ) : (
              <DocumentSealIcon compact />
            )}
          </div>
          <div className="xsolt-legal-showcase__contact-copy">
            <strong>{contactTitle}</strong>
            <p>{contactBody}</p>
          </div>
          <Link href={contactCtaHref} className="xsolt-legal-showcase__contact-cta">
            <MailIcon />
            <span>{contactCtaLabel}</span>
            <ArrowUpRightIcon />
          </Link>
        </div>
      ) : null}
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6 4.5v2M14 4.5v2M4.8 7.2h10.4M5.6 5.8h8.8a1.8 1.8 0 0 1 1.8 1.8v6.8a1.8 1.8 0 0 1-1.8 1.8H5.6a1.8 1.8 0 0 1-1.8-1.8V7.6a1.8 1.8 0 0 1 1.8-1.8Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.2 6.2h11.6v7.6H4.2Z" />
      <path d="m5.2 7.2 4.8 4 4.8-4" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M7 13 13.5 6.5" />
      <path d="M8.5 6.5h5v5" />
    </svg>
  );
}

function ShieldLockIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d="M60 16c12 9 24.4 13.2 38 15.2v26.2c0 25-14.8 43.4-38 53-23.2-9.6-38-28-38-53V31.2C35.6 29.2 48 25 60 16Z" />
      <path d="M48 56.5h24v20H48Z" />
      <path d="M52.5 56.5V50c0-6 3.2-10.5 7.5-10.5s7.5 4.5 7.5 10.5v6.5" />
      <path d="M60 63v6" />
    </svg>
  );
}

function DocumentSealIcon({ compact = false }: { compact?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={compact ? "is-compact" : undefined}>
      <path d="M34 20h34l18 18v60H34Z" />
      <path d="M68 20v18h18" />
      <path d="M46 52h28M46 66h20" />
      <circle cx="72" cy="82" r="12" />
      <path d="m72 74 2.8 5.8 6.2.9-4.5 4.3 1 6.1-5.5-3-5.5 3 1-6.1-4.5-4.3 6.2-.9Z" />
    </svg>
  );
}

function HelpCircleIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="40" />
      <path d="M48 47.5c1.8-7.7 9.4-13 18.3-11.5 8.7 1.5 14.2 9 13 16.8-1.2 8-8.3 10.1-12.6 13.6-2.5 2.1-4.2 4.4-4.2 8.6" />
      <circle cx="60" cy="86" r="2.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
