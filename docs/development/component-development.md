# Руководство по разработке React компонентов

## 🧩 Философия компонентной разработки

### Принципы
1. **Модульность** - каждый компонент самодостаточен
2. **Переиспользуемость** - компонент работает в разных контекстах
3. **Композиция** - сложное поведение через композицию простых компонентов
4. **Accessibility** - все компоненты доступны для скрин-ридеров
5. **SEO-оптимизация** - семантическая разметка по умолчанию

## 📁 Структура компонента

### Стандартная структура
```
ComponentName/
├── ComponentName.jsx      # Основная логика
├── ComponentName.scss     # Стили компонента
├── index.js              # Re-export (опционально)
└── ComponentName.stories.js  # Storybook (если используется)
```

### Альтернативная структура (для простых компонентов)
```
ComponentName.jsx
ComponentName.scss
```

## 🔨 Шаблон компонента

### Базовый шаблон
```jsx
import React from "react";
import "./ComponentName.scss";

/**
 * Описание компонента и его назначения
 *
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок (обязательно)
 * @param {string} props.description - Описание (опционально)
 * @param {string} props.className - Дополнительные CSS классы
 * @param {string} props.variant - Вариант отображения ('default', 'primary', 'secondary')
 * @param {ReactNode} props.children - Дочерние элементы
 */
const ComponentName = ({
  title,
  description,
  className = "",
  variant = "default",
  children,
  ...props
}) => {
  // Генерация CSS классов
  const componentClasses = [
    "component-name",
    `component-name--${variant}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={componentClasses} {...props}>
      {/* Семантическая разметка */}
      <h2 className="component-name__title">{title}</h2>
      {description && (
        <p className="component-name__description">{description}</p>
      )}
      {children && (
        <div className="component-name__content">
          {children}
        </div>
      )}
    </div>
  );
};

export default ComponentName;
```

### Продвинутый шаблон с hooks
```jsx
import React, { useState, useEffect, useRef } from "react";
import "./ComponentName.scss";

const ComponentName = ({
  data,
  onAction,
  className = "",
  variant = "default"
}) => {
  // State управление
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refs для DOM манипуляций
  const componentRef = useRef(null);

  // Effects
  useEffect(() => {
    // Инициализация компонента
    return () => {
      // Cleanup
    };
  }, []);

  // Обработчики событий
  const handleAction = () => {
    setLoading(true);
    onAction?.();
    setLoading(false);
  };

  const componentClasses = [
    "component-name",
    `component-name--${variant}`,
    isActive && "component-name--active",
    loading && "component-name--loading",
    className
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={componentRef}
      className={componentClasses}
      role="region"
      aria-label="Описание области для скрин-ридеров"
    >
      {/* Контент */}
    </div>
  );
};

export default ComponentName;
```

## 🎨 Система стилей для компонентов

### SCSS шаблон
```scss
@import "/src/styles/variables.scss";
@import "/src/styles/mixins.scss";

// =================
// COMPONENT NAME
// =================

.component-name {
  // Базовые стили (используем переменные)
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-base);
  transition: all var(--transition-base);

  // Элементы (BEM)
  &__title {
    @include heading-font;
    font-size: var(--font-size-xl);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
  }

  &__description {
    @include body-font;
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
  }

  &__content {
    margin-top: var(--spacing-md);
  }

  // Модификаторы (BEM)
  &--primary {
    background-color: var(--color-accent);
    color: var(--color-text-white);
  }

  &--large {
    padding: var(--spacing-lg);

    .component-name__title {
      font-size: var(--font-size-2xl);
    }
  }

  &--active {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  // Состояния
  &:hover {
    background-color: var(--color-bg-hover);
  }

  &:focus-visible {
    @include focus-outline;
  }

  // Адаптивность
  @include md-down {
    padding: var(--spacing-sm);

    &__title {
      font-size: var(--font-size-lg);
    }
  }
}
```

## 🔗 Паттерны компонентов

### 1. Композитный компонент
```jsx
// Card.jsx - базовый компонент
const Card = ({ children, className, ...props }) => (
  <div className={`card ${className}`} {...props}>
    {children}
  </div>
);

// Специализированные компоненты
const Card.Header = ({ children }) => (
  <div className="card__header">{children}</div>
);

const Card.Body = ({ children }) => (
  <div className="card__body">{children}</div>
);

const Card.Footer = ({ children }) => (
  <div className="card__footer">{children}</div>
);

// Использование
<Card>
  <Card.Header>Заголовок</Card.Header>
  <Card.Body>Контент</Card.Body>
  <Card.Footer>Футер</Card.Footer>
</Card>
```

### 2. Универсальный компонент с variants
```jsx
const FeatureCard = ({
  icon,
  title,
  description,
  variant = "default",
  link,
  linkText = "Подробнее"
}) => {
  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'object' && icon.viewBox) {
      return <svg viewBox={icon.viewBox}><path d={icon.path} /></svg>;
    }
    return null;
  };

  return (
    <div className={`feature-card feature-card--${variant}`}>
      {icon && <div className="feature-card__icon">{renderIcon()}</div>}
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
      {link && (
        <a href={link} className="feature-card__link">
          {linkText}
        </a>
      )}
    </div>
  );
};
```

### 3. Компонент с состоянием
```jsx
const ReviewCard = ({ author, rating, text, date }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const shouldTruncate = text.length > 200;
  const displayText = shouldTruncate && !isExpanded
    ? `${text.substring(0, 200)}...`
    : text;

  return (
    <article className="review-card">
      <header className="review-card__header">
        <div className="review-card__author">{author}</div>
        <div className="review-card__rating">{/* звездочки */}</div>
      </header>

      <div className="review-card__content">
        <p className="review-card__text">
          {displayText}
          {shouldTruncate && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="review-card__expand-btn"
            >
              Ещё
            </button>
          )}
        </p>
      </div>
    </article>
  );
};
```

## 🎯 Работа с изображениями

### Picture Element компонент
```jsx
const OptimizedImage = ({
  imageWebp,
  imageJpg,
  alt,
  width,
  height,
  loading = "lazy",
  className = ""
}) => (
  <picture className={className}>
    <source srcSet={imageWebp} type="image/webp" />
    <img
      src={imageJpg}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
    />
  </picture>
);
```

### Компонент иконки
```jsx
const Icon = ({ name, size = 24, className = "" }) => {
  const iconMap = {
    phone: { viewBox: "0 0 24 24", path: "M..." },
    email: { viewBox: "0 0 24 24", path: "M..." }
  };

  const icon = iconMap[name];
  if (!icon) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      className={`icon icon--${name} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
};
```

## ♿ Accessibility Guidelines

### Обязательные требования
```jsx
// 1. Семантические теги
<article className="review-card">
  <h3>Заголовок</h3>
  <p>Описание</p>
</article>

// 2. ARIA атрибуты
<button
  aria-label="Закрыть модальное окно"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  ×
</button>

// 3. Альтернативный текст
<img
  src={image}
  alt="Описательный alt текст, НЕ 'изображение' или 'фото'"
/>

// 4. Keyboard navigation
<div
  tabIndex={0}
  role="button"
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Кликабельный элемент
</div>

// 5. Focus management
const dialogRef = useRef();
useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus();
  }
}, [isOpen]);
```

## 📊 Интеграция с бизнес-данными

### Использование констант
```jsx
import { COMPANY_INFO } from "@/helpers";
import { SERVICES_DATA } from "@/constants/content";

const ContactInfo = () => (
  <div className="contact-info">
    <a href={`tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`}>
      {COMPANY_INFO.phone}
    </a>
    <p>{COMPANY_INFO.workSchedule}</p>
  </div>
);

const ServicesList = () => (
  <div className="services-list">
    {SERVICES_DATA.items.map(service => (
      <FeatureCard
        key={service.id}
        title={service.title}
        description={service.description}
        icon={service.icon}
        link={service.link}
      />
    ))}
  </div>
);
```

## 🔍 SEO оптимизация

### Структурированные данные в компонентах
```jsx
const ServiceCard = ({ service }) => (
  <article
    className="service-card"
    itemScope
    itemType="https://schema.org/Service"
  >
    <h3 itemProp="name">{service.title}</h3>
    <p itemProp="description">{service.description}</p>
    <meta itemProp="provider" content="Ритуальная служба Век" />
  </article>
);
```

### Мета-информация для страниц
```jsx
import { Helmet } from "react-helmet-async";

const PageComponent = ({ seoData }) => (
  <>
    <Helmet>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <script type="application/ld+json">
        {JSON.stringify(seoData.jsonLd)}
      </script>
    </Helmet>
    <main>{/* контент */}</main>
  </>
);
```

## ✅ Чек-лист нового компонента

- [ ] JSDoc документация всех props
- [ ] Поддержка className и variant props
- [ ] BEM нейминг в SCSS
- [ ] Использование CSS переменных (НЕ хардкод)
- [ ] Семантическая HTML разметка
- [ ] ARIA атрибуты где необходимо
- [ ] Alt тексты для изображений
- [ ] Адаптивные стили
- [ ] Lazy loading для изображений
- [ ] Обработка состояний loading/error
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Интеграция с бизнес-константами

---

**Принцип**: Каждый компонент должен быть самодостаточным, доступным, производительным и следовать единому стилю проекта.