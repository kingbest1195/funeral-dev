import React from "react";
import officeWebp from "@/assets/images-optimized/transport-and-office/office-facade.webp";
import officeJpg from "@/assets/images-optimized/transport-and-office/office-facade.png";
import "./HeroSection.scss";

/**
 * Hero секция главной страницы
 * Первый экран с основным призывом к действию
 */
const HeroSection = () => {
  return (
    <section className="hero section">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__content">
            <h1 className="hero__title">
              Помощь в трудную минуту. Круглосуточная ритуальная служба в
              Шуе.
            </h1>
            <p className="hero__subtitle">
              Бесплатно проконсультируем, что делать дальше. Агент приедет в
              течение часа в любую точку города и района.
            </p>
            <div className="hero__cta">
              <a
                href="tel:+79203663636"
                className="btn btn--primary btn--lg"
                aria-label="Вызвать ритуального агента круглосуточно"
              >
                Вызвать ритуального агента 24/7
              </a>
            </div>
          </div>
          <div className="hero__media" aria-hidden="true">
            <picture>
              <source srcSet={officeWebp} type="image/webp" />
              <img
                src={officeJpg}
                alt="Офис ритуальной службы Век в Шуе по адресу Красноармейский переулок, 6"
                loading="eager"
                decoding="async"
                width="800"
                height="533"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;