import React from "react";
import PropTypes from "prop-types";
import { CTA_DATA } from "@/constants/content";

/**
 * Секция призыва к действию
 * Поддерживает кастомный контент или использует данные по умолчанию
 */
const CTASection = ({
  title = CTA_DATA.title,
  description = CTA_DATA.description,
  buttonText = CTA_DATA.phone,
  buttonLink = CTA_DATA.phoneHref
}) => {
  return (
    <section className="cta-section section bg-dark">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-content__title">{title}</h2>
          <p className="cta-content__description">{description}</p>
          <div className="cta-content__actions">
            <a href={buttonLink} className="btn btn--accent btn--lg">
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

CTASection.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string
};

export default CTASection;