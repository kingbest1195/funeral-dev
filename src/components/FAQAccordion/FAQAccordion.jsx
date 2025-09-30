import React, { useState } from "react";
import "./FAQAccordion.scss";

/**
 * Компонент аккордеона для FAQ секции
 * Поддерживает Schema.org FAQPage для SEO
 * @param {string} title - Заголовок секции FAQ
 * @param {Array} items - Массив вопросов-ответов [{question, answer}]
 * @param {string} className - Дополнительные CSS классы
 * @param {Function} onJsonLdUpdate - Callback для обновления JSON-LD данных
 */
const FAQAccordion = ({
  title,
  items = [],
  className = "",
  onJsonLdUpdate
}) => {
  const [openItems, setOpenItems] = useState(new Set([0]));

  // Мемоизируем JSON-LD для FAQ
  const faqJsonLd = React.useMemo(() => {
    if (!items.length) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    };
  }, [items]);

  // Отправляем JSON-LD только при изменении данных
  React.useEffect(() => {
    if (onJsonLdUpdate && faqJsonLd) {
      onJsonLdUpdate(faqJsonLd);
    }
  }, [faqJsonLd, onJsonLdUpdate]);

  if (!items.length) return null;

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const accordionClassName = ["faq-accordion", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={accordionClassName}>
      <div className="container">
        {title && (
          <h2 className="faq-accordion__title">
            {title}
          </h2>
        )}

        <div className="faq-accordion__list">
          {items.map((item, index) => {
            const isOpen = openItems.has(index);
            const itemId = `faq-item-${index}`;

            return (
              <div
                key={index}
                className={`faq-accordion__item ${isOpen ? 'faq-accordion__item--open' : ''}`}
                itemScope
                itemType="https://schema.org/Question"
              >
                <button
                  className="faq-accordion__button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={itemId}
                  type="button"
                >
                  <span className="faq-accordion__question" itemProp="name">
                    {item.question}
                  </span>
                  <span className="faq-accordion__icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  id={itemId}
                  className="faq-accordion__content"
                  aria-hidden={!isOpen}
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div className="faq-accordion__answer" itemProp="text">
                    {typeof item.answer === 'string' ? (
                      <p>{item.answer}</p>
                    ) : (
                      item.answer
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;