# Архитектурное руководство проекта "Ритуальная служба Век"

## 🏗️ Общая архитектура

### Технологический стек

- **Frontend**: React 19.1.1 + Vite 7.1.5 + SCSS
- **Язык**: JavaScript (без TypeScript)
- **Стили**: SCSS с BEM методологией + CSS Custom Properties
- **Оптимизация**: Sharp 0.34.3 для изображений, кастомные Vite плагины (critical-css, image-optimization, html-assets)
- **SEO**: JSON-LD структурированные данные + `@dr.pogodin/react-helmet`

### Принципы архитектуры

#### 1. **Модульная структура**

```
src/
├── components/          # Переиспользуемые UI компоненты
├── pages/              # Страницы с секционной архитектурой
├── constants/          # Бизнес-данные и контент
├── helpers/            # Утилиты и бизнес-логика
├── styles/             # Глобальная система стилей
└── assets/            # Статические ресурсы
```

#### 2. **Component Co-location**

Каждый компонент содержит все связанные файлы:

```
ComponentName/
├── ComponentName.jsx   # Логика компонента
├── ComponentName.scss  # Стили компонента
└── index.js           # Экспорт (при необходимости)
```

#### 3. **Секционная архитектура страниц**

Крупные страницы разбиваются на секции:

```
HomePage/
├── HomePage.jsx
├── HomePage.scss
└── components/
    ├── HeroSection/
    ├── ServicesSection/
    └── ContactsSection/
```

## 🔄 Потоки данных

### Централизация бизнес-данных

```javascript
// constants/content.js - все тексты и настройки
export const SERVICES_DATA = { ... }
export const HOME_SEO_DATA = { ... }

// helpers/index.js - бизнес-логика и утилиты
export const COMPANY_INFO = {
  phone: "+7 (920) 366-36-36",
  offices: [...],
  // ...
}
```

### Паттерн глобального обертывания

```javascript
// Global.jsx оборачивает все страницы
<Global seoData={seoData}>
  <PageContent />
</Global>
```

## 🎨 Система стилей

### Иерархия SCSS импортов (КРИТИЧЕСКИ ВАЖНО)

```scss
// main.scss - строгий порядок импортов
@import "./variables.scss"; // 1. CSS переменные
@import "./constants.scss"; // 2. Sass константы
@import "./functions.scss"; // 3. Функции
@import "./media.scss"; // 4. Медиа-миксины
@import "./mixins.scss"; // 5. Миксины
@import "./fonts.scss"; // 6. Шрифты
@import "./normalize.scss"; // 7. Нормализация
// ...
```

### CSS Custom Properties система

```scss
:root {
  // Цвета из нового UI-гайда
  --color-primary: #444442;
  --color-accent: #c49e5e;
  --color-bg-primary: #ffffff;

  // Типографика (актуальные шрифты)
  --font-heading: "SangBleu Sunrise", serif;
  --font-body: "Euclid Flex", sans-serif;

  // Размеры и отступы
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  // ...
}
```

## 🖼️ Система изображений

### Автоматическая оптимизация

```javascript
// scripts/optimize-all-images.cjs
// Профили оптимизации по типам изображений
OPTIMIZATION_PROFILES = {
  'quiz-icons': { resize: {64x64}, quality: 80 },
  'design': { resize: {400x400}, quality: 90 },
  'general': { quality: 85 }
}
```

### Picture Element Pattern

```jsx
// Стандартный паттерн для всех изображений
<picture>
  <source srcSet={imageWebp} type="image/webp" />
  <img
    src={imageJpg}
    alt="Описательный alt текст"
    loading="lazy"
    width="800"
    height="533"
  />
</picture>
```

## 🔍 SEO архитектура

### Структурированные данные

```jsx
// Глобальные данные в StructuredData.jsx
const funeralServiceSchema = {
  "@type": "FuneralService",
  "name": "Ритуальная служба Век",
  // ...
}

// Страничные данные через react-helmet-async
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify(pageSpecificSchema)}
  </script>
</Helmet>
```

### Мета-теги и производительность

- Уникальные title/description для каждой страницы
- OpenGraph и Twitter Cards
- 100% lazy loading изображений
- WebP конвертация (99% экономии размера)

## 🌐 Русская локализация

### Утилиты локализации

```javascript
// helpers/index.js
formatPhone("+79203663636"); // "+7 (920) 366-36-36"
createSlug("Услуги похорон"); // "uslugi-pokhoron"
formatPrice(30000); // "30 000 ₽"
formatDate(date); // "15 сентября 2024 г."
```

### Валидация русских данных

```javascript
// Валидация кириллицы
validateName("Иван Петров"); // true
validatePhone("+7 920 366-36-36"); // true
```

## ⚡ Производительность

### Метрики

- PageSpeed > 90
- FCP < 2.5s
- WebP экономия: 10.6MB → 78KB (99.3%)
- Gzip: JS 435KB → 157KB, CSS 148KB → 25KB

### Оптимизации

- Автоматическая оптимизация изображений при сборке
- Критический CSS инлайн
- Lazy loading 100% покрытие
- Prefetch важных ресурсов

## 🔧 Конфигурация

### Vite настройки

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    react(),
    imageOptimizationPlugin(),
    criticalCssPlugin(),
    htmlAssetsPlugin(),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  css: {
    preprocessorOptions: {
      scss: { quietDeps: true, silenceDeprecations: ["import"] },
    },
  },
});
```

### Proxy для API

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true
    }
  }
}
```

## 📊 Диаграмма зависимостей компонентов

```
Global (SEO + Layout)
├── Header (навигация)
├── Main Content
│   ├── Page Components
│   │   ├── Section Components
│   │   └── UI Components
│   └── Shared Components
└── Footer (контакты)
```

## 🆕 Обновление до React 19 (Декабрь 2024)

### Изменения в архитектуре

- **PropTypes удалены** - заменены на JSDoc типизацию
- **Алиасы импортов** - восстановлены после решения кэш-проблем
- **PWA манифест** - обновлен с корректными путями к иконкам

### Миграция JSDoc вместо PropTypes

```javascript
/**
 * @param {Object} props - Параметры компонента
 * @param {string} props.phone - Номер телефона (обязательный)
 * @param {string} [props.note] - Дополнительная заметка
 * @param {string} [props.icon] - Иконка компонента
 * @param {string} [props.ariaLabel] - ARIA метка для доступности
 * @param {string} [props.parentClass="first-steps"] - CSS класс родительского элемента
 * @returns {JSX.Element} React компонент
 */
const CallBlock = ({
  phone,
  note,
  icon,
  ariaLabel,
  parentClass = "first-steps",
}) => {
  // ...
};
```

### Решение проблем при обновлении

1. **Кэш очистка** - при проблемах с импортами перезапустить dev сервер
2. **Алиасы работают** - `@/` корректно резолвится в Vite 7 + React 19
3. **PWA иконки** - добавлены в `public/` для корректной работы манифеста

## 🚀 Команды разработки

```bash
# Разработка с hot reload
npm run dev

# Production сборка с оптимизацией
npm run build

# Development сборка (быстрая)
npm run build:dev

# Оптимизация изображений
npm run optimize:images

# Линтинг
npm run lint:scss
npm run lint:js
```

---

**Важно**: Эта архитектура обеспечивает масштабируемость, производительность и SEO-оптимизацию для локального бизнеса ритуальных услуг с фокусом на конверсию телефонных звонков. Обновление до React 19 сохраняет все преимущества при улучшении производительности.
