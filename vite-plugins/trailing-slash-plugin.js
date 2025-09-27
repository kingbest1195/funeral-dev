/**
 * Плагин для поддержки URL с слешем и без в production сборке
 * Создает дубликаты HTML файлов для обоих вариантов URL
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

export default function trailingSlashPlugin() {
  return {
    name: 'trailing-slash-plugin',
    apply: 'build',
    generateBundle(options, bundle) {
      const htmlFiles = Object.keys(bundle).filter(key => key.endsWith('.html'));

      htmlFiles.forEach(htmlFile => {
        const asset = bundle[htmlFile];

        // Для файлов в поддиректориях создаем дубликаты
        if (htmlFile.includes('/')) {
          const pathParts = htmlFile.split('/');
          if (pathParts[pathParts.length - 1] === 'index.html') {
            // Создаем HTML файл без index.html для прямого доступа
            const directPath = pathParts.slice(0, -1).join('/') + '.html';

            // Создаем копию с тем же содержимым
            bundle[directPath] = {
              ...asset,
              fileName: directPath,
              source: asset.source || asset.code
            };
          }
        }
      });
    },
    writeBundle(options, bundle) {
      // Плагин отключен для Yandex Cloud - используется дублирование файлов
      console.log('⚠️  Trailing slash plugin отключен - используйте npm run prepare:yandex');
    }
  };
}