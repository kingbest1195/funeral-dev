# Стандарты кода и разработки

## 📋 Общие принципы

### Философия кода
1. **Читабельность** - код пишется один раз, читается множество раз
2. **Модульность** - каждый модуль решает одну задачу
3. **Переиспользуемость** - компоненты работают в разных контекстах
4. **Производительность** - оптимизация встроена в процесс разработки
5. **Доступность** - код доступен для всех пользователей

### Ограничения технологий
- ❌ **TypeScript** - проект использует vanilla JavaScript
- ❌ **CSS фреймворки** - никаких Bootstrap, Tailwind и т.д.
- ❌ **External CDN** - все зависимости бандлятся локально
- ❌ **jQuery** - используем только нативный JavaScript и React

## 📝 JavaScript/JSX стандарты

### Именование
```javascript
// ✅ Правильно
// Компоненты - PascalCase
const ServiceCard = () => {};
const ReviewsWidget = () => {};

// Переменные, функции - camelCase
const isLoading = true;
const handleClick = () => {};
const phoneNumber = "+7 920 366-36-36";

// Константы - UPPER_SNAKE_CASE
const COMPANY_INFO = {};
const API_ENDPOINTS = {};
const SERVICE_TYPES = {};

// Файлы компонентов - PascalCase
ServiceCard.jsx
ReviewsWidget.jsx

// Файлы утилит - camelCase
formatHelpers.js
validationUtils.js

// ❌ Неправильно
const servicecard = () => {};       // компонент не PascalCase
const PhoneNumber = "+7...";        // переменная не camelCase
const api_endpoints = {};           // константа не UPPER_SNAKE_CASE
```

### Структура файлов

```javascript
// Стандартная структура JSX файла

// 1. Импорты библиотек
import React, { useState, useEffect } from "react";

// 2. Импорты стилей
import "./ComponentName.scss";

// 3. Импорты констант и утилит
import { COMPANY_INFO } from "@/helpers";
import { SERVICES_DATA } from "@/constants/content";

// 4. Импорты изображений
import iconPhone from "@/assets/icons-optimized/phone-linear-gold.webp";

// 5. JSDoc документация
/**
 * Описание компонента
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок
 */

// 6. Определение компонента
const ComponentName = ({ title, ...props }) => {
  // 6.1 State
  const [isActive, setIsActive] = useState(false);

  // 6.2 Effects
  useEffect(() => {
    // логика
  }, []);

  // 6.3 Обработчики событий
  const handleClick = () => {
    setIsActive(!isActive);
  };

  // 6.4 Рендер-функции
  const renderContent = () => {
    return <div>Контент</div>;
  };

  // 6.5 Return
  return (
    <div className="component-name">
      {renderContent()}
    </div>
  );
};

// 7. Экспорт
export default ComponentName;
```

### Обработка ошибок

```javascript
// ✅ Правильная обработка ошибок
const ComponentWithErrorHandling = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error-state">Ошибка: {error}</div>;
  }

  if (loading) {
    return <div className="loading-state">Загрузка...</div>;
  }

  return <div>{/* основной контент */}</div>;
};
```

### Условный рендеринг

```javascript
// ✅ Правильные паттерны условного рендеринга

// Простое условие
{isVisible && <Component />}

// Условие с фолбэком
{data ? <DataComponent data={data} /> : <EmptyState />}

// Множественные условия
{(() => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;
  return <DataComponent data={data} />;
})()}

// ❌ Избегать тернарного оператора для сложной логики
{isLoading ?
  <LoadingSpinner /> :
  error ?
    <ErrorMessage /> :
    data ?
      <DataComponent /> :
      <EmptyState />
}
```

## 🎨 CSS/SCSS стандарты

### BEM именование
```scss
// ✅ Правильная BEM структура
.service-card {                    // Блок
  @include card-base;

  &__header {                      // Элемент
    padding: var(--spacing-md);
  }

  &__title {                       // Элемент
    @include heading-font;
    color: var(--color-text-primary);
  }

  &__description {                 // Элемент
    color: var(--color-text-secondary);
  }

  &--featured {                    // Модификатор блока
    border: var(--border-width-2) solid var(--color-accent);

    .service-card__title {         // Изменение элемента в модификаторе
      color: var(--color-accent);
    }
  }

  &--compact {                     // Модификатор блока
    .service-card__header {
      padding: var(--spacing-sm);
    }
  }
}

// ❌ Неправильные паттерны
.serviceCard {}                    // camelCase не для CSS
.service_card {}                   // underscores не BEM
.service-card .title {}            // не используем вложенность без &
```

### Использование переменных

```scss
// ✅ Всегда используем переменные
.component {
  padding: var(--spacing-md);
  margin: var(--spacing-lg);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-lg);
  transition: var(--transition-base);
}

// ❌ Никогда не хардкодим значения
.component {
  padding: 16px;                   // Плохо
  margin: 24px;                    // Плохо
  color: #444442;                  // Плохо
  background: white;               // Плохо
  border-radius: 8px;              // Плохо
}
```

## 📁 Структура файлов и папок

### Именование файлов
```
// ✅ Правильное именование
ComponentName.jsx              // React компоненты
ComponentName.scss             // Стили компонентов
utilityFunctions.js            // Утилиты
apiEndpoints.js               // API конфигурация
businessConstants.js          // Бизнес-константы

// ❌ Неправильное именование
component-name.jsx            // kebab-case не для компонентов
Component_Name.jsx            // underscores не используем
componentName.jsx             // camelCase не для файлов компонентов
```

### Структура модуля
```
ModuleName/
├── ModuleName.jsx            # Основной компонент
├── ModuleName.scss           # Стили модуля
├── index.js                  # Re-export (если нужен)
├── components/               # Внутренние компоненты
│   ├── SubComponent1/
│   └── SubComponent2/
├── hooks/                    # Кастомные хуки модуля
│   ├── useModuleData.js
│   └── useModuleState.js
├── utils/                    # Утилиты модуля
│   ├── formatters.js
│   └── validators.js
└── constants/                # Константы модуля
    ├── moduleConfig.js
    └── moduleContent.js
```

## 🔧 Работа с зависимостями

### Импорты
```javascript
// ✅ Правильный порядок импортов

// 1. React и библиотеки
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

// 2. Внутренние компоненты
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

// 3. Утилиты и хелперы
import { formatPhone, COMPANY_INFO } from "@/helpers";
import { SERVICES_DATA } from "@/constants/content";

// 4. Стили (в конце)
import "./ComponentName.scss";

// 5. Статические ресурсы (в конце)
import logoImage from "@/assets/images/logo.webp";
```

### Экспорты
```javascript
// ✅ Именованные экспорты для утилит
export const formatPhone = (phone) => { /* */ };
export const validateEmail = (email) => { /* */ };
export const COMPANY_INFO = { /* */ };

// ✅ Экспорт по умолчанию для компонентов
const ServiceCard = () => { /* */ };
export default ServiceCard;

// ✅ Смешанные экспорты при необходимости
const FeatureCard = () => { /* */ };
export const StatCard = () => { /* */ };
export const GalleryCard = () => { /* */ };
export default FeatureCard;
```

## 📖 Документация кода

### JSDoc для компонентов
```javascript
/**
 * Универсальная карточка услуги с иконкой и описанием
 *
 * @component
 * @example
 * <ServiceCard
 *   title="Организация похорон"
 *   description="Полный комплекс услуг"
 *   icon={{ viewBox: "0 0 24 24", path: "M..." }}
 *   variant="featured"
 *   onAction={() => console.log('Clicked')}
 * />
 *
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок карточки (обязательно)
 * @param {string} props.description - Описание услуги (обязательно)
 * @param {Object|ReactElement} props.icon - Иконка (SVG данные или JSX)
 * @param {string} [props.variant="default"] - Вариант отображения
 * @param {string} [props.className=""] - Дополнительные CSS классы
 * @param {Function} [props.onAction] - Обработчик клика по карточке
 * @param {string} [props.link] - Ссылка для перехода
 * @param {Object} [props...rest] - Остальные HTML атрибуты
 *
 * @returns {ReactElement} Компонент карточки услуги
 */
const ServiceCard = ({
  title,
  description,
  icon,
  variant = "default",
  className = "",
  onAction,
  link,
  ...props
}) => {
  // Реализация
};
```

### JSDoc для утилит
```javascript
/**
 * Форматирует российский номер телефона для отображения
 *
 * @param {string} phone - Номер телефона в любом формате
 * @returns {string} Отформатированный номер вида "+7 (920) 366-36-36"
 *
 * @example
 * formatPhone("79203663636") // "+7 (920) 366-36-36"
 * formatPhone("+7 920 366-36-36") // "+7 (920) 366-36-36"
 * formatPhone("8(920)366-36-36") // "+7 (920) 366-36-36"
 */
const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11 && cleaned.startsWith("7")) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }

  return phone;
};
```

## 🔍 Линтинг и форматирование

### ESLint правила (основные)
```json
// .eslintrc.json
{
  "extends": ["react-app", "react-app/jest"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/img-redundant-alt": "error"
  }
}
```

### Stylelint правила
```json
// .stylelintrc.json
{
  "extends": ["stylelint-config-standard-scss"],
  "rules": {
    "selector-class-pattern": "^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
    "custom-property-pattern": "^[a-z][a-z0-9]*(-[a-z0-9]+)*$",
    "selector-max-specificity": "0,3,0",
    "declaration-no-important": true
  }
}
```

## ✅ Чек-лист качества кода

### Перед коммитом
- [ ] Код проходит ESLint без ошибок
- [ ] Стили проходят Stylelint без ошибок
- [ ] Все функции и компоненты задокументированы
- [ ] Нет console.log в production коде
- [ ] Используются только CSS переменные (не хардкод)
- [ ] BEM именование соблюдено
- [ ] Accessibility атрибуты добавлены
- [ ] Изображения имеют alt атрибуты
- [ ] Lazy loading для изображений
- [ ] Мобильная адаптивность проверена

### Производительность
- [ ] Компоненты не рендерятся без необходимости
- [ ] Тяжелые операции мемоизированы
- [ ] Изображения оптимизированы (WebP + fallback)
- [ ] CSS не содержит неиспользуемых правил
- [ ] Bundle size не увеличился значительно

### SEO
- [ ] Семантическая HTML разметка
- [ ] Заголовки в правильной иерархии (h1 → h2 → h3)
- [ ] Meta теги уникальны для страницы
- [ ] Структурированные данные добавлены
- [ ] Контент оптимизирован для русскоязычной аудитории

---

**Главное правило**: Код должен быть понятен другому разработчику (или вам через полгода) без дополнительных объяснений.