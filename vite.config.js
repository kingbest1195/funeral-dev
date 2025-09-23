import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath, URL } from 'node:url';
import imageOptimizationPlugin from './vite-plugins/image-optimization-plugin.js';
import criticalCssPlugin from './vite-plugins/critical-css-plugin.js';
import { cleanUrlsPlugin } from './vite-plugins/clean-urls-plugin.js';
import { htmlAssetsPlugin } from './vite-plugins/html-assets-plugin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    imageOptimizationPlugin(),
    criticalCssPlugin(),
    cleanUrlsPlugin(),
    htmlAssetsPlugin()
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
    rollupOptions: {
      // Конфигурация для многостраничного приложения (MPA)
      input: {
        main: path.resolve(__dirname, 'index.html'),
        uslugi: path.resolve(__dirname, 'uslugi.html'),
        privacy: path.resolve(__dirname, 'privacy.html')
      },
      output: {
        manualChunks: {
          // Выносим React в отдельный чанк для лучшего кеширования
          react: ['react', 'react-dom'],
          // Библиотеки UI (убираем react-router-dom для MPA)
          ui: ['@dr.pogodin/react-helmet', 'swiper', 'imask']
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
    }
  },
  preview: {
    port: 3001,
    strictPort: true,
    // Настройка для MPA - отключаем historyApiFallback
    historyApiFallback: false
  }
});