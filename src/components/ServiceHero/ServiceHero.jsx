import React from "react";
import "./ServiceHero.scss";

/**
 * Универсальная hero секция для страниц услуг
 * Основана на дизайне из UslugiPage для консистентности
 * @param {string} title - Заголовок секции
 * @param {string} description - Описание услуги
 * @param {Object} cta - Объект с данными для кнопки {text, phone, ariaLabel}
 * @param {boolean} hasOwnMarginTop - Добавляет отступ от шапки (для страниц без breadcrumbs)
 * @param {string} className - Дополнительные CSS классы
 */
const ServiceHero = ({
  title,
  description,
  cta,
  hasOwnMarginTop = false,
  className = ""
}) => {
  const heroClassName = [
    "service-hero",
    hasOwnMarginTop && "service-hero--with-margin-top",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={heroClassName}>
      <div className="container">
        {title && (
          <h1 className="service-hero__title">
            {title}
          </h1>
        )}

        {description && (
          <p className="service-hero__description">
            {description}
          </p>
        )}

        {cta && (
          <div className="service-hero__cta">
            <a
              href={`tel:${cta.phone}`}
              className="btn btn--primary"
              aria-label={cta.ariaLabel || `Позвонить по номеру ${cta.phone}`}
            >
              {cta.text}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceHero;