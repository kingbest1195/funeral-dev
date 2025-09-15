import React from "react";
import { SERVICES_DATA } from "@/constants/content";
import "./ServicesSection.scss";

/**
 * Секция услуг на главной странице
 * Отображает список основных услуг компании
 */
const ServicesSection = () => {
  return (
    <section id="services" className="services section">
      <div className="container">
        <h2 className="services__title">{SERVICES_DATA.title}</h2>
        <p className="services__subtitle">{SERVICES_DATA.subtitle}</p>

        <div className="services__grid">
          {SERVICES_DATA.items.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card__icon" aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox={service.icon.viewBox}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d={service.icon.path}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__description">{service.description}</p>
              <div className="service-card__actions">
                <a href={service.link} aria-label={service.ariaLabel}>
                  Подробнее
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;