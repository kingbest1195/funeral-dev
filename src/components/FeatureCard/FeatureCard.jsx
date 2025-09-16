import React from "react";
import "./FeatureCard.scss";

/**
 * Универсальный компонент карточки с иконкой, заголовком и описанием
 * Используется для услуг, преимуществ и других информационных блоков
 *
 * @param {Object} props - Свойства компонента
 * @param {Object} props.icon - Данные иконки (viewBox, path) или JSX элемент
 * @param {string} props.title - Заголовок карточки (обязательно)
 * @param {string} props.description - Описание карточки (обязательно)
 * @param {string} props.link - Ссылка "Подробнее" (опционально)
 * @param {string} props.linkText - Текст ссылки (по умолчанию "Подробнее")
 * @param {string} props.className - Дополнительные CSS классы
 * @param {string} props.variant - Вариант оформления ('default', 'service', 'advantage', 'stat')
 */
const FeatureCard = ({
  icon,
  title,
  description,
  link,
  linkText = "Подробнее",
  className = "",
  variant = "default",
  ...props
}) => {
  const cardClasses = [
    "feature-card",
    `feature-card--${variant}`,
    className
  ].filter(Boolean).join(" ");

  // Рендер иконки
  const renderIcon = () => {
    if (!icon) return null;

    // Если передан JSX элемент, используем его
    if (React.isValidElement(icon)) {
      return <div className="feature-card__icon">{icon}</div>;
    }

    // Если передан объект с данными SVG
    if (typeof icon === 'object' && icon.viewBox && icon.path) {
      return (
        <div className="feature-card__icon" aria-hidden="true">
          <svg
            width="40"
            height="40"
            viewBox={icon.viewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d={icon.path}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={cardClasses} {...props}>
      {renderIcon()}

      <div className="feature-card__content">
        <h3 className="feature-card__title">{title}</h3>
        <p className="feature-card__description">{description}</p>

        {link && (
          <div className="feature-card__actions">
            <a href={link} className="feature-card__link">
              {linkText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Специализированный компонент статистики
 */
export const StatCard = ({ number, description, className = "", ...props }) => (
  <div className={`stat-card ${className}`} {...props}>
    <div className="stat-card__number">{number}</div>
    <p className="stat-card__description">{description}</p>
  </div>
);

/**
 * Специализированный компонент галереи
 */
export const GalleryCard = ({
  imageWebp,
  imageJpg,
  alt,
  caption,
  className = "",
  loading = "lazy",
  ...props
}) => (
  <div className={`gallery-card ${className}`} {...props}>
    <div className="gallery-card__image">
      <picture>
        <source srcSet={imageWebp} type="image/webp" />
        <img
          src={imageJpg}
          alt={alt}
          loading={loading}
          width="800"
          height="533"
        />
      </picture>
    </div>
    {caption && (
      <p className="gallery-card__caption">{caption}</p>
    )}
  </div>
);

export default FeatureCard;