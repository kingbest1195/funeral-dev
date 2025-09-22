#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Автогенерация sitemap.xml для сайта ритуальной службы "Век"
 * Сканирует страницы проекта и создает sitemap.xml
 */

// Конфигурация сайта
const SITE_CONFIG = {
  baseUrl: 'https://ritual-vek.ru', // TODO: заменить на продакшн домен
  defaultChangefreq: 'monthly',
  defaultPriority: '0.8'
};

// Настройки для разных типов страниц
const PAGE_SETTINGS = {
  '/': {
    priority: '1.0',
    changefreq: 'weekly'
  },
  '/uslugi': {
    priority: '0.9',
    changefreq: 'monthly'
  },
  '/privacy': {
    priority: '0.3',
    changefreq: 'yearly'
  }
};

class SitemapGenerator {
  constructor() {
    this.pages = [];
    this.lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }

  async generate() {
    console.log('🗺️  Генерируем sitemap.xml...');

    // Сканируем маршруты из App.jsx
    await this.scanRoutes();

    // Создаем sitemap.xml
    const sitemapContent = this.createSitemapXML();

    // Сохраняем в public папку
    const outputPath = 'public/sitemap.xml';
    fs.writeFileSync(outputPath, sitemapContent);

    console.log(`✅ Sitemap создан: ${outputPath}`);
    console.log(`📄 Включено страниц: ${this.pages.length}`);
    this.pages.forEach(page => {
      console.log(`   ${page.url} (priority: ${page.priority})`);
    });
  }

  async scanRoutes() {
    // Читаем App.jsx для автоматического извлечения маршрутов
    const appPath = 'src/App.jsx';

    if (!fs.existsSync(appPath)) {
      console.warn('⚠️  App.jsx не найден, использую статический список маршрутов');
      this.addStaticRoutes();
      return;
    }

    const appContent = fs.readFileSync(appPath, 'utf8');

    // Парсим маршруты из <Route path="..."
    const routeMatches = appContent.matchAll(/<Route\s+path="([^"]+)"/g);

    for (const match of routeMatches) {
      const path = match[1];

      // Исключаем динамические и служебные маршруты
      if (path.includes(':') || path === '*') {
        continue;
      }

      this.addPage(path);
    }

    // Если маршруты не найдены, добавляем статические
    if (this.pages.length === 0) {
      console.warn('⚠️  Маршруты не найдены в App.jsx, использую статический список');
      this.addStaticRoutes();
    }
  }

  addStaticRoutes() {
    // Статический список основных страниц
    const staticRoutes = [
      '/',
      '/uslugi',
      '/privacy'
    ];

    staticRoutes.forEach(route => this.addPage(route));
  }

  addPage(path) {
    const settings = PAGE_SETTINGS[path] || {};

    const page = {
      url: path,
      lastmod: this.lastmod,
      changefreq: settings.changefreq || SITE_CONFIG.defaultChangefreq,
      priority: settings.priority || SITE_CONFIG.defaultPriority
    };

    this.pages.push(page);
  }

  createSitemapXML() {
    const urls = this.pages.map(page => {
      return `  <url>
    <loc>${SITE_CONFIG.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }
}

// Запуск генерации
if (require.main === module) {
  const generator = new SitemapGenerator();
  generator.generate().catch(console.error);
}

module.exports = SitemapGenerator;