// =================
// СЕКЦИЯ РИТУАЛЬНОГО МАГАЗИНА
// =================

import React, { Suspense } from 'react';
import { RITUAL_SHOP_CONTENT } from '../../content';
import './RitualShopSection.scss';

const RitualShopSection = () => {
  const { title, description, subtitle, items, image } = RITUAL_SHOP_CONTENT;

  return (
    <section className="ritual-shop">
      <div className="container">
        <h2 className="ritual-shop__title">{title}</h2>

        <div className="ritual-shop__content">
          <div className="ritual-shop__text">
            <p>{description}</p>

            <h3 className="ritual-shop__subtitle">{subtitle}</h3>

            <ul className="ritual-shop__list">
              {items.map((item) => (
                <li key={item.id}>
                  <div className="quiz-option__icon">
                    <img src={item.icon} alt={item.alt} />
                  </div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ritual-shop__image">
            <Suspense fallback={<div>Загрузка изображения...</div>}>
              <picture>
                <source srcSet={image.webp} type="image/webp" />
                <img
                  src={image.jpg}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                />
              </picture>
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RitualShopSection;