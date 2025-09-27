import React from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon.jsx";
import { SERVICE_ICON_MAPPING } from "../../constants/iconMapping.js";
import "./ServiceCard.scss";

/**
 * Универсальная карточка услуги
 * Используется как на главной странице, так и на страницах услуг
 */
const ServiceCard = ({
  id,
  title,
  description,
  icon,
  link,
  ariaLabel,
  showActions = false,
  className = ""
}) => {
  const cardClasses = `service-card ${className}`.trim();

  // Получаем иконку из маппинга по ID или используем переданную
  const iconName = id && SERVICE_ICON_MAPPING[id] ? SERVICE_ICON_MAPPING[id] : null;

  return (
    <article className={cardClasses}>
      <div className="service-card__icon" aria-label={`Иконка услуги: ${title}`}>
        {iconName ? (
          <Icon name={iconName} size={40} />
        ) : icon && typeof icon === 'object' && icon.type === 'svg' ? (
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
        ) : (
          // Поддержка emoji для обратной совместимости
          <span className="service-card__emoji">{typeof icon === 'string' ? icon : ''}</span>
        )}
      </div>

      <div className="service-card__content">
        <h3 className="service-card__title">{title}</h3>
        <p className="service-card__description">{description}</p>

        {showActions && link && (
          <div className="service-card__actions">
            <a href={link} aria-label={ariaLabel}>
              Подробнее
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

ServiceCard.propTypes = {
  id: PropTypes.number, // ID для маппинга иконок
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.string, // для emoji
    PropTypes.shape({
      type: PropTypes.oneOf(['svg']),
      viewBox: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ]),
  link: PropTypes.string,
  ariaLabel: PropTypes.string,
  showActions: PropTypes.bool,
  className: PropTypes.string,
};

export default ServiceCard;