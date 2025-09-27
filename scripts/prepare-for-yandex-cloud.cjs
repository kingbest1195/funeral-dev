#!/usr/bin/env node

/**
 * Скрипт для подготовки файлов к загрузке в Yandex Cloud S3
 * Создает дубликаты HTML файлов для поддержки URL с и без слеша
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(process.cwd(), 'dist');

console.log('🚀 Подготовка файлов для Yandex Cloud S3...');

// Копируем HTML файлы для поддержки URL без слеша
const filesToCopy = [
  {
    from: 'uslugi/index.html',
    to: 'uslugi.html'
  },
  {
    from: 'privacy/index.html',
    to: 'privacy.html'
  },
  {
    from: 'uslugi/organizatsiya-pohoron/index.html',
    to: 'uslugi/organizatsiya-pohoron.html'
  }
];

filesToCopy.forEach(({ from, to }) => {
  const fromPath = path.join(distDir, from);
  const toPath = path.join(distDir, to);

  if (fs.existsSync(fromPath)) {
    // Создаем директорию если нужно
    const toDir = path.dirname(toPath);
    if (!fs.existsSync(toDir)) {
      fs.mkdirSync(toDir, { recursive: true });
    }

    // Читаем оригинальный файл
    let content = fs.readFileSync(fromPath, 'utf8');

    // Определяем canonical URL (версия со слешем)
    const canonicalUrl = getCanonicalUrl(to);

    // Добавляем canonical link в head секцию
    const canonicalTag = `    <link rel="canonical" href="${canonicalUrl}" />`;
    content = content.replace('</head>', `${canonicalTag}\n  </head>`);

    // Сохраняем модифицированный файл
    fs.writeFileSync(toPath, content);
    console.log(`✅ Скопирован с canonical: ${from} → ${to} (canonical: ${canonicalUrl})`);
  } else {
    console.log(`⚠️  Файл не найден: ${from}`);
  }
});

// Функция для определения canonical URL
function getCanonicalUrl(filePath) {
  const baseUrl = 'https://ритуал-век.рф';

  const urlMap = {
    'uslugi.html': `${baseUrl}/uslugi/`,
    'privacy.html': `${baseUrl}/privacy/`,
    'uslugi/organizatsiya-pohoron.html': `${baseUrl}/uslugi/organizatsiya-pohoron/`
  };

  return urlMap[filePath] || baseUrl;
}

// Обновляем sitemap.xml чтобы включить только canonical URLs
const sitemapPath = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  console.log('📋 Обновляем sitemap.xml для canonical URLs...');

  // Читаем существующий sitemap
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');

  // Убираем дублированные URL без слеша (учитываем разные домены)
  sitemap = sitemap.replace(/<url>\s*<loc>https:\/\/[^\/]+\/uslugi<\/loc>[\s\S]*?<\/url>/g, '');
  sitemap = sitemap.replace(/<url>\s*<loc>https:\/\/[^\/]+\/privacy<\/loc>[\s\S]*?<\/url>/g, '');
  sitemap = sitemap.replace(/<url>\s*<loc>https:\/\/[^\/]+\/uslugi\/organizatsiya-pohoron<\/loc>[\s\S]*?<\/url>/g, '');

  fs.writeFileSync(sitemapPath, sitemap);
  console.log('✅ Sitemap обновлен - оставлены только canonical URLs');
}

console.log('\n🎉 Подготовка завершена!');
console.log('📝 Теперь загрузите папку dist/ в S3 bucket');
console.log('\n🔍 SEO оптимизация:');
console.log('   ✅ Canonical теги добавлены в дублированные файлы');
console.log('   ✅ Sitemap содержит только canonical URLs');
console.log('   ✅ Поисковики будут индексировать только основные URL');