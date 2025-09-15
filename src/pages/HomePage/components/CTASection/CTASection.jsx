import React from "react";
import { CTA_DATA } from "@/constants/content";
import "./CTASection.scss";

/**
 * Секция призыва к действию на главной странице
 * Финальный призыв позвонить или получить консультацию
 */
const CTASection = () => {
  return (
    <section className="cta-section section bg-dark">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-content__title">{CTA_DATA.title}</h2>
          <p className="cta-content__description">{CTA_DATA.description}</p>
          <div className="cta-content__actions">
            <a href={CTA_DATA.phoneHref} className="btn btn--accent btn--lg">
              {CTA_DATA.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;