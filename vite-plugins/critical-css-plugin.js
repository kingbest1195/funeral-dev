import fs from 'fs';
import path from 'path';

/**
 * Vite плагин для инлайнинга критического CSS
 * Извлекает критические стили и вставляет их в index.html
 */
export default function criticalCssPlugin() {
  return {
    name: 'critical-css',
    apply: 'build', // Только для production build
    generateBundle(options, bundle) {
      // Находим CSS файлы в bundle
      const cssFiles = Object.keys(bundle).filter(fileName =>
        fileName.endsWith('.css') && bundle[fileName].type === 'asset'
      );

      if (cssFiles.length === 0) return;

      // Берем основной CSS файл
      const mainCssFile = cssFiles[0];
      const cssContent = bundle[mainCssFile].source;

      // Извлекаем критические стили (стили для первого экрана)
      const criticalSelectors = [
        // Основные теги
        'html', 'body',
        // Нормализация
        '*', '*::before', '*::after',
        // Шрифты
        '@font-face',
        // Хедер и навигация
        '.header', '.header__',
        // Герой секция
        '.hero', '.hero__',
        // Кнопки и основные элементы
        '.btn', '.button',
        // Утилиты
        '.container', '.wrapper',
        // CSS переменные
        ':root',
        // Анимации и базовые стили
        '@keyframes'
      ];

      let criticalCss = '';
      const cssLines = cssContent.split('\n');
      let inCriticalBlock = false;
      let braceCount = 0;

      for (let i = 0; i < cssLines.length; i++) {
        const line = cssLines[i].trim();

        // Проверяем, начинается ли критический блок
        if (!inCriticalBlock) {
          const isCritical = criticalSelectors.some(selector =>
            line.includes(selector) || line.startsWith(selector)
          );

          if (isCritical) {
            inCriticalBlock = true;
            criticalCss += cssLines[i] + '\n';
            braceCount += (line.match(/\{/g) || []).length;
            braceCount -= (line.match(/\}/g) || []).length;
            continue;
          }
        }

        // Если мы в критическом блоке, добавляем строки
        if (inCriticalBlock) {
          criticalCss += cssLines[i] + '\n';
          braceCount += (line.match(/\{/g) || []).length;
          braceCount -= (line.match(/\}/g) || []).length;

          // Если закрылись все скобки, блок закончен
          if (braceCount <= 0) {
            inCriticalBlock = false;
            braceCount = 0;
          }
        }
      }

      // Минифицируем критический CSS
      criticalCss = criticalCss
        .replace(/\/\*[\s\S]*?\*\//g, '') // Удаляем комментарии
        .replace(/\s+/g, ' ') // Сжимаем пробелы
        .replace(/;\s*}/g, '}') // Убираем лишние точки с запятой
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .trim();

      // Находим HTML файл и вставляем критический CSS
      const htmlFiles = Object.keys(bundle).filter(fileName =>
        fileName.endsWith('.html')
      );

      htmlFiles.forEach(htmlFile => {
        let htmlContent = bundle[htmlFile].source;

        // Вставляем критический CSS в head
        const criticalStyleTag = `<style id="critical-css">${criticalCss}</style>`;
        htmlContent = htmlContent.replace('</head>', `  ${criticalStyleTag}\n</head>`);

        // Делаем основной CSS асинхронным
        htmlContent = htmlContent.replace(
          /<link[^>]*href="[^"]*\.css"[^>]*>/g,
          (match) => {
            return match.replace('rel="stylesheet"', 'rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"');
          }
        );

        bundle[htmlFile].source = htmlContent;
      });
    }
  };
}