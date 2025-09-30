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
          // Хеш может содержать буквы, цифры и подчёркивания
          const originalPath = file.fileName.replace(/-[a-zA-Z0-9_]{8}\./i, ".");
          assetMap.set(originalPath, file.fileName);

          // Также создаем маппинг для src/assets/ префикса
          if (originalPath.includes("assets/")) {
            const srcAssetPath = `src/${originalPath}`;
            assetMap.set(srcAssetPath, file.fileName);
          }
        }
      });

      // Копируем файлы в корень без хешей для совместимости

      // 1. Копируем favicon.ico
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

      // 2. Копируем android-chrome иконки для манифеста
      const androidChrome192 = Object.values(bundle).find(
        (f) => f.type === "asset" && f.fileName.includes("android-chrome-192x192")
      );
      const androidChrome512 = Object.values(bundle).find(
        (f) => f.type === "asset" && f.fileName.includes("android-chrome-512x512")
      );

      if (androidChrome192) {
        bundle["android-chrome-192x192.png"] = {
          type: "asset",
          fileName: "android-chrome-192x192.png",
          source: androidChrome192.source,
        };
      }

      if (androidChrome512) {
        bundle["android-chrome-512x512.png"] = {
          type: "asset",
          fileName: "android-chrome-512x512.png",
          source: androidChrome512.source,
        };
      }
    },

    // Обработка HTML файлов после записи (они не попадают в bundle как assets)
    async writeBundle(options, bundle) {
      const distDir = options.dir || "dist";

      // Собираем маппинг хешей из bundle
      const assetMap = new Map();
      Object.values(bundle).forEach((file) => {
        if (file.type === "asset" &&
            (file.fileName.endsWith(".webp") ||
             file.fileName.endsWith(".jpg") ||
             file.fileName.endsWith(".png") ||
             file.fileName.endsWith(".ico"))) {
          const originalPath = file.fileName.replace(/-[a-zA-Z0-9_]{8}\./i, ".");
          assetMap.set(originalPath, file.fileName);
        }
      });

      // Обрабатываем все HTML файлы в dist
      const processHtmlFile = (filePath) => {
        if (!fs.existsSync(filePath)) return;

        let content = fs.readFileSync(filePath, "utf8");
        let changed = false;

        assetMap.forEach((hashedPath, originalPath) => {
          const pattern = new RegExp(`href="/assets/${originalPath.split('/').pop()}"`, "g");
          if (pattern.test(content)) {
            content = content.replace(pattern, `href="/assets/${hashedPath.split('/').pop()}"`);
            changed = true;
          }
        });

        if (changed) {
          fs.writeFileSync(filePath, content, "utf8");
          console.log(`[html-assets-plugin] Updated asset hashes in ${path.basename(filePath)}`);
        }
      };

      // Обрабатываем index.html
      processHtmlFile(path.join(distDir, "index.html"));

      // Обрабатываем все HTML в подпапках
      const processDirectory = (dir) => {
        if (!fs.existsSync(dir)) return;

        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            processDirectory(fullPath);
          } else if (item === "index.html") {
            processHtmlFile(fullPath);
          }
        });
      };

      processDirectory(path.join(distDir, "uslugi"));
      processDirectory(path.join(distDir, "privacy"));
    },
  };
}
