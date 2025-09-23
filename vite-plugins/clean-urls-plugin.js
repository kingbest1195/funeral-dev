/**
 * Плагин для обработки чистых URL (без .html)
 * - Создает редиректы с .html на чистые URL
 * - Настраивает сервер для обработки чистых URL
 */

export function cleanUrlsPlugin() {
  return {
    name: 'clean-urls',
    configureServer(server) {
      // Middleware для обработки чистых URL
      server.middlewares.use((req, res, next) => {
        const url = req.url;

        // Редирект с .html на чистые URL
        if (url.endsWith('.html')) {
          const cleanUrl = url.replace('.html', '');
          // Постоянный редирект 301
          res.writeHead(301, { Location: cleanUrl });
          res.end();
          return;
        }

        // Обработка чистых URL - добавляем .html для файловой системы
        if (url === '/uslugi') {
          req.url = '/uslugi.html';
        } else if (url === '/privacy') {
          req.url = '/privacy.html';
        }

        next();
      });
    },
    generateBundle(options, bundle) {
      // В production создаем дубликаты файлов без .html
      const htmlFiles = Object.keys(bundle).filter(fileName =>
        fileName.endsWith('.html') && fileName !== 'index.html'
      );

      htmlFiles.forEach(fileName => {
        const cleanName = fileName.replace('.html', '');
        const htmlContent = bundle[fileName];

        if (htmlContent.type === 'asset') {
          // Создаем копию с чистым именем
          bundle[cleanName] = {
            ...htmlContent,
            fileName: cleanName
          };
        }
      });
    }
  };
}