# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modern React website for "Век" (Vek) funeral service in Shuya, Russia. Built with Vite, React 18, and SCSS with focus on performance, accessibility, and local SEO optimization.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint:scss` - Lint and fix SCSS files with stylelint
- `npm run lint:js` - Lint and fix JavaScript/JSX files with eslint

## Architecture & Structure

### Core Stack
- **React 18** with Vite bundler and hot reload
- **SCSS** with modular architecture and CSS custom properties
- **Single-page application** with Global layout wrapper pattern

### Key Technical Patterns

**Global Component Wrapper**: `src/components/Global/Global.jsx` wraps all pages and provides:
- SEO meta tags and JSON-LD structured data
- Sticky header with scroll detection
- Footer with company information
- Accessibility features and print styles

**SCSS Import Hierarchy**: Strict order in `src/styles/main.scss`:
1. Variables (CSS custom properties) → Constants (Sass) → Functions → Media mixins → Mixins
2. Fonts → Normalize → Globals → Utils

**Business Data Centralization**: `src/helpers/index.js` exports `COMPANY_INFO` constant with all business details (phone, addresses, schedules) and utility functions for validation, formatting, and DOM manipulation.

### Image Strategy
- WebP with JPG/PNG fallbacks using picture elements
- Vite asset imports for proper bundling and optimization
- High-quality icons stored in `src/assets/icons/`

### SEO & Performance
- JSON-LD structured data for FuneralHome/LocalBusiness
- Russian language meta tags and OpenGraph
- Critical CSS inlined to prevent FOUC
- Print stylesheets and accessibility media queries

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
- Use CSS custom properties from `variables.scss` for theming
- Leverage media query mixins from `media.scss` 
- Follow BEM methodology for component classes
- Utilize validation/formatting helpers for forms (Russian phone formats)

Documentation in `docs/` contains original technical specifications and content strategy.
- #### **Правило №1: Протокол создания нового React-компонента**

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