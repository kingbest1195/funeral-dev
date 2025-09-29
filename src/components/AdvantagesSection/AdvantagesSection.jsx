import React from "react";
import PropTypes from "prop-types";
import "./AdvantagesSection.scss";

/**
 * Универсальная секция преимуществ
 * Переиспользуемый компонент для отображения сетки преимуществ на разных страницах
 *
 * @component
 * @example
 * <AdvantagesSection
 *   title="Наши преимущества"
 *   description="Почему выбирают нас"
 *   advantages={[
 *     { id: 1, title: "Качество", description: "Высокое качество услуг" },
 *     { id: 2, title: "Опыт", description: "Многолетний опыт работы" }
 *   ]}
 *   className="custom-advantages"
 * />
 */
const AdvantagesSection = ({
  title,
  description,
  advantages = [],
  className = "",
  sectionClass = "section bg-light",
  titleLevel = 2,
  columns = 3,
  ...props
}) => {
  const sectionClasses = `advantages-section ${sectionClass} ${className}`.trim();
  const gridClasses = `advantages__grid advantages__grid--cols-${columns}`.trim();

  // Создаем заголовок нужного уровня
  const TitleTag = `h${titleLevel}`;

  return (
    <section className={sectionClasses} {...props}>
      <div className="container">
        {title && (
          <TitleTag className="advantages-section__title">
            {title}
          </TitleTag>
        )}

        {description && (
          <p className="advantages-section__description">
            {description}
          </p>
        )}

        <div className={gridClasses}>
          {advantages.map((advantage) => (
            <div key={advantage.id} className="advantage-card">
              <h3 className="advantage-card__title">
                {advantage.title}
              </h3>
              <p className="advantage-card__description">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

AdvantagesSection.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  advantages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
  sectionClass: PropTypes.string,
  titleLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  columns: PropTypes.number,
};

export default AdvantagesSection;