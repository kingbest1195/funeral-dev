import React, { useState } from 'react';
import './ReviewCard.scss';
import yandexIcon from '@/assets/icons-optimized/yandex-icon.webp';
import googleIcon from '@/assets/icons-optimized/google-icon.webp';

/**
 * Компонент карточки отзыва с поддержкой аватарок, обрезки текста и источников
 */
const ReviewCard = ({
  author,
  rating,
  text,
  date,
  source, // 'yandex' или 'google'
  source_url,
  avatar_url,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const MAX_TEXT_LENGTH = 200;
  const shouldTruncate = text && text.length > MAX_TEXT_LENGTH;
  const displayText = shouldTruncate && !isExpanded
    ? `${text.substring(0, MAX_TEXT_LENGTH)}...`
    : text;

  // Получаем инициалы для аватара
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Генерируем цвет аватара на основе имени
  const getAvatarColor = (name) => {
    if (!name) return 'var(--color-accent)';

    const colors = [
      'var(--color-accent)',
      'var(--color-success)',
      'var(--color-warning)',
      'var(--color-primary)',
      'var(--color-secondary)'
    ];

    // Простой хеш для выбора цвета на основе имени
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // Получаем иконку источника и название
  const getSourceInfo = () => {
    switch (source) {
      case 'yandex':
        return {
          icon: yandexIcon,
          name: 'Яндекс.Картах'
        };
      case 'google':
        return {
          icon: googleIcon,
          name: 'Google Картах'
        };
      default:
        return {
          icon: null,
          name: source || 'источнике'
        };
    }
  };

  const sourceInfo = getSourceInfo();

  // Генерируем звёздочки рейтинга
  const renderStars = () => {
    const stars = [];
    const ratingNum = parseInt(rating) || 5;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`review-card__star ${i <= ratingNum ? 'review-card__star--filled' : ''}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Форматируем дату
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article className={`review-card ${className}`} aria-label="Отзыв клиента">
      <header className="review-card__header">
        <div className="review-card__author-info">
          <div className="review-card__avatar">
            {avatar_url && !imageError ? (
              <img
                src={avatar_url}
                alt={`Аватар пользователя ${author}`}
                className="review-card__avatar-image"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div
                className="review-card__avatar-initials"
                style={{ backgroundColor: getAvatarColor(author) }}
              >
                {getInitials(author)}
              </div>
            )}
          </div>
          <div className="review-card__meta">
            <div className="review-card__author">{author}</div>
            {date && (
              <div className="review-card__date">
                {formatDate(date)}
              </div>
            )}
          </div>
        </div>

        <div className="review-card__rating-wrapper">
          <div className="review-card__rating" aria-label={`Оценка ${rating} из 5`}>
            {renderStars()}
          </div>
          {sourceInfo.icon && (
            <div className="review-card__source-icon">
              <img
                src={sourceInfo.icon}
                alt={`Отзыв с ${sourceInfo.name}`}
                className="review-card__platform-icon"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </header>

      <div className="review-card__content">
        <p className="review-card__text">
          {displayText}
          {shouldTruncate && !isExpanded && (
            <button
              className="review-card__expand-btn"
              onClick={() => setIsExpanded(true)}
              aria-label="Показать полный текст отзыва"
            >
              Ещё
            </button>
          )}
        </p>
      </div>

      <footer className="review-card__footer">
        {source_url ? (
          <a
            href={source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="review-card__source-link"
            aria-label={`Читать отзыв в ${sourceInfo.name}`}
          >
            Читать в {sourceInfo.name} →
          </a>
        ) : (
          <span className="review-card__source-text">
            Отзыв с {sourceInfo.name}
          </span>
        )}
      </footer>
    </article>
  );
};

export default ReviewCard;