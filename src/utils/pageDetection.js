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
  const validPageTypes = ['home', 'uslugi', 'privacy', 'organizatsiya-pohoron', 'transportirovka-umershego', 'blagoustroystvo-mogil', 'krematsiya', 'pamyatniki-ogrady', 'zahoronenie-uchastnikov-svo'];

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
    },
    'organizatsiya-pohoron': {
      path: '/uslugi/organizatsiya-pohoron',
      title: 'Организация похорон в Шуе под ключ – Ритуальная служба "Век"',
      isMainPage: false
    },
    'transportirovka-umershego': {
      path: '/uslugi/transportirovka-umershego',
      title: 'Ритуальный транспорт и перевозка умерших в Шуе – Груз 200 | Служба "Век"',
      isMainPage: false
    },
    'blagoustroystvo-mogil': {
      path: '/uslugi/blagoustroystvo-mogil',
      title: 'Благоустройство могил и мест захоронения в Шуе | Ритуальная служба "Век"',
      isMainPage: false
    },
    'krematsiya': {
      path: '/uslugi/krematsiya',
      title: 'Организация кремации в Шуе – Услуги крематория | Служба "Век"',
      isMainPage: false
    },
    'pamyatniki-ogrady': {
      path: '/uslugi/pamyatniki-ogrady',
      title: 'Памятники и ограды от производителя в Шуе – Заказать | Ритуальная служба "Век"',
      isMainPage: false
    },
    'zahoronenie-uchastnikov-svo': {
      path: '/uslugi/zahoronenie-uchastnikov-svo',
      title: 'Организация похорон участников СВО в Шуе – Воинские почести | Служба "Век"',
      isMainPage: false
    }
  };

  return configs[pageType] || configs.home;
};