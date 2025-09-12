#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { glob } = require('glob');

/**
 * Автоматизированная оптимизация всех изображений проекта
 * Создает оптимизированные PNG и WebP версии для production сборки
 * 
 * Использование:
 * - В development: изображения остаются как есть
 * - В production: автоматически заменяются оптимизированными версиями
 */

// Конфигурация оптимизации по типам изображений
const OPTIMIZATION_PROFILES = {
  // Иконки квиза - маленькие, высокое сжатие
  'quiz-icons': {
    pattern: 'src/assets/images/quiz-icons/**/*.{png,jpg,jpeg}',
    resize: { width: 64, height: 64 },
    png: { quality: 80, compressionLevel: 9, palette: true },
    webp: { quality: 85, effort: 6 }
  },
  
  // Дизайнерские элементы - средний размер, хорошее качество  
  'design': {
    pattern: 'src/assets/images/design/**/*.{png,jpg,jpeg}',
    resize: { width: 400, height: 400, withoutEnlargement: true },
    png: { quality: 85, compressionLevel: 8 },
    webp: { quality: 90, effort: 5 }
  },
  
  // Фавиконы - без изменений размера, высокое качество
  'favicons': {
    pattern: 'src/assets/favicons/**/*.{png,jpg,jpeg}',
    resize: null, // Не изменяем размер
    png: { quality: 90, compressionLevel: 6 },
    webp: { quality: 95, effort: 4 }
  },
  
  // Иконки - высокое качество, средний размер
  'icons': {
    pattern: 'src/assets/icons/**/*.{png,jpg,jpeg}',
    resize: { width: 200, height: 200, withoutEnlargement: true },
    png: { quality: 88, compressionLevel: 8 },
    webp: { quality: 90, effort: 5 }
  },
  
  // Остальные изображения - универсальные настройки
  'general': {
    pattern: 'src/assets/images/**/*.{png,jpg,jpeg}',
    exclude: ['quiz-icons', 'design'], // Исключаем уже обработанные
    resize: { width: 800, height: 800, withoutEnlargement: true },
    png: { quality: 85, compressionLevel: 7 },
    webp: { quality: 88, effort: 5 }
  }
};

class ImageOptimizer {
  constructor() {
    this.stats = {
      processed: 0,
      originalSize: 0,
      optimizedSize: 0,
      webpSize: 0,
      errors: []
    };
  }

  async optimizeAll() {
    console.log('🖼️  Начинаем автоматизированную оптимизацию изображений...');
    console.log('📁 Создаём структуру для оптимизированных изображений...');
    
    // Создаем папки для оптимизированных изображений
    await this.createOptimizedStructure();
    
    // Обрабатываем каждый профиль оптимизации
    for (const [profileName, config] of Object.entries(OPTIMIZATION_PROFILES)) {
      console.log(`\n🎯 Обрабатываем профиль: ${profileName}`);
      await this.processProfile(profileName, config);
    }
    
    // Генерируем мапинг файлов для Vite
    await this.generateImageMapping();
    
    // Выводим статистику
    this.printStats();
    
    console.log('\n🚀 Оптимизация завершена!');
  }

  async createOptimizedStructure() {
    const dirs = [
      'src/assets/images-optimized',
      'src/assets/images-optimized/quiz-icons',
      'src/assets/images-optimized/design',
      'src/assets/favicons-optimized',
      'src/assets/icons-optimized'
    ];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  async processProfile(profileName, config) {
    try {
      const files = await glob(config.pattern, { ignore: 'node_modules/**' });
      
      // Фильтруем исключения для general профиля
      let filteredFiles = files;
      if (config.exclude) {
        filteredFiles = files.filter(file => {
          return !config.exclude.some(excluded => file.includes(excluded));
        });
      }
      
      console.log(`   Найдено файлов: ${filteredFiles.length}`);
      
      for (const file of filteredFiles) {
        await this.optimizeImage(file, config, profileName);
      }
      
    } catch (error) {
      console.error(`❌ Ошибка в профиле ${profileName}:`, error.message);
      this.stats.errors.push({ profile: profileName, error: error.message });
    }
  }

  async optimizeImage(inputPath, config, profileName) {
    try {
      const originalStats = fs.statSync(inputPath);
      this.stats.originalSize += originalStats.size;
      
      const parsedPath = path.parse(inputPath);
      const relativePath = path.relative('src/assets', inputPath);
      
      // Определяем выходные пути
      let outputDir;
      if (profileName === 'favicons') {
        outputDir = 'src/assets/favicons-optimized';
      } else if (profileName === 'icons') {
        outputDir = 'src/assets/icons-optimized';
      } else {
        outputDir = path.join('src/assets/images-optimized', path.dirname(relativePath).replace('images/', ''));
      }
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const baseOutputPath = path.join(outputDir, parsedPath.name);
      const pngPath = `${baseOutputPath}.png`;
      const webpPath = `${baseOutputPath}.webp`;
      
      // Создаем Sharp инстанс
      let sharpInstance = sharp(inputPath);
      
      // Применяем resize если указан
      if (config.resize) {
        sharpInstance = sharpInstance.resize(config.resize);
      }
      
      // Создаем PNG версию
      await sharpInstance
        .clone()
        .png(config.png)
        .toFile(pngPath);
      
      // Создаем WebP версию
      await sharpInstance
        .clone()
        .webp(config.webp)
        .toFile(webpPath);
      
      // Обновляем статистику
      const pngStats = fs.statSync(pngPath);
      const webpStats = fs.statSync(webpPath);
      
      this.stats.optimizedSize += pngStats.size;
      this.stats.webpSize += webpStats.size;
      this.stats.processed++;
      
      const originalKB = Math.round(originalStats.size / 1024);
      const pngKB = Math.round(pngStats.size / 1024);
      const webpKB = Math.round(webpStats.size / 1024);
      
      console.log(`     ✅ ${path.basename(inputPath)}: ${originalKB}KB → PNG: ${pngKB}KB, WebP: ${webpKB}KB`);
      
    } catch (error) {
      console.error(`     ❌ Ошибка обработки ${inputPath}:`, error.message);
      this.stats.errors.push({ file: inputPath, error: error.message });
    }
  }

  async generateImageMapping() {
    console.log('\n📝 Генерируем мапинг оптимизированных изображений...');
    
    const mapping = {
      development: {},
      production: {}
    };
    
    // Проходим по всем оптимизированным файлам
    const optimizedFiles = await glob('src/assets/{images-optimized,favicons-optimized,icons-optimized}/**/*.{png,webp}');
    
    for (const optimizedPath of optimizedFiles) {
      const parsedPath = path.parse(optimizedPath);
      const relativePath = optimizedPath.replace(/^src\/assets\//, '');
      
      // Восстанавливаем оригинальный путь
      let originalPath;
      if (optimizedPath.includes('favicons-optimized')) {
        originalPath = optimizedPath.replace('favicons-optimized', 'favicons');
      } else if (optimizedPath.includes('icons-optimized')) {
        originalPath = optimizedPath.replace('icons-optimized', 'icons');
      } else {
        originalPath = optimizedPath.replace('images-optimized', 'images');
      }
      
      const originalRelativePath = originalPath.replace(/^src\/assets\//, '');
      
      if (parsedPath.ext === '.png') {
        // PNG - это оптимизированная замена оригинала
        mapping.development[originalRelativePath] = originalRelativePath;
        mapping.production[originalRelativePath] = relativePath;
      } else if (parsedPath.ext === '.webp') {
        // WebP - дополнительная версия
        const webpKey = originalRelativePath.replace(/\.(png|jpg|jpeg)$/, '.webp');
        mapping.development[webpKey] = null; // В dev нет WebP
        mapping.production[webpKey] = relativePath;
      }
    }
    
    // Сохраняем мапинг
    const mappingPath = 'src/assets/image-mapping.json';
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    
    console.log(`   ✅ Мапинг сохранен в ${mappingPath}`);
  }

  printStats() {
    console.log('\n📊 Статистика оптимизации:');
    console.log(`   Обработано файлов: ${this.stats.processed}`);
    console.log(`   Исходный размер: ${Math.round(this.stats.originalSize / 1024 / 1024 * 100) / 100} MB`);
    console.log(`   Оптимизированные PNG: ${Math.round(this.stats.optimizedSize / 1024 / 1024 * 100) / 100} MB`);
    console.log(`   WebP версии: ${Math.round(this.stats.webpSize / 1024 / 1024 * 100) / 100} MB`);
    
    const pngSavings = Math.round((1 - this.stats.optimizedSize / this.stats.originalSize) * 100);
    const webpSavings = Math.round((1 - this.stats.webpSize / this.stats.originalSize) * 100);
    
    console.log(`\n💰 Экономия:`);
    console.log(`   PNG: ${pngSavings}%`);
    console.log(`   WebP: ${webpSavings}%`);
    
    if (this.stats.errors.length > 0) {
      console.log(`\n⚠️  Ошибки: ${this.stats.errors.length}`);
      this.stats.errors.forEach(error => {
        console.log(`     ${error.file || error.profile}: ${error.error}`);
      });
    }
  }
}

// Запуск оптимизации
if (require.main === module) {
  const optimizer = new ImageOptimizer();
  optimizer.optimizeAll().catch(console.error);
}

module.exports = ImageOptimizer;