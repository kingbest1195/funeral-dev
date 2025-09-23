/**
 * Генератор HTML страниц для MPA
 * Автоматически создает HTML файлы на основе конфигурации страниц
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// Конфигурация страниц
const PAGES_CONFIG = {
  index: {
    title: 'Ритуальная служба Век - Помощь в трудную минуту | Шуя',
    description: 'Ритуальная служба Век в Шуе. Круглосуточная помощь в организации похорон, кремации, изготовление памятников. Звоните: +7 (920) 366-36-36',
    keywords: 'ритуальная служба, похороны, Шуя, организация похорон, кремация, памятники, ритуальные услуги',
    ogTitle: 'Ритуальная служба Век - Помощь в трудную минуту | Шуя',
    ogDescription: 'Круглосуточная ритуальная служба в Шуе. Полный комплекс услуг: организация похорон, кремация, памятники. Бесплатная консультация.',
    canonicalUrl: 'https://ритуал-век.рф/',
    dataPage: 'home',
    preloadHeroImage: true
  },
  uslugi: {
    title: 'Ритуальные услуги в Шуе: организация похорон и кремация – Ритуальная служба Век',
    description: 'Полный комплекс ритуальных услуг в Шуе: организация похорон, кремация, перевозка тела, памятники. Круглосуточная служба Век. Звоните: +7 (920) 366-36-36',
    keywords: 'ритуальные услуги, организация похорон, кремация, Шуя, перевозка тела, памятники, прощальные залы',
    ogTitle: 'Ритуальные услуги в Шуе – Ритуальная служба Век',
    ogDescription: 'Полный комплекс ритуальных услуг: организация похорон, кремация, памятники, прощальные залы. Деликатная помощь в трудную минуту.',
    canonicalUrl: 'https://ритуал-век.рф/uslugi/',
    dataPage: 'uslugi',
    preloadHeroImage: false
  },
  privacy: {
    title: 'Политика конфиденциальности | Ритуальная служба Век',
    description: 'Политика конфиденциальности и обработки персональных данных ритуальной службы Век в Шуе. Информация о защите персональных данных.',
    keywords: 'политика конфиденциальности, персональные данные, ритуальная служба Век, Шуя',
    ogTitle: 'Политика конфиденциальности – Ритуальная служба Век',
    ogDescription: 'Политика конфиденциальности и обработки персональных данных службы Век.',
    canonicalUrl: 'https://ритуал-век.рф/privacy/',
    dataPage: 'privacy',
    preloadHeroImage: false
  }
};

// Базовый шаблон HTML
function generateHtmlTemplate(pageConfig) {
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    canonicalUrl,
    dataPage,
    preloadHeroImage
  } = pageConfig;

  const preloadScript = preloadHeroImage ? `
    <script>
      // Предзагрузка hero изображения только для главной страницы
      document.addEventListener('DOMContentLoaded', function() {
        const rootElement = document.getElementById('root');
        if (rootElement && rootElement.getAttribute('data-page') === 'home') {
          const heroImageLink = document.createElement('link');
          heroImageLink.rel = 'preload';
          heroImageLink.as = 'image';
          heroImageLink.href = '/src/assets/images-optimized/hero/hero-main.webp';
          heroImageLink.type = 'image/webp';
          document.head.appendChild(heroImageLink);
        }
      });
    </script>` : '';

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO Meta Tags -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="https://ритуал-век.рф/assets/office-facade-CENYA-P5.webp" />
    <meta property="og:site_name" content="Ритуальная служба Век" />
    <meta property="og:locale" content="ru_RU" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${canonicalUrl}" />
    <meta property="twitter:title" content="${ogTitle}" />
    <meta property="twitter:description" content="${ogDescription}" />
    <meta property="twitter:image" content="https://ритуал-век.рф/assets/office-facade-CENYA-P5.webp" />

    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/src/assets/favicons/favicon.ico" />
    <link rel="icon" type="image/png" sizes="16x16" href="/src/assets/favicons/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/src/assets/favicons/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/src/assets/favicons/apple-touch-icon.png" />
    <link rel="manifest" href="/src/assets/favicons/site.webmanifest" />

    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />

    <!-- DNS Prefetch -->
    <link rel="dns-prefetch" href="//www.google-analytics.com" />
    <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    ${preloadScript}
  </head>
  <body>
    <div id="root" data-page="${dataPage}"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
}

// Генерация HTML файлов
function generateHtmlPages() {
  console.log('🏗️  Генерация HTML страниц...');

  Object.entries(PAGES_CONFIG).forEach(([pageName, config]) => {
    const htmlContent = generateHtmlTemplate(config);

    if (pageName === 'index') {
      // Главная страница остается в корне
      const filePath = path.join(ROOT_DIR, 'index.html');
      fs.writeFileSync(filePath, htmlContent, 'utf8');
      console.log(`✅ Создан index.html`);
    } else {
      // Остальные страницы создаем в папках
      const dirPath = path.join(ROOT_DIR, pageName);
      const filePath = path.join(dirPath, 'index.html');

      // Создаем папку если не существует
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(filePath, htmlContent, 'utf8');
      console.log(`✅ Создан ${pageName}/index.html`);
    }
  });

  console.log('🎉 Все HTML страницы созданы успешно!');
}

// Запуск генерации
if (import.meta.url === `file://${process.argv[1]}`) {
  generateHtmlPages();
}

export { generateHtmlPages, PAGES_CONFIG };