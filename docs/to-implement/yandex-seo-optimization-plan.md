# План оптимизации сайта под Яндекс

**Дата составления:** 30 сентября 2025
**Цель:** Максимальное позиционирование в поисковой системе Яндекс и получение расширенных сниппетов

---

## ⚡ БЫСТРЫЙ СТАРТ: Что нужно от тебя

### 📝 Заполни и отправь мне этот файл:

**Создай файл `yandex-seo-config.yaml` и заполни:**

```yaml
# ============================================
# КОНФИГУРАЦИЯ ДЛЯ ЯНДЕКС SEO ОПТИМИЗАЦИИ
# ============================================

# --- ПРИОРИТЕТ 1 (КРИТИЧНО) ---

yandex_metrika:
  id: "УКАЖИ_ID"  # Получить на https://metrika.yandex.ru
  # Инструкция: Создай счетчик для сайта "ритуал-век.рф" и скопируй числовой ID

og_images:
  strategy: "ВЫБЕРИ: create_new ИЛИ use_existing"
  # create_new - нужны новые изображения 1200x630px
  # use_existing - использую имеющиеся фото из проекта

  # Если выбрал create_new - укажи пути или скажи "GENERATE_AI":
  home: "ПУТЬ_ИЛИ_URL или GENERATE_AI"
  services: "ПУТЬ_ИЛИ_URL или GENERATE_AI"
  funeral_hall: "ПУТЬ_ИЛИ_URL или GENERATE_AI"

# --- ПРИОРИТЕТ 2 (ВАЖНО) ---

yandex_webmaster:
  verification_code: "УКАЖИ_КОД"  # Получить после добавления сайта
  # Инструкция: https://webmaster.yandex.ru → Добавить сайт → Мета-тег
  site_added: false  # Поменяй на true после добавления

yandex_sprav:
  created: false  # Поменяй на true если создал карточку
  url: ""  # Ссылка на карточку после создания (опционально)

office_photos:
  # Укажи пути к 5 фотографиям (высокого качества):
  facade: "ПУТЬ_К_ФОТО"  # Фасад офиса
  hall_big: "ПУТЬ_К_ФОТО"  # Большой зал
  hall_small: "ПУТЬ_К_ФОТО"  # Малый зал
  shop: "ПУТЬ_К_ФОТО"  # Витрина товаров
  interior: "ПУТЬ_К_ФОТО"  # Интерьер офиса
  # Если используем существующие из проекта - скажи "USE_EXISTING"

social_media:
  # Если есть соцсети - укажи ссылки, если нет - оставь "НЕТ":
  vk: "НЕТ"  # https://vk.com/ritual_vek_shuya
  ok: "НЕТ"  # https://ok.ru/ritual.vek
  telegram: "НЕТ"  # https://t.me/ritual_vek
  instagram: "НЕТ"  # (если есть)

# --- ДОПОЛНИТЕЛЬНО ---

content_plan:
  create_articles: false  # Нужны ли SEO-статьи?
  create_faq: false  # Нужна ли отдельная страница FAQ?
  turbo_pages: false  # Нужны ли турбо-страницы Яндекса?

# ============================================
# КОНЕЦ КОНФИГУРАЦИИ
# ============================================

# Отправь этот файл мне с заполненными данными
```

### 🎯 Минимум для старта (Приоритет 1):

Чтобы я начал работу, **обязательно нужны только 2 вещи:**

1. ✅ **Яндекс.Метрика ID** (5 минут на получение)
2. ✅ **Решение по OG-изображениям** (create_new или use_existing)

Остальное можно добавить позже!

---

## 📊 Результаты аудита

### ✅ Что реализовано хорошо

**1. Структурированные данные (Schema.org)**
- ✅ JSON-LD на всех страницах (WebPage, Service, LocalBusiness, BreadcrumbList)
- ✅ Корректная микроразметка с полными данными (телефон, адрес, режим работы)
- ✅ Отзывы и рейтинги в структурированных данных (4.89/5, 38 отзывов)

**2. Технические параметры**
- ✅ Правильная кодировка UTF-8 и lang="ru"
- ✅ Адаптивность (viewport)
- ✅ Оптимизация изображений (WebP + PNG fallback, lazy loading)
- ✅ Sitemap.xml с корректными приоритетами
- ✅ robots.txt разрешает индексацию

**3. Контент**
- ✅ Уникальные title и description на каждой странице
- ✅ Семантическая HTML-разметка
- ✅ Региональная привязка (Шуя, Ивановская область)
- ✅ Canonical URLs для избежания дублей

---

## ⚠️ Критические точки для улучшения

### 1. 🚨 Отсутствует Яндекс.Метрика

**Проблема:**
Нет счетчика Яндекс.Метрики - ключевого инструмента для отслеживания поведенческих факторов, которые Яндекс использует для ранжирования.

**Влияние:**
Яндекс не получает поведенческие сигналы → снижение позиций в выдаче.

**Что даст метрика:**
- Отслеживание поведенческих факторов (время на сайте, глубина просмотра)
- Вебвизор для анализа UX
- Цели и конверсии
- Карта кликов
- Отчет "Источники трафика"

---

### 2. 🚨 Конфликт canonical URLs

**Проблема:**
В `sitemap.xml` используется Punycode-версия домена:
```xml
<loc>https://xn----7sbhmlqd1btk.xn--p1ai/</loc>
```

Но в HTML-файлах указана кириллическая версия:
```html
<link rel="canonical" href="https://ритуал-век.рф/" />
```

**Влияние:**
- Каноническая путаница для поисковиков
- Возможное дублирование страниц в индексе
- Размытие ссылочного веса между версиями

**Решение:**
Выбрать ОДНУ версию домена и использовать её везде (рекомендуется кириллическая для UX).

---

### 3. ⚠️ JSON-LD генерирует несовместимые URL

**Проблема в коде:**
```javascript
// src/components/StructuredData/StructuredData.jsx
const baseUrl = typeof window !== "undefined"
  ? window.location.origin
  : "https://ритуал-век.рф";
```

На страницах услуг в JSON-LD попадает:
```json
"url": "https://xn----7sbhmlqd1btk.xn--p1ai/uslugi/organizatsiya-pohoron"
```

**Конфликт:**
canonical в HTML (`ритуал-век.рф`) ≠ url в JSON-LD (Punycode)

**Влияние:**
Путаница для поисковиков, неоднозначная идентификация страниц.

---

### 4. ⚠️ Нет связи с Яндекс.Справочником

**Проблема:**
Отсутствует подтверждение организации через:
- Яндекс.Организации/Справочник
- Код подтверждения в мета-тегах

**Влияние:**
Нет расширенного сниппета с:
- Часами работы
- Адресом на карте
- Фотографиями офиса
- Прямым телефоном
- Кнопкой "Позвонить"

---

### 5. ⚠️ Некорректные пути к OG:image

**Проблема:**
```html
<meta property="og:image" content="https://ритуал-век.рф/images/og/hero-main.png" />
```

Путь `/images/og/hero-main.png` не существует в dist (нет папки `images/og/`).

**Влияние:**
- Сломанные превью при репостах в соцсетях
- Нет изображения в Яндекс.Дзен
- Плохая кликабельность ссылок в мессенджерах

---

### 6. ⚠️ Нет видимых Breadcrumbs

**Текущее состояние:**
Есть JSON-LD разметка BreadcrumbList, но нет визуальных "хлебных крошек" в HTML.

**Влияние:**
Яндекс может не показывать навигационную цепочку в сниппете (навигация улучшает CTR на 5-10%).

---

### 7. ⚠️ JSON-LD генерируется на клиенте (CSR)

**Проблема:**
```html
<div id="root" data-page="home"></div>
```

Структурированные данные вставляются через React после загрузки JS.

**Влияние:**
- Задержка индексации микроразметки
- Яндекс может не увидеть JSON-LD при первом обходе
- Медленная валидация в Вебмастере

---

### 8. 💡 Отсутствует RSS-лента

**Возможность:**
Яндекс индексирует RSS для быстрого попадания новых страниц в индекс.

**Что можно сделать:**
Создать ленту новостей/статей о ритуальных услугах для органического трафика по информационным запросам.

---

### 9. 💡 Нет расширенной разметки для местного бизнеса

**Текущая разметка неполная:**
```json
"address": {
  "@type": "PostalAddress",
  "streetAddress": "Красноармейский переулок, 6"
}
```

**Не хватает для максимальной видимости:**
- `geo` (координаты для карты)
- `sameAs` (ссылки на соцсети)
- `paymentAccepted` (способы оплаты)
- `priceRange` (диапазон цен)

---

### 10. 💡 Нет турбо-страниц Яндекса

**Возможность:**
Турбо-страницы дают моментальную загрузку в мобильной выдаче Яндекса → +5-15% к CTR.

**Оценка:**
Не критично для ритуальной службы, но может дать конкурентное преимущество.

---

## 📋 План внедрения улучшений

---

## 🎯 ЧТО МНЕ НУЖНО ОТ ТЕБЯ ДЛЯ ВЫПОЛНЕНИЯ

### 📦 Данные для Приоритета 1:

```yaml
# Яндекс.Метрика
yandex_metrika_id: "УКАЖИ_ID_СЧЕТЧИКА"  # Получить на https://metrika.yandex.ru

# OG Images
og_images_strategy: "ВЫБЕРИ_ВАРИАНТ"
# Вариант 1: "create_new" - я создам папку public/images/og/ и нужны изображения 1200x630px
# Вариант 2: "use_existing" - использую существующие из dist/assets/

# Если выбран Вариант 1 - предоставь:
og_image_home: "ПУТЬ_К_ФАЙЛУ_ИЛИ_URL"  # Для главной страницы
og_image_services: "ПУТЬ_К_ФАЙЛУ_ИЛИ_URL"  # Для страницы услуг
og_image_funeral_hall: "ПУТЬ_К_ФАЙЛУ_ИЛИ_URL"  # Для залов
```

### 📦 Данные для Приоритета 2:

```yaml
# Яндекс.Вебмастер
yandex_verification_code: "УКАЖИ_КОД_ПОДТВЕРЖДЕНИЯ"  # Получить после добавления сайта в Вебмастере

# Яндекс.Справочник
yandex_sprav_created: "YES/NO"  # Создана ли карточка организации?
# Если NO - нужно создать на https://yandex.ru/sprav

# Фото для Справочника (минимум 5 штук)
office_photos:
  - "ПУТЬ_К_ФОТО_1"  # Фасад офиса
  - "ПУТЬ_К_ФОТО_2"  # Большой зал
  - "ПУТЬ_К_ФОТО_3"  # Малый зал
  - "ПУТЬ_К_ФОТО_4"  # Товары в магазине
  - "ПУТЬ_К_ФОТО_5"  # Интерьер офиса

# Социальные сети (если есть)
social_media:
  vk: "ССЫЛКА_НА_VK"  # https://vk.com/ritual_vek_shuya
  ok: "ССЫЛКА_НА_OK"  # https://ok.ru/ritual.vek
  telegram: "ССЫЛКА_НА_TELEGRAM"  # https://t.me/ritual_vek
  # Если нет - укажи "НЕТ" или оставь пустым
```

---

### 🔥 Приоритет 1: Критичные (1-3 дня)

#### 1.1. Интеграция Яндекс.Метрики

> **⚠️ ТРЕБУЕТСЯ ОТ ТЕБЯ:**
> ```
> yandex_metrika_id: "________"
> ```
> Получить ID счетчика на https://metrika.yandex.ru
> 1. Зарегистрируйся/войди в Яндекс
> 2. Создай счетчик для сайта "ритуал-век.рф"
> 3. Скопируй ID (числовой код)

**Действия после получения ID:**

1. **Добавить код в шаблоны HTML:**

**Файлы для изменения:**
- `scripts/generate-html-pages.js` (добавить в шаблон)
- `src/components/Global/Global.jsx` (добавить через Helmet)

**Код счетчика:**
```html
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {
         if (document.scripts[j].src === r) { return; }
      }
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
   })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym({{YANDEX_METRIKA_ID}}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true,
        trackHash:true,
        ecommerce:"dataLayer"
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/{{YANDEX_METRIKA_ID}}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
```

3. **Настроить цели:**
   - Клик на телефон: `+7 (920) 366-36-36`
   - Отправка формы калькулятора
   - Просмотр страниц услуг
   - Клик на "Позвонить" в шапке
   - Скролл до футера

4. **Включить Вебвизор** для анализа поведения

---

#### 1.2. Исправить конфликт canonical URLs

**Решение:** Выбрать кириллическую версию `https://ритуал-век.рф/` для всех элементов

**Файлы для изменения:**

1. **scripts/generate-sitemap.cjs:**
```javascript
// Заменить
const DOMAIN = 'https://xn----7sbhmlqd1btk.xn--p1ai';
// На
const DOMAIN = 'https://ритуал-век.рф';
```

2. **src/components/StructuredData/StructuredData.jsx:**
```javascript
// Заменить
const baseUrl = typeof window !== "undefined"
  ? window.location.origin
  : "https://ритуал-век.рф";
// На
const baseUrl = "https://ритуал-век.рф"; // Hardcoded
```

3. **src/constants/seo.js:**
```javascript
// Проверить все упоминания домена и заменить на кириллицу
export const SITE_URL = 'https://ритуал-век.рф';
```

4. **Пересобрать sitemap:**
```bash
npm run generate:sitemap
npm run build
```

**Проверка:**
- Все canonical → `https://ритуал-век.рф/*`
- Все JSON-LD url → `https://ритуал-век.рф/*`
- sitemap.xml → `https://ритуал-век.рф/*`

---

#### 1.3. Исправить OG:image пути

> **⚠️ ТРЕБУЕТСЯ ОТ ТЕБЯ:**
> ```yaml
> og_images_strategy: "ВЫБЕРИ: create_new ИЛИ use_existing"
>
> # Если выбрал create_new - предоставь:
> og_image_home: "ПУТЬ_К_ФАЙЛУ"      # 1200x630px для главной
> og_image_services: "ПУТЬ_К_ФАЙЛУ"  # 1200x630px для услуг
> og_image_funeral_hall: "ПУТЬ_К_ФАЙЛУ"  # 1200x630px для залов
> ```

**Проблема:** `/images/og/hero-main.png` не существует

**Решение 1: Создать новые OG-изображения (РЕКОМЕНДУЕТСЯ)**

> **Что нужно от тебя:**
> - Предоставь 3 изображения размером **1200x630px**
> - С логотипом компании и текстом
> - Или скажи - я сгенерирую их с помощью AI

После получения изображений:
1. Создам `public/images/og/`
2. Размещу изображения:
   - `hero-main.png` - главная страница
   - `services.png` - услуги
   - `funeral-hall.png` - залы для прощания

**Решение 2: Использовать существующие изображения**

> **Если выберешь этот вариант:**
> Просто скажи "use_existing" - я настрою пути на существующие файлы

```javascript
// src/constants/seo.js
export const OG_IMAGES = {
  HOME: '/assets/office-facade-main-BPzJqPMt.png',
  SERVICES: '/assets/funeral-hall-big-Bn7S320D.png',
  FUNERAL_HALL: '/assets/funeral-hall-small-Bous5W0h.png'
};
```

---

### 🟡 Приоритет 2: Важные (3-7 дней)

#### 2.1. Подключить к Яндекс.Вебмастеру + Справочнику

> **⚠️ ТРЕБУЕТСЯ ОТ ТЕБЯ:**
> ```yaml
> yandex_verification_code: "________"  # Получить после добавления сайта
> yandex_sprav_created: "YES/NO"       # Создана ли карточка?
>
> # Если карточка не создана - нужны фото:
> office_photos:
>   - "ПУТЬ_К_ФОТО_1"  # Фасад офиса (существующий)
>   - "ПУТЬ_К_ФОТО_2"  # Большой зал (существующий)
>   - "ПУТЬ_К_ФОТО_3"  # Малый зал (существующий)
>   - "ПУТЬ_К_ФОТО_4"  # Товары/витрина
>   - "ПУТЬ_К_ФОТО_5"  # Интерьер офиса
>
> # Социальные сети (если есть):
> social_media:
>   vk: "ССЫЛКА или НЕТ"
>   ok: "ССЫЛКА или НЕТ"
>   telegram: "ССЫЛКА или НЕТ"
> ```

**Шаг 1: Регистрация в Яндекс.Вебмастер**

> **Твои действия (займет 5 минут):**
> 1. Перейди на https://webmaster.yandex.ru
> 2. Войди через Яндекс-аккаунт
> 3. Нажми "Добавить сайт"
> 4. Введи: `https://ритуал-век.рф`
> 5. Выбери способ подтверждения: **"Мета-тег"**
> 6. Скопируй код вида: `<meta name="yandex-verification" content="abc123..." />`
> 7. **Пришли мне этот код** - я добавлю его в проект

После получения кода:
```javascript
// scripts/generate-html-pages.js
const htmlTemplate = `
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="yandex-verification" content="{{YANDEX_VERIFICATION_CODE}}" />
    ...
```

**Шаг 2: Создать карточку в Яндекс.Справочнике**

> **Твои действия (займет 15 минут):**
> 1. Перейди на https://yandex.ru/sprav
> 2. Войди через тот же Яндекс-аккаунт
> 3. Нажми "Добавить организацию"
> 4. Заполни данные:
>    - **Название:** "Ритуальная служба Век"
>    - **Адрес:** Красноармейский переулок, 6, Шуя, Ивановская область
>    - **Телефон:** +7 (920) 366-36-36
>    - **Режим работы:** Круглосуточно (24/7)
>    - **Категория:** Ритуальные услуги
>    - **Сайт:** https://ритуал-век.рф
> 5. **Загрузи минимум 5 фото:**
>    - Фото фасада офиса (уже есть в проекте)
>    - Фото большого зала (есть)
>    - Фото малого зала (есть)
>    - Фото товаров/витрины
>    - Фото интерьера офиса
> 6. После создания - скажи "DONE"

**Шаг 3: Добавить geo-координаты в Schema.org**

```javascript
// src/components/StructuredData/StructuredData.jsx
const schemaData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  // ... существующие данные
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 56.840843,
    "longitude": 41.364861
  }
};
```

---

#### 2.2. Внедрить видимые Breadcrumbs

**Шаг 1: Создать компонент**

**Файл:** `src/components/Breadcrumbs/Breadcrumbs.jsx`

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.scss';

const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Навигационная цепочка">
      <ol
        className="breadcrumbs__list"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => (
          <li
            key={index}
            className="breadcrumbs__item"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index < items.length - 1 ? (
              <Link
                to={item.url}
                itemProp="item"
                className="breadcrumbs__link"
              >
                <span itemProp="name">{item.name}</span>
              </Link>
            ) : (
              <span itemProp="name" className="breadcrumbs__current">
                {item.name}
              </span>
            )}
            <meta itemProp="position" content={index + 1} />
            {index < items.length - 1 && (
              <span className="breadcrumbs__separator" aria-hidden="true">›</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
```

**Шаг 2: Создать стили**

**Файл:** `src/components/Breadcrumbs/Breadcrumbs.scss`

```scss
.breadcrumbs {
  padding: var(--spacing-4) 0;

  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-2);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  &__link {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
      text-decoration: underline;
    }
  }

  &__current {
    color: var(--color-text-primary);
    font-weight: 500;
  }

  &__separator {
    color: var(--color-text-tertiary);
    user-select: none;
  }
}
```

**Шаг 3: Добавить на страницы**

```jsx
// src/pages/OrganizatsiyaPohoronPage/OrganizatsiyaPohoronPage.jsx
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

const breadcrumbs = [
  { name: 'Главная', url: '/' },
  { name: 'Услуги', url: '/uslugi' },
  { name: 'Организация похорон', url: '/uslugi/organizatsiya-pohoron' }
];

return (
  <Global seo={seoData} pageClass="organizatsiya-pohoron-page">
    <main>
      <Breadcrumbs items={breadcrumbs} />
      {/* остальной контент */}
    </main>
  </Global>
);
```

---

#### 2.3. SSR для JSON-LD (предрендеринг)

**Проблема:** JSON-LD генерируется React на клиенте

**Решение:** Предрендерить структурированные данные в статические HTML

**Файл:** `scripts/generate-html-pages.js`

**Добавить функцию генерации JSON-LD:**

```javascript
// Функция для генерации JSON-LD для конкретной страницы
function generatePageJsonLd(pageType, pageData = {}) {
  const baseUrl = 'https://ритуал-век.рф';

  // Базовая разметка LocalBusiness (для всех страниц)
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Ритуальная служба Век",
    "telephone": "+79203663636",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Красноармейский переулок, 6",
      "addressLocality": "Шуя",
      "addressRegion": "Ивановская область",
      "postalCode": "155900",
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 56.840843,
      "longitude": 41.364861
    },
    "openingHours": "Mo-Su 00:00-24:00",
    "url": baseUrl
  };

  // Специфичная разметка для страниц услуг
  if (pageType === 'service') {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": pageData.title,
      "description": pageData.description,
      "url": `${baseUrl}${pageData.url}`,
      "mainEntity": {
        "@type": "Service",
        "serviceType": pageData.serviceType,
        "name": pageData.title,
        "description": pageData.description,
        "provider": baseSchema,
        "areaServed": {
          "@type": "City",
          "name": "Шуя"
        }
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": pageData.breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `${baseUrl}${item.url}`
        }))
      }
    };
  }

  return baseSchema;
}

// В функции генерации HTML добавить JSON-LD
function generateHTMLPage(page) {
  const jsonLd = generatePageJsonLd(page.type, page.data);

  const htmlTemplate = `<!doctype html>
<html lang="ru">
  <head>
    <!-- ... мета-теги ... -->

    <!-- JSON-LD структурированные данные -->
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>

    <!-- ... остальное ... -->
  </head>
  <body>
    <div id="root" data-page="${page.id}"></div>
  </body>
</html>`;

  return htmlTemplate;
}
```

**Настроить данные для страниц:**

```javascript
const pages = [
  {
    id: 'organizatsiya-pohoron',
    type: 'service',
    path: 'uslugi/organizatsiya-pohoron/index.html',
    data: {
      title: 'Организация похорон в Шуе под ключ',
      description: 'Профессиональная организация похорон...',
      url: '/uslugi/organizatsiya-pohoron/',
      serviceType: 'Организация похорон',
      breadcrumbs: [
        { name: 'Главная', url: '/' },
        { name: 'Услуги', url: '/uslugi/' },
        { name: 'Организация похорон', url: '/uslugi/organizatsiya-pohoron/' }
      ]
    }
  },
  // ... остальные страницы
];
```

---

### 🟢 Приоритет 3: Желательные (7-14 дней)

#### 3.1. Создать RSS-ленту

**Файл:** `public/rss.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:yandex="http://news.yandex.ru"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Ритуальная служба Век - Статьи и новости</title>
    <link>https://ритуал-век.рф/</link>
    <description>Полезные статьи о ритуальных услугах, организации похорон и выборе памятников в Шуе</description>
    <language>ru</language>
    <lastBuildDate>Mon, 30 Sep 2024 00:00:00 +0300</lastBuildDate>

    <item>
      <title>Как правильно выбрать памятник на могилу</title>
      <link>https://ритуал-век.рф/articles/kak-vybrat-pamyatnik/</link>
      <guid>https://ритуал-век.рф/articles/kak-vybrat-pamyatnik/</guid>
      <pubDate>Mon, 30 Sep 2024 00:00:00 +0300</pubDate>
      <description>Полное руководство по выбору памятника: материалы, размеры, формы и цены. Советы от специалистов ритуальной службы Век.</description>
      <yandex:full-text>
        <![CDATA[
          <p>Полное руководство по выбору памятника...</p>
        ]]>
      </yandex:full-text>
    </item>

    <item>
      <title>Что делать, если умер близкий человек: пошаговая инструкция</title>
      <link>https://ритуал-век.рф/articles/chto-delat-esli-umer-chelovek/</link>
      <guid>https://ритуал-век.рф/articles/chto-delat-esli-umer-chelovek/</guid>
      <pubDate>Fri, 27 Sep 2024 00:00:00 +0300</pubDate>
      <description>Подробная инструкция: какие документы нужны, куда обращаться, как организовать похороны в Шуе.</description>
    </item>

    <!-- Добавить минимум 5-10 статей -->
  </channel>
</rss>
```

**Обновить robots.txt:**

```txt
User-agent: *
Disallow:

Sitemap: https://ритуал-век.рф/sitemap.xml
Sitemap: https://ритуал-век.рф/rss.xml
```

**Добавить ссылку в HTML:**

```html
<link rel="alternate" type="application/rss+xml"
      title="Ритуальная служба Век - RSS"
      href="https://ритуал-век.рф/rss.xml" />
```

---

#### 3.2. Турбо-страницы Яндекса (опционально)

**Файл:** `public/turbo.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:yandex="http://news.yandex.ru"
     xmlns:turbo="http://turbo.yandex.ru"
     version="2.0">
  <channel>
    <title>Ритуальная служба Век</title>
    <link>https://ритуал-век.рф/</link>
    <description>Ритуальные услуги в Шуе</description>
    <language>ru</language>
    <turbo:cms_plugin>ВАШИХ_ID</turbo:cms_plugin>

    <item turbo="true">
      <link>https://ритуал-век.рф/uslugi/organizatsiya-pohoron/</link>
      <turbo:topic>Организация похорон в Шуе</turbo:topic>
      <turbo:content><![CDATA[
        <header>
          <h1>Организация похорон в Шуе под ключ</h1>
          <figure>
            <img src="https://ритуал-век.рф/assets/funeral-hall-big.webp"
                 alt="Прощальный зал" />
          </figure>
        </header>

        <p>Профессиональная организация похорон от службы "Век"...</p>

        <div data-block="widget-feedback" data-stick="false">
          <div data-block="chat"
               data-type="whatsapp"
               data-url="https://wa.me/79203663636">
          </div>
        </div>
      ]]></turbo:content>
    </item>
  </channel>
</rss>
```

**Подключение:**
1. Зарегистрировать в Яндекс.Вебмастере (Турбо-страницы)
2. Указать URL: `https://ритуал-век.рф/turbo.xml`
3. Дождаться валидации

---

#### 3.3. Расширить Schema.org разметку

**Файл:** `src/components/StructuredData/StructuredData.jsx`

**Добавить:**

```javascript
const schemaData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  // ... существующие данные ...

  // Социальные сети
  "sameAs": [
    "https://vk.com/ritual_vek_shuya",
    "https://ok.ru/ritual.vek",
    "https://t.me/ritual_vek"
  ],

  // Способы оплаты
  "paymentAccepted": "Наличные, Безналичный расчет, Банковские карты, QR-код СБП",

  // Диапазон цен
  "priceRange": "20000-150000 RUB",
  "currenciesAccepted": "RUB",

  // Дополнительные контакты
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+7-920-366-36-36",
      "contactType": "customer service",
      "availableLanguage": "Russian",
      "areaServed": "RU"
    }
  ],

  // Фото организации
  "photo": [
    `${baseUrl}/assets/office-facade-main.webp`,
    `${baseUrl}/assets/funeral-hall-big.webp`,
    `${baseUrl}/assets/funeral-hall-small.webp`
  ]
};
```

---

#### 3.4. Контент-стратегия для Яндекса

**Создать новые разделы:**

1. **`/articles/` - Информационные статьи**

Темы для статей (информационные запросы):
- "Что делать когда умер человек"
- "Документы для похорон список"
- "Как организовать поминки дома"
- "Выбор гроба советы специалистов"
- "Кремация или захоронение что выбрать"
- "Сколько стоит памятник на могилу"
- "Благоустройство могил своими руками"
- "Православные похороны традиции"

2. **`/faq/` - Отдельная страница FAQ**

С разметкой FAQPage для расширенного сниппета:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Сколько стоят ритуальные услуги в Шуе?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Стоимость ритуальных услуг зависит от выбранного пакета..."
      }
    }
  ]
}
```

3. **`/reviews/` - Страница отзывов**

С фото клиентов и разметкой Review для Rich Snippets.

---

## 🎯 Чеклист внедрения

### 📦 ЧТО НУЖНО ОТ ТЕБЯ:

#### Для старта работы (Приоритет 1):
- [ ] **Заполнить `yandex-seo-config.yaml`:**
  - [ ] Указать Яндекс.Метрика ID
  - [ ] Выбрать стратегию OG-изображений (create_new/use_existing)
  - [ ] Если create_new - предоставить изображения или сказать GENERATE_AI

#### Для Приоритета 2:
- [ ] **Яндекс.Вебмастер:**
  - [ ] Добавить сайт на https://webmaster.yandex.ru
  - [ ] Получить код подтверждения (мета-тег)
  - [ ] Прислать код подтверждения

- [ ] **Яндекс.Справочник:**
  - [ ] Создать карточку на https://yandex.ru/sprav
  - [ ] Загрузить минимум 5 фотографий
  - [ ] Подтвердить создание (yandex_sprav.created = true)

- [ ] **Социальные сети (если есть):**
  - [ ] Указать ссылки на VK/OK/Telegram/Instagram

---

### ⚙️ ЧТО СДЕЛАЮ Я (Claude):

#### Приоритет 1 (Критичные) - После получения данных:
- [ ] Добавить Яндекс.Метрику (код + цели)
- [ ] Исправить canonical URLs (кириллическая версия везде)
- [ ] Исправить og:image пути
- [ ] Пересобрать sitemap.xml с правильным доменом
- [ ] **Время выполнения: 30-60 минут**

#### Приоритет 2 (Важные) - После твоих действий:
- [ ] Добавить мета-тег подтверждения Вебмастера
- [ ] Добавить geo-координаты в Schema.org
- [ ] Добавить ссылки на соцсети в разметку
- [ ] Внедрить видимые Breadcrumbs с микроразметкой
- [ ] Переместить JSON-LD в статический HTML (SSR)
- [ ] **Время выполнения: 2-3 часа**

#### Приоритет 3 (Желательные) - По запросу:
- [ ] Создать RSS-ленту
- [ ] Настроить Турбо-страницы (опционально)
- [ ] Расширить Schema.org (sameAs, payment, price)
- [ ] Создать раздел /articles/ с SEO-контентом
- [ ] Создать страницу /faq/ с разметкой FAQPage
- [ ] Создать страницу /reviews/ с отзывами
- [ ] **Время выполнения: 4-6 часов**

---

## 📊 Ожидаемые результаты

### После внедрения Приоритета 1:
- ✅ Яндекс начнет отслеживать поведенческие факторы
- ✅ Исчезнут дубли страниц из-за canonical-конфликта
- ✅ Превью в соцсетях будут корректными
- ✅ Единая версия домена в индексе

**Прогноз:** +10-15% к органическому трафику через 2-4 недели

### После внедрения Приоритета 2:
- ✅ Расширенный сниппет с картой, часами работы, адресом
- ✅ Хлебные крошки в выдаче
- ✅ Быстрая индексация структурированных данных
- ✅ Отображение на Яндекс.Картах

**Прогноз:** +15-25% к органическому трафику через 4-8 недель

### После внедрения Приоритета 3:
- ✅ Позиции по информационным запросам
- ✅ Сниппет FAQ в выдаче
- ✅ Турбо-страницы в мобильной выдаче
- ✅ Увеличение доверия к сайту

**Прогноз:** +20-40% к органическому трафику через 2-3 месяца

---

## 🔧 Инструменты для контроля

### Обязательные:
1. **Яндекс.Вебмастер** - индексация, ошибки, запросы
2. **Яндекс.Метрика** - поведение, конверсии, источники
3. **Валидатор Schema.org** - https://validator.schema.org
4. **Яндекс.Вебмастер проверка турбо** - https://webmaster.yandex.ru/turbo/

### Дополнительные:
- **Screaming Frog SEO Spider** - аудит технических ошибок
- **Serpstat/Ahrefs** - мониторинг позиций
- **Google PageSpeed Insights** - скорость загрузки
- **Яндекс.Справочник** - управление карточкой организации

---

## 📝 Примечания

- **Время индексации:** Яндекс индексирует изменения медленнее Google (1-4 недели)
- **Региональность:** Для Шуи критично указать регион в Вебмастере
- **Конкуренты:** Проанализировать сниппеты конкурентов (ритуал-шуя.рф, вечность-шуя.рф)
- **Мобильная версия:** 70%+ трафика с мобильных - приоритет на mobile-first индексацию

---

**Документ составлен:** 30.09.2025
**Автор:** Claude Code (AI-ассистент)
**Статус:** Готов к внедрению