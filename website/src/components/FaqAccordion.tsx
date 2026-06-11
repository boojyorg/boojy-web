// ⚠️ Kept on purpose for when the /cloud FAQ returns (see CLAUDE.md) — but its styles
// (faq-list / faq-item / faq-question) were deleted with the old /cloud page, so
// remounting it as-is renders unstyled. Rebuild a faq.css alongside it first.
import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isActive = openIndex === index;
        return (
          <div key={item.question} className={`faq-item${isActive ? ' active' : ''}`}>
            <button
              type="button"
              className="faq-question"
              aria-expanded={isActive}
              onClick={() => setOpenIndex(isActive ? null : index)}
            >
              <span>{item.question}</span>
              <span className="faq-arrow">▸</span>
            </button>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
