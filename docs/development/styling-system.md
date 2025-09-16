# Система стилей и SCSS архитектура

## 🎨 Философия стилизации

### Принципы
1. **Система переменных** - все значения через CSS Custom Properties
2. **BEM методология** - структурированное именование классов
3. **Модульность** - каждый компонент имеет свои стили
4. **Никакого хардкода** - все размеры, цвета, отступы из переменных
5. **Accessibility-first** - стили поддерживают доступность

## 📂 Структура стилей

```
src/styles/
├── main.scss              # Главный файл импортов
├── variables.scss         # CSS Custom Properties
├── constants.scss         # Sass константы
├── functions.scss         # SCSS функции
├── media.scss            # Media query миксины
├── mixins.scss           # Основные миксины
├── fonts.scss            # Шрифты
├── normalize.scss        # CSS сброс
├── globals.scss          # Глобальные стили
├── utils.scss            # Утилитарные классы
├── abstracts/            # Продвинутые миксины
├── layout/               # Лэйаут компоненты
└── components/           # Глобальные компоненты
```

## ⚡ Критически важная иерархия импортов

```scss
// main.scss - СТРОГИЙ ПОРЯДОК!
// Нарушение порядка приводит к ошибкам сборки

// 1. CSS переменные (должны быть первыми)
@import './variables.scss';

// 2. Sass константы
@import './constants.scss';

// 3. Функции
@import './functions.scss';

// 4. Медиа-миксины
@import './media.scss';

// 5. Миксины (зависят от функций и медиа-миксинов)
@import './mixins.scss';
@import './abstracts/mixins-enhanced';

// 6. Шрифты
@import './fonts.scss';

// 7. Нормализация
@import './normalize.scss';

// 8. Глобальные стили
@import './globals.scss';

// 9. Утилитарные классы
@import './utils.scss';
```

## 🎯 CSS Custom Properties система

### Полная палитра переменных

```scss
// variables.scss
:root {
  // ЦВЕТОВАЯ ПАЛИТРА (из UI-гайда)
  // =================

  // Основные цвета
  --color-primary: #444442;           // Основной текст
  --color-primary-light: #5a5a58;
  --color-primary-dark: #2e2e2d;

  --color-secondary: #888888;         // Вторичный текст
  --color-accent: #c49e5e;           // Золотой акцент
  --color-accent-light: #d9bb82;
  --color-accent-dark: #a98240;
  --color-accent-transparent: rgba(196, 158, 94, 0.05);

  // Текстовые цвета
  --color-text-primary: #444442;
  --color-text-secondary: #888888;
  --color-text-muted: #9a9a9a;
  --color-text-white: #ffffff;
  --color-text-light: #f7fafc;

  // Фоновые цвета
  --color-bg-primary: #ffffff;        // Белые карточки
  --color-bg-secondary: #f6f6f6;      // Светло-серый фон страницы
  --color-bg-dark: #2d3748;
  --color-bg-overlay: rgba(26, 26, 26, 0.85);

  // Служебные цвета
  --color-success: #10b981;           // Зеленый
  --color-error: #ef4444;             // Красный
  --color-warning: #f59e0b;           // Оранжевый
  --color-info: #3b82f6;              // Синий

  // Границы и разделители
  --color-border: #eaeaea;            // Едва заметные границы
  --color-border-dark: #d1d5db;
  --color-border-light: #f3f4f6;

  // ТИПОГРАФИКА
  // =================

  // Семейства шрифтов
  --font-heading: 'Playfair Display', serif;    // Заголовки
  --font-body: 'Roboto', sans-serif;            // Основной текст
  --font-mono: 'Monaco', monospace;             // Код

  // Размеры шрифтов (система)
  --font-size-xs: 0.75rem;           // 12px
  --font-size-sm: 0.875rem;          // 14px
  --font-size-base: 1rem;            // 16px
  --font-size-lg: 1.125rem;          // 18px
  --font-size-xl: 1.25rem;           // 20px
  --font-size-2xl: 1.5rem;           // 24px
  --font-size-3xl: 1.875rem;         // 30px
  --font-size-4xl: 2.25rem;          // 36px
  --font-size-5xl: 3rem;             // 48px

  // Интерлиньяж
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  // Жирность шрифта
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  // РАЗМЕРЫ И ОТСТУПЫ
  // =================

  // Система отступов (0.25rem base)
  --spacing-xs: 0.25rem;              // 4px
  --spacing-sm: 0.5rem;               // 8px
  --spacing-md: 1rem;                 // 16px
  --spacing-lg: 1.5rem;               // 24px
  --spacing-xl: 2rem;                 // 32px
  --spacing-2xl: 3rem;                // 48px
  --spacing-3xl: 4rem;                // 64px

  // Специальные отступы
  --spacing-section: var(--spacing-3xl);      // Между секциями
  --spacing-component: var(--spacing-lg);     // Внутри компонентов
  --spacing-element: var(--spacing-md);       // Между элементами

  // Размеры контейнеров
  --container-xs: 20rem;              // 320px
  --container-sm: 30rem;              // 480px
  --container-md: 48rem;              // 768px
  --container-lg: 64rem;              // 1024px
  --container-xl: 80rem;              // 1280px
  --container-2xl: 96rem;             // 1536px
  --container-padding: var(--spacing-md);

  // КОМПОНЕНТЫ
  // =================

  // Высоты элементов
  --input-height: 2.75rem;            // 44px
  --button-height: 2.75rem;           // 44px
  --header-height: 4rem;              // 64px

  // Радиусы скругления
  --border-radius-sm: 0.25rem;        // 4px
  --border-radius-base: 0.5rem;       // 8px
  --border-radius-lg: 0.75rem;        // 12px
  --border-radius-xl: 1rem;           // 16px
  --border-radius-full: 9999px;       // Полный радиус

  // Толщины границ
  --border-width-1: 1px;
  --border-width-2: 2px;
  --border-width-4: 4px;

  // ТЕНИ
  // =================

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-outline: 0 0 0 3px rgba(196, 158, 94, 0.3);    // Фокус
  --shadow-inset: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

  // АНИМАЦИИ
  // =================

  // Длительность анимаций
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  // Функции плавности
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  // Готовые переходы
  --transition-base: all var(--duration-base) var(--ease-smooth);
  --transition-colors: color var(--duration-base) var(--ease-smooth),
                      background-color var(--duration-base) var(--ease-smooth),
                      border-color var(--duration-base) var(--ease-smooth);
  --transition-transform: transform var(--duration-base) var(--ease-smooth);

  // Z-INDEX
  // =================

  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}
```

## 🧩 SCSS Миксины

### Основные миксины

```scss
// mixins.scss

// Типографика
@mixin heading-font {
  font-family: var(--font-heading);
  font-display: swap;
  line-height: var(--line-height-tight);
}

@mixin body-font {
  font-family: var(--font-body);
  font-display: swap;
  line-height: var(--line-height-normal);
}

// Компоненты
@mixin card-base {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: var(--border-width-1) solid var(--color-border);
  overflow: hidden;
}

@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--button-height);
  padding: 0 var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-base);
  border: none;
  cursor: pointer;
  transition: var(--transition-colors);
  text-decoration: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

@mixin button-primary {
  @include button-base;
  background-color: var(--color-accent);
  color: var(--color-text-white);

  &:hover:not(:disabled) {
    background-color: var(--color-accent-dark);
  }

  &:focus-visible {
    @include focus-outline;
  }
}

// Утилиты
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@mixin focus-outline {
  outline: none;
  box-shadow: var(--shadow-outline);
}

@mixin container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

// Позиционирование
@mixin absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Адаптивность
@mixin aspect-ratio($width, $height) {
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 100%;
    padding-top: calc(#{$height} / #{$width} * 100%);
  }

  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
```

### Media Query миксины

```scss
// media.scss
$breakpoints: (
  xs: 480px,
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
  2xl: 1536px
);

// Mobile-first подход
@mixin xs-up {
  @media (min-width: #{map-get($breakpoints, xs)}) {
    @content;
  }
}

@mixin sm-up {
  @media (min-width: #{map-get($breakpoints, sm)}) {
    @content;
  }
}

@mixin md-up {
  @media (min-width: #{map-get($breakpoints, md)}) {
    @content;
  }
}

@mixin lg-up {
  @media (min-width: #{map-get($breakpoints, lg)}) {
    @content;
  }
}

// Desktop-first подход (для специальных случаев)
@mixin md-down {
  @media (max-width: #{map-get($breakpoints, md) - 1px}) {
    @content;
  }
}

@mixin sm-down {
  @media (max-width: #{map-get($breakpoints, sm) - 1px}) {
    @content;
  }
}

// Специальные media queries
@mixin print {
  @media print {
    @content;
  }
}

@mixin reduced-motion {
  @media (prefers-reduced-motion: reduce) {
    @content;
  }
}

@mixin high-contrast {
  @media (prefers-contrast: high) {
    @content;
  }
}
```

## 🏷️ BEM Методология

### Структура именования
```
.block
.block__element
.block__element--modifier
.block--modifier
```

### Примеры правильного BEM

```scss
// ✅ Правильно
.service-card {
  @include card-base;

  &__header {
    padding: var(--spacing-md);
    border-bottom: var(--border-width-1) solid var(--color-border);
  }

  &__title {
    @include heading-font;
    font-size: var(--font-size-xl);
    color: var(--color-text-primary);
  }

  &__description {
    @include body-font;
    color: var(--color-text-secondary);
    margin-top: var(--spacing-sm);
  }

  &__footer {
    padding: var(--spacing-md);
    background-color: var(--color-bg-secondary);
  }

  // Модификаторы
  &--featured {
    border: var(--border-width-2) solid var(--color-accent);

    .service-card__title {
      color: var(--color-accent);
    }
  }

  &--compact {
    .service-card__header,
    .service-card__footer {
      padding: var(--spacing-sm);
    }
  }
}

// ❌ Неправильно - избегать вложенности
.service-card {
  .header {
    .title {
      .link {
        // Слишком глубокая вложенность
      }
    }
  }
}
```

## 📱 Адаптивная система

### Mobile-first подход
```scss
.component {
  // Базовые стили для мобильных
  padding: var(--spacing-sm);
  font-size: var(--font-size-sm);

  // Планшеты
  @include md-up {
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
  }

  // Десктоп
  @include lg-up {
    padding: var(--spacing-lg);
    font-size: var(--font-size-lg);
  }
}
```

### Адаптивная сетка
```scss
.grid {
  display: grid;
  gap: var(--spacing-md);

  // Мобильная сетка
  grid-template-columns: 1fr;

  // Планшет - 2 колонки
  @include md-up {
    grid-template-columns: repeat(2, 1fr);
  }

  // Десктоп - 3 колонки
  @include lg-up {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🎭 Темная тема (подготовка)

```scss
// Подготовка к темной теме
:root {
  --color-scheme: light;
  // светлые переменные
}

[data-theme="dark"] {
  --color-scheme: dark;
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2d2d2d;
  --color-text-primary: #ffffff;
  --color-text-secondary: #cccccc;
}

// Автоматическая темная тема
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-scheme: dark;
    // темные переменные
  }
}
```

## 🛠️ Утилитарные классы

```scss
// utils.scss

// Отображение
.hidden { display: none !important; }
.block { display: block !important; }
.inline-block { display: inline-block !important; }
.flex { display: flex !important; }
.grid { display: grid !important; }

// Позиционирование
.relative { position: relative !important; }
.absolute { position: absolute !important; }
.fixed { position: fixed !important; }

// Отступы (только для экстренных случаев)
.mt-0 { margin-top: 0 !important; }
.mt-xs { margin-top: var(--spacing-xs) !important; }
.mt-sm { margin-top: var(--spacing-sm) !important; }
.mt-md { margin-top: var(--spacing-md) !important; }

// Текст
.text-center { text-align: center !important; }
.text-left { text-align: left !important; }
.text-right { text-align: right !important; }

// Цвета текста
.text-primary { color: var(--color-text-primary) !important; }
.text-secondary { color: var(--color-text-secondary) !important; }
.text-accent { color: var(--color-accent) !important; }

// Доступность
.sr-only {
  @include visually-hidden;
}

.focus-outline:focus {
  @include focus-outline;
}
```

## ✅ Правила и best practices

### Обязательные правила
1. **Всегда используй переменные** - никаких магических чисел
2. **Соблюдай иерархию импортов** - она критична для работы сборки
3. **Используй BEM** - для структурированности и избежания конфликтов
4. **Mobile-first** - начинай с мобильных стилей
5. **Semantic HTML** - стили должны дополнять, а не заменять семантику

### Что нельзя делать
```scss
// ❌ Хардкод значений
.component {
  padding: 16px;
  color: #444442;
  font-size: 18px;
}

// ❌ !important без крайней необходимости
.component {
  background: red !important;
}

// ❌ Глубокая вложенность
.component {
  .inner {
    .deep {
      .very-deep {
        color: red;
      }
    }
  }
}

// ❌ Нарушение BEM
.componentName {  // camelCase не BEM
  color: red;
}
```

### Что нужно делать
```scss
// ✅ Использование переменных
.component {
  padding: var(--spacing-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
}

// ✅ Правильный BEM
.component {
  @include card-base;

  &__element {
    color: var(--color-text-secondary);
  }

  &--modifier {
    background: var(--color-accent-light);
  }
}
```

---

**Главное правило**: Система стилей должна быть предсказуемой, масштабируемой и основанной на дизайн-системе проекта.