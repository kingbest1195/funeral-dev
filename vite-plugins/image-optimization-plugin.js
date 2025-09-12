import fs from 'fs';
import path from 'path';

/**
 * Vite плагин для автоматического использования оптимизированных изображений в production
 * 
 * В development режиме:
 * - Использует оригинальные изображения
 * - Быстрая сборка без дополнительной обработки
 * 
 * В production режиме:
 * - Автоматически заменяет пути к изображениям на оптимизированные версии
 * - Добавляет поддержку WebP с PNG fallback
 * - Интегрируется с существующим процессом сборки
 */
export default function imageOptimizationPlugin() {
  let isProduction = false;
  let imageMapping = null;

  return {
    name: 'image-optimization',
    
    configResolved(config) {
      isProduction = config.command === 'build' && config.mode === 'production';
      
      if (isProduction) {
        // Загружаем мапинг оптимизированных изображений
        const mappingPath = path.resolve('src/assets/image-mapping.json');
        if (fs.existsSync(mappingPath)) {
          imageMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
          console.log('🖼️  Загружен мапинг оптимизированных изображений');
        } else {
          console.warn('⚠️  Мапинг изображений не найден. Запустите npm run optimize:images');
        }
      }
    },

    load(id) {
      if (!isProduction || !imageMapping) return null;
      
      // Обрабатываем импорты изображений
      if (id.includes('src/assets/') && /\.(png|jpg|jpeg|webp)$/.test(id)) {
        const relativePath = path.relative(path.resolve('src/assets'), id);
        const optimizedPath = imageMapping.production[relativePath];
        
        if (optimizedPath) {
          const fullOptimizedPath = path.resolve('src/assets', optimizedPath);
          if (fs.existsSync(fullOptimizedPath)) {
            console.log(`🔄 ${relativePath} → ${optimizedPath}`);
            return `export default "${optimizedPath}";`;
          }
        }
      }
      
      return null;
    },

    generateBundle(options, bundle) {
      if (!isProduction || !imageMapping) return;
      
      // Обрабатываем все файлы в bundle для замены путей к изображениям
      Object.keys(bundle).forEach(fileName => {
        const chunk = bundle[fileName];
        
        if (chunk.type === 'chunk' && chunk.code) {
          let modifiedCode = chunk.code;
          let hasChanges = false;
          
          // Ищем и заменяем пути к изображениям в коде
          Object.entries(imageMapping.production || {}).forEach(([original, optimized]) => {
            const originalPattern = new RegExp(`["'\`]${original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'\`]`, 'g');
            if (originalPattern.test(modifiedCode)) {
              modifiedCode = modifiedCode.replace(originalPattern, `"${optimized}"`);
              hasChanges = true;
            }
          });
          
          if (hasChanges) {
            chunk.code = modifiedCode;
          }
        }
      });
    },

    transformIndexHtml(html) {
      if (!isProduction || !imageMapping) return html;
      
      // Заменяем пути к изображениям в HTML
      let modifiedHtml = html;
      Object.entries(imageMapping.production || {}).forEach(([original, optimized]) => {
        const pattern = new RegExp(`src=["']([^"']*)?${original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
        modifiedHtml = modifiedHtml.replace(pattern, `src="$1${optimized}"`);
      });
      
      return modifiedHtml;
    }
  };
}

/**
 * Хелпер функция для создания React компонента с поддержкой WebP
 * Используется в компонентах для автоматического выбора формата изображения
 */
export function createOptimizedImage(imagePath, alt = '', props = {}) {
  const webpPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  return `
    <picture>
      <source srcSet="${webpPath}" type="image/webp" />
      <img 
        src="${imagePath}" 
        alt="${alt}"
        loading="lazy"
        ${Object.entries(props).map(([key, value]) => `${key}="${value}"`).join(' ')}
      />
    </picture>
  `;
}