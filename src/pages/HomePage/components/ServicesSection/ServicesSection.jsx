import React from "react";
import { SERVICES_DATA } from "@/constants/content";
import ServiceCard from "@/components/ServiceCard/ServiceCard.jsx";
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
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              ariaLabel={service.ariaLabel}
              showActions={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;