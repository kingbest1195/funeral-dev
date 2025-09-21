// Импорт шрифтов для включения в Vite сборку
// Это гарантирует, что Vite увидит эти файлы как зависимости и скопирует их в dist

import SangBleuSunrise from './SangBleuSunrise-Regular.woff2';
import EuclidFlexLight from './EuclidFlex-Light.woff2';
import EuclidFlexRegular from './EuclidFlex-Regular.woff2';
import EuclidFlexMedium from './EuclidFlex-Medium.woff2';
import EuclidFlexSemiBold from './EuclidFlex-SemiBold.woff2';
import EuclidFlexBold from './EuclidFlex-Bold.woff2';

// Создаем preload ссылки для критических шрифтов
const createFontPreload = (href, fontName) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = '';
  link.setAttribute('data-font', fontName);
  document.head.appendChild(link);
};

// Preload критических шрифтов при загрузке
if (typeof document !== 'undefined') {
  // Preload только самых важных шрифтов для первого экрана
  createFontPreload(SangBleuSunrise, 'SangBleuSunrise-Regular');
  createFontPreload(EuclidFlexRegular, 'EuclidFlex-Regular');
  createFontPreload(EuclidFlexMedium, 'EuclidFlex-Medium');
}

// Экспортируем для возможного использования в будущем
export {
  SangBleuSunrise,
  EuclidFlexLight,
  EuclidFlexRegular,
  EuclidFlexMedium,
  EuclidFlexSemiBold,
  EuclidFlexBold
};