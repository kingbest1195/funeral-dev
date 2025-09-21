import React from "react";
import "./BenefitBlock.scss";

/**
 * Компонент блока с информацией о пособии
 * @param {Object} props - Параметры компонента
 * @param {string} props.amount - Сумма пособия (обязательный)
 * @param {string} [props.label] - Подпись к сумме
 * @param {Object|string} [props.icon] - Иконка компонента (может быть строкой или объектом с webp/png)
 * @param {string} [props.ariaLabel] - ARIA метка для доступности
 * @param {string} [props.parentClass="burial-benefit"] - CSS класс родительского элемента
 * @returns {JSX.Element} React компонент
 */
const BenefitBlock = ({ amount, label, icon, ariaLabel, parentClass = "burial-benefit" }) => {
  return (
    <div className={`${parentClass}__amount-block`} role="group">
      {icon && (
        <div className={`${parentClass}__icon`} aria-hidden="true">
          {typeof icon === 'object' ? (
            <picture>
              <source srcSet={icon.webp} type="image/webp" />
              <img
                src={icon.png}
                alt="Пособие на погребение - государственная выплата для ритуальных услуг"
                width="96"
                height="96"
                loading="lazy"
              />
            </picture>
          ) : (
            <img
              src={icon}
              alt="Пособие на погребение - государственная выплата для ритуальных услуг"
              width="96"
              height="96"
              loading="lazy"
            />
          )}
        </div>
      )}
      <div className={`${parentClass}__amount`}>{amount}</div>
      {label && (
        <div className={`${parentClass}__label`}>{label}</div>
      )}
    </div>
  );
};


export default BenefitBlock;