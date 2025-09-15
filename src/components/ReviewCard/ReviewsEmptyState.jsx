import React from 'react';
import './ReviewsEmptyState.scss';

/**
 * Компонент для отображения состояния ошибки или отсутствия отзывов
 */
const ReviewsEmptyState = ({
  type = 'empty', // 'empty' | 'error'
  message,
  onRetry
}) => {
  const getContent = () => {
    switch (type) {
      case 'error':
        return {
          icon: '⚠️',
          title: 'Не удалось загрузить отзывы',
          defaultMessage: 'Попробуйте обновить страницу или зайти позже',
          showRetry: true
        };
      case 'empty':
      default:
        return {
          icon: '💭',
          title: 'Отзывы появятся скоро',
          defaultMessage: 'Мы работаем над тем, чтобы собрать отзывы наших клиентов',
          showRetry: false
        };
    }
  };

  const content = getContent();

  return (
    <div className={`reviews-empty-state reviews-empty-state--${type}`}>
      <div className="reviews-empty-state__content">
        <div className="reviews-empty-state__icon" aria-hidden="true">
          {content.icon}
        </div>

        <h3 className="reviews-empty-state__title">
          {content.title}
        </h3>

        <p className="reviews-empty-state__message">
          {message || content.defaultMessage}
        </p>

        {content.showRetry && onRetry && (
          <button
            className="reviews-empty-state__retry-btn btn btn--secondary btn--sm"
            onClick={onRetry}
            aria-label="Повторить загрузку отзывов"
          >
            Попробовать снова
          </button>
        )}

        <div className="reviews-empty-state__cta">
          <p className="reviews-empty-state__cta-text">
            Расскажите о нашей работе в
          </p>
          <a
            href="https://yandex.ru/maps/org/vek/22307782205/reviews/?ll=41.376142%2C56.846580&z=10"
            target="_blank"
            rel="noopener noreferrer"
            className="reviews-empty-state__yandex-link"
            aria-label="Оставить отзыв в Яндекс.Картах"
          >
            Яндекс.Картах →
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReviewsEmptyState;