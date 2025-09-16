# Чек-лист создания нового модуля

## 🎯 Подготовка и планирование

### 1. Анализ требований
- [ ] **Определить назначение модуля** - что модуль должен делать?
- [ ] **Проанализировать существующие компоненты** - можно ли переиспользовать?
- [ ] **Определить место в архитектуре** - страница или переиспользуемый компонент?
- [ ] **Проверить UI-гайд** - соответствует ли дизайн-системе?
- [ ] **Изучить бизнес-требования** - какие данные нужны из `COMPANY_INFO`?

### 2. Планирование структуры
- [ ] **Выбрать тип модуля**:
  - `src/components/` - переиспользуемый UI компонент
  - `src/pages/` - страница сайта
  - `src/pages/PageName/components/` - секция страницы
- [ ] **Определить зависимости** - какие константы, утилиты, стили нужны?
- [ ] **Спланировать props API** - какие свойства будет принимать?

## 📁 Создание структуры файлов

### 3. Создание базовой структуры
```bash
# Для компонента
mkdir src/components/ModuleName
touch src/components/ModuleName/ModuleName.jsx
touch src/components/ModuleName/ModuleName.scss

# Для страницы
mkdir src/pages/PageName
mkdir src/pages/PageName/components
touch src/pages/PageName/PageName.jsx
touch src/pages/PageName/PageName.scss

# Для секции страницы
mkdir src/pages/HomePage/components/SectionName
touch src/pages/HomePage/components/SectionName/SectionName.jsx
touch src/pages/HomePage/components/SectionName/SectionName.scss
```

### 4. Создание основного JSX файла
- [ ] **Скопировать шаблон** из `docs/templates/component-template/`
- [ ] **Добавить правильные импорты**:
  ```javascript
  import React from "react";
  import "./ModuleName.scss";
  // Бизнес-данные
  import { COMPANY_INFO } from "@/helpers";
  // Контент (если нужен)
  import { MODULE_DATA } from "@/constants/content";
  // Оптимизированные изображения
  import imageWebp from "@/assets/images-optimized/image.webp";
  ```

- [ ] **Добавить JSDoc документацию**:
  ```javascript
  /**
   * Описание модуля и его назначения
   *
   * @param {Object} props - Свойства компонента
   * @param {string} props.title - Заголовок (обязательно)
   * @param {string} [props.className=""] - CSS классы
   * @param {string} [props.variant="default"] - Вариант отображения
   */
  ```

## 🎨 Создание стилей

### 5. Создание SCSS файла
- [ ] **Добавить правильные импорты**:
  ```scss
  @import "/src/styles/variables.scss";
  @import "/src/styles/mixins.scss";
  ```

- [ ] **Следовать BEM методологии**:
  ```scss
  .module-name {
    // Базовые стили с переменными
    padding: var(--spacing-md);
    background: var(--color-bg-primary);

    &__element {
      // Стили элемента
    }

    &--modifier {
      // Стили модификатора
    }
  }
  ```

- [ ] **Использовать ТОЛЬКО переменные** - никакого хардкода
- [ ] **Добавить адаптивность** с mobile-first подходом
- [ ] **Проверить accessibility** - фокус, контраст, размеры

## 📋 Контент и данные

### 6. Добавление бизнес-данных
- [ ] **Создать константы** в `src/constants/content.js`:
  ```javascript
  export const MODULE_DATA = {
    title: "Заголовок модуля",
    description: "Описание модуля",
    items: [
      {
        id: 1,
        title: "Элемент 1",
        description: "Описание элемента",
        icon: { viewBox: "0 0 24 24", path: "..." }
      }
    ]
  };
  ```

- [ ] **Использовать переводы и форматирование**:
  ```javascript
  import { formatPhone, formatPrice } from "@/helpers";

  // В компоненте
  <a href={`tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`}>
    {formatPhone(COMPANY_INFO.phone)}
  </a>
  ```

### 7. SEO оптимизация
- [ ] **Семантическая разметка**:
  ```jsx
  <section className="module-name">
    <h2 className="module-name__title">Заголовок</h2>
    <article className="module-name__item">
      <h3>Подзаголовок</h3>
    </article>
  </section>
  ```

- [ ] **Alt атрибуты для изображений**:
  ```jsx
  <img
    src={image}
    alt="Подробное описание изображения, НЕ 'картинка'"
    loading="lazy"
    width="800"
    height="533"
  />
  ```

- [ ] **Микроразметка** (если применимо):
  ```jsx
  <article itemScope itemType="https://schema.org/Service">
    <h3 itemProp="name">Название услуги</h3>
    <p itemProp="description">Описание услуги</p>
  </article>
  ```

## 🖼️ Работа с изображениями

### 8. Оптимизация изображений
- [ ] **Добавить изображения** в `src/assets/images/profile-name/`
- [ ] **Настроить профиль оптимизации** в `scripts/optimize-all-images.cjs`:
  ```javascript
  'module-images': {
    pattern: 'src/assets/images/module-name/**/*.{png,jpg,jpeg}',
    resize: { width: 800, height: 533, withoutEnlargement: true },
    png: { quality: 85, compressionLevel: 8 },
    webp: { quality: 90, effort: 4 }
  }
  ```

- [ ] **Запустить оптимизацию**: `npm run optimize:images`

### 9. Использование Picture элемента
- [ ] **Применить стандартный паттерн**:
  ```jsx
  <picture className="module-name__image">
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

## ♿ Accessibility проверки

### 10. Доступность
- [ ] **Keyboard navigation** - можно ли управлять с клавиатуры?
- [ ] **Screen reader support** - понятен ли контент для скрин-ридеров?
- [ ] **Focus management** - видны ли состояния фокуса?
- [ ] **Color contrast** - соответствует ли контраст WCAG AA?
- [ ] **ARIA атрибуты**:
  ```jsx
  <button
    aria-label="Открыть калькулятор стоимости"
    aria-expanded={isOpen}
    onClick={handleOpen}
  >
    Рассчитать стоимость
  </button>
  ```

## 📱 Адаптивность

### 11. Мобильная версия
- [ ] **Mobile-first подход** в CSS
- [ ] **Тестирование на мобильных** - iPhone, Android
- [ ] **Touch-friendly** - размеры кнопок минимум 44px
- [ ] **Производительность** - lazy loading, оптимизированные изображения

## 🔗 Интеграция

### 12. Подключение модуля
- [ ] **Импорт в родительский компонент**:
  ```javascript
  import ModuleName from "./components/ModuleName/ModuleName";
  ```

- [ ] **Передача правильных props**:
  ```jsx
  <ModuleName
    title="Заголовок"
    variant="featured"
    className="page-section"
  />
  ```

- [ ] **Обновление экспортов** (если нужно):
  ```javascript
  // В index.js
  export { default as ModuleName } from './ModuleName';
  ```

## 🧪 Тестирование

### 13. Проверка функциональности
- [ ] **Визуальная проверка** - соответствует ли дизайну?
- [ ] **Функциональная проверка** - работают ли все интерактивные элементы?
- [ ] **Адаптивность** - корректно ли отображается на всех разрешениях?
- [ ] **Производительность** - нет ли лагов, медленной загрузки?

### 14. Кросс-браузерная совместимость
- [ ] **Chrome** - основной браузер
- [ ] **Safari** - проверить на Mac/iOS
- [ ] **Firefox** - проверить отображение
- [ ] **Edge** - базовая совместимость

## 🔍 Качество кода

### 15. Линтинг и форматирование
- [ ] **ESLint проверка**: `npm run lint:js`
- [ ] **Stylelint проверка**: `npm run lint:scss`
- [ ] **Нет console.log** в production коде
- [ ] **Документация JSDoc** полная и актуальная

### 16. Производительность
- [ ] **Bundle size** - не увеличился ли значительно?
- [ ] **Render performance** - нет ли лишних рендеров?
- [ ] **Image optimization** - все изображения оптимизированы?

## 📄 Документация

### 17. Обновление документации
- [ ] **README обновлен** (если нужно)
- [ ] **CLAUDE.md обновлен** с новыми паттернами
- [ ] **Примеры использования** добавлены в JSDoc
- [ ] **Storybook** (если используется)

## 🚀 Финальная проверка

### 18. Перед коммитом
- [ ] **Код ревью** - просмотреть код свежим взглядом
- [ ] **Git staging** - добавить только нужные файлы
- [ ] **Commit message** - описательное сообщение
- [ ] **Production build** - `npm run build` проходит без ошибок

### 19. Деплой и мониторинг
- [ ] **Dev environment** - проверить на dev сервере
- [ ] **Performance metrics** - PageSpeed, Core Web Vitals
- [ ] **SEO проверка** - структурированные данные, meta теги
- [ ] **Analytics** - отслеживание взаимодействий (если нужно)

---

## 📋 Краткий чек-лист

**Перед началом:**
- [ ] Анализ требований
- [ ] Планирование структуры
- [ ] Проверка UI-гайда

**Разработка:**
- [ ] Создание JSX с JSDoc
- [ ] Создание SCSS с BEM
- [ ] Добавление бизнес-данных
- [ ] Оптимизация изображений

**Качество:**
- [ ] Accessibility проверки
- [ ] Адаптивность
- [ ] Линтинг
- [ ] Тестирование

**Финализация:**
- [ ] Документация
- [ ] Код ревью
- [ ] Production build
- [ ] Деплой

**Цель**: Каждый новый модуль должен быть качественным, доступным, производительным и соответствовать стандартам проекта.