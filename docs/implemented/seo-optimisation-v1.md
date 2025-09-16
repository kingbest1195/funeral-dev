### **План по SEO-оптимизации сайта "Век"**

---

#### **1. On-Page SEO (Оптимизация контента и тегов)**

Это базовые, но критически важные улучшения, которые нужно внести в код.

- **1.1. Мета-теги в `index.html`**

  - **Проблема:** В файле `src/index.html` отсутствуют или не оптимизированы ключевые мета-теги.
  - [cite\_start]**Решение:** Заполнить теги в секции `<head>` следующим образом, ориентируясь на главные ключевые запросы из ТЗ[cite: 1]:
    ```html
    <head>
      ...
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/logo-vek.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>Ритуальная служба Век в Шуе - Круглосуточная помощь</title>
      <meta
        name="description"
        content="Круглосуточная ритуальная служба 'Век' в г. Шуя. Полный комплекс похоронных услуг. Бесплатная консультация и выезд агента 24/7. Телефон: +7 (920) 366-36-36."
      />
      <meta
        name="keywords"
        content="ритуальные услуги Шуя, похоронное бюро Шуя, организация похорон Шуя, ритуальный агент Шуя, кремация, груз 200"
      />
      ...
    </head>
    ```

- **1.2. Атрибуты `alt` для изображений**

  - **Проблема:** Не у всех изображений в `HomePage.jsx` прописаны осмысленные `alt` атрибуты.
  - **Решение:** Для каждого тега `<img>` добавить описание, включающее ключевые слова, где это уместно. Это важно для SEO и доступности.
    - **Пример для блока транспорта:**
      ```jsx
      <img src={hearseModern} alt="Катафалк ритуальной службы Век в Шуе" />
      <img src={busComfort} alt="Автобус для перевозки на похоронах" />
      ```

---

#### **2. Техническая SEO-оптимизация**

Эти шаги необходимы для правильной индексации сайта поисковыми системами.

- **2.1. Создание `robots.txt`**

  - [cite\_start]**Задача:** Создать файл для управления поисковыми роботами, как указано в ТЗ[cite: 1].
  - **Решение:** Создать в папке `public` (которая копируется в корень сборки `dist`) файл `robots.txt` со следующим содержимым:

    ```
    User-agent: *
    Disallow:

    Sitemap: https://ритуал-век.рф/sitemap.xml
    ```

    _Этот код разрешает индексацию всего сайта для всех роботов и указывает путь к карте сайта._

- **2.2. Создание `sitemap.xml`**

  - [cite\_start]**Задача:** Создать карту сайта для поисковиков, как указано в ТЗ[cite: 1].
  - **Решение:** Поскольку сайт пока одностраничный, можно создать в папке `public` файл `sitemap.xml` вручную:
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://ритуал-век.рф/</loc>
        <lastmod>2025-09-12</lastmod>
        <priority>1.0</priority>
      </url>
    </urlset>
    ```
    _Не забудьте менять дату `<lastmod>` после значительных обновлений._ Для будущих страниц рекомендуется использовать плагин `vite-plugin-sitemap` для автоматической генерации.

---

#### **3. Структурированные данные (Schema.org) для расширенного сниппета**

**Это главный пункт для получения рейтинга, графика работы и телефона в поиске.** Данные добавляются в виде JSON-LD скрипта.

- [cite\_start]**Задача:** Внедрить микроразметку `FuneralService` и `LocalBusiness`, как того требует ТЗ[cite: 1], чтобы поисковики показывали расширенную информацию.
- **Решение:**

  1.  Установить `react-helmet-async` для удобного управления тегами в `<head>`:
      `npm install react-helmet-async`
  2.  Создать новый компонент, например, `src/components/StructuredData/StructuredData.jsx`:

      ```jsx
      // src/components/StructuredData/StructuredData.jsx
      import React from "react";
      import { Helmet } from "react-helmet-async";

      const StructuredData = () => {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": ["FuneralService", "LocalBusiness"],
          name: "Ритуальная служба Век",
          image: "https://ритуал-век.рф/logo-vek.svg", // Ссылка на ваш логотип
          "@id": "https://ритуал-век.рф/",
          url: "https://ритуал-век.рф/",
          telephone: "+7-920-366-36-36",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Красноармейский переулок, 6",
            addressLocality: "Шуя",
            addressRegion: "Ивановская область",
            postalCode: "155900", // Уточнить индекс
            addressCountry: "RU",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "00:00",
              closes: "23:59",
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.7",
            reviewCount: "35",
          },
        };

        return (
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify(schemaData)}
            </script>
          </Helmet>
        );
      };

      export default StructuredData;
      ```

  3.  Подключить этот компонент в `App.jsx` и обернуть приложение в `HelmetProvider`.

      ```jsx
      // src/App.jsx
      import { HelmetProvider } from "react-helmet-async";
      import StructuredData from "./components/StructuredData/StructuredData";
      // ... другие импорты

      function App() {
        return (
          <HelmetProvider>
            <StructuredData />
            {/* Ваш остальной код приложения */}
            <HomePage />
          </HelmetProvider>
        );
      }
      ```

После внедрения этих правок ваш сайт будет значительно лучше оптимизирован для поисковых систем, а в результатах поиска появится желаемый расширенный сниппет с рейтингом, графиком и телефоном.
