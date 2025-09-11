import React from "react";
import PropTypes from "prop-types";

/**
 * Блок с телефоном для срочных вызовов (сохраняет оригинальную структуру)
 */
const CallBlock = ({ phone, note, icon, ariaLabel, parentClass = "first-steps" }) => {
  return (
    <div className={`${parentClass}__call-block`} role="group" aria-label={ariaLabel}>
      {icon && (
        <div className={`${parentClass}__icon`} aria-hidden="true">
          <img
            src={icon}
            alt="Иконка телефона"
            width="96"
            height="96"
          />
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

CallBlock.propTypes = {
  phone: PropTypes.string.isRequired,
  note: PropTypes.string,
  icon: PropTypes.string,
  ariaLabel: PropTypes.string,
  parentClass: PropTypes.string,
};

export default CallBlock;