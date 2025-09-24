/**
 * Плагин для автоматической замены путей к ассетам в HTML файлах
 * Заменяет прямые пути на пути с хешами, сгенерированными Vite
 */

import fs from "fs";
import path from "path";

export function htmlAssetsPlugin() {
  return {
    name: "html-assets",
    generateBundle(options, bundle) {
      // Отладка: выводим все файлы в bundle для понимания структуры
      // Собираем все ассеты с хешами
      const assetMap = new Map();

      // Первый проход: собираем все ассеты
      Object.values(bundle).forEach((file) => {
        if (
          file.type === "asset" &&
          (file.fileName.includes("images-optimized/") ||
            file.fileName.includes("favicons/") ||
            file.fileName.endsWith(".webp") ||
            file.fileName.endsWith(".jpg") ||
            file.fileName.endsWith(".png") ||
            file.fileName.endsWith(".ico") ||
            file.fileName.endsWith(".webmanifest"))
        ) {
          // Извлекаем оригинальный путь без хеша Vite (формат: filename-HASH8CHARS.ext)
          const originalPath = file.fileName.replace(/-[a-zA-Z0-9]{8}\./i, ".");
          assetMap.set(originalPath, file.fileName);

          // Также создаем маппинг для src/assets/ префикса
          if (originalPath.includes("assets/")) {
            const srcAssetPath = `src/${originalPath}`;
            assetMap.set(srcAssetPath, file.fileName);
          }
        }
      });

      // Второй проход: обрабатываем HTML файлы и манифесты
      Object.values(bundle).forEach((file) => {
        if (
          file.type === "asset" &&
          (file.fileName.endsWith(".html") ||
            file.fileName.endsWith(".webmanifest"))
        ) {
          let content = file.source.toString();

          // Заменяем все найденные пути
          assetMap.forEach((hashedPath, originalPath) => {
            // Заменяем в атрибутах href, content и src
            const patterns = [
              // Точные совпадения в атрибутах
              new RegExp(`href="/${originalPath}"`, "g"),
              new RegExp(`src="/${originalPath}"`, "g"),
              // Для Open Graph и Twitter изображений
              new RegExp(
                `content="https://ритуал-век\\.рф/${originalPath}"`,
                "g"
              ),
              // Также для путей без ведущего слеша в content
              new RegExp(
                `content="https://ритуал-век\\.рф/${originalPath.replace(
                  /^\//,
                  ""
                )}"`,
                "g"
              ),
              // Для JSON манифеста - заменяем в значениях "src"
              new RegExp(`"src":\\s*"${originalPath.split("/").pop()}"`, "g"),
            ];

            patterns.forEach((pattern) => {
              content = content.replace(pattern, (match) => {
                if (match.includes("https://")) {
                  // Для URL с доменом заменяем только путь
                  return match.replace(
                    new RegExp(originalPath.replace(/\//g, "\\/")),
                    hashedPath
                  );
                } else if (match.includes('"src":')) {
                  // Для JSON манифеста заменяем только имя файла
                  const fileName = originalPath.split("/").pop();
                  const hashedFileName = hashedPath.split("/").pop();
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
      const faviconAsset = Object.values(bundle).find(
        (file) =>
          file.type === "asset" &&
          file.fileName.includes("favicon") &&
          file.fileName.endsWith(".ico")
      );
      if (faviconAsset) {
        bundle["favicon.ico"] = {
          type: "asset",
          fileName: "favicon.ico",
          source: faviconAsset.source,
        };
      }

      // Копируем и обновляем site.webmanifest в корень
      const manifestAsset = Object.values(bundle).find(
        (file) =>
          file.type === "asset" && file.fileName.includes("site.webmanifest")
      );
      if (manifestAsset) {
        let manifestContent = manifestAsset.source.toString();

        // Заменяем пути в манифесте на актуальные хеши (с отладкой)
        // Ищем все android-chrome файлы и заменяем их пути
        const androidChrome192 = Object.values(bundle).find(
          (f) =>
            f.type === "asset" && f.fileName.includes("android-chrome-192x192")
        );
        const androidChrome512 = Object.values(bundle).find(
          (f) =>
            f.type === "asset" && f.fileName.includes("android-chrome-512x512")
        );

        if (androidChrome192) {
          const oldPath = '"src": "/assets/android-chrome-192x192.png"';
          const newPath = `"src": "/assets/${androidChrome192.fileName}"`;
          manifestContent = manifestContent.replace(oldPath, newPath);
        }

        if (androidChrome512) {
          const oldPath = '"src": "/assets/android-chrome-512x512.png"';
          const newPath = `"src": "/assets/${androidChrome512.fileName}"`;
          manifestContent = manifestContent.replace(oldPath, newPath);
        }

        bundle["site.webmanifest"] = {
          type: "asset",
          fileName: "site.webmanifest",
          source: manifestContent,
        };
      }
    },

    // Дополнительная обработка после записи файлов (для public/site.webmanifest)
    async writeBundle(options, bundle) {
      // Путь к manifest в dist
      const manifestPath = path.join(options.dir || "dist", "site.webmanifest");

      if (fs.existsSync(manifestPath)) {
        let manifestContent = fs.readFileSync(manifestPath, "utf8");

        // Ищем файлы android-chrome с хешами в dist/assets/
        const assetsDir = path.join(options.dir || "dist", "assets");

        if (fs.existsSync(assetsDir)) {
          const assetFiles = fs.readdirSync(assetsDir);

          const androidChrome192 = assetFiles.find((f) =>
            f.includes("android-chrome-192x192")
          );
          const androidChrome512 = assetFiles.find((f) =>
            f.includes("android-chrome-512x512")
          );

          if (androidChrome192) {
            const oldPath = '"src": "/assets/android-chrome-192x192.png"';
            const newPath = `"src": "/assets/${androidChrome192}"`;
            manifestContent = manifestContent.replace(oldPath, newPath);
          }

          if (androidChrome512) {
            const oldPath = '"src": "/assets/android-chrome-512x512.png"';
            const newPath = `"src": "/assets/${androidChrome512}"`;
            manifestContent = manifestContent.replace(oldPath, newPath);
          }

          // Записываем обновленный manifest
          fs.writeFileSync(manifestPath, manifestContent, "utf8");
        }
      }
    },
  };
}
