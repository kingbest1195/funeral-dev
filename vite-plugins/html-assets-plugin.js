/**
 * Плагин для автоматической замены путей к ассетам в HTML файлах
 * Заменяет прямые пути на пути с хешами, сгенерированными Vite
 */

export function htmlAssetsPlugin() {
  return {
    name: 'html-assets',
    generateBundle(options, bundle) {
      // Собираем все ассеты с хешами
      const assetMap = new Map();

      // Первый проход: собираем все ассеты
      Object.values(bundle).forEach(file => {
        if (file.type === 'asset' && (
          file.fileName.includes('images-optimized/') ||
          file.fileName.includes('favicons/') ||
          file.fileName.endsWith('.webp') ||
          file.fileName.endsWith('.jpg') ||
          file.fileName.endsWith('.png') ||
          file.fileName.endsWith('.ico') ||
          file.fileName.endsWith('.webmanifest')
        )) {
          // Извлекаем оригинальный путь без хеша (поддержка форматов с дефисами и точками)
          const originalPath = file.fileName.replace(/[-\.]([a-f0-9A-Z]{8})[-.]/i, '.');
          assetMap.set(originalPath, file.fileName);

          // Также создаем маппинг для src/assets/ префикса
          if (originalPath.includes('assets/')) {
            const srcAssetPath = `src/${originalPath}`;
            assetMap.set(srcAssetPath, file.fileName);
          }
        }
      });

      // Второй проход: обрабатываем HTML файлы и манифесты
      Object.values(bundle).forEach(file => {
        if (file.type === 'asset' && (file.fileName.endsWith('.html') || file.fileName.endsWith('.webmanifest'))) {
          let content = file.source.toString();

          // Заменяем все найденные пути
          assetMap.forEach((hashedPath, originalPath) => {
            // Заменяем в атрибутах href, content и src
            const patterns = [
              // Точные совпадения в атрибутах
              new RegExp(`href="/${originalPath}"`, 'g'),
              new RegExp(`src="/${originalPath}"`, 'g'),
              // Для Open Graph и Twitter изображений
              new RegExp(`content="https://ритуал-век\\.рф/${originalPath}"`, 'g'),
              // Также для путей без ведущего слеша в content
              new RegExp(`content="https://ритуал-век\\.рф/${originalPath.replace(/^\//, '')}"`, 'g'),
              // Для JSON манифеста - заменяем в значениях "src"
              new RegExp(`"src":\\s*"${originalPath.split('/').pop()}"`, 'g'),
            ];

            patterns.forEach(pattern => {
              content = content.replace(pattern, (match) => {
                if (match.includes('https://')) {
                  // Для URL с доменом заменяем только путь
                  return match.replace(new RegExp(originalPath.replace(/\//g, '\\/')), hashedPath);
                } else if (match.includes('"src":')) {
                  // Для JSON манифеста заменяем только имя файла
                  const fileName = originalPath.split('/').pop();
                  const hashedFileName = hashedPath.split('/').pop();
                  return match.replace(fileName, hashedFileName);
                } else {
                  // Для локальных путей заменяем полностью
                  return match.replace(originalPath, hashedPath);
                }
              });
            });
          });

          file.source = content;
        }
      });

      // Копируем favicon.ico в корень без хеша
      const faviconAsset = Object.values(bundle).find(file =>
        file.type === 'asset' && file.fileName.includes('favicon') && file.fileName.endsWith('.ico')
      );
      if (faviconAsset) {
        bundle['favicon.ico'] = {
          type: 'asset',
          fileName: 'favicon.ico',
          source: faviconAsset.source,
        };
      }

      // Копируем и обновляем site.webmanifest в корень
      const manifestAsset = Object.values(bundle).find(file =>
        file.type === 'asset' && file.fileName.includes('site.webmanifest')
      );
      if (manifestAsset) {
        let manifestContent = manifestAsset.source.toString();

        // Заменяем пути в манифесте на актуальные хеши
        assetMap.forEach((hashedPath, originalPath) => {
          if (originalPath.includes('android-chrome')) {
            const originalFileName = originalPath.split('/').pop();
            const hashedFileName = hashedPath.split('/').pop();
            manifestContent = manifestContent.replace(
              new RegExp(`"src":\\s*"/[^"]*${originalFileName}"`, 'g'),
              `"src": "/assets/${hashedFileName}"`
            );
          }
        });

        bundle['site.webmanifest'] = {
          type: 'asset',
          fileName: 'site.webmanifest',
          source: manifestContent,
        };
      }
    }
  };
}