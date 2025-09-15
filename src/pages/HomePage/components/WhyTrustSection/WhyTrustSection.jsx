import React from "react";
import { WHY_TRUST_DATA } from "@/constants/content";
import "./WhyTrustSection.scss";

/**
 * Секция "Почему доверяют" на главной странице
 * Отображает преимущества и причины доверия к компании
 */
const WhyTrustSection = () => {
  return (
    <section id="benefits" className="why-trust section bg-light">
      <div className="container">
        <h2 className="why-trust__title">{WHY_TRUST_DATA.title}</h2>

        <div className="advantages__grid">
          {WHY_TRUST_DATA.items.map((advantage) => (
            <div key={advantage.id} className="advantage-card">
              <h3 className="advantage-card__title">{advantage.title}</h3>
              <p className="advantage-card__description">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyTrustSection;