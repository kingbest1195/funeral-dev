import React, { useEffect, useRef, useState } from "react";
import { COMPANY_INFO, createTelLink } from "@/helpers";
import "./YandexMap.scss";

// Константы для настройки карты
const MAP_CONFIG = {
  center: [56.840843, 41.364861],
  zoom: 13,
  controls: ["zoomControl", "typeSelector"],
};

const MARKER_CONFIG = {
  preset: "islands#icon",
  iconColor: "#c49e5e", // Цвет из CSS переменных --color-accent
};

/**
 * Интерактивная Яндекс.Карта с отметками офисов
 *
 * @param {Object} props - Свойства компонента
 * @param {Array} props.offices - Массив офисов с координатами
 * @param {string} [props.className=""] - Дополнительные CSS классы
 */
const YandexMap = ({ offices = [], className = "" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  // Проверяем доступность API
  useEffect(() => {
    // Динамическая загрузка Яндекс.Карт API
    const loadYandexMapsAPI = () => {
      return new Promise((resolve, reject) => {
        // Проверяем, не загружен ли уже скрипт
        if (window.ymaps) {
          resolve();
          return;
        }

        // Проверяем, не загружается ли уже API
        if (document.querySelector('script[src*="api-maps.yandex.ru"]')) {
          // Ждем загрузки уже существующего скрипта
          const checkYmaps = () => {
            if (window.ymaps) {
              resolve();
            } else {
              setTimeout(checkYmaps, 100);
            }
          };
          checkYmaps();
          return;
        }

        const script = document.createElement("script");
        // Получаем API ключ из переменных окружения или используем пустой для разработки
        const apiKey = import.meta.env.VITE_YANDEX_API_KEY || "";
        script.src = `https://api-maps.yandex.ru/2.1/?${
          apiKey ? `apikey=${apiKey}&` : ""
        }lang=ru_RU`;
        script.async = true;
        script.onload = () => {
          resolve();
        };
        script.onerror = () =>
          reject(new Error("Ошибка загрузки Yandex Maps API"));

        document.head.appendChild(script);
      });
    };

    loadYandexMapsAPI()
      .then(() => {
        setIsApiLoaded(true);
      })
      .catch((error) => {
        console.error("Ошибка загрузки Яндекс.Карт:", error);
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  // Инициализация карты
  useEffect(() => {
    if (!isApiLoaded || !mapRef.current || mapInstanceRef.current) {
      return;
    }

    const initMap = () => {
      try {
        // Создаем карту с правильными параметрами
        const map = new window.ymaps.Map(mapRef.current, {
          center: MAP_CONFIG.center,
          zoom: MAP_CONFIG.zoom,
          controls: MAP_CONFIG.controls,
        });

        // Добавляем маркеры офисов
        offices.forEach((office) => {
          if (office.coordinates && office.coordinates.length === 2) {
            const placemark = new window.ymaps.Placemark(
              [office.coordinates[1], office.coordinates[0]], // ymaps использует [lat, lng]
              {
                balloonContentHeader: office.title || office.address,
                balloonContentBody: createBalloonContent(office),
                balloonContentFooter: `<small>ритуальная служба "${COMPANY_INFO.name}"</small>`,
              },
              MARKER_CONFIG
            );

            map.geoObjects.add(placemark);
          }
        });

        // Устанавливаем центр и зум явно, не меняем их автоматически
        map.setCenter(MAP_CONFIG.center);
        map.setZoom(MAP_CONFIG.zoom);

        mapInstanceRef.current = map;
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка инициализации карты:", error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    // Обязательно используем ymaps.ready для правильной инициализации
    window.ymaps.ready(initMap);

    // Очистка при размонтировании
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [isApiLoaded, offices]);

  // Создание HTML-контента для balloon
  const createBalloonContent = (office) => {
    const telLink = office.phoneOffice || createTelLink(COMPANY_INFO.phone);
    const officeTitle = office.title || "офис";

    return `
      <article class="office-balloon">
        <div class="office-balloon__content">
          <address class="office-balloon__address">${office.address}</address>
          ${
            office.note
              ? `<p class="office-balloon__note">${office.note}</p>`
              : ""
          }
          <p class="office-balloon__schedule">${office.schedule}</p>
        </div>
        <div class="office-balloon__actions">
          <a href="${telLink}"
             class="btn btn--primary btn--sm"
             aria-label="Позвонить в ${officeTitle}">
            📞 Позвонить
          </a>
          <a href="${office.mapUrl}"
             target="_blank"
             rel="noopener noreferrer"
             class="btn btn--secondary btn--sm"
             aria-label="Построить маршрут до ${office.address}">
            🗺️ Маршрут
          </a>
        </div>
      </article>
    `;
  };

  // Fallback для случая недоступности API
  const renderFallback = () => (
    <section className="yandex-map__fallback">
      <h3 className="yandex-map__fallback-title">Наши адреса:</h3>
      <div className="yandex-map__fallback-list">
        {offices.map((office) => {
          const telLink = createTelLink(COMPANY_INFO.phone);
          const officeTitle = office.title || "Офис";

          return (
            <article key={office.id} className="office-fallback">
              <h4 className="office-fallback__title">{officeTitle}</h4>
              <address className="office-fallback__address">
                {office.address}
              </address>
              {office.note && (
                <p className="office-fallback__note">{office.note}</p>
              )}
              <p className="office-fallback__schedule">{office.schedule}</p>
              <div className="office-fallback__actions">
                <a
                  href={telLink}
                  className="btn btn--primary btn--sm"
                  aria-label={`Позвонить в ${officeTitle}`}
                >
                  Позвонить
                </a>
                <a
                  href={office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary btn--sm"
                  aria-label={`Показать ${office.address} на карте`}
                >
                  Показать на карте
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );

  return (
    <section className={`yandex-map ${className}`}>
      {/* Загрузка */}
      {isLoading && !hasError && (
        <div className="yandex-map__loader">
          <div className="yandex-map__loader-spinner"></div>
          <p className="yandex-map__loader-text">Загрузка карты...</p>
        </div>
      )}

      {/* Ошибка или fallback */}
      {hasError && renderFallback()}

      {/* Контейнер карты */}
      {!hasError && (
        <div
          ref={mapRef}
          className="yandex-map__container"
          role="application"
          aria-label="Интерактивная карта с адресами офисов ритуальной службы Век"
          tabIndex="0"
        />
      )}

      {/* Микроразметка для SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Map",
          name: `Карта офисов ${COMPANY_INFO.name}`,
          description: `Интерактивная карта с ${offices.length} офисами ритуальной службы в городе Шуя`,
          provider: {
            "@type": "Organization",
            name: COMPANY_INFO.name,
            telephone: COMPANY_INFO.phone,
          },
          areaServed: "Шуя, Ивановская область",
        })}
      </script>

      {/* Скрытый текст для скрин-ридеров */}
      <div className="sr-only">
        Интерактивная карта показывает расположение {offices.length} офисов
        ритуальной службы "Век" в городе Шуя. Используйте клавиши стрелок для
        навигации по карте и Enter для взаимодействия с маркерами. Каждый маркер
        содержит адрес, график работы и возможности связаться с офисом.
      </div>
    </section>
  );
};

export default YandexMap;
