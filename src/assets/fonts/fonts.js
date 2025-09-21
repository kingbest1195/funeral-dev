// Оптимизированный импорт шрифтов - только критические для первого экрана
import SangBleuSunrise from './SangBleuSunrise-Regular.woff2';
import EuclidFlexRegular from './EuclidFlex-Regular.woff2';
import EuclidFlexSemiBold from './EuclidFlex-SemiBold.woff2';

// Ленивая загрузка дополнительных шрифтов
const loadAdditionalFonts = () => {
  import('./EuclidFlex-Light.woff2');
  import('./EuclidFlex-Medium.woff2');
  import('./EuclidFlex-Bold.woff2');
};

// Загружаем дополнительные шрифты после загрузки основного контента
if (typeof document !== 'undefined') {
  // Отложенная загрузка дополнительных шрифтов
  if (document.readyState === 'complete') {
    setTimeout(loadAdditionalFonts, 1000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(loadAdditionalFonts, 1000);
    });
  }
}

// Экспортируем только критические шрифты
export {
  SangBleuSunrise,
  EuclidFlexRegular,
  EuclidFlexSemiBold
};