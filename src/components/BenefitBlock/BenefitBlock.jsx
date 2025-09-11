import React from "react";
import PropTypes from "prop-types";

/**
 * Блок с информацией о пособии (сохраняет оригинальную структуру)
 */
const BenefitBlock = ({ amount, label, icon, ariaLabel, parentClass = "burial-benefit" }) => {
  return (
    <div className={`${parentClass}__amount-block`} role="group">
      {icon && (
        <div className={`${parentClass}__icon`} aria-hidden="true">
          <img
            src={icon}
            alt="Пособие на погребение - государственная выплата для ритуальных услуг"
            width="96"
            height="96"
          />
        </div>
      )}
      <div className={`${parentClass}__amount`}>{amount}</div>
      {label && (
        <div className={`${parentClass}__label`}>{label}</div>
      )}
    </div>
  );
};

BenefitBlock.propTypes = {
  amount: PropTypes.string.isRequired,
  label: PropTypes.string,
  icon: PropTypes.string,
  ariaLabel: PropTypes.string,
  parentClass: PropTypes.string,
};

export default BenefitBlock;