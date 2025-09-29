# План разработки подстраниц раздела «Услуги»

## 1. Общие цели и охват

1.1. Подготовить шесть тематических страниц в разделе `uslugi` на основе контента из `docs/page-content/uslugi/*.md`.
1.2. Строго соблюдать архитектуру проекта (`React + Vite`, модульные страницы, BEM/SCSS) и гайд по дизайну (`docs/layout-reference.png`, глобальные правила из `docs/`).
1.3. Обеспечить SEO-first подход: уникальные мета-теги, структурированные данные Schema.org, корректные хлебные крошки, доступность и быструю загрузку.
1.4. Обеспечить единый пользовательский опыт: единая сетка, типографика, цвета, общий CTA и блок отзывов.
1.5. Обеспечить компонентный подход с чистым и обслуживаемым кодом. Без хардкодинга и дублирования кода. Использовать готовые переменные из `src/styles/variables.scss` и миксины из `src/styles/mixins.scss`
1.6. Наше React приложение работает по принципу MPA. Страницы находятся в своей папке и выдаются через свой index.html (смотри пример других страниц сайта)

## 2. Архитектурные принципы и инфраструктура

2.1. Для каждой страницы использовать обёртку `Global` с передачей SEO-данных и JSON-LD.
2.2. На каждой странице ровно один `<h1>` (из контента), дальнейшие заголовки — последовательные уровни (`h2`, `h3`).
2.3. Контент разбивать на семантические секции (`<section>`, `<article>`, `<aside>`), избегая «див-супы».
2.4. Использовать компоненты (`Paragraph`, `DataTable`, `CTASection` и др.), дорабатывая их при надобности и расширяя их через пропсы вместо дублирования логики.
2.5. Перенести/унифицировать компоненты из `pages/UslugiPage/components`, которые необходимы на новых страницах (например, `UslugiHeroSection`, `CTASection`), сделав их глобальными и настраиваемыми.
2.6. При добавлении новых компонентов следовать стандартам разработки и строго придерживаться дизайн-системе проекта `docs/` и придерживаться BEM-именования.
2.7. Статический контент каждой страницы должен содержаться в своем `content.js` файле

## 3. Новые и доработанные UI-компоненты

3.1. `Breadcrumbs`:

- Расположение: `src/components/Breadcrumbs/`.
- Семантический `nav` с `aria-label`, список `ol`/`li`, поддержка Schema `BreadcrumbList`.
- Пропсы: массив объектов `{ label, href }`, текущая страница без ссылки.

  3.2. `ServiceHero` (универсализация текущего `UslugiHeroSection`):

- Пропсы для заголовка, подзаголовка, CTA-кнопки, изображения (если понадобится).
- Возможность переиспользования на всех страницах услуг.

  3.3. `ServiceTimeline` (рабочее имя):

- Компонент для блоков «Шаг 1 — …».
- Структура: `<ol>` с адаптивной сеткой, поддержка иконок/номеров.
- Пропсы: заголовок, массив шагов (`title`, `description`).

  3.4. `FAQAccordion`:

- Доступный аккордеон (`button` + `aria-expanded`, `aria-controls`).
- Возможность передачи данных для FAQ JSON-LD.
- Пропсы: массив вопросов/ответов, заголовок блока.

  3.5. Адаптация `DataTable` и карточек:

- Проверить поддержку кастомных классов и полосатых режимов (`stripedMode`).
- При необходимости добавить вариант для таблиц с изображениями (через обёртку/слоты).
- Проверить, надо ли добавить горизонтальный скролл таблицы, если столбцов 3 и выше

## 4. SEO и структурированные данные

4.1. Создать для каждой страницы файл `content.js` с SEO-константами: `title`, `description`, `ogTitle`, `ogDescription`, `ogImage`, `canonical`, массив хлебных крошек.
4.2. Для каждой страницы сформировать JSON-LD типа `Service` с уникальным `serviceType`, `description`, `areaServed`, `offers`. Подключать через `<Helmet>` внутри страницы.
4.3. Блок FAQ снабжать JSON-LD `FAQPage` (формировать объект на основе переданных вопросов).
4.4. Использовать единый источник отзывов: вынести данные из `StructuredData.jsx`
4.5. Проверить, что `canonical` URL формируется через `getFullUrl`, а хлебные крошки ведут на `Главная → Все услуги → Текущая страница`.

## 5. Контентная архитектура страниц

### 5.1. Общий шаблон страницы услуги

- Структура: `Global` → `<main>` → `Breadcrumbs` → Hero → тематические секции → блок FAQ → CTA.
- Каждая секция — отдельный компонент/разметка с BEM-классами.
- Использовать `SectionTitle`/`Paragraph` для согласованной типографики.

### 5.2. Организация похорон (`organizatsiya-pohoron`)

- Hero с CTA.
- Секция «Что входит…» — `Paragraph` с маркированным списком.
- Таблица пакетов через `DataTable` (`stripedMode="column"`).
- Таймлайн из 4 шагов (`ServiceTimeline`).
- FAQ-аккордеон.
- CTA (адаптированный общий компонент).

### 5.3. Перевозка умершего (`transportirovka-umershego`)

- Hero.
- Список видов транспорта (`Paragraph`).
- Блок «Автопарк и стоимость» — таблица/карточки с изображениями автомобилей.
- Таймлайн (3 шага).
- FAQ.
- CTA.

### 5.4. Кремация (`krematsiya`)

- Hero.
- Список услуг (`Paragraph`).
- Таблица пакетов.
- Таймлайн (4 шага).
- FAQ.
- CTA.

### 5.5. Благоустройство могил (`blagoustroystvo-mogil`)

- Hero.
- Перечень услуг.
- Таблица примеров с изображениями (оптимизированный компонент/таблица).
- Таймлайн (этапы работ).
- FAQ.
- CTA.

### 5.6. Памятники и ограды (`pamyatniki-ogrady`)

- Hero.
- Блок «Что производим» (структурированные подпункты).
- Таблица преимуществ на 3 колонки.
- Таймлайн (этапы заказа).
- FAQ.
- CTA.

### 5.7. Захоронение участников СВО (`zahoronenie-uchastnikov-svo`)

- Hero.
- Перечень услуг/воинских почестей (можно использовать `Paragraph` + вложенные списки).
- Блок «Госгарантии» — структурированный список/карточки.
- Таймлайн (порядок действий).
- Блок преимуществ.
- CTA.

## 6. Данные и константы

6.1. Телефоны, CTA-тексты, названия услуг брать из существующих констант (`SITE_CONFIG`, `CTA_DATA` и др.), избегать хардкода.
6.2. При необходимости расширить `src/constants/content.js` или добавить новые файлы `src/constants/services/*.js`.
6.3. Убедиться, что ссылки `/uslugi/...` соответствуют контенту и попадут в генерацию HTML (Vite MPA: добавить новые точки входа/маршруты, если требуется).

## 7. Тестирование и валидация

7.1. Запустить `npm run lint:js` и `npm run lint:scss` после реализации.
7.2. Проверить Lighthouse/PageSpeed для нескольких страниц (особенно Largest Contentful Paint, CLS).
7.3. Проверить JSON-LD через Google Rich Results Test (Service + FAQ + Breadcrumb).
7.4. Протестировать адаптивность на ширинах <480px, 768px, 1024px.
7.5. Проверить клавиатурную навигацию и фокус на интерактивных элементах (`Breadcrumbs`, `FAQAccordion`).

## 8. Последовательность работ

8.1. Реализовать/унифицировать базовые компоненты (`Breadcrumbs`, `ServiceHero`, `ServiceTimeline`, `FAQAccordion`).
8.2. Подготовить каркас страниц (структура папок, контентные секции, SEO).
8.3. Верстать страницы последовательно, начиная с «Организация похорон» как эталонной.
8.4. Интегрировать отзывы и CTA на все страницы.
8.5. Выполнить финальное тестирование (SEO, доступность, адаптивность), затем передать на ревью/интеграцию.

## 9. ✅ ЧЕКЛИСТ ПОДГОТОВКИ К ДЕПЛОЮ

### 9.1. 📁 Структура файлов и компонентов

#### Для каждой новой страницы услуги:

- [ ] **Создана папка страницы**: `src/pages/[ServiceName]Page/`
  - [ ] `[ServiceName]Page.jsx` - основной компонент страницы
  - [ ] `[ServiceName]Page.scss` - стили страницы
  - [ ] `content.js` - контент и SEO данные

- [ ] **Компоненты используют правильные импорты**:
  ```jsx
  import Global from "@/components/Global/Global.jsx";
  import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs.jsx";
  import ServiceHero from "@/components/ServiceHero/ServiceHero.jsx";
  import ServiceTimeline from "@/components/ServiceTimeline/ServiceTimeline.jsx";
  import FAQAccordion from "@/components/FAQAccordion/FAQAccordion.jsx";
  import DataTable from "@/components/DataTable/DataTable.jsx";
  import CTASection from "@/pages/HomePage/components/CTASection/CTASection.jsx";
  ```

### 9.2. 🔧 Конфигурация системы сборки

#### Добавить JSON-LD схему:

- [ ] **Обновить** `src/constants/json-ld-schemas.js`:
  ```javascript
  export const [SERVICE_NAME]_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "[Название услуги]",
    description: "[Описание]",
    url: getFullUrl("/uslugi/[service-url]"),
    mainEntity: {
      "@type": "Service",
      serviceType: "[Тип услуги]",
      // ... остальные поля
    }
  };
  ```

#### Обновить генератор HTML:

- [ ] **Добавить конфигурацию в** `scripts/generate-html-pages.js`:
  ```javascript
  '[service-slug]': {
    title: `[SEO Title] – Ритуальная служба "Век"`,
    description: `[SEO Description]`,
    keywords: "[ключевые слова через запятую]",
    ogTitle: `[OG Title]`,
    ogDescription: `[OG Description]`,
    ogImage: `https://ритуал-век.рф${OG_IMAGES.funeralHall}`,
    canonicalUrl: "https://ритуал-век.рф/uslugi/[service-slug]/",
    dataPage: "[service-slug]",
    preloadHeroImage: false,
    jsonLd: JSON_LD_SCHEMAS['[service-slug]'],
  },
  ```

- [ ] **Обновить логику создания папок** (если нужны вложенные пути):
  ```javascript
  // Добавить в блок if-else логики
  if (pageName === '[service-slug]') {
    dirPath = path.join(ROOT_DIR, 'uslugi', '[service-slug]');
    filePath = path.join(dirPath, "index.html");
  }
  ```

#### Обновить Vite конфигурацию:

- [ ] **Добавить entry point в** `vite.config.js`:
  ```javascript
  input: {
    main: path.resolve(__dirname, 'index.html'),
    uslugi: path.resolve(__dirname, 'uslugi/index.html'),
    'organizatsiya-pohoron': path.resolve(__dirname, 'uslugi/organizatsiya-pohoron/index.html'),
    '[service-slug]': path.resolve(__dirname, 'uslugi/[service-slug]/index.html'), // ← ДОБАВИТЬ
    privacy: path.resolve(__dirname, 'privacy/index.html')
  },
  ```

### 9.3. 📄 Контент и SEO

#### content.js файл каждой страницы должен содержать:

- [ ] **SEO данные**:
  - [ ] `title` (до 60 символов)
  - [ ] `description` (до 160 символов)
  - [ ] `keywords`
  - [ ] `ogTitle`, `ogDescription`, `ogImage`, `ogUrl`
  - [ ] `canonicalUrl`

- [ ] **JSON-LD данные**:
  - [ ] Корректный `@type: "Service"`
  - [ ] Уникальный `serviceType`
  - [ ] Заполненные `offers` с ценами
  - [ ] Правильные `breadcrumb` данные

- [ ] **Контент секций**:
  - [ ] HERO_CONTENT (title, description, cta)
  - [ ] SERVICES_CONTENT (если есть подуслуги)
  - [ ] TIMELINE_DATA (шаги процесса)
  - [ ] FAQ_DATA (вопросы-ответы)
  - [ ] PACKAGES_DATA (таблицы цен)

#### Хлебные крошки:

- [ ] **Корректный массив BREADCRUMBS_DATA**:
  ```javascript
  [
    { label: "Главная", href: "/" },
    { label: "Все услуги", href: "/uslugi" },
    { label: "[Название услуги]" } // Текущая страница без href
  ]
  ```

### 9.4. 🎨 Компонентная архитектура

#### Структура страницы:

- [ ] **Оборачивается в Global** с корректными SEO данными
- [ ] **Единственный h1** - заголовок из Hero секции
- [ ] **Семантическая разметка**: `<main>`, `<section>`, `<article>`
- [ ] **Корректные aria-labelledby** для секций

#### Использование компонентов:

- [ ] **Breadcrumbs** с корректными данными
- [ ] **ServiceHero** с заголовком, описанием и CTA
- [ ] **ServiceTimeline** для этапов процесса
- [ ] **DataTable** для таблиц цен (с `stripedMode` если нужно)
- [ ] **FAQAccordion** с обработчиком `onJsonLdUpdate`
- [ ] **CTASection** в конце страницы

### 9.5. 🔍 Тестирование перед деплоем

#### Код-качество:

- [ ] `npm run lint:js` - **БЕЗ ОШИБОК**
- [ ] `npm run lint:scss` - **БЕЗ ОШИБОК**
- [ ] **Все переменные из** `src/styles/variables.scss`
- [ ] **Никаких magic numbers** в CSS

#### Функциональность:

- [ ] `npm run generate:html` - **УСПЕШНО**
- [ ] `npm run build` - **УСПЕШНО**
- [ ] **HTML файл создается** в `uslugi/[service-slug]/index.html`
- [ ] **JSON-LD присутствует** в статическом HTML
- [ ] **Микроразметка валидна** (Google Rich Results Test)

#### SEO проверки:

- [ ] **Уникальный title** (не дублируется с другими)
- [ ] **Уникальный description** (не дублируется с другими)
- [ ] **Canonical URL корректный**
- [ ] **OG-теги заполнены**
- [ ] **JSON-LD Service валидный**
- [ ] **JSON-LD FAQPage** (если есть FAQ)
- [ ] **JSON-LD BreadcrumbList валидный**

#### Адаптивность и доступность:

- [ ] **Корректно на 320px, 768px, 1024px, 1440px**
- [ ] **Клавиатурная навигация работает**
- [ ] **Фокус видимый на интерактивных элементах**
- [ ] **Alt-тексты на всех изображениях**
- [ ] **Контрастность текста соответствует WCAG**

### 9.6. 📊 Performance

- [ ] **Lazy loading** на изображениях ниже fold
- [ ] **WebP + PNG fallback** для изображений
- [ ] **Размеры изображений оптимизированы**
- [ ] **Шрифты с font-display: swap**
- [ ] **CSS без unused селекторов**

### 9.7. 🚀 Финальная проверка перед деплоем

#### Команды для выполнения:

1. [ ] `npm run generate:html`
2. [ ] `npm run build`
3. [ ] Проверить файл в `dist/uslugi/[service-slug]/index.html`
4. [ ] Найти блок `<script type="application/ld+json">` в HTML
5. [ ] Валидировать JSON-LD через [Google Rich Results Test](https://search.google.com/test/rich-results)

#### Чек-лист файлов для коммита:

- [ ] `src/pages/[ServiceName]Page/[ServiceName]Page.jsx`
- [ ] `src/pages/[ServiceName]Page/[ServiceName]Page.scss`
- [ ] `src/pages/[ServiceName]Page/content.js`
- [ ] `src/constants/json-ld-schemas.js` (обновленный)
- [ ] `scripts/generate-html-pages.js` (обновленный)
- [ ] `vite.config.js` (обновленный)
- [ ] `uslugi/[service-slug]/index.html` (сгенерированный)

### 9.8. ⚠️ Критические проверки

#### ОБЯЗАТЕЛЬНО ПЕРЕД ДЕПЛОЕМ:

- [ ] **Страница доступна** по URL `/uslugi/[service-slug]/`
- [ ] **JSON-LD статически включен** в HTML (не только через JS)
- [ ] **Хлебные крошки ведут** на существующие страницы
- [ ] **CTA кнопки работают** (телефон, формы)
- [ ] **Нет 404 ошибок** на внутренних ссылках
- [ ] **Sitemap.xml обновлен** (автоматически при сборке)

#### Команда финальной проверки:

```bash
# Полная проверка готовности к деплою
npm run generate:html && npm run build && npm run lint:js && npm run lint:scss
```

✅ **Если все пункты выполнены** - страница готова к деплою!
