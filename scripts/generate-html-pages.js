/**
 * Генератор HTML страниц для MPA
 * Автоматически создает HTML файлы на основе конфигурации страниц
 * Следует принципам: модульность, переиспользуемость, отсутствие хардкода
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { COMPANY_INFO } from "../src/helpers/index.js";
import { JSON_LD_SCHEMAS, HOME_LOCAL_BUSINESS_SCHEMA } from "../src/constants/json-ld-schemas.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

// КОНСТАНТЫ ПРОЕКТА
// =================

// Хелперы для экранирования значений
const toStringSafe = (value = "") => String(value ?? "");
const escapeHtml = (value = "") =>
  toStringSafe(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const escapeAttribute = (value = "") =>
  escapeHtml(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Базовые мета-теги и настройки
const BASE_CONFIG = {
  charset: "UTF-8",
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
  siteName: COMPANY_INFO.name,
  locale: "ru_RU",
  companyPhone: COMPANY_INFO.phone,
};

// Структура favicon'ов (пути генерируются Vite автоматически)
const FAVICON_ASSETS = [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/assets/favicon-16x16.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/assets/favicon-32x32.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/assets/apple-touch-icon.png",
  },
  { rel: "manifest", href: "/site.webmanifest" },
];

// Внешние подключения (DNS prefetch для аналитики + preconnect для Яндекс.Метрики)
const EXTERNAL_RESOURCES = {
  dnsPrefetch: ["//www.google-analytics.com", "//www.googletagmanager.com"],
  preconnect: ["https://mc.yandex.ru"],
};

// Изображения для Open Graph (пути обрабатываются htmlAssetsPlugin)
const OG_IMAGES = {
  heroMain: "/images/og/hero-main.png",
  funeralHall: "/images/og/funeral-hall.png",
  officeFacade: "/images/og/hero-main.png",
};

// Критически важные изображения для preload
// ВАЖНО: Vite flatten все ассеты в /assets/, структура папок не сохраняется
// Хеш захардкожен, так как не меняется между сборками (content-based hash)
const CRITICAL_IMAGES = [
  {
    href: "/assets/office-facade-CENYA-P5.webp",
    type: "image/webp",
  },
];

// КОНФИГУРАЦИЯ СТРАНИЦ
// ===================

const PAGES_CONFIG = {
  index: {
    title: `${COMPANY_INFO.name} - Помощь в трудную минуту | ${COMPANY_INFO.city}`,
    description: `${COMPANY_INFO.name} в ${COMPANY_INFO.city}. Круглосуточная помощь в организации похорон, кремации, изготовление памятников. Звоните: ${COMPANY_INFO.phone}`,
    keywords:
      "ритуальная служба, похороны, Шуя, организация похорон, кремация, памятники, ритуальные услуги",
    ogTitle: `${COMPANY_INFO.name} - Помощь в трудную минуту | ${COMPANY_INFO.city}`,
    ogDescription: `Круглосуточная ритуальная служба в ${COMPANY_INFO.city}. Полный комплекс услуг: организация похорон, кремация, памятники. Бесплатная консультация.`,
    ogImage: `https://ритуал-век.рф${OG_IMAGES.heroMain}`,
    canonicalUrl: "https://ритуал-век.рф/",
    dataPage: "home",
    preloadHeroImage: true,
    jsonLd: HOME_LOCAL_BUSINESS_SCHEMA,
  },
  uslugi: {
    title: `Ритуальные услуги в ${COMPANY_INFO.city}: организация похорон и кремация – ${COMPANY_INFO.name}`,
    description: `Полный комплекс ритуальных услуг в ${COMPANY_INFO.city}: организация похорон, кремация, перевозка тела, памятники. Круглосуточная служба Век. Звоните: ${COMPANY_INFO.phone}`,
    keywords:
      "ритуальные услуги, организация похорон, кремация, Шуя, перевозка тела, памятники, прощальные залы",
    ogTitle: `Ритуальные услуги в ${COMPANY_INFO.city} – ${COMPANY_INFO.name}`,
    ogDescription:
      "Полный комплекс ритуальных услуг: организация похорон, кремация, памятники, прощальные залы. Деликатная помощь в трудную минуту.",
    ogImage: `https://ритуал-век.рф${OG_IMAGES.funeralHall}`,
    canonicalUrl: "https://ритуал-век.рф/uslugi/",
    dataPage: "uslugi",
    preloadHeroImage: false,
    jsonLd: JSON_LD_SCHEMAS.uslugi,
  },
  'organizatsiya-pohoron': {
    title: `Организация похорон в Шуе под ключ – Ритуальная служба "Век"`,
    description: `Профессиональная организация похорон в Шуе от службы "Век". Полный комплекс услуг: от оформления документов до проведения поминального обеда. Поможем достойно проститься с близким. Круглосуточная деликатная поддержка.`,
    keywords: "организация похорон Шуя, ритуальные услуги под ключ, похоронная служба Шуя, оформление документов умершего",
    ogTitle: `Организация похорон в Шуе под ключ – Ритуальная служба "Век"`,
    ogDescription: `Профессиональная организация похорон в Шуе от службы "Век". Полный комплекс услуг. Круглосуточная поддержка.`,
    ogImage: `https://ритуал-век.рф${OG_IMAGES.funeralHall}`,
    canonicalUrl: "https://ритуал-век.рф/uslugi/organizatsiya-pohoron/",
    dataPage: "organizatsiya-pohoron",
    preloadHeroImage: false,
    jsonLd: JSON_LD_SCHEMAS['organizatsiya-pohoron'],
  },
  'transportirovka-umershego': {
    title: `Ритуальный транспорт и перевозка умерших в Шуе – Груз 200 | Служба "Век"`,
    description: `Услуги по перевозке умерших в Шуе и по России (Груз 200). Специализированный ритуальный транспорт (катафалк) для похорон. Бережная и своевременная подача транспорта 24/7. Ритуальная служба "Век".`,
    keywords: "перевозка умерших Шуя, ритуальный транспорт, катафалк Шуя, груз 200, транспортировка тела умершего, похоронный транспорт",
    ogTitle: `Ритуальный транспорт и перевозка умерших в Шуе – Груз 200 | Служба "Век"`,
    ogDescription: `Услуги по перевозке умерших в Шуе и по России (Груз 200). Специализированный ритуальный транспорт для похорон. Бережная подача транспорта 24/7.`,
    ogImage: `https://ритуал-век.рф${OG_IMAGES.funeralHall}`,
    canonicalUrl: "https://ритуал-век.рф/uslugi/transportirovka-umershego/",
    dataPage: "transportirovka-umershego",
    preloadHeroImage: false,
    jsonLd: JSON_LD_SCHEMAS['transportirovka-umershego'],
  },
  'blagoustroystvo-mogil': {
    title: `Благоустройство могил и мест захоронения в Шуе | Ритуальная служба "Век"`,
    description: `Услуги по благоустройству могил в Шуе. Укладка плитки, установка цоколя, оград, памятников. Создание мемориальных комплексов. Уход за захоронениями. Гарантия качества.`,
    keywords: "благоустройство могил Шуя, укладка плитки на могилу, установка цоколя, ограды для могил, памятники Шуя, мемориальные комплексы, уход за захоронениями",
    ogTitle: `Благоустройство могил и мест захоронения в Шуе | Ритуальная служба "Век"`,
    ogDescription: `Услуги по благоустройству могил в Шуе. Укладка плитки, установка цоколя, оград, памятников. Создание мемориальных комплексов.`,
    ogImage: `https://ритуал-век.рф${OG_IMAGES.funeralHall}`,
    canonicalUrl: "https://ритуал-век.рф/uslugi/blagoustroystvo-mogil/",
    dataPage: "blagoustroystvo-mogil",
    preloadHeroImage: false,
    jsonLd: JSON_LD_SCHEMAS['blagoustroystvo-mogil'],
  },
  'krematsiya': {
    title: `Организация кремации в Шуе – Услуги крематория | Служба "Век"`,
    description: `Полная организация кремации в Шуе от ритуальной службы "Век". Помощь в оформлении документов, проведение прощания, доставка праха. Узнайте стоимость и порядок процедуры. Круглосуточная поддержка.`,
    keywords: "кремация Шуя, организация кремации, услуги крематория, помощь с документами для кремации, урна для праха Шуя, прощание перед кремацией",
    ogTitle: `Организация кремации в Шуе – Услуги крематория | Служба "Век"`,
    ogDescription: `Полная организация кремации в Шуе от ритуальной службы "Век". Помощь в оформлении документов, проведение прощания, доставка праха.`,
    ogImage: `https://ритуал-век.рф${OG_IMAGES.funeralHall}`,
    canonicalUrl: "https://ритуал-век.рф/uslugi/krematsiya/",
    dataPage: "krematsiya",
    preloadHeroImage: false,
    jsonLd: JSON_LD_SCHEMAS['krematsiya'],
  },
  'pamyatniki-ogrady': {
    title: `Памятники и ограды от производителя в Шуе – Заказать | Ритуальная служба "Век"`,
    description: `Изготовление и установка гранитных и мраморных памятников, оград и мемориальных комплексов в Шуе. Собственное производство. Гарантия качества, доступные цены. Закажите бесплатный 3D-макет.`,
    keywords: "памятники Шуя, ограды Шуя, изготовление памятников, гранитные памятники, мраморные памятники, мемориальные комплексы, установка памятников, собственное производство",
    ogTitle: `Памятники и ограды от производителя в Шуе – Заказать | Ритуальная служба "Век"`,
    ogDescription: `Изготовление и установка памятников, оград и мемориальных комплексов в Шуе. Собственное производство, гарантия качества.`,
    ogImage: `https://ритуал-век.рф${OG_IMAGES.funeralHall}`,
    canonicalUrl: "https://ритуал-век.рф/uslugi/pamyatniki-ogrady/",
    dataPage: "pamyatniki-ogrady",
    preloadHeroImage: false,
    jsonLd: JSON_LD_SCHEMAS['pamyatniki-ogrady'],
  },
  'zahoronenie-uchastnikov-svo': {
    title: `Организация похорон участников СВО в Шуе – Воинские почести | Служба "Век"`,
    description: `Помощь в организации похорон участников и ветеранов СВО в Шуе. Полное сопровождение: оформление льгот, взаимодействие с военкоматом, организация воинских почестей. Достойное прощание с героем.`,
    keywords: "похороны участников СВО, захоронение военнослужащих, воинские почести Шуя, похороны ветеранов СВО, организация похорон героев, военные похороны, льготы на погребение военных",
    ogTitle: `Организация похорон участников СВО в Шуе – Воинские почести | Служба "Век"`,
    ogDescription: `Организация похорон участников СВО с воинскими почестями в Шуе. Полное сопровождение, оформление льгот, взаимодействие с военкоматом.`,
    ogImage: `https://ритуал-век.рф${OG_IMAGES.funeralHall}`,
    canonicalUrl: "https://ритуал-век.рф/uslugi/zahoronenie-uchastnikov-svo/",
    dataPage: "zahoronenie-uchastnikov-svo",
    preloadHeroImage: false,
    jsonLd: JSON_LD_SCHEMAS['zahoronenie-uchastnikov-svo'],
  },
  privacy: {
    title: `Политика конфиденциальности | ${COMPANY_INFO.name}`,
    description: `Политика конфиденциальности и обработки персональных данных ${COMPANY_INFO.legalName} в ${COMPANY_INFO.city}. Информация о защите персональных данных.`,
    keywords: `политика конфиденциальности, персональные данные, ${COMPANY_INFO.name}, ${COMPANY_INFO.city}`,
    ogTitle: `Политика конфиденциальности – ${COMPANY_INFO.name}`,
    ogDescription: `Политика конфиденциальности и обработки персональных данных ${COMPANY_INFO.legalName}.`,
    ogImage: `https://ритуал-век.рф${OG_IMAGES.officeFacade}`,
    canonicalUrl: "https://ритуал-век.рф/privacy/",
    dataPage: "privacy",
    preloadHeroImage: false,
  },
};

// ГЕНЕРАЦИЯ HTML КОМПОНЕНТОВ
// ==========================

/**
 * Создает мета-теги для SEO
 * @param {Object} seoData - Данные для SEO
 * @returns {string} - HTML строка с мета-тегами
 */
const generateSeoMetaTags = (seoData) => {
  const { title, description, keywords, canonicalUrl } = seoData;

  return `<!-- SEO Meta Tags -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttribute(description)}" />
    <meta name="keywords" content="${escapeAttribute(keywords)}" />
    <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
    <meta name="robots" content="${escapeAttribute(BASE_CONFIG.robots)}" />
    <meta name="yandex-verification" content="614c2088cfa90fbd" />`;
};

/**
 * Создает Open Graph мета-теги
 * @param {Object} ogData - Данные для Open Graph
 * @returns {string} - HTML строка с OG тегами
 */
const generateOpenGraphTags = (ogData) => {
  const { ogTitle, ogDescription, ogImage, canonicalUrl } = ogData;

  return `<!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
    <meta property="og:title" content="${escapeAttribute(ogTitle)}" />
    <meta property="og:description" content="${escapeAttribute(
      ogDescription
    )}" />
    <meta property="og:image" content="${escapeAttribute(ogImage)}" />
    <meta property="og:site_name" content="${escapeAttribute(
      BASE_CONFIG.siteName
    )}" />
    <meta property="og:locale" content="${escapeAttribute(
      BASE_CONFIG.locale
    )}" />`;
};

/**
 * Создает Twitter мета-теги
 * @param {Object} twitterData - Данные для Twitter
 * @returns {string} - HTML строка с Twitter тегами
 */
const generateTwitterTags = (twitterData) => {
  const { ogTitle, ogDescription, ogImage, canonicalUrl } = twitterData;

  return `<!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${escapeAttribute(canonicalUrl)}" />
    <meta property="twitter:title" content="${escapeAttribute(ogTitle)}" />
    <meta property="twitter:description" content="${escapeAttribute(
      ogDescription
    )}" />
    <meta property="twitter:image" content="${escapeAttribute(ogImage)}" />`;
};

/**
 * Создает ссылки на favicon'ы
 * @returns {string} - HTML строка с favicon ссылками
 */
const generateFaviconLinks = () => {
  return `<!-- Favicons -->
    ${FAVICON_ASSETS.map(
      (favicon) =>
        `<link rel="${favicon.rel}" ${
          favicon.type ? `type="${favicon.type}"` : ""
        } ${favicon.sizes ? `sizes="${favicon.sizes}"` : ""} href="${
          favicon.href
        }" />`
    ).join("\n    ")}`;
};

/**
 * Создает ссылки на внешние ресурсы
 * @returns {string} - HTML строка с внешними ресурсами
 */
const generateExternalResources = () => {
  const dnsPrefetchLinks = EXTERNAL_RESOURCES.dnsPrefetch
    .map((url) => `<link rel="dns-prefetch" href="${url}" />`)
    .join("\n    ");

  const preconnectLinks = EXTERNAL_RESOURCES.preconnect
    ? EXTERNAL_RESOURCES.preconnect
        .map((url) => `<link rel="preconnect" href="${url}" crossorigin />`)
        .join("\n    ")
    : "";

  return `<!-- DNS Prefetch для аналитики -->
    ${dnsPrefetchLinks}
    ${preconnectLinks ? `\n    <!-- Preconnect для критичных ресурсов -->\n    ${preconnectLinks}` : ""}`;
};

/**
 * Создает preload теги для критически важных изображений
 * @param {boolean} shouldPreload - Нужно ли добавлять preload
 * @returns {string} - HTML строка с preload тегами
 */
const generateImagePreload = (shouldPreload) => {
  if (!shouldPreload) return "";

  return `
    <!-- Preload critical images -->
    ${CRITICAL_IMAGES.map(
      (image) =>
        `<link rel="preload" href="${image.href}" as="image" type="${image.type}" fetchpriority="high" />`
    ).join("\n    ")}`;
};

/**
 * Создает JSON-LD структурированные данные для включения в статический HTML
 * @param {Object} jsonLdData - JSON-LD данные для страницы
 * @returns {string} - HTML строка с JSON-LD скриптом
 */
const generateJsonLdScript = (jsonLdData) => {
  if (!jsonLdData) return "";

  const jsonString = JSON.stringify(jsonLdData, null, 2);

  return `
    <!-- JSON-LD структурированные данные -->
    <script type="application/ld+json">
${jsonString}
    </script>`;
};

/**
 * Создает скрипт Яндекс.Метрики с оптимизированной загрузкой
 * @returns {string} - HTML строка со скриптом Метрики
 */
const generateYandexMetrika = () => {
  return `
    <!-- Яндекс.Метрика -->
    <script type="text/javascript">
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(104326103, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true,
        trackHash:true
      });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/104326103" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Яндекс.Метрика -->`;
};

// ОСНОВНАЯ ФУНКЦИЯ ГЕНЕРАЦИИ
// =========================

/**
 * Генерирует полный HTML шаблон для страницы
 * @param {Object} pageConfig - Конфигурация страницы
 * @returns {string} - Полный HTML шаблон
 */
function generateHtmlTemplate(pageConfig) {
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    dataPage,
    preloadHeroImage,
    jsonLd,
  } = pageConfig;

  // Подготавливаем данные для генерации
  const seoData = { title, description, keywords, canonicalUrl };
  const ogData = { ogTitle, ogDescription, ogImage, canonicalUrl };

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="${BASE_CONFIG.charset}" />
    <meta name="viewport" content="${BASE_CONFIG.viewport}" />

    ${generateSeoMetaTags(seoData)}

    ${generateOpenGraphTags(ogData)}

    ${generateTwitterTags(ogData)}

    ${generateFaviconLinks()}

    ${generateExternalResources()}
    ${generateImagePreload(preloadHeroImage)}
    ${generateJsonLdScript(jsonLd)}
    ${generateYandexMetrika()}
  </head>
  <body>
    <div id="root" data-page="${dataPage}"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
}

/**
 * Основная функция генерации всех HTML страниц
 */
function generateHtmlPages() {
  console.log("🏗️  Генерация HTML страниц...");

  Object.entries(PAGES_CONFIG).forEach(([pageName, config]) => {
    const htmlContent = generateHtmlTemplate(config);

    if (pageName === "index") {
      // Главная страница остается в корне
      const filePath = path.join(ROOT_DIR, "index.html");
      fs.writeFileSync(filePath, htmlContent, "utf8");
      console.log(`✅ Создан index.html`);
    } else {
      // Остальные страницы создаем в папках
      let dirPath, filePath;

      if (pageName === 'organizatsiya-pohoron') {
        // Вложенная страница: uslugi/organizatsiya-pohoron
        dirPath = path.join(ROOT_DIR, 'uslugi', 'organizatsiya-pohoron');
        filePath = path.join(dirPath, "index.html");
      } else if (pageName === 'transportirovka-umershego') {
        // Вложенная страница: uslugi/transportirovka-umershego
        dirPath = path.join(ROOT_DIR, 'uslugi', 'transportirovka-umershego');
        filePath = path.join(dirPath, "index.html");
      } else if (pageName === 'blagoustroystvo-mogil') {
        // Вложенная страница: uslugi/blagoustroystvo-mogil
        dirPath = path.join(ROOT_DIR, 'uslugi', 'blagoustroystvo-mogil');
        filePath = path.join(dirPath, "index.html");
      } else if (pageName === 'krematsiya') {
        // Вложенная страница: uslugi/krematsiya
        dirPath = path.join(ROOT_DIR, 'uslugi', 'krematsiya');
        filePath = path.join(dirPath, "index.html");
      } else if (pageName === 'pamyatniki-ogrady') {
        // Вложенная страница: uslugi/pamyatniki-ogrady
        dirPath = path.join(ROOT_DIR, 'uslugi', 'pamyatniki-ogrady');
        filePath = path.join(dirPath, "index.html");
      } else if (pageName === 'zahoronenie-uchastnikov-svo') {
        // Вложенная страница: uslugi/zahoronenie-uchastnikov-svo
        dirPath = path.join(ROOT_DIR, 'uslugi', 'zahoronenie-uchastnikov-svo');
        filePath = path.join(dirPath, "index.html");
      } else {
        // Обычные страницы
        dirPath = path.join(ROOT_DIR, pageName);
        filePath = path.join(dirPath, "index.html");
      }

      // Создаем папку если не существует
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(filePath, htmlContent, "utf8");
      console.log(`✅ Создан ${pageName === 'organizatsiya-pohoron' ? 'uslugi/organizatsiya-pohoron' : pageName === 'transportirovka-umershego' ? 'uslugi/transportirovka-umershego' : pageName}/index.html`);
    }
  });

  console.log("🎉 Все HTML страницы созданы успешно!");
}

// Запуск генерации
if (import.meta.url === `file://${process.argv[1]}`) {
  generateHtmlPages();
}

export { generateHtmlPages, PAGES_CONFIG, BASE_CONFIG };
