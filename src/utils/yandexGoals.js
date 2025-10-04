/**
 * Утилита для отслеживания целей Яндекс.Метрики
 * Документация: https://yandex.ru/support/metrica/general/goal-js-event.html
 */

// ID счетчика Яндекс.Метрики
const COUNTER_ID = 104326103;

/**
 * Справочник целей для Яндекс.Метрики
 * Используется для документирования и валидации
 */
export const YANDEX_GOALS = {
  PHONE_CALL: {
    id: 'phone_call',
    name: 'Звонок по телефону',
    description: 'Клик по любой ссылке с телефонным номером (tel:)',
    params: ['phone', 'element', 'source']
  },
  CALCULATOR_OPEN: {
    id: 'calculator_open',
    name: 'Открытие калькулятора',
    description: 'Клик по кнопке открытия калькулятора стоимости',
    params: []
  },
  CALCULATOR_SUBMIT: {
    id: 'calculator_submit_success',
    name: 'Отправка формы калькулятора',
    description: 'Успешная отправка заявки через калькулятор',
    params: ['burial_type', 'product_type']
  },
  ROUTE_CLICK: {
    id: 'route_click',
    name: 'Построение маршрута',
    description: 'Клик по кнопке "Маршрут" на Яндекс.Карты',
    params: ['url', 'office']
  },
  SERVICES_PAGE: {
    id: 'services_page_visit',
    name: 'Просмотр услуги',
    description: 'Переход на страницу любой услуги',
    params: ['url', 'service_name']
  }
};

/**
 * Отправка цели в Яндекс.Метрику
 * @param {string} goalId - Идентификатор цели
 * @param {Object} params - Дополнительные параметры (опционально)
 */
const reachGoal = (goalId, params = {}) => {
  try {
    if (typeof window !== 'undefined' && window.ym) {
      // ВРЕМЕННО: вызываем без параметров для тестирования
      window.ym(COUNTER_ID, 'reachGoal', goalId);

      // TODO: Раскомментировать когда понадобится передача параметров
      // if (Object.keys(params).length === 0) {
      //   window.ym(COUNTER_ID, 'reachGoal', goalId);
      // } else {
      //   window.ym(COUNTER_ID, 'reachGoal', goalId, params);
      // }
    }
  } catch (error) {
    console.error('[Яндекс.Метрика] Ошибка отправки цели:', error);
  }
};

/**
 * Определяет источник клика по телефону для более точной аналитики
 * @param {HTMLElement} element - Элемент, по которому кликнули
 * @returns {string} - Источник клика
 */
const getPhoneClickSource = (element) => {
  // Проверяем классы элемента
  if (element.classList.contains('global__mobile-call-button')) {
    return 'mobile_call_button';
  }
  if (element.classList.contains('global__call-circle')) {
    return 'header_call_circle';
  }
  if (element.classList.contains('phone-number--hero')) {
    return 'hero_section';
  }
  if (element.classList.contains('phone-number--large')) {
    return 'cta_section';
  }
  if (element.closest('header')) {
    return 'header';
  }
  if (element.closest('footer')) {
    return 'footer';
  }
  if (element.closest('.first-steps')) {
    return 'first_steps_section';
  }

  return 'other';
};

/**
 * Флаг для предотвращения дублирования инициализации
 */
let isInitialized = false;

/**
 * Инициализация отслеживания целей
 * Вызывается один раз при загрузке приложения
 */
export const initYandexGoals = () => {
  if (typeof window === 'undefined') return;
  if (isInitialized) return;

  isInitialized = true;

  // 1. ЗВОНКИ - клик по всем ссылкам с tel:
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="tel:"]');
    if (link) {
      const phoneNumber = link.getAttribute('href');
      const source = getPhoneClickSource(link);

      reachGoal(YANDEX_GOALS.PHONE_CALL.id, {
        phone: phoneNumber,
        element: link.textContent.trim(),
        source: source
      });
    }
  }, { passive: true });

  // 2. ПОСТРОЕНИЕ МАРШРУТА - клик по внешним ссылкам на Яндекс.Карты
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="yandex.ru/maps"]');
    if (link) {
      const url = link.getAttribute('href');
      const isExternal = url.startsWith('http://') || url.startsWith('https://');

      if (isExternal) {
        const officeContainer = link.closest('.contacts-info__item, [class*="office"]');
        let office = 'unknown';

        if (officeContainer) {
          const addressText = officeContainer.textContent;
          if (addressText.includes('Красноармейский')) {
            office = 'office_main';
          } else if (addressText.includes('Фабричная')) {
            office = 'office_hall';
          } else if (addressText.includes('Белова')) {
            office = 'office_belova';
          }
        }

        reachGoal(YANDEX_GOALS.ROUTE_CLICK.id, {
          url: url,
          office: office
        });
      }
    }
  }, { passive: true });

  // 3. ПРОСМОТР СТРАНИЦЫ УСЛУГИ - при загрузке страницы с /uslugi в URL
  const currentUrl = window.location.pathname;

  if (currentUrl.includes('/uslugi')) {
    const pageTitle = document.title;

    reachGoal(YANDEX_GOALS.SERVICES_PAGE.id, {
      url: currentUrl,
      service_name: pageTitle
    });
  }
};

/**
 * Функция для ручной отправки цели из компонентов
 * @param {string} goalId - Идентификатор цели
 * @param {Object} params - Дополнительные параметры
 *
 * @example
 * import { trackGoal, YANDEX_GOALS } from '@/utils/yandexGoals';
 *
 * trackGoal(YANDEX_GOALS.CALCULATOR_OPEN.id);
 * trackGoal(YANDEX_GOALS.PHONE_CALL.id, { phone: '79203663636', source: 'custom_button' });
 */
export const trackGoal = reachGoal;

export default {
  initYandexGoals,
  trackGoal,
  YANDEX_GOALS
};
