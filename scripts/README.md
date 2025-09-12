# 🖼️ Система автоматизированной оптимизации изображений

Полностью автоматизированная система оптимизации изображений для проекта ритуальной службы "Век".

## 🎯 Что делает система

### В Development режиме
- Использует оригинальные изображения без изменений
- Быстрая сборка и hot reload
- Никаких дополнительных шагов оптимизации

### В Production режиме
- Автоматически создает оптимизированные версии всех изображений
- Генерирует WebP версии для современных браузеров
- Заменяет импорты изображений на оптимизированные версии
- Экономия 80-99% размера файлов

## 🚀 Использование

### Автоматическая оптимизация (рекомендуется)
```bash
# Production сборка с автоматической оптимизацией
npm run build

# Только оптимизация изображений (без сборки)
npm run optimize:images
```

### Профили оптимизации

#### 1. **Quiz Icons** (`src/assets/images/quiz-icons/`)
- Размер: 64x64px
- PNG: качество 80%, максимальное сжатие
- WebP: качество 85%
- Результат: ~1KB на иконку

#### 2. **Design Elements** (`src/assets/images/design/`)
- Размер: до 400x400px (пропорциональное масштабирование)
- PNG: качество 85%
- WebP: качество 90%
- Результат: ~10-50KB на изображение

#### 3. **Favicons** (`src/assets/favicons/`)
- Размер: без изменений (сохраняются оригинальные размеры)
- PNG: качество 90%
- WebP: качество 95%
- Результат: высокое качество для иконок сайта

#### 4. **General Images** (`src/assets/images/`)
- Размер: до 800x800px (пропорциональное масштабирование)
- PNG: качество 85%
- WebP: качество 88%
- Результат: ~20-100KB на изображение

## 📁 Структура файлов

```
src/assets/
├── images/                     # Оригинальные изображения (development)
├── images-optimized/           # Оптимизированные PNG + WebP (production)
├── favicons/                   # Оригинальные фавиконы
├── favicons-optimized/         # Оптимизированные фавиконы
└── image-mapping.json          # Автоматический мапинг путей
```

## 🔧 Как это работает

1. **Анализ**: Сканирование всех изображений в проекте
2. **Оптимизация**: Создание PNG и WebP версий с профильными настройками
3. **Мапинг**: Генерация `image-mapping.json` для автоматической замены путей
4. **Интеграция**: Vite плагин подставляет оптимизированные версии в production сборке

## 💡 Интеграция в компоненты

### React компоненты (автоматически)
```jsx
// Development: использует оригинальные изображения
// Production: автоматически заменяется на оптимизированные
import iconPath from '@/assets/images/quiz-icons/coffin-traditional.png';

// Vite плагин автоматически создаст:
// <picture>
//   <source srcSet="optimized-version.webp" type="image/webp" />
//   <img src="optimized-version.png" alt="..." />
// </picture>
```

### Manual WebP support
```jsx
import { createOptimizedImage } from '../vite-plugins/image-optimization-plugin.js';

const optimizedImageHTML = createOptimizedImage(
  imagePath, 
  'Alt text', 
  { width: '64', height: '64' }
);
```

## 📊 Результаты оптимизации

### Quiz Icons
- **До**: 17.05 MB (14 файлов по ~1.2MB)
- **После**: 20 KB PNG + 12 KB WebP
- **Экономия**: 99.9%

### Общая статистика
- Автоматическая обработка всех изображений проекта
- Создание WebP версий для всех современных браузеров
- Сохранение PNG как fallback для старых браузеров
- Интеллектуальное кэширование (повторная оптимизация только измененных файлов)

## 🛠 Конфигурация

Настройки оптимизации находятся в `scripts/optimize-all-images.cjs`:

```javascript
const OPTIMIZATION_PROFILES = {
  'quiz-icons': {
    resize: { width: 64, height: 64 },
    png: { quality: 80, compressionLevel: 9 },
    webp: { quality: 85, effort: 6 }
  },
  // ... другие профили
};
```

## 🐛 Troubleshooting

### Не создаются оптимизированные изображения
```bash
# Проверьте наличие Sharp
npm install --save-dev sharp

# Запустите оптимизацию вручную
npm run optimize:images
```

### Старые изображения в production
```bash
# Очистите кэш и пересоберите
rm -rf src/assets/images-optimized
rm -rf src/assets/favicons-optimized
npm run build
```

### Performance мониторинг
```bash
# Запуск тестов производительности
npm run test:quiz
```

## ✨ Преимущества системы

1. **Zero Configuration** - работает из коробки
2. **Automatic** - не требует ручного вмешательства
3. **Development Friendly** - не замедляет разработку
4. **Production Optimized** - максимальная оптимизация для продакшена
5. **Future Proof** - легко добавлять новые форматы (AVIF, etc.)
6. **Backwards Compatible** - поддержка старых браузеров через PNG fallback