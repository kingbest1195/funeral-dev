import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath, URL } from 'node:url';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import imageOptimizationPlugin from './vite-plugins/image-optimization-plugin.js';
import criticalCssPlugin from './vite-plugins/critical-css-plugin.js';
import { htmlAssetsPlugin } from './vite-plugins/html-assets-plugin.js';
import trailingSlashPlugin from './vite-plugins/trailing-slash-plugin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons-svg')],
      symbolId: 'icon-[dir]-[name]',
      customDomId: '__svg__icons__dom__',
    }),
    imageOptimizationPlugin(),
    criticalCssPlugin(),
    htmlAssetsPlugin(),
    trailingSlashPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Импорты только в main.scss чтобы избежать дублирования
        // Подавляем предупреждения о @import (временно до полной миграции на @use)
        quietDeps: true,
        verbose: false,
        silenceDeprecations: ['import'],
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'es2018', // Поддержка современных браузеров для меньшего размера
    // Настройки для предотвращения ошибки 416 при preload CSS
    cssCodeSplit: true, // Разделение CSS по чанкам
    assetsInlineLimit: 0, // Отключаем инлайнинг ассетов для стабильности кеширования
    rollupOptions: {
      // Конфигурация для многостраничного приложения (MPA)
      input: {
        main: path.resolve(__dirname, 'index.html'),
        uslugi: path.resolve(__dirname, 'uslugi/index.html'),
        'organizatsiya-pohoron': path.resolve(__dirname, 'uslugi/organizatsiya-pohoron/index.html'),
        'transportirovka-umershego': path.resolve(__dirname, 'uslugi/transportirovka-umershego/index.html'),
        'blagoustroystvo-mogil': path.resolve(__dirname, 'uslugi/blagoustroystvo-mogil/index.html'),
        'krematsiya': path.resolve(__dirname, 'uslugi/krematsiya/index.html'),
        'pamyatniki-ogrady': path.resolve(__dirname, 'uslugi/pamyatniki-ogrady/index.html'),
        'zahoronenie-uchastnikov-svo': path.resolve(__dirname, 'uslugi/zahoronenie-uchastnikov-svo/index.html'),
        privacy: path.resolve(__dirname, 'privacy/index.html')
      },
      output: {
        manualChunks: {
          // Выносим React в отдельный чанк для лучшего кеширования
          react: ['react', 'react-dom'],
          // Библиотеки UI (Swiper убран - загружается только с ReviewsWidget через lazy loading)
          ui: ['@dr.pogodin/react-helmet', 'imask']
        },
        // Стабильные имена файлов для предотвращения конфликтов кеширования
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          // Для CSS используем более предсказуемые имена с хешем содержимого
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `assets/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    // Дополнительные оптимизации для мобильной производительности
    chunkSizeWarningLimit: 500, // Уменьшаем размер чанков для мобильных
    reportCompressedSize: false, // Ускоряет сборку
    terserOptions: {
      compress: {
        drop_console: true, // Удаляем console.log в production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn'], // Удаляем дополнительные debug функции
      },
      mangle: {
        safari10: true // Исправляет проблемы с Safari
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    },
    // Middleware отключен для Yandex Cloud S3 - используется дублирование файлов
    // В production URL без слеша будут работать через дублированные .html файлы
  },
  preview: {
    port: 3001,
    strictPort: true,
    // Настройка для MPA - отключаем historyApiFallback
    historyApiFallback: false
  }
});