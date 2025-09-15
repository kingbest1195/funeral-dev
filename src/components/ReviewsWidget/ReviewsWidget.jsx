import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import ReviewCard from '@/components/ReviewCard/ReviewCard.jsx';
import ReviewCardSkeleton from '@/components/ReviewCard/ReviewCardSkeleton.jsx';
import ReviewsEmptyState from '@/components/ReviewCard/ReviewsEmptyState.jsx';
import './ReviewsWidget.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// SVG компоненты для навигации
const ArrowLeftIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Конфигурация компонента
const REVIEWS_CONFIG = {
  ITEMS_PER_PAGE: 9, // 3x3 на десктопе
  CACHE: {
    KEY: 'funeral_reviews_cache',
    TIMESTAMP_KEY: 'funeral_reviews_cache_timestamp',
    DURATION: 30 * 60 * 1000, // 30 минут
  },
  PAGINATION_THRESHOLDS: {
    SMALL: 25,
    MEDIUM: 15,
  },
  BREAKPOINTS: {
    TABLET: 768,
    DESKTOP: 1024,
  },
  AUTO_LOAD_THRESHOLD: 3, // Загружать за 3 слайда до конца
  CTA_LINK: 'https://yandex.ru/maps/org/vek/22307782205/reviews/?ll=41.376142%2C56.846580&z=10',
};

/**
 * Виджет отзывов с асинхронной загрузкой и кешированием
 */
const ReviewsWidget = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);

  // Загрузка отзывов после монтирования компонента
  useEffect(() => {
    loadReviews();
  }, []);

  // Эффект для адаптации пагинации при изменении количества отзывов
  useEffect(() => {
    const adaptPagination = () => {
      const paginationEl = document.querySelector('.reviews__slider .swiper-pagination');
      if (!paginationEl) return;

      const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
      const bulletCount = bullets.length;

      // Убираем предыдущие классы
      paginationEl.classList.remove('pagination-medium', 'pagination-small');

      if (bulletCount > REVIEWS_CONFIG.PAGINATION_THRESHOLDS.SMALL) {
        paginationEl.classList.add('pagination-small');
      } else if (bulletCount > REVIEWS_CONFIG.PAGINATION_THRESHOLDS.MEDIUM) {
        paginationEl.classList.add('pagination-medium');
      }
    };

    // Адаптируем пагинацию через небольшую задержку после рендера
    const timeoutId = setTimeout(adaptPagination, 100);
    return () => clearTimeout(timeoutId);
  }, [reviews.length]);

  // Функция проверки кеша
  const getCachedReviews = () => {
    try {
      const cachedData = localStorage.getItem(REVIEWS_CONFIG.CACHE.KEY);
      const cachedTimestamp = localStorage.getItem(REVIEWS_CONFIG.CACHE.TIMESTAMP_KEY);

      if (cachedData && cachedTimestamp) {
        const now = Date.now();
        const timestamp = parseInt(cachedTimestamp);

        if (now - timestamp < REVIEWS_CONFIG.CACHE.DURATION) {
          return JSON.parse(cachedData);
        }
      }
    } catch (error) {
      console.warn('Ошибка чтения кеша отзывов:', error);
    }
    return null;
  };

  // Функция сохранения в кеш
  const setCachedReviews = (data) => {
    try {
      localStorage.setItem(REVIEWS_CONFIG.CACHE.KEY, JSON.stringify(data));
      localStorage.setItem(REVIEWS_CONFIG.CACHE.TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.warn('Ошибка сохранения кеша отзывов:', error);
    }
  };

  // Функция загрузки отзывов
  const loadReviews = async () => {
    console.log('🔄 Начинаем loadReviews');

    // Сначала проверяем кеш
    const cachedReviews = getCachedReviews();
    if (cachedReviews && cachedReviews.length > 0) {
      console.log('📦 Использую кешированные отзывы:', cachedReviews.length);

      // Применяем дедупликацию и к кешированным данным
      const uniqueReviewsMap = new Map();
      cachedReviews.forEach(review => {
        if (review.id && !uniqueReviewsMap.has(review.id)) {
          uniqueReviewsMap.set(review.id, review);
        }
      });

      const uniqueCachedReviews = Array.from(uniqueReviewsMap.values());
      console.log(`🔍 Уникальных кешированных отзывов: ${uniqueCachedReviews.length} из ${cachedReviews.length}`);

      setReviews(uniqueCachedReviews);
      setCurrentOffset(uniqueCachedReviews.length);

      // Если кешированных отзывов меньше чем ITEMS_PER_PAGE, значит это все что есть
      if (uniqueCachedReviews.length < REVIEWS_CONFIG.ITEMS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setLoading(false);
      return;
    }

    console.log('🌐 Кеша нет, загружаю с сервера');

    // Если кеша нет, загружаем с бэкенда
    try {
      setLoading(true);
      setError(null);

      console.log('📡 Отправляю запрос к /api/reviews');
      const response = await fetch(`/api/reviews?offset=0&limit=${REVIEWS_CONFIG.ITEMS_PER_PAGE}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📨 Получен ответ:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Данные получены:', data.length, 'отзывов');

      // Создаем Map для уникальности по ID
      const uniqueReviewsMap = new Map();

      data.forEach(review => {
        if (review.id && !uniqueReviewsMap.has(review.id)) {
          uniqueReviewsMap.set(review.id, review);
        }
      });

      // Преобразуем обратно в массив и сортируем
      const uniqueReviews = Array.from(uniqueReviewsMap.values()).sort((a, b) => {
        const lengthDiff = (b.review_text?.length || 0) - (a.review_text?.length || 0);
        if (lengthDiff !== 0) return lengthDiff;
        return new Date(b.publish_date || 0) - new Date(a.publish_date || 0);
      });

      console.log('✅ Отзывы обработаны и отсортированы');
      console.log(`🔍 Уникальных отзывов: ${uniqueReviews.length} из ${data.length}`);

      setReviews(uniqueReviews);
      setCurrentOffset(uniqueReviews.length);

      // Проверяем есть ли еще данные
      if (data.length < REVIEWS_CONFIG.ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setCachedReviews(uniqueReviews);
    } catch (err) {
      console.error('❌ Ошибка загрузки отзывов:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Функция повторной загрузки
  const handleRetry = () => {
    loadReviews();
  };

  // Функция для удаления дубликатов отзывов
  const removeDuplicateReviews = (existingReviews, newReviews) => {
    const existingIds = new Set(existingReviews.map(review => review.id).filter(Boolean));
    return newReviews.filter(review => review.id && !existingIds.has(review.id));
  };

  // Функция загрузки дополнительных отзывов
  const loadMoreReviews = async () => {
    if (loadingMore || !hasMore) {
      console.log('❌ Загрузка заблокирована:', { loadingMore, hasMore });
      return;
    }

    try {
      setLoadingMore(true);
      console.log(`🔄 Загружаю дополнительные отзывы, offset: ${currentOffset}`);

      const response = await fetch(`/api/reviews?offset=${currentOffset}&limit=${REVIEWS_CONFIG.ITEMS_PER_PAGE}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newReviews = await response.json();
      console.log(`📊 Получено дополнительных отзывов: ${newReviews.length}`);

      // Если получили меньше чем запрашивали - это конец
      if (newReviews.length < REVIEWS_CONFIG.ITEMS_PER_PAGE) {
        setHasMore(false);
        console.log('✅ Достигнут конец списка отзывов');
      }

      if (newReviews.length > 0) {
        // Удаляем дубликаты
        const filteredNewReviews = removeDuplicateReviews(reviews, newReviews);
        console.log(`🔍 После удаления дубликатов: ${filteredNewReviews.length} из ${newReviews.length} отзывов`);

        if (filteredNewReviews.length > 0) {
          // Сортируем новые отзывы
          const sortedNewReviews = filteredNewReviews.sort((a, b) => {
            const lengthDiff = (b.review_text?.length || 0) - (a.review_text?.length || 0);
            if (lengthDiff !== 0) return lengthDiff;
            return new Date(b.publish_date || 0) - new Date(a.publish_date || 0);
          });

          setReviews(prev => {
            const allReviews = [...prev, ...sortedNewReviews];
            setCachedReviews(allReviews);
            return allReviews;
          });

          setCurrentOffset(prev => prev + newReviews.length);
        } else {
          // Если все отзывы оказались дубликатами, увеличиваем offset
          setCurrentOffset(prev => prev + newReviews.length);

          // Если мы получили полную порцию дубликатов, пробуем еще раз
          if (newReviews.length === REVIEWS_CONFIG.ITEMS_PER_PAGE && hasMore) {
            console.log('🔄 Все отзывы были дубликатами, пробую загрузить еще');
            setTimeout(() => loadMoreReviews(), 100);
            return;
          }
        }
      } else {
        // Если отзывов вообще нет - конец
        setHasMore(false);
        console.log('✅ Отзывов больше нет');
      }
    } catch (err) {
      console.error('❌ Ошибка загрузки дополнительных отзывов:', err);
      setHasMore(false); // Останавливаем загрузку при ошибке
    } finally {
      setLoadingMore(false);
    }
  };

  // Рендер состояния загрузки
  const renderLoading = () => (
    <div className="reviews__slider">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          prevEl: '.reviews__slider .swiper-button-prev',
          nextEl: '.reviews__slider .swiper-button-next',
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          [REVIEWS_CONFIG.BREAKPOINTS.TABLET]: { slidesPerView: 2 },
          [REVIEWS_CONFIG.BREAKPOINTS.DESKTOP]: { slidesPerView: 3 },
        }}
        a11y={{
          prevSlideMessage: "Предыдущие отзывы",
          nextSlideMessage: "Следующие отзывы",
        }}
      >
        {[1, 2, 3].map((index) => (
          <SwiperSlide key={index}>
            <ReviewCardSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Кнопки навигации для состояния загрузки */}
      <div className="swiper-button-prev" style={{ opacity: 0.5, pointerEvents: 'none' }}>
        <ArrowLeftIcon />
      </div>
      <div className="swiper-button-next" style={{ opacity: 0.5, pointerEvents: 'none' }}>
        <ArrowRightIcon />
      </div>
    </div>
  );

  // Рендер ошибки
  const renderError = () => (
    <ReviewsEmptyState
      type="error"
      message={error}
      onRetry={handleRetry}
    />
  );

  // Рендер пустого состояния
  const renderEmpty = () => (
    <ReviewsEmptyState type="empty" />
  );

  // Рендер отзывов
  const renderReviews = () => (
    <div className="reviews__slider">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          prevEl: '.reviews__slider .swiper-button-prev',
          nextEl: '.reviews__slider .swiper-button-next',
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          [REVIEWS_CONFIG.BREAKPOINTS.TABLET]: { slidesPerView: 2 },
          [REVIEWS_CONFIG.BREAKPOINTS.DESKTOP]: { slidesPerView: Math.min(reviews.length, 3) },
        }}
        a11y={{
          prevSlideMessage: "Предыдущие отзывы",
          nextSlideMessage: "Следующие отзывы",
        }}
        onSlideChange={(swiper) => {
          // Автозагрузка при достижении последних слайдов
          if (hasMore && !loadingMore) {
            const totalSlides = swiper.slides?.length || 0;
            const threshold = Math.max(1, totalSlides - REVIEWS_CONFIG.AUTO_LOAD_THRESHOLD);

            if (swiper.activeIndex >= threshold) {
              console.log('🔄 Автозагрузка на слайде:', swiper.activeIndex, 'threshold:', threshold);
              loadMoreReviews();
            }
          }
        }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={review.id ? `review-${review.id}` : `review-fallback-${index}`}>
            <ReviewCard
              author={review.author_name}
              rating={review.rating}
              text={review.review_text}
              date={review.publish_date}
              source={review.source}
              source_url={review.source_url}
              avatar_url={review.author_avatar_url}
            />
          </SwiperSlide>
        ))}

        {/* Слайд с кнопкой загрузки дополнительных отзывов */}
        {hasMore && (
          <SwiperSlide key={`load-more-${reviews.length}`}>
            <div className="reviews__load-more-card">
              <div className="reviews__load-more-content">
                <h3 className="reviews__load-more-title">Еще отзывы</h3>
                <p className="reviews__load-more-text">
                  Посмотрите больше отзывов наших клиентов
                </p>
                <button
                  className="reviews__load-more-btn btn btn--accent btn--md"
                  onClick={loadMoreReviews}
                  disabled={loadingMore}
                  aria-label="Загрузить дополнительные отзывы"
                >
                  {loadingMore ? 'Загружаем...' : 'Загрузить еще'}
                </button>
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {/* Кнопки навигации внутри slider */}
      <div className="swiper-button-prev">
        <ArrowLeftIcon />
      </div>
      <div className="swiper-button-next">
        <ArrowRightIcon />
      </div>
    </div>
  );

  return (
    <section
      className="reviews section"
      aria-labelledby="reviews-title"
      role="region"
    >
      <div className="container">
        <header className="reviews__header">
          <h2 id="reviews-title" className="reviews__title">Что о нас говорят</h2>
          <p className="reviews__subtitle">
            Реальные отзывы наших клиентов с Яндекс.Карт и Google Карт
          </p>
        </header>

        <div className="reviews__content" aria-live="polite">
          {loading && renderLoading()}
          {!loading && error && renderError()}
          {!loading && !error && reviews.length === 0 && renderEmpty()}
          {!loading && !error && reviews.length > 0 && renderReviews()}
        </div>

        <aside className="reviews__cta" role="complementary" aria-label="Призыв к действию">
          <p className="reviews__cta-text">
            Поделитесь своим опытом работы с нами
          </p>
          <a
            href={REVIEWS_CONFIG.CTA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="reviews__cta-link btn btn--secondary btn--sm"
            aria-label="Оставить отзыв в Яндекс.Картах (откроется в новой вкладке)"
          >
            Оставить отзыв в Яндекс.Картах
          </a>
        </aside>
      </div>
    </section>
  );
};

export default ReviewsWidget;