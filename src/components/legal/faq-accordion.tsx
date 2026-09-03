"use client";

import { useState, type ReactNode } from "react";

type FAQItem = {
  question: string;
  answer: ReactNode;
};

type FAQAccordionProps = {
  items: FAQItem[];
  defaultOpen?: number;
};

export function FAQAccordion({ items, defaultOpen = -1 }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  return (
    <div className="xsolt-faq-accordion">
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <section key={item.question} className={`xsolt-faq-accordion__item${open ? " is-open" : ""}`}>
            <button
              type="button"
              className="xsolt-faq-accordion__trigger"
              aria-expanded={open}
              aria-controls={`faq-panel-${index}`}
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              <span className="xsolt-faq-accordion__question">{item.question}</span>
              <span className="xsolt-faq-accordion__marker" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
            <div
              id={`faq-panel-${index}`}
              className="xsolt-faq-accordion__panel"
              aria-hidden={!open}
            >
              <div className="xsolt-faq-accordion__panel-inner">{item.answer}</div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
