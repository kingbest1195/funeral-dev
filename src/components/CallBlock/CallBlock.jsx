import React from "react";
import "./CallBlock.scss";

/**
 * Компонент блока с информацией для звонка
 * @param {Object} props - Параметры компонента
 * @param {string} props.phone - Номер телефона (обязательный)
 * @param {string} [props.note] - Дополнительная заметка
 * @param {Object|string} [props.icon] - Иконка компонента (может быть строкой или объектом с webp/png)
 * @param {string} [props.ariaLabel] - ARIA метка для доступности
 * @param {string} [props.parentClass="first-steps"] - CSS класс родительского элемента
 * @returns {JSX.Element} React компонент
 */
const CallBlock = ({ phone, note, icon, ariaLabel, parentClass = "first-steps" }) => {
  return (
    <div className={`${parentClass}__call-block`} role="group" aria-label={ariaLabel}>
      {icon && (
        <div className={`${parentClass}__icon`} aria-hidden="true">
          {typeof icon === 'object' ? (
            <picture>
              <source srcSet={icon.webp} type="image/webp" />
              <img
                src={icon.png}
                alt="Телефон ритуального агента для круглосуточного вызова в Шуе"
                width="96"
                height="96"
                loading="lazy"
              />
            </picture>
          ) : (
            <img
              src={icon}
              alt="Телефон ритуального агента для круглосуточного вызова в Шуе"
              width="96"
              height="96"
              loading="lazy"
            />
          )}
        </div>
      )}
      <a 
        href={`tel:${phone.replace(/\D/g, '')}`} 
        className={`${parentClass}__phone`}
        aria-label={`Позвонить ${phone}`}
      >
        {phone}
      </a>
      {note && <div className={`${parentClass}__label`}>{note}</div>}
    </div>
  );
};


export default CallBlock;