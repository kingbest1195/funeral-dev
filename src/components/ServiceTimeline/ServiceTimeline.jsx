import React from "react";
import "./ServiceTimeline.scss";

/**
 * Компонент временной шкалы для этапов услуги
 * @param {string} title - Заголовок секции
 * @param {Array} steps - Массив этапов [{title, description, number?}]
 * @param {string} className - Дополнительные CSS классы
 */
const ServiceTimeline = ({
  title,
  steps = [],
  className = ""
}) => {
  if (!steps.length) return null;

  const timelineClassName = ["service-timeline", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={timelineClassName}>
      <div className="container">
        {title && (
          <h2 className="service-timeline__title">
            {title}
          </h2>
        )}

        <ol className="service-timeline__list">
          {steps.map((step, index) => (
            <li
              key={index}
              className="service-timeline__item"
            >
              <div className="service-timeline__number">
                {step.number || index + 1}
              </div>

              <div className="service-timeline__content">
                <h3 className="service-timeline__step-title">
                  {step.title}
                </h3>

                {step.description && (
                  <p className="service-timeline__step-description">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ServiceTimeline;