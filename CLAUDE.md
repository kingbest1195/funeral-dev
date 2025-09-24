# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modern React website for "Век" (Vek) funeral service in Shuya, Russia. Built with Vite, React 18, and SCSS with focus on performance, accessibility, and local SEO optimization.

## Development Commands

### Core Development
- `npm run dev` - Start development server (http://localhost:3000 with API proxy)
- `npm run build` - **Production build** with automatic HTML generation, image optimization, and sitemap
- `npm run build:dev` - **Development build** without image optimization (faster)
- `npm run preview` - Preview production build locally (http://localhost:3001)

### Code Quality
- `npm run lint:scss` - Lint and fix SCSS files with stylelint
- `npm run lint:js` - Lint and fix JavaScript/JSX files with eslint

### Specialized Tasks
- `npm run generate:html` - Generate HTML pages from templates
- `npm run optimize:images` - Run Sharp-based image optimization (auto-runs before production build)
- `npm run generate:sitemap` - Generate XML sitemap (auto-runs before production build)
- `npm run test:quiz` - Test quiz calculator optimizations
- `npm run test:final` - Test final performance improvements

## Architecture & Structure

### Core Stack
- **React 19** with Vite bundler and hot reload
- **SCSS** with modular architecture, CSS custom properties, and dual design token system
- **Multi-page application (MPA)** with Global layout wrapper pattern
- **Custom Vite plugins** for image optimization, critical CSS, and HTML asset processing

### Key Technical Patterns

**Global Component Wrapper**: `src/components/Global/Global.jsx` wraps all pages and provides:
- SEO meta tags and JSON-LD structured data
- Sticky header with scroll detection
- Footer with company information
- Accessibility features and print styles

**Section-Based Page Architecture**: Large pages (like HomePage) are split into focused section components:
- `src/pages/HomePage/components/HeroSection/`
- `src/pages/HomePage/components/ServicesSection/`
- Each section has co-located `.scss` file and handles specific business logic

**Dual Design Token System**: **CRITICAL** - Project uses both CSS custom properties and Sass variables:
- `src/styles/variables.scss` - CSS custom properties (:root) for runtime values and responsiveness
- `src/styles/constants.scss` - Sass variables ($) for build-time calculations and complex operations
- **All hardcoded values forbidden** - Use design tokens from these files exclusively

**SCSS Import Hierarchy**: **CRITICAL** - Strict order in `src/styles/main.scss` must be maintained:
1. Variables (CSS custom properties) → Constants (Sass) → Functions → Media mixins → Mixins
2. Fonts → Normalize → Globals → Utils
3. Breaking this order causes build failures due to dependency chain
4. SCSS preprocessor configured with `quietDeps: true` and `silenceDeprecations: ['import']` to suppress warnings

**Business Data Centralization**: `src/helpers/index.js` exports:
- `COMPANY_INFO` constant with phone (+7 920 366-36-36), addresses, schedules
- Russian localization utilities (phone formatting, transliteration, date formatting)
- Form validation functions for Cyrillic names and Russian phone numbers
- DOM manipulation helpers (smooth scrolling, debounce, throttle)

### Advanced Image Optimization System
**Automated Sharp-based Pipeline** (`scripts/optimize-all-images.cjs`):
- **Profile-based optimization**: Different settings for quiz-icons, design elements, favicons, etc.
- **Dual format generation**: Creates both PNG (optimized) and WebP versions
- **Automatic mapping**: Generates `src/assets/image-mapping.json` for dynamic imports
- **Production integration**: Runs automatically before `npm run build`

**Picture Element Pattern** (used throughout codebase):
```jsx
<picture>
  <source srcSet={imageWebp} type="image/webp" />
  <img src={imageJpg} alt="..." loading="lazy" width="800" height="533" />
</picture>
```

**Asset Import Strategy**:
- Vite alias `@` resolves to `./src`
- Optimized images stored in `src/assets/images-optimized/`
- Icon assets dynamically imported with mapping system

### SEO & Performance Architecture
**JSON-LD Structured Data System**:
- Global `StructuredData.jsx` component provides base FuneralHome/LocalBusiness schema
- Page-specific schema added via `react-helmet-async` for Services, Products, FAQ
- Comprehensive coverage: WebPage, Organization, ContactPoint, OpeningHours

**Performance Optimization Features**:
- **Lazy loading**: 100% coverage with `loading="lazy"` on all images
- **Critical CSS**: Inlined styles in `main.scss` prevent FOUC
- **WebP conversion**: 99% size reduction from PNG (10.6MB → 78KB for icons)
- **Bundle optimization**: Gzip compression (435KB JS → 157KB, 148KB CSS → 25KB)

**Russian Localization & Accessibility**:
- Cyrillic font optimization with `font-display: swap`
- Screen reader support with proper ARIA labels in Russian
- Print stylesheets for funeral service documents
- High contrast and reduced motion media queries

## Development Context

### Business Requirements
- **Target**: Grieving families (ages 35-65+) in Shuya/Ivanovo region
- **Primary goal**: Phone conversion (+7 920 366-36-36 - stored in COMPANY_INFO)
- **Key features**: 24/7 phone prominence, cost calculator, service catalog
- **Competitors**: ритуал-шуя.рф, вечность-шуя.рф

### Adding Components
1. Create page component in `src/pages/[ComponentName]/`
2. Co-locate SCSS file with same name
3. Wrap with `Global` component and pass SEO props
4. Import required business data from helpers

### Styling Workflow
- **CSS Custom Properties**: All colors, spacing, fonts defined in `variables.scss`
- **Media Query Mixins**: Use mixins from `media.scss` for responsive design
- **BEM Methodology**: Strict `.component__element--modifier` naming
- **Sass Configuration**: SCSS quietDeps and silenceDeprecations suppress warnings during build

### Advanced Development Configuration

**Vite Configuration** (`vite.config.js`):
- **Custom plugins**: imageOptimizationPlugin, criticalCssPlugin, htmlAssetsPlugin
- **Multi-page setup**: main, uslugi, privacy pages with separate entry points
- **Build optimization**: Manual chunks (react, ui libraries), Terser compression
- **Development server**: Port 3000 with API proxy to localhost:8000
- **Preview server**: Port 3001 with historyApiFallback disabled for MPA
- **SCSS preprocessor**: quietDeps and silenceDeprecations configured
- **Production optimizations**: Console removal, Safari10 compatibility, chunkSizeWarning at 500KB

**Russian Localization Helpers** (`src/helpers/index.js`):
```js
// Phone formatting: "+7 (920) 366-36-36"
formatPhone(phone)
// Cyrillic transliteration for URLs
createSlug("Услуги похорон") // → "uslugi-pokhoron"
// Russian date formatting
formatDate(date) // → "15 сентября 2024 г."
```

### Important Notes from Project Rules (.cursorrules)

**Technology Stack Restrictions**:
- **NO TypeScript** - Project specifically avoids it, use vanilla JavaScript
- **NO CSS Frameworks** - No Bootstrap, Tailwind, etc. Use custom SCSS with BEM
- **NO External CDNs** - Bundle everything locally for performance
- **Font Requirements**: 'SangBleu Sunrise' for headings, 'Euclid Flex' for body text (custom commercial fonts)
- **NO hardcoded values** - All spacing, colors, fonts must come from design token files

**Performance Requirements**:
- Google PageSpeed score > 90
- First Contentful Paint < 2.5s
- Lazy load all images below the fold
- Use `font-display: swap` for font loading

Documentation in `docs/` contains original technical specifications and content strategy.

## CRITICAL Variable Usage Rules

### Modular Design System Enforcement
- **Строгое следование модульной концепции** - Agent must prioritize existing architecture and design system
- **NO hardcoding**: Forbidden to use "magic numbers" for spacing, colors, font sizes. All values for `gap`, `padding`, `margin`, `color` must come from `src/styles/variables.scss`
  - **Wrong**: `gap: 30px;`
  - **Correct**: `gap: var(--spacing-8);` (where `--spacing-8` is from variables.scss)
- **Use mixins**: If a mixin exists in `_mixins.scss` (e.g. for centering), agent MUST use it instead of writing CSS properties manually

## Development Rules & Protocols

#### **Правило №1: Протокол создания нового React-компонента**

Любой новый компонент, добавляемый в проект, должен соответствовать следующим требованиям:

1.  **Семантическая верстка — по умолчанию.**
      * Используй семантические теги HTML5 вместо `<div>` там, где это уместно. Карточка новости — `<article>`, навигационное меню — `<nav>`, блок с дополнительной информацией — `<aside>`.
2.  **Иерархия заголовков — без конфликтов.**
      * Компонент не должен содержать заголовок `<h1>`. Главный заголовок всегда один и принадлежит странице.
      * Если компонент содержит заголовок, он должен быть `<h2>`, `<h3>` и т.д., в зависимости от его места в общей структуре страницы.
3.  **Обязательные `alt` атрибуты для изображений.**
      * Каждый компонент, отображающий изображение (`<img>`), должен принимать `alt` текст через `props` и делать его обязательным. Атрибут `alt` должен быть осмысленным и описывать изображение.
        ```jsx
        // Пример: компонент Image.jsx
        const Image = ({ src, alt }) => {
          if (!alt) {
            console.error('ERROR: Alt attribute is required for Image component!');
          }
          return <img src={src} alt={alt} />;
        };
        ```
4.  **Доступные ссылки.**
      * Все внутренние ссылки должны использовать компонент `<Link>` из `react-router-dom`.
      * Текст ссылки должен четко описывать, куда она ведет (например, "Подробнее о кремации", а не просто "Подробнее").
- #### **Правило №2: Протокол создания новой страницы**

Каждая новая страница (например, страница услуги, товара или статья в блоге) должна быть создана по следующему чек-листу:

1.  **Человеко-понятный URL (ЧПУ).**
      * URL страницы должен быть в `kebab-case` (например, `/uslugi/blagoustroystvo-mogil`) и содержать основной ключевой запрос.
2.  **Уникальные мета-теги.**
      * Каждая страница **обязана** использовать `react-helmet-async` для установки уникальных `<title>` и `<meta name="description">`.
      * `<title>`: До 60 символов, содержит главный ключ и название компании. *Пример: "Благоустройство могил в Шуе | Ритуальная служба Век"*.
      * `<meta name="description">`: До 160 символов, раскрывает суть страницы, содержит призыв к действию и телефон. *Пример: "Услуги по благоустройству мест захоронения в Шуе от службы 'Век'. Укладка плитки, установка памятников и оград. Гарантия качества. Звоните: +7(920)366-36-36."*
3.  **Строгая структура контента.**
      * На странице должен быть **только один** заголовок `<h1>`.
      * Далее контент должен структурироваться подзаголовками `<h2>`, `<h3>` и т.д. без пропусков уровней.
4.  **Автоматическое обновление `sitemap.xml`**
      * Убедись, что сборщик проекта (Vite) настроен с плагином `vite-plugin-sitemap`, который автоматически добавит URL новой страницы в карту сайта во время сборки.
- #### **Правило №3: Мандат на структурированные данные (Schema.org)**

Структурированные данные — наш главный инструмент для получения расширенных сниппетов.

1.  **Глобальная разметка (`StructuredData.jsx`)**
      * Базовая разметка `FuneralService` и `LocalBusiness` остается на всех страницах сайта.
2.  **Специфическая разметка для новых страниц.**
      * Каждая новая страница с определенным типом контента **обязана** добавлять свою собственную, более узкую разметку через `react-helmet-async`.
      * **Страница услуги (например, "Кремация"):** Должна содержать разметку `Service`.
        ```json
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Кремация",
          "provider": {
            "@type": "FuneralService",
            "name": "Ритуальная служба Век"
          },
          "areaServed": {
            "@type": "City",
            "name": "Шуя"
          }
        }
        ```
      * **Страница товара (например, "Памятник из гранита"):** Должна содержать разметку `Product`.
        ```json
        {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Памятник из гранита",
          "image": "url-to-image.jpg",
          "description": "Долговечный памятник из карельского гранита...",
          "offers": {
            "@type": "Offer",
            "url": "url-to-product-page",
            "priceCurrency": "RUB",
            "price": "30000"
          }
        }
        ```
      * **Страница с вопросами и ответами (FAQ):** Любой блок FAQ **обязан** быть размечен с помощью `FAQPage`.
        ```json
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{
            "@type": "Question",
            "name": "Сколько времени занимает установка памятника?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Обычно установка занимает от 1 до 3 дней..."
            }
          }]
        }
        ```