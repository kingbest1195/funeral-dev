import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import imageOptimizationPlugin from './vite-plugins/image-optimization-plugin.js';

export default defineConfig({
  plugins: [
    react(),
    imageOptimizationPlugin()
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
      output: {
        manualChunks: {
          // Выносим React в отдельный чанк для лучшего кеширования
          react: ['react', 'react-dom'],
          // Библиотеки маршрутизации
          router: ['react-router-dom'],
          // Библиотеки UI
          ui: ['@dr.pogodin/react-helmet', 'swiper', 'imask']
        }
      }
    },
    // Дополнительные оптимизации
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false // Ускоряет сборку
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
  }
});