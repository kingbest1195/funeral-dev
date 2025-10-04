import { useEffect } from 'react';
import { initYandexGoals } from '@/utils/yandexGoals';

/**
 * Компонент Яндекс.Метрики с оптимизированной загрузкой
 *
 * Особенности:
 * - Загружается после полного рендера страницы (requestIdleCallback)
 * - Не блокирует основной поток
 * - Использует async/defer для скрипта
 * - Отключен SSR для избежания дублирования
 */
const YandexMetrika = () => {
  useEffect(() => {
    // Проверяем, что код выполняется только на клиенте
    if (typeof window === 'undefined') return;

    // Проверяем, не загружена ли уже метрика
    if (window.ym) {
      // Если метрика уже загружена (например, из index.html), просто инициализируем цели
      setTimeout(() => {
        initYandexGoals();
      }, 500);
      return;
    }

    // Функция инициализации метрики
    const initMetrika = () => {
      // Добавляем скрипт метрики
      (function(m, e, t, r, i, k, a) {
        m[i] = m[i] || function() {
          (m[i].a = m[i].a || []).push(arguments);
        };
        m[i].l = 1 * new Date();

        // Проверка на дубликаты скрипта
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) {
            return;
          }
        }

        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = 1;
        k.defer = 1; // Добавляем defer для дополнительной оптимизации
        k.src = r;
        a.parentNode.insertBefore(k, a);
      })(
        window,
        document,
        'script',
        'https://mc.yandex.ru/metrika/tag.js',
        'ym'
      );

      // Инициализация счетчика после загрузки скрипта
      window.ym = window.ym || function() {
        (window.ym.a = window.ym.a || []).push(arguments);
      };
      window.ym.l = 1 * new Date();

      // Конфигурация метрики
      window.ym(104326103, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        trackHash: true,
        ecommerce: 'dataLayer',
      });

      // Инициализация отслеживания целей после загрузки метрики
      setTimeout(() => {
        initYandexGoals();
      }, 500);
    };

    // Используем requestIdleCallback для загрузки метрики
    // когда браузер находится в режиме простоя
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(initMetrika, { timeout: 2000 });
    } else {
      // Fallback для браузеров без поддержки requestIdleCallback
      // Загружаем после полной загрузки страницы с небольшой задержкой
      if (document.readyState === 'complete') {
        setTimeout(initMetrika, 1000);
      } else {
        window.addEventListener('load', () => {
          setTimeout(initMetrika, 1000);
        });
      }
    }

    // Cleanup функция (опционально)
    return () => {
      // Метрика остается на странице между переходами в SPA
    };
  }, []); // Пустой массив зависимостей - запуск только при монтировании

  // Noscript fallback для случаев, когда JS отключен
  return (
    <noscript>
      <div>
        <img
          src="https://mc.yandex.ru/watch/104326103"
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  );
};

export default YandexMetrika;