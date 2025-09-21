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
    rollupOptions: {
      output: {
        manualChunks: {
          // Выносим React в отдельный чанк для лучшего кеширования
          react: ['react', 'react-dom'],
          // Библиотеки маршрутизации
          router: ['react-router-dom'],
          // Библиотеки UI
          ui: ['react-helmet-async', 'swiper', 'imask']
        }
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
  }
});