# Документация проекта "Ритуальная служба Век"

Комплексная документация для разработки модулей и компонентов в проекте React-сайта ритуальной службы.

## 📁 Структура документации

### 🏗️ Development (`docs/development/`)
Техническая архитектура и принципы разработки:

- **[`architecture-guide.md`](development/architecture-guide.md)** - Архитектурное руководство проекта
- **[`component-development.md`](development/component-development.md)** - Руководство по разработке React компонентов
- **[`styling-system.md`](development/styling-system.md)** - Система стилей и SCSS архитектура
- **[`performance-optimization.md`](development/performance-optimization.md)** - Принципы оптимизации и SEO

### 📏 Standards (`docs/standards/`)
Стандарты кода и методологии:

- **[`code-standards.md`](standards/code-standards.md)** - Стандарты кода, нейминга, модульности
- **[`component-patterns.md`](standards/component-patterns.md)** - Паттерны и шаблоны компонентов
- **[`testing-guidelines.md`](standards/testing-guidelines.md)** - Подходы к тестированию
- **[`seo-requirements.md`](standards/seo-requirements.md)** - Требования по SEO и доступности

### 📖 Guides (`docs/guides/`)
Практические руководства и инструкции:

- **[`new-module-checklist.md`](guides/new-module-checklist.md)** - Чек-лист создания нового модуля
- **[`api-integration.md`](guides/api-integration.md)** - Интеграция с API и работа с данными
- **[`image-optimization.md`](guides/image-optimization.md)** - Работа с изображениями и оптимизация
- **[`localization-guide.md`](guides/localization-guide.md)** - Локализация и работа с русским языком

### 🛠️ Templates (`docs/templates/`)
Готовые шаблоны для быстрого старта:

- **[`component-template/`](templates/component-template/)** - Полный шаблон React компонента
- **[`page-template/`](templates/page-template/)** - Шаблон страницы сайта
- **[`module-structure/`](templates/module-structure/)** - Структура модуля
- **[`scss-template/`](templates/scss-template/)** - Шаблон SCSS файла

### 🆘 Troubleshooting (`docs/troubleshooting/`)
Решение распространенных проблем:

- **[`README.md`](troubleshooting/README.md)** - Обзор всех проблем и быстрые решения
- **[`fix-416-error.md`](troubleshooting/fix-416-error.md)** - Ошибка HTTP 416 при загрузке CSS

### 🚀 Deploy (`docs/deploy/`)
Деплой и инфраструктура:

- **[`deploy-plan.md`](deploy/deploy-plan.md)** - Полный план деплоя на Yandex Cloud

## 🚀 Быстрый старт

### Создание нового компонента
1. **Изучите** [`component-development.md`](development/component-development.md) - принципы разработки
2. **Используйте** [`component-template/`](templates/component-template/) - готовый шаблон
3. **Следуйте** [`new-module-checklist.md`](guides/new-module-checklist.md) - пошаговое руководство
4. **Проверьте** [`code-standards.md`](standards/code-standards.md) - соответствие стандартам

### Работа со стилями
1. **Изучите** [`styling-system.md`](development/styling-system.md) - систему CSS переменных
2. **Следуйте** BEM методологии и mobile-first подходу
3. **Используйте** только CSS Custom Properties (никакого хардкода)
4. **Применяйте** адаптивные миксины из `media.scss`

### Оптимизация изображений
1. **Добавьте** изображения в `src/assets/images/profile-name/`
2. **Настройте** профиль в `scripts/optimize-all-images.cjs`
3. **Запустите** `npm run optimize:images`
4. **Используйте** Picture Element pattern с WebP + fallback

## 🎯 Ключевые принципы проекта

### 1. **Модульность**
- Каждый компонент самодостаточен
- Co-location: компонент + стили в одной папке
- Переиспользуемость в разных контекстах

### 2. **Производительность**
- WebP конвертация (99% экономии размера)
- Lazy loading 100% покрытие
- Автоматическая оптимизация при сборке
- Critical CSS инлайн

### 3. **SEO & Accessibility**
- Семантическая HTML разметка
- JSON-LD структурированные данные
- ARIA атрибуты и keyboard navigation
- Русская локализация

### 4. **Система дизайна**
- CSS Custom Properties из `variables.scss`
- BEM методология
- Mobile-first адаптивность
- Следование UI-гайду проекта

### 5. **Качество кода**
- JSDoc документация
- ESLint + Stylelint проверки
- TypeScript НЕ используется (проектное ограничение)
- Никаких CSS фреймворков

## 📊 Технологический стек

- **Frontend**: React 18 + Vite
- **Стили**: SCSS + CSS Custom Properties
- **Изображения**: Sharp оптимизация + WebP
- **SEO**: JSON-LD + react-helmet-async
- **Локализация**: Русский язык + Cyrillic

## 📋 Часто используемые команды

```bash
# Разработка
npm run dev                  # Запуск dev сервера

# Сборка
npm run build               # Production с оптимизацией
npm run build:dev           # Development без оптимизации
npm run build:yandex        # Сборка для деплоя на Yandex Cloud

# Деплой
npm run cdn:clear           # Инвалидация кеша CDN (после деплоя)

# Качество кода
npm run lint:scss           # Проверка SCSS
npm run lint:js             # Проверка JavaScript

# Оптимизация
npm run optimize:images     # Оптимизация изображений
```

## 🔗 Полезные ссылки

### Внутренние документы
- [`CLAUDE.md`](../CLAUDE.md) - Основное руководство для Claude Code
- [`ui-guide.md`](ui-guide.md) - UI гайд и дизайн-система
- [`.cursorrules`](../.cursorrules) - Правила разработки

### Внешние ресурсы
- [React Documentation](https://react.dev/)
- [SCSS Guide](https://sass-lang.com/guide)
- [BEM Methodology](https://getbem.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Контрибуция

При добавлении новой документации:

1. **Следуйте** структуре существующих файлов
2. **Добавляйте** практические примеры из проекта
3. **Обновляйте** этот README при добавлении новых файлов
4. **Используйте** Markdown с GitHub Flavored extensions

## 📝 Обновления документации

**Последнее обновление**: 16 сентября 2024

**Версия проекта**: 1.0.0

**Статус**: Актуальная (соответствует текущей архитектуре)

---

**Цель документации**: Обеспечить консистентную, качественную и эффективную разработку новых модулей в соответствии с принципами и стандартами проекта.