import React from 'react';
import './ReviewCard.scss';

/**
 * Компонент скелетона карточки отзыва для состояния загрузки
 */
const ReviewCardSkeleton = ({ className = '' }) => {
  return (
    <article className={`review-card review-card--loading ${className}`} aria-label="Загружается отзыв">
      <header className="review-card__header">
        <div className="review-card__author-info">
          <div className="review-card__avatar">
            <div className="review-card__avatar-initials">АА</div>
          </div>
          <div className="review-card__meta">
            <div className="review-card__author">Загружается имя</div>
            <div className="review-card__date">Загружается дата</div>
          </div>
        </div>

        <div className="review-card__rating-wrapper">
          <div className="review-card__rating">
            <span className="review-card__star review-card__star--filled">★</span>
            <span className="review-card__star review-card__star--filled">★</span>
            <span className="review-card__star review-card__star--filled">★</span>
            <span className="review-card__star review-card__star--filled">★</span>
            <span className="review-card__star review-card__star--filled">★</span>
          </div>
          <div className="review-card__source-icon">
            <div className="review-card__platform-icon" style={{width: 20, height: 20, backgroundColor: 'var(--color-bg-secondary)', borderRadius: '2px'}}></div>
          </div>
        </div>
      </header>

      <div className="review-card__content">
        <p className="review-card__text">
          Загружается текст отзыва, который может быть довольно длинным и содержать множество полезной информации о качестве обслуживания...
        </p>
      </div>

      <footer className="review-card__footer">
        <span className="review-card__source-text">
          Загружается источник...
        </span>
      </footer>
    </article>
  );
};

export default ReviewCardSkeleton;