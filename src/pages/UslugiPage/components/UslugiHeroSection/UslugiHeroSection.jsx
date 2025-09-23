// =================
// HERO СЕКЦИЯ СТРАНИЦЫ УСЛУГ
// =================

import React from 'react';
import { USLUGI_HERO_CONTENT } from '../../content';
import './UslugiHeroSection.scss';

const UslugiHeroSection = () => {
  const { title, description, cta } = USLUGI_HERO_CONTENT;

  return (
    <section className="uslugi-hero">
      <div className="container">
        <h1 className="uslugi-hero__title">
          {title}
        </h1>

        <p className="uslugi-hero__description">
          {description}
        </p>

        <div className="uslugi-hero__cta">
          <a
            href={`tel:${cta.phone}`}
            className="btn btn--primary"
            aria-label={cta.ariaLabel}
          >
            {cta.text}
          </a>
        </div>
      </div>
    </section>
  );
};

export default UslugiHeroSection;