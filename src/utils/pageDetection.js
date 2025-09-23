/**
 * Утилиты для определения текущей страницы в MPA архитектуре
 * Соответствует стандартам кода из code-standards.md
 */

/**
 * Получает тип страницы из data-page атрибута корневого элемента
 *
 * @returns {string} Тип страницы ('home', 'uslugi', 'privacy')
 *
 * @example
 * getCurrentPageType() // 'home'
 * getCurrentPageType() // 'uslugi'
 */
export const getCurrentPageType = () => {
  const rootElement = document.getElementById('root');
  const pageType = rootElement?.getAttribute('data-page');

  // Валидация типа страницы
  const validPageTypes = ['home', 'uslugi', 'privacy'];

  if (!pageType || !validPageTypes.includes(pageType)) {
    console.warn(`Invalid page type: ${pageType}. Falling back to 'home'.`);
    return 'home';
  }

  return pageType;
};

/**
 * Проверяет, является ли текущая страница главной
 *
 * @returns {boolean} true если главная страница
 */
export const isHomePage = () => {
  return getCurrentPageType() === 'home';
};

/**
 * Проверяет, является ли текущая страница страницей услуг
 *
 * @returns {boolean} true если страница услуг
 */
export const isUslugiPage = () => {
  return getCurrentPageType() === 'uslugi';
};

/**
 * Проверяет, является ли текущая страница страницей конфиденциальности
 *
 * @returns {boolean} true если страница политики конфиденциальности
 */
export const isPrivacyPage = () => {
  return getCurrentPageType() === 'privacy';
};

/**
 * Получает конфигурацию страницы с SEO данными
 *
 * @param {string} pageType - Тип страницы
 * @returns {Object} Конфигурация страницы
 */
export const getPageConfig = (pageType) => {
  const configs = {
    home: {
      path: '/',
      title: 'Ритуальная служба Век в Шуе - Круглосуточная помощь',
      isMainPage: true
    },
    uslugi: {
      path: '/uslugi',
      title: 'Ритуальные услуги в Шуе - Полный комплекс похоронных услуг | Век',
      isMainPage: false
    },
    privacy: {
      path: '/privacy',
      title: 'Политика конфиденциальности - Ритуальная служба Век',
      isMainPage: false
    }
  };

  return configs[pageType] || configs.home;
};