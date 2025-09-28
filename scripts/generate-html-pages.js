/**
 * Генератор HTML страниц для MPA
 * Автоматически создает HTML файлы на основе конфигурации страниц
 * Следует принципам: модульность, переиспользуемость, отсутствие хардкода
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { COMPANY_INFO } from "../src/helpers/index.js";
import { JSON_LD_SCHEMAS } from "../src/constants/json-ld-schemas.js";

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

// Внешние подключения (только DNS prefetch для аналитики)
const EXTERNAL_RESOURCES = {
  dnsPrefetch: ["//www.google-analytics.com", "//www.googletagmanager.com"],
};

// Изображения для Open Graph (пути обрабатываются htmlAssetsPlugin)
const OG_IMAGES = {
  heroMain: "/images/og/hero-main.png",
  funeralHall: "/images/og/funeral-hall.png",
  officeFacade: "/images/og/hero-main.png",
};

// Критически важные изображения для preload
const CRITICAL_IMAGES = [
  // Убраны неиспользуемые изображения office-facade для устранения warning в консоли
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
    <meta name="robots" content="${escapeAttribute(BASE_CONFIG.robots)}" />`;
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

  return `<!-- DNS Prefetch для аналитики -->
    ${dnsPrefetchLinks}`;
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
        `<link rel="preload" href="${image.href}" as="image" type="${image.type}" />`
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
      console.log(`✅ Создан ${pageName === 'organizatsiya-pohoron' ? 'uslugi/organizatsiya-pohoron' : pageName}/index.html`);
    }
  });

  console.log("🎉 Все HTML страницы созданы успешно!");
}

// Запуск генерации
if (import.meta.url === `file://${process.argv[1]}`) {
  generateHtmlPages();
}

export { generateHtmlPages, PAGES_CONFIG, BASE_CONFIG };
