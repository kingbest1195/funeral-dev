import React from "react";
import PropTypes from "prop-types";
import "./InfoSection.scss";

/**
 * Переиспользуемый компонент двухколоночной информационной секции
 * Сохраняет оригинальную верстку first-steps и burial-benefit
 */
const InfoSection = ({
  className = "",
  title,
  heading,
  text,
  rightContent,
  originalLayout = true, // Сохранение оригинальной структуры
}) => {
  const sectionClass = `${className} section`;
  
  return (
    <section className={sectionClass}>
      <div className="container">
        <div className="card">
          <div className="card__body">
            {/* Для first-steps title сверху, для burial-benefit внутри колонки */}
            {title && className === "first-steps" && (
              <h2 className={`${className}__title`}>{title}</h2>
            )}
            <div className={`${className}__grid`}>
              {/* Левая колонка - текст (точно как в оригинале) */}
              <div className={`${className}__col ${className}__col--text`}>
                {title && className === "burial-benefit" && (
                  <h2 className={`${className}__title`}>{title}</h2>
                )}
                {heading && (
                  <h3 className={`${className}__heading`}>{heading}</h3>
                )}
                {text && (
                  <p className={`${className}__text`}>{text}</p>
                )}
              </div>

              {/* Правая колонка - визуал (точно как в оригинале) */}
              <div className={`${className}__col ${className}__col--${className === 'burial-benefit' ? 'visual' : 'call'}`}>
                {rightContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

InfoSection.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  heading: PropTypes.string,
  text: PropTypes.string,
  rightContent: PropTypes.node.isRequired,
  originalLayout: PropTypes.bool,
};

export default InfoSection;