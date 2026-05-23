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
