Раздел 4: Разработка Фронтенда: Создание Динамичного и Отзывчивого UI
Этот раздел описывает создание пользовательского интерфейса для отображения отзывов с использованием стека Vite + JSX + SCSS, с акцентом на пользовательский опыт во время загрузки данных.

4.1. Архитектура Компонентов
Для реализации блока с отзывами предлагается использовать модульный подход с разделением на несколько компонентов:

ReviewsSection.jsx: Компонент-контейнер, отвечающий за всю логику: управление состоянием (загрузка, ошибка, данные), выполнение запроса к бэкенду и передачу данных в дочерние компоненты для отрисовки.

ReviewCard.jsx: Презентационный (глупый) компонент, который принимает в качестве props один объект отзыва и отвечает за его визуальное представление: отображение аватара, имени автора, рейтинга (звезд), текста отзыва и источника.

SkeletonCard.jsx: Компонент-заглушка, который имеет ту же структуру и размеры, что и ReviewCard, но вместо реальных данных отображает анимированные серые плашки. Он используется для создания эффекта "скелета" во время загрузки данных.

4.2. Управление Состоянием и Загрузка Данных
В компоненте ReviewsSection.jsx для управления состоянием используются стандартные хуки React: useState и useEffect.

JavaScript

import React, { useState, useEffect } from 'react';

const ReviewsSection = () => {
const = useState();
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
const fetchReviews = async () => {
try {
const response = await fetch('/api/reviews');
if (!response.ok) {
throw new Error('Ошибка при загрузке данных');
}
const data = await response.json();

        // Применяем финальную сортировку на клиенте
        const sortedData = data.sort((a, b) => {
          const aTextLength = a.text_content? a.text_content.length : 0;
          const bTextLength = b.text_content? b.text_content.length : 0;

          if (bTextLength!== aTextLength) {
            return bTextLength - aTextLength;
          }
          return b.publish_timestamp - a.publish_timestamp;
        });

        setReviews(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();

},); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

//... логика рендеринга
};
Флаг isLoading используется для условного рендеринга: пока он true, на экране отображается массив компонентов SkeletonCard, а после успешной загрузки и установки данных — массив ReviewCard.

4.3. Реализация Анимированных Скелетонов
Компонент SkeletonCard.jsx представляет собой набор div-элементов, стилизованных под элементы реальной карточки.

JSX (SkeletonCard.jsx):

Пример кода (не инструкция):

const SkeletonCard = () => (

  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-author"></div>
    </div>
    <div className="skeleton-rating"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-text short"></div>
  </div>
);
SCSS (_skeleton-card.scss):
Анимация "мерцания" достигается с помощью анимированного градиента фона.

Пример кода SCSS (не инструкция):

.skeleton-card {
// Стили контейнера, совпадающие с ReviewCard
.skeleton-avatar,.skeleton-author,.skeleton-rating,.skeleton-text {
background-color: #e0e0e0;
border-radius: 4px;
animation: pulse 1.5s infinite ease-in-out;
}

// Размеры элементов
.skeleton-avatar { width: 48px; height: 48px; border-radius: 50%; }
.skeleton-author { width: 120px; height: 20px; margin-left: 12px; }
.skeleton-rating { width: 100px; height: 16px; margin-top: 16px; }
.skeleton-text { width: 100%; height: 14px; margin-top: 12px; }
.skeleton-text.short { width: 70%; }
}

@keyframes pulse {
0% {
background-color: #e0e0e0;
}
50% {
background-color: #f0f0f0;
}
100% {
background-color: #e0e0e0;
}
}
Этот код создает плавную пульсацию, которая дает пользователю понять, что контент загружается, и улучшает общее восприятие скорости работы сайта.

4.4. Логика Сортировки и Рендеринга
Как показано в коде из п. 4.2, после получения данных от бэкенда, они проходят через метод sort(). Функция сравнения реализует требуемую двухфакторную сортировку:

По длине текста: Сравнивается b.text_content.length с a.text_content.length. Отзывы с более длинным текстом будут первыми.

По дате: Если длина текста одинакова, сравниваются b.publish_timestamp и a.publish_timestamp. Более новые отзывы будут первыми.

После сортировки массив reviews передается в метод map() для рендеринга списка компонентов ReviewCard:

Пример кода (не инструкция):

// Внутри рендер-метода ReviewsSection.jsx
if (isLoading) {
return (

<div className="reviews-grid">
{Array.from({ length: 3 }).map((\_, index) => <SkeletonCard key={index} />)}
</div>
);
}

if (error) {
return <p>Не удалось загрузить отзывы.</p>;
}

return (

  <div className="reviews-grid">
    {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
  </div>
);
