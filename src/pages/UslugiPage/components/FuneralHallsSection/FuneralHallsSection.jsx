// =================
// СЕКЦИЯ ПРОЩАЛЬНЫХ ЗАЛОВ
// =================

import React, { Suspense } from 'react';
import { FUNERAL_HALLS_CONTENT } from '../../content';
import './FuneralHallsSection.scss';

// Компонент для отдельной карточки зала
const HallCard = ({ hall }) => {
  const { title, description, image } = hall;

  return (
    <article className="hall-card">
      <h3 className="hall-card__title">{title}</h3>

      <p className="hall-card__description">{description}</p>

      <div className="hall-card__image">
        <Suspense fallback={<div>Загрузка изображения...</div>}>
          <picture>
            <source srcSet={image.webp} type="image/webp" />
            <img
              src={image.png}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
            />
          </picture>
        </Suspense>
      </div>
    </article>
  );
};

const FuneralHallsSection = () => {
  const { title, description, halls } = FUNERAL_HALLS_CONTENT;

  return (
    <section className="funeral-halls">
      <div className="container">
        <h2 className="funeral-halls__title">{title}</h2>

        <p className="funeral-halls__description">{description}</p>

        <div className="funeral-halls__grid">
          {halls.map((hall) => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FuneralHallsSection;